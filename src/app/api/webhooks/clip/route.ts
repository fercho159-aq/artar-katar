import 'dotenv/config';
import { NextResponse } from 'next/server';
import crypto from 'crypto';
import pool from '@/lib/db';

/**
 * Este endpoint maneja los webhooks (Postbacks) de Clip.
 * URL a configurar en el dashboard de Clip: https://www.astar-katar.com/api/webhooks/clip
 */

export async function GET() {
  return NextResponse.json({
    status: 'active',
    message: 'Clip Webhook Endpoint - Este endpoint solo acepta solicitudes POST de Clip.',
    endpoint: '/api/webhooks/clip',
  });
}

export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const clipSignature = request.headers.get('clip-signature');

    if (!clipSignature) {
      console.warn('Webhook de Clip recibido sin firma.');
      return NextResponse.json({ message: 'Firma no proporcionada.' }, { status: 400 });
    }

    const secretKey = process.env.CLIP_SECRET_KEY;
    if (!secretKey) {
      console.error('CLIP_SECRET_KEY no configurada.');
      return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
    }

    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawBody, 'utf8')
      .digest('hex');

    if (expectedSignature !== clipSignature) {
      console.warn('Firma de webhook de Clip inválida.');
      return NextResponse.json({ message: 'Firma inválida.' }, { status: 403 });
    }

    const event = JSON.parse(rawBody);
    console.log('Webhook Clip recibido:', event.event, event.data?.object?.reference);

    switch (event.event) {
      case 'transaction.succeeded':
        await handleTransactionSucceeded(event);
        break;
      case 'payment.created':
      case 'transaction.failed':
        // no-op for now
        break;
    }

    return NextResponse.json({ message: 'Webhook recibido' }, { status: 200 });
  } catch (error) {
    console.error('Error en webhook de Clip:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido.';
    return NextResponse.json({ message: `Error: ${errorMessage}` }, { status: 500 });
  }
}

type ClipEvent = {
  event: string;
  data?: {
    object?: {
      id?: string;
      reference?: string;
      metadata?: Record<string, string>;
      amount?: number;
    };
  };
};

async function handleTransactionSucceeded(event: ClipEvent) {
  const obj = event.data?.object;
  if (!obj) {
    console.warn('transaction.succeeded sin data.object');
    return;
  }
  const reference = obj.reference;
  const metadata = obj.metadata || {};

  if (!reference) {
    console.warn('transaction.succeeded sin reference');
    return;
  }

  // Only subscription references processed here.
  // Orders are created by the client after redirect to /checkout/success.
  const isSubscription =
    metadata.type === 'subscription' || reference.startsWith('SUB-');

  if (!isSubscription) {
    console.log('Ignoring non-subscription ref in webhook:', reference);
    return;
  }

  const client = await pool.connect();
  try {
    // Idempotency: skip if already processed
    const existing = await client.query(
      'SELECT 1 FROM subscription_events WHERE payment_reference = $1',
      [reference]
    );
    if (existing.rows.length > 0) {
      console.log('Webhook duplicado ignorado:', reference);
      return;
    }

    const userUid = metadata.user_uid;
    const planSku = metadata.plan_sku;
    const program = metadata.program || 'activaciones_diarias';

    if (!userUid || !planSku) {
      console.warn('Subscription webhook sin user_uid o plan_sku:', metadata);
      return;
    }

    const userResult = await client.query('SELECT id FROM users WHERE uid = $1', [userUid]);
    if (userResult.rows.length === 0) {
      console.error('Usuario no encontrado:', userUid);
      return;
    }
    const userId = userResult.rows[0].id;

    const planResult = await client.query(
      'SELECT duration_days FROM subscription_plans WHERE plan_sku = $1',
      [planSku]
    );
    if (planResult.rows.length === 0) {
      console.error('Plan no encontrado:', planSku);
      return;
    }
    const durationDays = planResult.rows[0].duration_days;

    await client.query('BEGIN');

    // Look for existing active subscription for this (user, program)
    const activeSub = await client.query(
      `SELECT id, end_date FROM subscriptions
       WHERE user_id = $1 AND program = $2 AND status = 'Activa'
       LIMIT 1`,
      [userId, program]
    );

    let subscriptionId: number;
    let eventType: 'created' | 'extended';

    if (activeSub.rows.length > 0) {
      // Extend: never shrink. Base from max(end_date, NOW())
      const existingId = activeSub.rows[0].id;
      const updated = await client.query(
        `UPDATE subscriptions
         SET end_date = GREATEST(COALESCE(end_date, NOW()), NOW()) + ($1 || ' days')::INTERVAL,
             plan_sku = $2,
             last_payment_reference = $3,
             status = 'Activa'
         WHERE id = $4
         RETURNING id`,
        [durationDays, planSku, reference, existingId]
      );
      subscriptionId = updated.rows[0].id;
      eventType = 'extended';
    } else {
      // Insert new subscription
      const inserted = await client.query(
        `INSERT INTO subscriptions
           (user_id, status, start_date, end_date, program, plan_sku, last_payment_reference)
         VALUES ($1, 'Activa', NOW(), NOW() + ($2 || ' days')::INTERVAL, $3, $4, $5)
         RETURNING id`,
        [userId, durationDays, program, planSku, reference]
      );
      subscriptionId = inserted.rows[0].id;
      eventType = 'created';
    }

    await client.query(
      `INSERT INTO subscription_events
         (user_id, subscription_id, plan_sku, payment_reference, event_type, days_added)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, subscriptionId, planSku, reference, eventType, durationDays]
    );

    await client.query('COMMIT');
    console.log(`Suscripción ${eventType}: user=${userUid} plan=${planSku} +${durationDays}d`);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error('Error procesando subscription webhook:', err);
    throw err;
  } finally {
    client.release();
  }
}
