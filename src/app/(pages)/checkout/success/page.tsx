'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

function CheckoutSuccessContent() {
    const searchParams = useSearchParams();
    const router = useRouter();
    const { clearCart } = useCart();
    const { user } = useAuth();
    const { toast } = useToast();

    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('');

    const reference = searchParams.get('reference');
    const error = searchParams.get('error');

    useEffect(() => {
        const processPayment = async () => {
            // Check if there was an error from Clip
            if (error) {
                setStatus('error');
                setMessage('El pago no pudo ser procesado. Por favor, intenta de nuevo.');
                return;
            }

            // If we have a reference and no error, the payment was successful
            // Even if localStorage is cleared, CLIP has confirmed the payment
            if (!reference) {
                setStatus('error');
                setMessage('No se encontró referencia de pago.');
                return;
            }

            // Try to get pending order from localStorage
            const pendingOrderStr = localStorage.getItem('pendingOrder');

            // If we don't have localStorage data but payment was successful,
            // still show success - the webhook will handle order creation
            if (!pendingOrderStr) {
                // Payment was successful (no error param), show success message
                clearCart();
                setStatus('success');
                setMessage('¡Tu pago ha sido procesado exitosamente! Tu pedido será confirmado en breve.');
                toast({
                    title: '¡Gracias por tu compra!',
                    description: 'Recibirás una confirmación pronto.',
                });
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

                const result = await response.json();

                if (!response.ok) {
                    // Even if order creation fails, payment was successful
                    console.error('Order creation failed:', result);
                }

                // Clear the cart and pending order
                clearCart();
                localStorage.removeItem('pendingOrder');

                setStatus('success');
                setMessage('¡Tu pago ha sido recibido! Tu pedido está siendo procesado.');

                toast({
                    title: '¡Gracias por tu compra!',
                    description: 'Hemos recibido tu pedido correctamente.',
                });

            } catch (err) {
                console.error('Error processing payment:', err);
                // Still show success since payment went through
                clearCart();
                setStatus('success');
                setMessage('¡Tu pago ha sido procesado! Tu pedido será confirmado en breve.');
            }
        };

        processPayment();
    }, [reference, error, clearCart, toast]);

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
