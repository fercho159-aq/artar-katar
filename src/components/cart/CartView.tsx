'use client';

import { useCart } from '@/context/CartContext';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Minus, Plus, Trash2, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export function CartView() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  // Simulación de envío, podría ser 0 para productos digitales
  const shipping = cart.some(item => !item.product.id.startsWith('med_') && !item.product.id.startsWith('wshop_')) ? 10.0 : 0;
  const total = subtotal + shipping;

  const handleCheckout = async () => {
    if (!user) {
      toast({
        variant: 'destructive',
        title: 'Inicia sesión para continuar',
        description: 'Debes iniciar sesión para poder realizar la compra.',
      });
      router.push('/login');
      return;
    }

    setIsProcessing(true);

    try {
      // Generate a unique reference for this order
      const orderReference = `ORDER-${user.uid}-${Date.now()}`;

      // Get the base URL for redirects
      const baseUrl = window.location.origin;

      // Create descriptions for the purchase
      const itemDescriptions = cart.map(item =>
        `${item.product.name} x${item.quantity}`
      ).join(', ');

      // Create Clip checkout session
      const clipResponse = await fetch('/api/clip/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          amount: total,
          currency: 'MXN',
          purchase_description: `Compra Astar Katar: ${itemDescriptions}`.substring(0, 250),
          reference: orderReference,
          return_url: `${baseUrl}/checkout/success?reference=${orderReference}`,
          webhook_url: `${baseUrl}/api/webhooks/clip`,
          metadata: {
            user_id: user.uid,
            user_email: user.email || '',
            items: JSON.stringify(cart.map(item => ({
              id: item.product.id,
              name: item.product.name,
              quantity: item.quantity,
              price: item.product.price,
            }))),
          },
        }),
      });

      const clipResult = await clipResponse.json();

      if (!clipResponse.ok) {
        throw new Error(clipResult.message || 'Error al crear sesión de pago.');
      }

      // Store order info in localStorage before redirecting
      localStorage.setItem('pendingOrder', JSON.stringify({
        reference: orderReference,
        userId: user.uid,
        items: cart,
        totalAmount: total,
      }));

      // Redirect to Clip's checkout page
      window.location.href = clipResult.payment_url;

    } catch (error) {
      console.error("Checkout error:", error);
      toast({
        variant: "destructive",
        title: "Error en la compra",
        description: (error as Error).message || "No se pudo completar el pedido.",
      });
      setIsProcessing(false);
    }
    // Note: we don't set isProcessing to false on success because we're redirecting
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-[50vh]">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
        <p className="text-muted-foreground mb-6">
          Parece que aún no has añadido nada. ¡Explora nuestros productos!
        </p>
        <Button asChild>
          <Link href="/tienda">Ir a la tienda</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="grid md:grid-cols-3 gap-12">
      <div className="md:col-span-2">
        <h1 className="text-3xl font-bold font-headline mb-8">Tu Carrito</h1>
        <div className="space-y-6">
          {cart.map((item) => (
            <div key={item.product.id} className="flex items-start gap-4">
              <Image
                src={item.product.image || '/placeholder.svg'}
                alt={item.product.name}
                width={120}
                height={120}
                className="rounded-lg object-cover aspect-square"
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p className="text-primary font-bold text-md">
                  ${item.product.price.toFixed(2)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity - 1)
                    }
                    disabled={isProcessing}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      updateQuantity(
                        item.product.id,
                        parseInt(e.target.value) || 1
                      )
                    }
                    className="w-16 h-8 text-center"
                    readOnly
                    disabled={isProcessing}
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() =>
                      updateQuantity(item.product.id, item.quantity + 1)
                    }
                    disabled={isProcessing}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCart(item.product.id)}
                disabled={isProcessing}
              >
                <Trash2 className="h-5 w-5 text-muted-foreground" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <Card className="md:col-span-1 h-fit sticky top-24">
        <CardHeader>
          <CardTitle>Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)}</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span>${shipping.toFixed(2)}</span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)}</span>
          </div>
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleCheckout}
            disabled={isProcessing || cart.length === 0}
          >
            {isProcessing ? "Procesando..." : (user ? 'Proceder al Pago' : 'Inicia sesión para pagar')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
