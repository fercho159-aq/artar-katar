import 'dotenv/config';
import { NextResponse } from 'next/server';
import { z } from 'zod';
import { confirmAndActivate } from '@/lib/activaciones-subscription';

const schema = z.object({
  reference: z.string().min(1),
  payment_request_id: z.string().min(1),
});

/**
 * Confirmación server-side de una suscripción de activaciones.
 *
 * Lo llama la página de éxito al volver del checkout de Clip. Verifica con la
 * API de Clip que el pago esté COMPLETED y activa la suscripción. Funciona
 * aunque el webhook nunca llegue (red, config del dashboard, etc.).
 *
 * No requiere auth: la referencia es autodescriptiva (lleva el uid) y solo
 * activamos si Clip confirma el pago, así que no se puede abusar.
 */
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { reference, payment_request_id } = schema.parse(body);

    const result = await confirmAndActivate({ paymentRequestId: payment_request_id, reference });
    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ activated: false, reason: 'Datos inválidos' }, { status: 400 });
    }
    console.error('POST /api/activaciones/confirm error:', error);
    return NextResponse.json({ activated: false, reason: 'Error interno' }, { status: 500 });
  }
}
