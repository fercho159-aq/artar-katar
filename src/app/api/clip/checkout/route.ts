import { NextResponse } from 'next/server';
import { z } from 'zod';

const checkoutSchema = z.object({
    amount: z.number().positive(),
    currency: z.string().default('MXN'),
    purchase_description: z.string(),
    reference: z.string(), // Unique reference for this order
    return_url: z.string().url(),
    webhook_url: z.string().url(),
    metadata: z.record(z.string()).optional(),
});

/**
 * Creates a Clip checkout session and returns the payment URL.
 * The user will be redirected to Clip's hosted checkout page.
 */
export async function POST(request: Request) {
    try {
        const body = await request.json();
        const validatedData = checkoutSchema.parse(body);

        const clipApiKey = process.env.CLIP_API_KEY;
        const clipSecretKey = process.env.CLIP_SECRET_KEY;

        if (!clipApiKey || !clipSecretKey) {
            console.error('Clip API credentials not configured');
            return NextResponse.json(
                { message: 'Error de configuración del servidor de pagos.' },
                { status: 500 }
            );
        }

        // Create the Basic Auth token
        const authToken = Buffer.from(`${clipApiKey}:${clipSecretKey}`).toString('base64');

        // Clip uses the same production URL for both test and live credentials
        // Test credentials start with 'test_'
        const clipBaseUrl = 'https://api.payclip.com';

        console.log('Creating Clip checkout session:', {
            amount: validatedData.amount,
            reference: validatedData.reference,
            isTestMode: clipApiKey.startsWith('test_'),
        });

        // Create checkout session with Clip API
        const clipResponse = await fetch(`${clipBaseUrl}/v2/checkout`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Basic ${authToken}`,
            },
            body: JSON.stringify({
                amount: validatedData.amount,
                currency: validatedData.currency,
                purchase_description: validatedData.purchase_description,
                redirection_url: {
                    success: validatedData.return_url,
                    error: `${validatedData.return_url}?error=payment_failed`,
                    default: validatedData.return_url,
                },
                webhook_url: validatedData.webhook_url,
                reference: validatedData.reference,
                metadata: validatedData.metadata || {},
            }),
        });

        const clipResult = await clipResponse.json();

        console.log('Clip API response status:', clipResponse.status);
        console.log('Clip API response:', JSON.stringify(clipResult, null, 2));

        if (!clipResponse.ok) {
            console.error('Clip API error:', clipResult);
            return NextResponse.json(
                { message: clipResult.message || clipResult.error || 'Error al crear sesión de pago.' },
                { status: clipResponse.status }
            );
        }

        // Clip returns a payment_request_id and a payment_url for redirect
        return NextResponse.json({
            success: true,
            payment_request_id: clipResult.payment_request_id,
            payment_url: clipResult.payment_request_url,
        });

    } catch (error) {
        console.error('Error creating Clip checkout:', error);

        if (error instanceof z.ZodError) {
            return NextResponse.json(
                { message: 'Datos inválidos', errors: error.errors },
                { status: 400 }
            );
        }

        return NextResponse.json(
            { message: 'Error interno del servidor.' },
            { status: 500 }
        );
    }
}
