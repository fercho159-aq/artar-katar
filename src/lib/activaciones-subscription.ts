import 'dotenv/config';
import pool from '@/lib/db';

/**
 * Activación de suscripciones de Activaciones Diarias (pagos vía Clip Checkout).
 *
 * El webhook de Clip NO reenvía la metadata que mandamos al crear el checkout, así
 * que derivamos usuario y plan desde la referencia, que es autodescriptiva:
 *
 *   reference = `SUB-ACT-${uid}-${plan_sku}-${timestamp}`
 *   p.ej.       SUB-ACT-user_1781801722445-ACT-1M-1718900000000
 *
 * (uid = `user_<digits>` no tiene guiones; plan_sku siempre `ACT-<algo>`.)
 */

const CLIP_BASE_URL = 'https://api.payclip.com';

export type ParsedReference = { userUid: string; planSku: string };

export function parseSubscriptionReference(reference: string): ParsedReference | null {
  if (!reference || !reference.startsWith('SUB-ACT-')) return null;
  const rest = reference.slice('SUB-ACT-'.length); // user_123-ACT-1M-1718...
  const parts = rest.split('-');
  if (parts.length < 4) return null;
  parts.pop(); // timestamp
  const planSku = parts.slice(-2).join('-'); // ACT-1M
  const userUid = parts.slice(0, -2).join('-'); // user_123
  if (!userUid || !planSku.startsWith('ACT')) return null;
  return { userUid, planSku };
}

type ClipStatus = {
  ok: boolean;
  completed: boolean;
  status?: string;
  reference?: string;
};

/**
 * Clip usa dos vocabularios para el mismo estado: la API de checkout devuelve
 * `CHECKOUT_COMPLETED` y el webhook manda `resource_status: COMPLETED`.
 * Normalizamos el prefijo antes de comparar.
 */
export function isCompletedStatus(rawStatus: string): boolean {
  const status = rawStatus.toUpperCase().replace(/^CHECKOUT_/, '');
  return ['COMPLETED', 'PAID', 'APPROVED', 'SUCCEEDED'].includes(status);
}

/**
 * Consulta a Clip el estado real de un payment_request. Es la fuente de verdad:
 * nunca activamos una suscripción sin que Clip confirme COMPLETED.
 */
export async function fetchClipCheckoutStatus(paymentRequestId: string): Promise<ClipStatus> {
  const apiKey = process.env.CLIP_API_KEY;
  const secretKey = process.env.CLIP_SECRET_KEY;
  if (!apiKey || !secretKey) {
    console.error('CLIP credentials no configuradas.');
    return { ok: false, completed: false };
  }
  const authToken = Buffer.from(`${apiKey}:${secretKey}`).toString('base64');

  try {
    const res = await fetch(`${CLIP_BASE_URL}/v2/checkout/${encodeURIComponent(paymentRequestId)}`, {
      method: 'GET',
      headers: { Authorization: `Basic ${authToken}` },
    });
    if (!res.ok) {
      console.error('Clip status no OK:', res.status, await res.text().catch(() => ''));
      return { ok: false, completed: false };
    }
    const data: Record<string, any> = await res.json();
    const rawStatus = String(
      data.status ?? data.resource_status ?? data.payment_status ?? ''
    ).toUpperCase();
    const completed = isCompletedStatus(rawStatus);
    const reference =
      data.metadata?.external_reference ?? data.me_reference_id ?? data.reference ?? undefined;
    return { ok: true, completed, status: rawStatus, reference };
  } catch (err) {
    console.error('Error consultando estado Clip:', err);
    return { ok: false, completed: false };
  }
}

export type ActivationResult =
  | { ok: true; outcome: 'created' | 'extended' | 'duplicate'; daysAdded?: number }
  | { ok: false; reason: string };

/**
 * Crea o extiende la suscripción de forma idempotente.
 * Idempotencia garantizada por subscription_events.payment_reference UNIQUE.
 */
export async function activateSubscriptionByReference(reference: string): Promise<ActivationResult> {
  const parsed = parseSubscriptionReference(reference);
  if (!parsed) return { ok: false, reason: `Referencia no parseable: ${reference}` };
  const { userUid, planSku } = parsed;
  const program = 'activaciones_diarias';

  const client = await pool.connect();
  try {
    const dup = await client.query(
      'SELECT 1 FROM subscription_events WHERE payment_reference = $1',
      [reference]
    );
    if (dup.rows.length > 0) {
      return { ok: true, outcome: 'duplicate' };
    }

    const userResult = await client.query('SELECT id FROM users WHERE uid = $1', [userUid]);
    if (userResult.rows.length === 0) {
      return { ok: false, reason: `Usuario no encontrado: ${userUid}` };
    }
    const userId = userResult.rows[0].id;

    const planResult = await client.query(
      'SELECT duration_days FROM subscription_plans WHERE plan_sku = $1',
      [planSku]
    );
    if (planResult.rows.length === 0) {
      return { ok: false, reason: `Plan no encontrado: ${planSku}` };
    }
    const durationDays = planResult.rows[0].duration_days;

    await client.query('BEGIN');

    const activeSub = await client.query(
      `SELECT id FROM subscriptions
       WHERE user_id = $1 AND program = $2 AND status = 'Activa'
       LIMIT 1`,
      [userId, program]
    );

    let subscriptionId: number;
    let outcome: 'created' | 'extended';

    if (activeSub.rows.length > 0) {
      const updated = await client.query(
        `UPDATE subscriptions
         SET end_date = GREATEST(COALESCE(end_date, NOW()), NOW()) + ($1 || ' days')::INTERVAL,
             plan_sku = $2,
             last_payment_reference = $3,
             status = 'Activa'
         WHERE id = $4
         RETURNING id`,
        [durationDays, planSku, reference, activeSub.rows[0].id]
      );
      subscriptionId = updated.rows[0].id;
      outcome = 'extended';
    } else {
      const inserted = await client.query(
        `INSERT INTO subscriptions
           (user_id, status, start_date, end_date, program, plan_sku, last_payment_reference)
         VALUES ($1, 'Activa', NOW(), NOW() + ($2 || ' days')::INTERVAL, $3, $4, $5)
         RETURNING id`,
        [userId, durationDays, program, planSku, reference]
      );
      subscriptionId = inserted.rows[0].id;
      outcome = 'created';
    }

    await client.query(
      `INSERT INTO subscription_events
         (user_id, subscription_id, plan_sku, payment_reference, event_type, days_added)
       VALUES ($1, $2, $3, $4, $5, $6)`,
      [userId, subscriptionId, planSku, reference, outcome, durationDays]
    );

    await client.query('COMMIT');
    console.log(`Suscripción ${outcome}: user=${userUid} plan=${planSku} +${durationDays}d ref=${reference}`);
    return { ok: true, outcome, daysAdded: durationDays };
  } catch (err) {
    await client.query('ROLLBACK').catch(() => {});
    // Carrera con otra activación de la misma referencia: trátala como duplicado.
    if (err instanceof Error && /subscription_events.*payment_reference|duplicate key/i.test(err.message)) {
      return { ok: true, outcome: 'duplicate' };
    }
    console.error('Error activando suscripción:', err);
    return { ok: false, reason: (err as Error).message };
  } finally {
    client.release();
  }
}

/**
 * Punto de entrada seguro: verifica con Clip que el pago esté COMPLETED y,
 * solo entonces, activa la suscripción. Usado por el webhook y por el endpoint
 * de confirmación del cliente.
 */
export async function confirmAndActivate(params: {
  paymentRequestId: string;
  reference: string;
}): Promise<{ activated: boolean; status?: string; outcome?: string; reason?: string }> {
  const { paymentRequestId, reference } = params;

  if (!parseSubscriptionReference(reference)) {
    return { activated: false, reason: 'reference inválida' };
  }

  const clip = await fetchClipCheckoutStatus(paymentRequestId);
  if (!clip.ok) return { activated: false, reason: 'no se pudo verificar con Clip' };
  if (!clip.completed) return { activated: false, status: clip.status };

  // Defensa: la referencia que devuelve Clip debe coincidir con la solicitada.
  if (clip.reference && clip.reference !== reference) {
    return { activated: false, reason: 'referencia no coincide con Clip' };
  }

  const result = await activateSubscriptionByReference(reference);
  if (!result.ok) return { activated: false, status: clip.status, reason: result.reason };
  return { activated: true, status: clip.status, outcome: result.outcome };
}
