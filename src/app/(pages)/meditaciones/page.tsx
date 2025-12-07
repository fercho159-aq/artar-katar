"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Clock, ShoppingCart, Star } from "lucide-react";
import { useCart, type Product } from "@/context/CartContext";
import Link from 'next/link';

export const meditations = [
  { id: "med_test_001", title: "🧪 Meditación de Prueba", duration: "1 min", description: "Producto de prueba para verificar pagos - $1 MXN", imageId: "meditation-1", price: 1 },
  { id: "med_001", title: "Meditación de Anclaje a Tierra", duration: "15 min", description: "Conecta con la energía de Gaia y encuentra tu centro.", imageId: "meditation-1", price: 40 },
  { id: "med_002", title: "Activación del Corazón Cristalino", duration: "25 min", description: "Abre tu corazón a la frecuencia del amor incondicional.", imageId: "meditation-2", price: 40 },
  { id: "med_003", title: "Viaje al Templo de Sanación", duration: "30 min", description: "Recibe sanación y guía de los maestros ascendidos.", imageId: "workshop-1", price: 40 },
  { id: "med_004", title: "Limpieza Energética Profunda", duration: "20 min", description: "Libera energías densas y revitaliza tu campo áurico.", imageId: "workshop-2", price: 40 },
  { id: "med_005", title: "Conexión con tu Llama Gemela", duration: "22 min", description: "Armoniza la energía sagrada masculina y femenina en tu interior.", imageId: "meditation-1", price: 40 },
  { id: "med_006", title: "Activación del ADN Cósmico", duration: "33 min", description: "Despierta tu potencial dormido y activa tus hebras de ADN.", imageId: "meditation-2", price: 40 },
];

const subscriptionImage = PlaceHolderImages.find(p => p.id === 'subscription-bg');
const subscriptionProduct: Product = {
  id: "sub_001",
  name: "Suscripción Mensual - Acceso Total",
  price: 300,
  image: subscriptionImage?.imageUrl || '',
};


export default function MeditacionesPage() {
  const { addToCart } = useCart();

  const handleAddToCart = (meditation: (typeof meditations)[0]) => {
    const image = PlaceHolderImages.find(p => p.id === meditation.imageId);
    const product: Product = {
      id: meditation.id,
      name: meditation.title,
      price: meditation.price,
      image: image?.imageUrl || '',
    };
    addToCart(product);
  };

  const handleSubscribe = () => {
    addToCart(subscriptionProduct);
  };

  return (
    <div className="bg-background">
      <div className="container py-16 md:py-24">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Biblioteca de Meditaciones</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            Encuentra paz, claridad y conexión a través de nuestras meditaciones guiadas por Frank Alexander. Compra grabaciones individuales o suscríbete para tener acceso ilimitado.
          </p>
        </div>

        {/* Subscription Section */}
        <div className="mb-16">
          <Card className="relative overflow-hidden w-full max-w-4xl mx-auto">
            <div className="absolute inset-0">
              {subscriptionImage && (
                <Image
                  src={subscriptionImage.imageUrl}
                  alt={subscriptionImage.description}
                  fill
                  className="object-cover brightness-[.35]"
                  data-ai-hint={subscriptionImage.imageHint}
                />
              )}
            </div>
            <div className="relative flex flex-col md:flex-row items-center justify-between p-8 md:p-12 text-white">
              <div className="max-w-md text-center md:text-left">
                <h2 className="text-3xl font-bold font-headline mb-4">Acceso Total a la Biblioteca</h2>
                <p className="text-lg text-gray-200 mb-6 md:mb-0">
                  Disfruta de todas las meditaciones existentes y futuras con nuestra suscripción mensual. Medita sin límites y profundiza en tu práctica.
                </p>
              </div>
              <div className="flex flex-col items-center gap-4 mt-6 md:mt-0">
                <p className="text-3xl font-bold [text-shadow:0_2px_4px_rgba(0,0,0,0.5)]">
                  $300 MXN / mes
                </p>
                <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 shadow-lg" onClick={handleSubscribe}>
                  <Star className="mr-2 h-5 w-5" /> Suscribirse Ahora
                </Button>
              </div>
            </div>
          </Card>
        </div>


        <div className="flex items-center justify-center mb-12">
          <div className="w-full max-w-md h-px bg-border"></div>
          <span className="mx-4 text-muted-foreground uppercase tracking-widest text-sm text-center">O compra individualmente</span>
          <div className="w-full max-w-md h-px bg-border"></div>
        </div>


        {/* Individual Meditations */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {meditations.map(meditation => {
            const image = PlaceHolderImages.find(p => p.id === meditation.imageId);
            return (
              <Card key={meditation.id} className="overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
                <Link href={`/meditaciones/${meditation.id}`} className="flex flex-col flex-grow">
                  <CardHeader className="p-0">
                    {image && <Image src={image.imageUrl} alt={meditation.title} data-ai-hint="serene meditation" width={600} height={400} className="object-cover aspect-video" />}
                  </CardHeader>
                  <CardContent className="p-6 flex flex-col flex-grow">
                    <CardTitle>{meditation.title}</CardTitle>
                    <div className="flex items-center text-muted-foreground text-sm mt-2">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{meditation.duration}</span>
                    </div>
                    <CardDescription className="mt-2 flex-grow">{meditation.description}</CardDescription>
                    <div className="mt-4 text-2xl font-bold text-primary">
                      ${meditation.price.toFixed(2)} MXN
                    </div>
                  </CardContent>
                </Link>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full" onClick={() => handleAddToCart(meditation)}>
                    <ShoppingCart className="mr-2 h-4 w-4" /> Comprar Grabación
                  </Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
