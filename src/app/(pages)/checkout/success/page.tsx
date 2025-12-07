'use client';

import { Suspense, useEffect, useState, useRef } from 'react';
import { useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const { clearCart } = useCart();
    const hasProcessed = useRef(false);

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    const reference = searchParams.get('reference');
    const error = searchParams.get('error');

    useEffect(() => {
        // Prevent double processing
        if (hasProcessed.current) return;
        hasProcessed.current = true;

        const processPayment = async () => {
            // Check if there was an error from Clip
            if (error) {
                setStatus('error');
                setMessage('El pago no pudo ser procesado. Por favor, intenta de nuevo.');
                return;
            }

            // If we have a reference and no error, the payment was successful
            if (!reference) {
                setStatus('error');
                setMessage('No se encontró referencia de pago.');
                return;
            }

            // Try to get pending order from localStorage
            let pendingOrderStr: string | null = null;
            try {
                pendingOrderStr = localStorage.getItem('pendingOrder');
            } catch (e) {
                // localStorage might not be available
                console.warn('Could not access localStorage:', e);
            }

            // If we don't have localStorage data but payment was successful,
            // still show success - the webhook will handle order creation
            if (!pendingOrderStr) {
                try {
                    clearCart();
                } catch (e) {
                    console.warn('Could not clear cart:', e);
                }
                setStatus('success');
                setMessage('¡Tu pago ha sido procesado exitosamente! Tu pedido será confirmado en breve.');
                return;
            }

            try {
                const pendingOrder = JSON.parse(pendingOrderStr);

                // Create the order in the database
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: pendingOrder.userId,
                        items: pendingOrder.items,
                        totalAmount: pendingOrder.totalAmount,
                        paymentReference: reference,
                        paymentStatus: 'completed',
                    }),
                });

                if (!response.ok) {
                    const result = await response.json();
                    console.error('Order creation failed:', result);
                }

                // Clear the cart and pending order
                try {
                    clearCart();
                    localStorage.removeItem('pendingOrder');
                } catch (e) {
                    console.warn('Could not clear cart/localStorage:', e);
                }

                setStatus('success');
                setMessage('¡Tu pago ha sido recibido! Tu pedido está siendo procesado.');

            } catch (err) {
                console.error('Error processing payment:', err);
                // Still show success since payment went through
                try {
                    clearCart();
                } catch (e) {
                    console.warn('Could not clear cart:', e);
                }
                setStatus('success');
                setMessage('¡Tu pago ha sido procesado! Tu pedido será confirmado en breve.');
            }
        };

        processPayment();
    }, [reference, error]); // eslint-disable-line react-hooks/exhaustive-deps

    return (
        <div className="container py-16 md:py-24 flex justify-center">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    {status === 'loading' && (
                        <>
                            <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
                            <CardTitle>Procesando tu pago...</CardTitle>
                        </>
                    )}
                    {status === 'success' && (
                        <>
                            <CheckCircle2 className="h-16 w-16 text-green-500 mx-auto mb-4" />
                            <CardTitle className="text-green-600">¡Pago Exitoso!</CardTitle>
                        </>
                    )}
                    {status === 'error' && (
                        <>
                            <XCircle className="h-16 w-16 text-red-500 mx-auto mb-4" />
                            <CardTitle className="text-red-600">Error en el Pago</CardTitle>
                        </>
                    )}
                </CardHeader>
                <CardContent className="space-y-6">
                    <p className="text-muted-foreground">{message}</p>

                    {status === 'success' && (
                        <div className="space-y-3">
                            <Button asChild className="w-full">
                                <Link href="/mis-compras">Ver Mis Compras</Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/tienda">Seguir Comprando</Link>
                            </Button>
                        </div>
                    )}

                    {status === 'error' && (
                        <div className="space-y-3">
                            <Button asChild className="w-full">
                                <Link href="/cart">Volver al Carrito</Link>
                            </Button>
                            <Button asChild variant="outline" className="w-full">
                                <Link href="/">Ir al Inicio</Link>
                            </Button>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

function LoadingFallback() {
    return (
        <div className="container py-16 md:py-24 flex justify-center">
            <Card className="max-w-md w-full text-center">
                <CardHeader>
                    <Loader2 className="h-16 w-16 text-primary mx-auto mb-4 animate-spin" />
                    <CardTitle>Cargando...</CardTitle>
                </CardHeader>
            </Card>
        </div>
    );
}

export default function CheckoutSuccessPage() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <CheckoutSuccessContent />
        </Suspense>
    );
}
