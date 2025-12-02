"use client";

import { useCart } from "@/context/CartContext";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Minus, Plus, Trash2, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/context/AuthContext";
import { useRouter } from "next/navigation";

export function CartView() {
  const { cart, removeFromCart, updateQuantity, clearCart } = useCart();
  const { toast } = useToast();
  const { user } = useAuth();
  const router = useRouter();

  const subtotal = cart.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0
  );
  const shipping = 10.0;
  const total = subtotal + shipping;

  const handleCheckout = () => {
    if (!user) {
      toast({
        variant: "destructive",
        title: "Inicia sesión para continuar",
        description: "Debes iniciar sesión para poder realizar la compra.",
      });
      router.push('/login');
      return;
    }
    
    toast({
      title: "¡Gracias por tu compra!",
      description: "Hemos recibido tu pedido. (Esto es una simulación)",
    });
    clearCart();
  };

  if (cart.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center text-center h-[50vh]">
        <ShoppingCart className="h-16 w-16 text-muted-foreground mb-4" />
        <h2 className="text-2xl font-bold mb-2">Tu carrito está vacío</h2>
        <p className="text-muted-foreground mb-6">Parece que aún no has añadido nada. ¡Explora nuestros productos!</p>
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
                src={item.product.image}
                alt={item.product.name}
                width={120}
                height={120}
                className="rounded-lg object-cover aspect-square"
              />
              <div className="flex-grow">
                <h3 className="font-semibold text-lg">{item.product.name}</h3>
                <p className="text-primary font-bold text-md">${item.product.price.toFixed(2)}</p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                  >
                    <Minus className="h-4 w-4" />
                  </Button>
                  <Input
                    type="number"
                    value={item.quantity}
                    onChange={(e) => updateQuantity(item.product.id, parseInt(e.target.value) || 1)}
                    className="w-16 h-8 text-center"
                  />
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFromCart(item.product.id)}
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
          <Button className="w-full" onClick={handleCheckout}>
            {user ? "Proceder al Pago (Simulación)" : "Inicia sesión para pagar"}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
