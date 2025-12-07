import { NextResponse } from 'next/server';
import crypto from 'crypto';

/**
 * Este endpoint maneja los webhooks (Postbacks) de Clip.
 * Clip enviará notificaciones a esta URL para eventos como pagos completados.
 * URL a configurar en el dashboard de Clip: https://www.astar-katar.com/api/webhooks/clip
 */
export async function POST(request: Request) {
  try {
    const rawBody = await request.text();
    const clipSignature = request.headers.get('clip-signature');

    if (!clipSignature) {
      console.warn('Webhook de Clip recibido sin firma.');
      return NextResponse.json({ message: 'Firma no proporcionada.' }, { status: 400 });
    }

    // La clave secreta debe estar en tus variables de entorno
    const secretKey = process.env.CLIP_SECRET_KEY;
    if (!secretKey) {
      console.error('La clave secreta de Clip no está configurada en las variables de entorno.');
      return NextResponse.json({ message: 'Error interno del servidor.' }, { status: 500 });
    }

    // Verificar la firma para asegurar que el webhook es legítimo
    const expectedSignature = crypto
      .createHmac('sha256', secretKey)
      .update(rawBody, 'utf8')
      .digest('hex');

    if (expectedSignature !== clipSignature) {
      console.warn('Firma de webhook de Clip inválida.');
      return NextResponse.json({ message: 'Firma inválida.' }, { status: 403 });
    }

    // Si la firma es válida, procesamos el evento.
    const event = JSON.parse(rawBody);

    console.log('Webhook de Clip recibido y verificado:', JSON.stringify(event, null, 2));

    // --- Lógica de negocio ---
    // Aquí es donde manejarías el evento.
    // Por ejemplo, si el evento es 'payment.completed', buscarías la orden
    // en tu base de datos usando un ID de referencia (ej. event.data.object.reference_id)
    // y la marcarías como "pagada".

    switch (event.event) {
      case 'payment.created':
        // Lógica para cuando se crea un pago
        break;
      case 'transaction.succeeded':
        // Lógica para cuando una transacción es exitosa.
        // Este es usualmente el evento más importante para confirmar una compra.
        // const paymentId = event.data.object.id;
        // const orderId = event.data.object.reference; // Suponiendo que la referencia es el ID de tu pedido
        // await updateOrderStatus(orderId, 'paid');
        break;
      case 'transaction.failed':
        // Lógica para cuando una transacción falla.
        break;
      // Añadir más casos para otros eventos que te interesen...
    }


    // Respondemos a Clip con un status 200 para indicar que recibimos el webhook correctamente.
    // Si no respondemos con 200, Clip seguirá intentando enviar el webhook.
    return NextResponse.json({ message: 'Webhook recibido' }, { status: 200 });

  } catch (error) {
    console.error('Error al procesar el webhook de Clip:', error);
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido.';
    return NextResponse.json({ message: `Error en el webhook: ${errorMessage}` }, { status: 500 });
  }
}
