import 'dotenv/config';
import { NextResponse } from 'next/server';
import { confirmAndActivate } from '@/lib/activaciones-subscription';

/**
 * Webhook (Postback) del Checkout de Clip.
 * URL configurada en el dashboard de Clip: https://www.astar-katar.com/api/webhooks/clip
 *
 * Formato real del Checkout Webhook de Clip (NO es estilo Stripe):
 *   { id, api_version, payment_request_id, transaction_id, resource,
 *     resource_status, detail_type, me_reference_id, receipt_no, ... }
 *
 *   - resource_status ∈ CREATED | PENDING | COMPLETED | CANCELED | EXPIRED
 *   - me_reference_id = la `reference` que mandamos al crear el checkout
 *   - NO reenvía la metadata personalizada
 *
 * Clip no documenta firma para este webhook, así que NO confiamos en el body:
 * verificamos el pago consultando el estado real a la API de Clip antes de
 * activar (confirmAndActivate). Un webhook forjado no puede regalar suscripciones.
 */

export async function GET() {
  return NextResponse.json({
    status: 'active',
    message: 'Clip Webhook Endpoint - solo acepta POST de Clip.',
    endpoint: '/api/webhooks/clip',
  });
}

export async function POST(request: Request) {
  try {
    const event = await request.json();
    const paymentRequestId: string | undefined = event.payment_request_id;
    const reference: string | undefined = event.me_reference_id;
    const resourceStatus: string = String(event.resource_status ?? '').toUpperCase();

    console.log('Webhook Clip:', {
      resource: event.resource,
      resource_status: resourceStatus,
      payment_request_id: paymentRequestId,
      me_reference_id: reference,
    });

    // Solo nos interesan pagos completados de suscripciones de activaciones.
    if (resourceStatus !== 'COMPLETED') {
      return NextResponse.json({ message: 'Ignorado (no COMPLETED)' }, { status: 200 });
    }
    if (!reference || !reference.startsWith('SUB-')) {
      // Pagos de tienda u otros: se procesan en otro flujo.
      return NextResponse.json({ message: 'Ignorado (no suscripción)' }, { status: 200 });
    }
    if (!paymentRequestId) {
      console.warn('Webhook COMPLETED sin payment_request_id:', reference);
      return NextResponse.json({ message: 'Sin payment_request_id' }, { status: 200 });
    }

    const result = await confirmAndActivate({ paymentRequestId, reference });
    if (!result.activated) {
      console.warn('Webhook no activó suscripción:', reference, result);
    }

    // Siempre 200: evita tormenta de reintentos. El cliente también confirma
    // por su cuenta al volver de Clip (/api/activaciones/confirm).
    return NextResponse.json({ message: 'Webhook procesado', ...result }, { status: 200 });
  } catch (error) {
    console.error('Error en webhook de Clip:', error);
    const msg = error instanceof Error ? error.message : 'Error desconocido.';
    return NextResponse.json({ message: `Error: ${msg}` }, { status: 200 });
  }
}
