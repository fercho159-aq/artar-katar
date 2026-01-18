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
import { Minus, Plus, Trash2, ShoppingCart, Package, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import {
  ShippingAddressForm,
  ShippingAddress,
  emptyShippingAddress,
  isShippingAddressValid
} from './ShippingAddressForm';

export function CartView() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);
  const [shippingAddress, setShippingAddress] = useState<ShippingAddress>(emptyShippingAddress);

  // Check if there are physical products that require shipping
  // Only PHYSICAL_GOOD products require shipping. WORKSHOP, MEDITATION, SUBSCRIPTION are digital.
  const hasPhysicalProducts = cart.some(item =>
    item.product.type === 'PHYSICAL_GOOD' ||
    // Fallback for items without type: check if NOT a digital product prefix
    (!item.product.type &&
      !item.product.id.startsWith('med_') &&
      !item.product.id.startsWith('wshop_') &&
      !item.product.id.startsWith('sub_'))
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );

  // Shipping cost only for physical products
  const shipping = hasPhysicalProducts ? 200.0 : 0;
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

    // Validate contact/shipping address - always required
    if (!isShippingAddressValid(shippingAddress)) {
      toast({
        variant: 'destructive',
        title: hasPhysicalProducts ? 'Dirección incompleta' : 'Datos incompletos',
        description: hasPhysicalProducts
          ? 'Por favor completa todos los campos de la dirección de envío.'
          : 'Por favor completa todos los campos de contacto.',
      });
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
        requiresShipping: hasPhysicalProducts,
        shippingAddress: shippingAddress,
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
    <div className="grid md:grid-cols-3 gap-8">
      <div className="md:col-span-2 space-y-8">
        <div>
          <h1 className="text-3xl font-bold font-headline mb-6">Tu Carrito</h1>
          <div className="space-y-4">
            {cart.map((item) => {
              // Check if product is digital based on type or fallback to ID prefix
              const isDigital = item.product.type === 'WORKSHOP' ||
                item.product.type === 'MEDITATION' ||
                item.product.type === 'SUBSCRIPTION' ||
                (!item.product.type && (
                  item.product.id.startsWith('med_') ||
                  item.product.id.startsWith('wshop_') ||
                  item.product.id.startsWith('sub_')
                ));
              return (
                <div key={item.product.id} className="flex items-start gap-4 p-4 bg-card rounded-lg border">
                  <Image
                    src={item.product.image || '/placeholder.svg'}
                    alt={item.product.name}
                    width={100}
                    height={100}
                    className="rounded-lg object-cover aspect-square"
                  />
                  <div className="flex-grow">
                    <div className="flex items-center gap-2">
                      <h3 className="font-semibold text-lg">{item.product.name}</h3>
                      {isDigital ? (
                        <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Sparkles className="h-3 w-3" /> Digital
                        </span>
                      ) : (
                        <span className="text-xs bg-secondary text-secondary-foreground px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Package className="h-3 w-3" /> Físico
                        </span>
                      )}
                    </div>
                    <p className="text-primary font-bold text-md mt-1">
                      ${item.product.price.toFixed(2)} MXN
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
              );
            })}
          </div>
        </div>

        {/* Contact/Shipping Address Form - Always shown */}
        <Card>
          <CardContent className="pt-6">
            <ShippingAddressForm
              address={shippingAddress}
              onChange={setShippingAddress}
              disabled={isProcessing}
              title={hasPhysicalProducts ? "Dirección de Envío" : "Datos de Contacto"}
            />
          </CardContent>
        </Card>
      </div>

      <Card className="md:col-span-1 h-fit sticky top-24">
        <CardHeader>
          <CardTitle>Resumen del Pedido</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>${subtotal.toFixed(2)} MXN</span>
          </div>
          <div className="flex justify-between">
            <span>Envío</span>
            <span>
              {hasPhysicalProducts ? (
                `$${shipping.toFixed(2)} MXN`
              ) : (
                <span className="text-green-600">Gratis (Digital)</span>
              )}
            </span>
          </div>
          <Separator />
          <div className="flex justify-between font-bold text-lg">
            <span>Total</span>
            <span>${total.toFixed(2)} MXN</span>
          </div>

          {!isShippingAddressValid(shippingAddress) && (
            <p className="text-sm text-muted-foreground">
              * Completa {hasPhysicalProducts ? 'la dirección de envío' : 'tus datos de contacto'} para continuar
            </p>
          )}
        </CardContent>
        <CardFooter>
          <Button
            className="w-full"
            onClick={handleCheckout}
            disabled={isProcessing || cart.length === 0 || !isShippingAddressValid(shippingAddress)}
          >
            {isProcessing ? "Procesando..." : (user ? 'Proceder al Pago' : 'Inicia sesión para pagar')}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
