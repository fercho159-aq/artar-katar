'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle2, XCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';

export default function CheckoutSuccessPage() {
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

            if (!reference) {
                setStatus('error');
                setMessage('No se encontró referencia de pago.');
                return;
            }

            // Get pending order from localStorage
            const pendingOrderStr = localStorage.getItem('pendingOrder');
            if (!pendingOrderStr) {
                setStatus('error');
                setMessage('No se encontró información del pedido.');
                return;
            }

            try {
                const pendingOrder = JSON.parse(pendingOrderStr);

                // Verify the reference matches
                if (pendingOrder.reference !== reference) {
                    setStatus('error');
                    setMessage('La referencia del pedido no coincide.');
                    return;
                }

                // Create the order in the database
                const response = await fetch('/api/orders', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        userId: pendingOrder.userId,
                        items: pendingOrder.items,
                        totalAmount: pendingOrder.totalAmount,
                        paymentReference: reference,
                        paymentStatus: 'pending_confirmation', // Will be confirmed by webhook
                    }),
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || 'Error al crear el pedido.');
                }

                // Clear the cart and pending order
                clearCart();
                localStorage.removeItem('pendingOrder');

                setStatus('success');
                setMessage('¡Tu pago ha sido recibido! Estamos procesando tu pedido.');

                toast({
                    title: '¡Gracias por tu compra!',
                    description: 'Hemos recibido tu pedido correctamente.',
                });

            } catch (err) {
                console.error('Error processing payment:', err);
                setStatus('error');
                setMessage((err as Error).message || 'Error al procesar el pago.');
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
