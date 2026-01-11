'use client';

import { useParams } from 'next/navigation';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { Button } from '@/components/ui/button';
import { CheckCircle, ShoppingCart, Sparkles, Gem, BookOpen, ArrowLeft, Users } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
        <Link href="/tienda">
          <Button variant="outline" className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Volver a la tienda
          </Button>
        </Link>
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
      type: product.type, // PHYSICAL_GOOD, WORKSHOP, etc.
    });
  };

  return (
    <div className="bg-background">
      {/* Back Button */}
      <div className="container pt-8">
        <Link href="/tienda">
          <Button variant="ghost" size="sm" className="gap-2 text-muted-foreground hover:text-foreground">
            <ArrowLeft className="h-4 w-4" />
            Volver a la tienda
          </Button>
        </Link>
      </div>

      {/* Product Section */}
      <div className="container py-8 md:py-16">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-16">
          {/* Image */}
          <div className="relative">
            <div className="sticky top-24">
              <div className="relative rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src={product.image_url || image?.imageUrl || '/placeholder.svg'}
                  alt={product.name}
                  width={800}
                  height={800}
                  className="object-cover aspect-square"
                  data-ai-hint={image?.imageHint}
                  priority
                />
                {/* Category Badge */}
                {product.category && (
                  <div className="absolute top-4 left-4 px-3 py-1.5 rounded-full bg-primary/90 text-primary-foreground text-sm font-medium backdrop-blur-sm">
                    {product.category}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Product Info */}
          <div className="flex flex-col">
            {/* Title */}
            <h1 className="text-3xl lg:text-4xl font-bold font-headline mb-3 uppercase bg-clip-text text-transparent bg-gradient-to-r from-primary to-purple-600">
              {product.name}
            </h1>

            {/* Short Description */}
            <p className="text-lg text-muted-foreground mb-6">
              {product.short_description || 'Cargadas para potenciar tu energía y vibración.'}
            </p>

            {/* Activated By */}
            {product.activated_by && (
              <div className="flex items-start gap-3 p-4 rounded-lg bg-primary/5 border border-primary/20 mb-6">
                <div className="p-2 rounded-full bg-primary/10">
                  <Sparkles className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">Activada por</p>
                  <p className="text-sm text-muted-foreground">{product.activated_by}</p>
                </div>
              </div>
            )}

            {/* Stone */}
            {(product.stone || material) && (
              <div className="flex items-center gap-3 mb-6">
                <Gem className="h-5 w-5 text-primary" />
                <div>
                  <span className="font-semibold">Piedra: </span>
                  <span className="text-muted-foreground">{product.stone || material}</span>
                </div>
              </div>
            )}

            {/* Benefits Card */}
            <Card className="bg-gradient-to-br from-muted/50 to-muted/30 border-primary/10 mb-6">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center gap-2">
                  <CheckCircle className="h-5 w-5 text-primary" />
                  Beneficios
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                {benefits.map((benefit, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <CheckCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                    <span className="text-sm text-foreground/80">{benefit}</span>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Learn More Accordion */}
            {product.learn_more && (
              <Accordion type="single" collapsible className="mb-6">
                <AccordionItem value="learn-more" className="border border-primary/20 rounded-lg px-4">
                  <AccordionTrigger className="hover:no-underline">
                    <div className="flex items-center gap-2 text-primary">
                      <BookOpen className="h-4 w-4" />
                      <span className="font-semibold">Saber Más</span>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent>
                    <div className="prose prose-sm max-w-none text-muted-foreground whitespace-pre-line">
                      {product.learn_more}
                    </div>
                  </AccordionContent>
                </AccordionItem>
              </Accordion>
            )}

            {/* Price and Add to Cart */}
            <div className="mt-auto pt-6 border-t border-border">
              <div className="flex items-center justify-between mb-4">
                <p className="text-4xl font-bold text-primary">
                  ${Number(product.price).toFixed(0)} MXN
                </p>
              </div>

              <Button size="lg" onClick={handleAddToCart} className="w-full text-lg py-6">
                <ShoppingCart className="mr-2 h-5 w-5" />
                Añadir al Carrito
              </Button>

              {/* Usage Note */}
              <div className="mt-4 p-3 rounded-lg bg-muted/50 border border-border">
                <div className="flex items-start gap-2 text-xs text-muted-foreground">
                  <Users className="h-4 w-4 mt-0.5 flex-shrink-0" />
                  <p>Para cualquier edad (adultos, adolescentes y niños). Puedes combinar varias pulseras para potenciar sus efectos.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
