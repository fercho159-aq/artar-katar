import 'dotenv/config';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { dbQuery } from '@/lib/db';

const schema = z.object({
  userId: z.string().min(1),
  plan_sku: z.string().min(1),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { userId, plan_sku } = schema.parse(body);

    const userRows = await dbQuery(
      'SELECT id, email FROM users WHERE uid = $1',
      [userId]
    );
    if (userRows.length === 0) {
      return NextResponse.json({ message: 'Usuario no encontrado.' }, { status: 404 });
    }

    const planRows = await dbQuery(
      `SELECT plan_sku, program, name, price, duration_days
       FROM subscription_plans
       WHERE plan_sku = $1 AND is_active = TRUE`,
      [plan_sku]
    );
    if (planRows.length === 0) {
      return NextResponse.json({ message: 'Plan no encontrado.' }, { status: 404 });
    }
    const plan = planRows[0];

    const clipApiKey = process.env.CLIP_API_KEY;
    const clipSecretKey = process.env.CLIP_SECRET_KEY;
    if (!clipApiKey || !clipSecretKey) {
      return NextResponse.json(
        { message: 'Error de configuración del servidor de pagos.' },
        { status: 500 }
      );
    }

    const reference = `SUB-ACT-${userId}-${plan_sku}-${Date.now()}`;
    const authToken = Buffer.from(`${clipApiKey}:${clipSecretKey}`).toString('base64');

    // Build URLs
    const host = request.headers.get('host');
    const proto = request.headers.get('x-forwarded-proto') || 'https';
    const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || `${proto}://${host}`;

    const clipResponse = await fetch('https://api.payclip.com/v2/checkout', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Basic ${authToken}`,
      },
      body: JSON.stringify({
        amount: Number(plan.price),
        currency: 'MXN',
        purchase_description: `Suscripción Activaciones Diarias: ${plan.name}`,
        redirection_url: {
          success: `${baseUrl}/checkout/success?type=subscription&program=activaciones_diarias&ref=${reference}`,
          error: `${baseUrl}/checkout/success?type=subscription&error=payment_failed&ref=${reference}`,
          default: `${baseUrl}/checkout/success?type=subscription&ref=${reference}`,
        },
        webhook_url: `${baseUrl}/api/webhooks/clip`,
        reference,
        metadata: {
          type: 'subscription',
          program: plan.program,
          plan_sku: plan.plan_sku,
          user_uid: userId,
        },
      }),
    });

    const clipResult = await clipResponse.json();

    if (!clipResponse.ok) {
      console.error('Clip error:', clipResult);
      return NextResponse.json(
        { message: clipResult.message || 'Error al crear sesión de pago.' },
        { status: clipResponse.status }
      );
    }

    return NextResponse.json({
      success: true,
      reference,
      payment_url: clipResult.payment_request_url,
      payment_request_id: clipResult.payment_request_id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ message: 'Datos inválidos', errors: error.errors }, { status: 400 });
    }
    console.error('POST /api/activaciones/checkout error:', error);
    return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
  }
}
