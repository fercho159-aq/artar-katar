'use client';

import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, ShoppingCart } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const getImageIdForProduct = (product: Product): string => {
  if (
    product.type === 'PHYSICAL_GOOD' &&
    product.name.toLowerCase().includes('pulsera')
  ) {
    return 'shop-bracelet';
  }
  return 'shop-crystal';
};

// Helper to parse description into benefits and material
const parseDescription = (description: string | null) => {
    if (!description) return { benefits: [], material: '' };
    const parts = description.split('Material:');
    const benefits = parts[0].split(' | ').map(b => b.trim()).filter(b => b);
    const material = parts.length > 1 ? parts[1].trim() : '';
    return { benefits, material };
}

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function fetchProducts() {
      try {
        const response = await fetch('/api/products');
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    }
    fetchProducts();
  }, []);
  
  const handleAddToCart = (product: Product) => {
    const imageId = getImageIdForProduct(product);
    const image = PlaceHolderImages.find((p) => p.id === imageId);
    
    addToCart({
      id: product.product_sku,
      name: product.name,
      price: Number(product.price),
      image: product.image_url || image?.imageUrl || '',
    });
  };

  return (
    <div className="bg-background">
      <div className="container py-16 md:py-24">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">
            Tienda Cósmica
          </h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            Herramientas energéticas y joyería activada multidimensionalmente
            para potenciar tu camino espiritual.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {isLoading
            ? Array.from({ length: 3 }).map((_, index) => (
                <Card key={index} className="flex flex-col overflow-hidden">
                  <Skeleton className="w-full aspect-square" />
                  <CardContent className="p-6 flex-grow space-y-4">
                    <Skeleton className="h-6 w-3/4" />
                    <Skeleton className="h-4 w-full" />
                    <div className="space-y-2">
                        <Skeleton className="h-4 w-5/6" />
                        <Skeleton className="h-4 w-4/6" />
                        <Skeleton className="h-4 w-5/6" />
                    </div>
                    <Skeleton className="h-5 w-1/2" />
                    <Skeleton className="h-8 w-1/3" />
                    <Skeleton className="h-10 w-full" />
                  </CardContent>
                </Card>
              ))
            : products.map((product) => {
                const imageId = getImageIdForProduct(product);
                const image = PlaceHolderImages.find((p) => p.id === imageId);
                const priceAsNumber = Number(product.price);
                const { benefits, material } = parseDescription(product.description);
                
                return (
                  <Card
                    key={product.id}
                    className="flex flex-col overflow-hidden group hover:shadow-xl transition-shadow duration-300 border-primary/20"
                  >
                    <Link href={`/tienda/${product.id}`} className="flex flex-col flex-grow">
                      <div className="p-0 relative overflow-hidden">
                       <Image
                        src={
                          product.image_url ||
                          image?.imageUrl ||
                          '/placeholder.svg'
                        }
                        alt={product.name}
                        data-ai-hint={image?.imageHint}
                        width={500}
                        height={500}
                        className="object-cover aspect-square"
                      />
                      </div>
                      <CardContent className="p-6 flex flex-col flex-grow text-foreground/80">
                        <h3 className="text-xl font-bold font-headline text-center uppercase text-foreground mb-2">
                          {product.name}
                        </h3>
                        <p className="text-sm text-center text-muted-foreground mb-4">
                          Cargadas para potenciar tu energía
                        </p>
                        
                        <div className="space-y-2 mb-4 text-sm flex-grow">
                          {benefits.slice(0, 3).map((benefit, i) => ( // Show first 3 benefits
                              <div key={i} className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-primary" />
                                  <span>{benefit}</span>
                              </div>
                          ))}
                           {benefits.length > 3 && <p className="text-sm text-muted-foreground">y más...</p>}
                        </div>

                        {material && (
                           <p className="text-sm mb-4">
                              <span className="font-semibold">Material:</span> {material}
                           </p>
                        )}

                        <p className="text-3xl font-bold text-center text-primary mb-4">
                          ${priceAsNumber.toFixed(0)} MXN
                        </p>
                      </CardContent>
                    </Link>
                    <CardFooter className="p-6 pt-0">
                       <Button className="w-full" onClick={() => handleAddToCart(product)}>
                          <ShoppingCart className="mr-2 h-4 w-4" />
                          Añadir al Carrito
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
