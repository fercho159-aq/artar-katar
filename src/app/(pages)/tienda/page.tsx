"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { useCart, type Product as CartProduct } from "@/context/CartContext";
import { useEffect, useState } from "react";
import { Product } from "@/lib/types";
import { Skeleton } from "@/components/ui/skeleton";

const getTagForProduct = (product: Product): string => {
  if (product.name.toLowerCase().includes('cuarzo rosa')) return 'Amor';
  if (product.name.toLowerCase().includes('atlante')) return 'Sabiduría';
  if (product.name.toLowerCase().includes('amatista')) return 'Protección';
  if (product.name.toLowerCase().includes('lemuriano')) return 'Conexión';
  if (product.name.toLowerCase().includes('ojo de tigre')) return 'Fuerza';
  if (product.name.toLowerCase().includes('orgonita')) return 'Energía';
  if (product.name.toLowerCase().includes('chakras')) return 'Equilibrio';
  return 'Paz';
}

const getImageIdForProduct = (product: Product): string => {
    if (product.type === 'PHYSICAL_GOOD' && product.name.toLowerCase().includes('pulsera')) {
        return 'shop-bracelet';
    }
    return 'shop-crystal';
}


export default function TiendaPage() {
  const { addToCart } = useCart();
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

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
    const cartProduct: CartProduct = {
      id: product.product_sku,
      name: product.name,
      price: product.price,
      image: product.image_url || '',
    };
    addToCart(cartProduct);
  };

  return (
    <div className="bg-background">
      <div className="container py-16 md:py-24">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Tienda Cósmica</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            Herramientas energéticas y joyería activada multidimensionalmente para potenciar tu camino espiritual.
          </p>
        </div>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, index) => (
               <Card key={index} className="flex flex-col overflow-hidden">
                  <CardHeader className="p-0 relative overflow-hidden">
                     <Skeleton className="w-full aspect-square" />
                  </CardHeader>
                  <CardContent className="p-4 flex-grow space-y-2">
                     <Skeleton className="h-5 w-3/4" />
                     <Skeleton className="h-6 w-1/2" />
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                     <Skeleton className="h-10 w-full" />
                  </CardFooter>
               </Card>
            ))
          ) : (
            products.map(product => {
              const imageId = getImageIdForProduct(product);
              const image = PlaceHolderImages.find(p => p.id === imageId);
              const tag = getTagForProduct(product);
              
              return (
                <Card key={product.id} className="flex flex-col overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                  <CardHeader className="p-0 relative overflow-hidden">
                    <Image src={product.image_url || image?.imageUrl || '/placeholder.svg'} alt={product.name} data-ai-hint={image?.imageHint} width={500} height={500} className="object-cover aspect-square group-hover:scale-105 transition-transform duration-300" />
                    <Badge variant="secondary" className="absolute top-3 right-3 bg-accent/90 text-accent-foreground backdrop-blur-sm">{tag}</Badge>
                  </CardHeader>
                  <CardContent className="p-4 flex-grow">
                    <CardTitle className="text-lg">{product.name}</CardTitle>
                    <p className="text-xl font-semibold mt-2 text-primary">${product.price.toFixed(2)}</p>
                  </CardContent>
                  <CardFooter className="p-4 pt-0">
                    <Button className="w-full" onClick={() => handleAddToCart(product)}>Añadir al Carrito</Button>
                  </CardFooter>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
