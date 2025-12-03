'use client';

import { useParams } from 'next/navigation';
import { workshops } from '../page';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, ShoppingCart, MessageSquare } from 'lucide-react';
import { useCart, type Product } from '@/context/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';

export default function TallerDetailPage() {
  const params = useParams();
  const { addToCart } = useCart();
  const workshop = workshops.find((w) => w.id === params.id);

  if (!workshop) {
    return (
      <div className="container py-16 md:py-24 text-center">
        <h1 className="text-2xl font-bold">Taller no encontrado</h1>
        <p className="text-muted-foreground mt-2">
          El taller que buscas no existe o ha sido movido.
        </p>
        <Button asChild className="mt-4">
          <Link href="/talleres">Volver a Talleres</Link>
        </Button>
      </div>
    );
  }

  const image = PlaceHolderImages.find((p) => p.id === workshop.imageId);
  
  const handleAddToCart = () => {
    const product: Product = {
      id: workshop.id,
      name: workshop.title,
      price: workshop.price,
      image: image?.imageUrl || '',
    };
    addToCart(product);
  };
  
  const whatsappNumber = "528181139378";
  const whatsappMessage = encodeURIComponent(`Hola, me gustaría recibir más información sobre el taller: "${workshop.title}"`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;


  return (
    <div className="container py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          {image && (
            <Image
              src={image.imageUrl}
              alt={workshop.title}
              width={800}
              height={600}
              className="rounded-xl shadow-lg object-cover aspect-[4/3]"
              data-ai-hint={image.imageHint}
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <Badge
            className="w-fit mb-2"
            variant={workshop.status === 'Abierto' ? 'default' : 'secondary'}
          >
            {workshop.status}
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold font-headline mb-4">
            {workshop.title}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            {workshop.longDescription || workshop.description}
          </p>

          <Card className="bg-muted/50 mb-6">
            <CardContent className="p-4 grid grid-cols-2 gap-4">
              <div className="flex items-center text-foreground">
                <Calendar className="mr-3 text-primary" />
                <span className='font-semibold'>Fecha: {workshop.date}</span>
              </div>
              <div className="flex items-center text-foreground">
                <p className="font-semibold text-2xl text-primary">${workshop.price} USD</p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button 
              size="lg" 
              onClick={handleAddToCart}
              disabled={workshop.status !== 'Abierto'}
              className="flex-1"
            >
              <ShoppingCart className="mr-2" />
              Inscribirme Ahora
            </Button>
            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link href={whatsappUrl} target="_blank">
                <MessageSquare className="mr-2" />
                Pedir Información
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
