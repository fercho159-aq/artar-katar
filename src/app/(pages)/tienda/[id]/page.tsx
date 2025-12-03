'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Card, CardContent } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';

const getImageIdForProduct = (product: Product): string => {
  if (product.type === 'PHYSICAL_GOOD' && product.name.toLowerCase().includes('pulsera')) {
    return 'shop-bracelet';
  }
  return 'shop-crystal';
};

const parseDescription = (description: string | null) => {
  if (!description) return { benefits: [], material: '' };
  const parts = description.split('Material:');
  const benefits = parts[0].split(' | ').map(b => b.trim()).filter(b => b);
  const material = parts.length > 1 ? parts[1].trim() : '';
  return { benefits, material };
};

export default function TiendaDetailPage() {
  const params = useParams();
  const { id } = params;
  const { addToCart } = useCart();
  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (id) {
      async function fetchProduct() {
        try {
          const response = await fetch(`/api/products/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch product');
          }
          const data = await response.json();
          setProduct(data);
        } catch (error) {
          console.error(error);
          setProduct(null);
        } finally {
          setIsLoading(false);
        }
      }
      fetchProduct();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="container py-16 md:py-24">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          <Skeleton className="aspect-square w-full rounded-xl" />
          <div className="space-y-6">
            <Skeleton className="h-10 w-3/4" />
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-8 w-1/4" />
            <Skeleton className="h-12 w-full" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container py-16 md:py-24 text-center">
        <h1 className="text-2xl font-bold">Producto no encontrado</h1>
        <p className="text-muted-foreground mt-2">
          El producto que buscas no existe o ha sido movido.
        </p>
      </div>
    );
  }

  const imageId = getImageIdForProduct(product);
  const image = PlaceHolderImages.find((p) => p.id === imageId);
  const { benefits, material } = parseDescription(product.description);

  const handleAddToCart = () => {
    addToCart({
      id: product.product_sku,
      name: product.name,
      price: Number(product.price),
      image: product.image_url || image?.imageUrl || '',
    });
  };

  return (
    <div className="container py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          <Image
            src={product.image_url || image?.imageUrl || '/placeholder.svg'}
            alt={product.name}
            width={800}
            height={800}
            className="rounded-xl shadow-lg object-cover aspect-square"
            data-ai-hint={image?.imageHint}
          />
        </div>
        <div className="flex flex-col justify-center">
          <h1 className="text-4xl lg:text-5xl font-bold font-headline mb-4 uppercase">
            {product.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-6">
            Cargadas para potenciar tu energía y vibración.
          </p>
          
          <Card className="bg-muted/50 mb-6">
            <CardContent className="p-6 space-y-4">
              <div className="space-y-2">
                <h4 className="font-semibold text-foreground">Beneficios:</h4>
                <div className="space-y-2 text-sm text-foreground/80">
                  {benefits.map((benefit, i) => (
                    <div key={i} className="flex items-center gap-2">
                      <CheckCircle className="h-4 w-4 text-primary" />
                      <span>{benefit}</span>
                    </div>
                  ))}
                </div>
              </div>
               {material && (
                 <div>
                    <h4 className="font-semibold text-foreground">Material:</h4>
                    <p className="text-sm text-foreground/80">{material}</p>
                 </div>
              )}
            </CardContent>
          </Card>

          <p className="text-4xl font-bold text-primary mb-6">
            ${Number(product.price).toFixed(0)} MXN
          </p>

          <Button size="lg" onClick={handleAddToCart}>
            <ShoppingCart className="mr-2" />
            Añadir al Carrito
          </Button>
        </div>
      </div>
    </div>
  );
}
