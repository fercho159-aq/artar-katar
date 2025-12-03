'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Clock, ShoppingCart, Tag } from 'lucide-react';
import { useCart, type Product } from '@/context/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { meditations } from '../page';
import Link from 'next/link';

export default function MeditacionDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const meditation = meditations.find((m) => m.id === params.id);

  if (!meditation) {
    return (
      <div className="container py-16 md:py-24 text-center">
        <h1 className="text-2xl font-bold">Meditación no encontrada</h1>
        <p className="text-muted-foreground mt-2">
          La meditación que buscas no existe o ha sido movida.
        </p>
        <Button asChild className="mt-4">
          <Link href="/meditaciones">Volver a la biblioteca</Link>
        </Button>
      </div>
    );
  }

  const image = PlaceHolderImages.find((p) => p.id === meditation.imageId);

  const handleAddToCart = () => {
    const product: Product = {
      id: meditation.id,
      name: meditation.title,
      price: meditation.price,
      image: image?.imageUrl || '',
    };
    addToCart(product);
  };

  return (
    <div className="container py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          {image && (
            <Image
              src={image.imageUrl}
              alt={meditation.title}
              width={800}
              height={600}
              className="rounded-xl shadow-lg object-cover aspect-[4/3]"
              data-ai-hint={image.imageHint}
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold font-headline mb-4">
            {meditation.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {meditation.description}
          </p>

          <Card className="bg-muted/50 mb-6">
            <CardContent className="p-4 grid grid-cols-2 gap-4">
              <div className="flex items-center text-foreground">
                <Clock className="mr-3 text-primary" />
                <span className="font-semibold">{meditation.duration}</span>
              </div>
              <div className="flex items-center text-foreground">
                <Tag className="mr-3 text-primary" />
                <span className="font-semibold text-2xl text-primary">
                  ${meditation.price.toFixed(2)} MXN
                </span>
              </div>
            </CardContent>
          </Card>

          <Button size="lg" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2" />
            Comprar Grabación
          </Button>
        </div>
      </div>
    </div>
  );
}
