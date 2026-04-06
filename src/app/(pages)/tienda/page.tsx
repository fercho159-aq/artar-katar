'use client';

import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { useEffect, useState } from 'react';
import { Product } from '@/lib/types';
import { Skeleton } from '@/components/ui/skeleton';
import { CheckCircle, ShoppingCart, Sparkles, Shield, Heart, Brain, Flame, Gem, ChevronDown, ChevronUp, Moon, Clock, Star, Eye, Zap } from 'lucide-react';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const getImageIdForProduct = (product: Product): string => {
  if (
    product.type === 'PHYSICAL_GOOD' &&
    product.name.toLowerCase().includes('pulsera')
  ) {
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
}

// Grupos de categorías con su orden visual
const categoryGroups = [
  {
    id: 'abundancia',
    label: 'Abundancia',
    subtitle: 'Abundancia & ADN Millonario - 12 modelos',
    icon: Star,
    color: 'from-amber-500/20 to-yellow-500/10',
    borderColor: 'border-amber-500/30',
    textColor: 'text-amber-500',
    keywords: ['abundancia'],
  },
  {
    id: 'sexualidad',
    label: 'Sexualidad',
    subtitle: 'Kundalini & Sexualidad: Hombres, Mujeres y Parejas',
    icon: Flame,
    color: 'from-red-500/20 to-pink-500/10',
    borderColor: 'border-red-500/30',
    textColor: 'text-red-500',
    keywords: ['sexualidad'],
  },
  {
    id: 'conexion-arcturiana',
    label: 'Conexión Arcturiana',
    subtitle: 'Energía ascensional de la 7a y 9a dimensión',
    icon: Brain,
    color: 'from-pink-400/20 to-rose-400/10',
    borderColor: 'border-pink-400/30',
    textColor: 'text-pink-400',
    keywords: ['conexion arcturiana', 'conexión arcturiana'],
  },
  {
    id: 'proposito',
    label: 'Propósito',
    subtitle: 'Dones y Potencial del Alma',
    icon: Heart,
    color: 'from-orange-500/20 to-red-500/10',
    borderColor: 'border-orange-500/30',
    textColor: 'text-orange-500',
    keywords: ['proposito', 'propósito'],
  },
  {
    id: 'sanacion',
    label: 'Sanación',
    subtitle: 'Sanadores Cósmicos & Anclas de Sanadores Cósmicos',
    icon: Gem,
    color: 'from-emerald-500/20 to-teal-500/10',
    borderColor: 'border-emerald-500/30',
    textColor: 'text-emerald-500',
    keywords: ['sanacion', 'sanación'],
  },
  {
    id: 'proteccion',
    label: 'Protección',
    subtitle: 'Protección Energética, Extra-Fuerte & Anclas de Protección',
    icon: Shield,
    color: 'from-violet-500/20 to-purple-500/10',
    borderColor: 'border-violet-500/30',
    textColor: 'text-violet-500',
    keywords: ['proteccion', 'protección'],
  },
];

const getGroupForProduct = (product: Product): string => {
  const category = (product.category || '').toLowerCase();
  for (const group of categoryGroups) {
    if (group.keywords.some(kw => category.includes(kw))) {
      return group.id;
    }
  }
  return 'other';
};

export default function TiendaPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showMethodology, setShowMethodology] = useState(false);
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

  // Scroll to category group
  const scrollToGroup = (groupId: string) => {
    const el = document.getElementById(`group-${groupId}`);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Group products by category
  const groupedProducts = categoryGroups.map(group => ({
    ...group,
    products: products.filter(p => getGroupForProduct(p) === group.id),
  })).filter(g => g.products.length > 0);

  return (
    <div className="bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background">
        <div className="absolute inset-0 bg-[url('/stars-pattern.svg')] opacity-5"></div>
        <div className="container py-16 md:py-24 relative z-10">
          <div className="flex flex-col items-center justify-center space-y-6 text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium">
              <Sparkles className="h-4 w-4" />
              Colección Astar Katar
            </div>
            <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl font-headline bg-clip-text text-transparent bg-gradient-to-r from-primary via-purple-500 to-primary">
              Tienda Cósmica
            </h1>
            <p className="max-w-[800px] text-muted-foreground text-lg md:text-xl/relaxed">
              Pulseras activadas multidimensionalmente en el portal de Astar Katar.
              Geometría sagrada cargada con energía vital para tu evolución espiritual.
            </p>
          </div>

          {/* Methodology Section - Collapsible */}
          <div className="max-w-4xl mx-auto">
            <Card className="border-primary/20 bg-card/50 backdrop-blur-sm">
              <div
                className="cursor-pointer hover:bg-muted/30 transition-colors rounded-t-lg p-6"
                onClick={() => setShowMethodology(!showMethodology)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className="p-2 rounded-full bg-primary/10">
                      <Gem className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold">¿Cómo trabajan las pulseras "ASTAR KATAR"?</h3>
                  </div>
                  {showMethodology ? <ChevronUp className="h-5 w-5 text-muted-foreground" /> : <ChevronDown className="h-5 w-5 text-muted-foreground" />}
                </div>
              </div>
              {showMethodology && (
                <CardContent className="pt-0 space-y-6">
                  <p className="text-muted-foreground">
                    El lenguaje de creación en los planos superiores del universo está conformado por geometría.
                    Este lenguaje de geometría creadora está a la base de las activaciones ejercidas sobre las piedras
                    de las pulseras que ofrecemos.
                  </p>

                  <Accordion type="single" collapsible className="w-full">
                    <AccordionItem value="activation">
                      <AccordionTrigger className="text-foreground hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Sparkles className="h-4 w-4 text-primary" />
                          Activación y Duración
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground space-y-2">
                        <p>Cada piedra que conforma las pulseras tiene energía vital propia y es activada en su singularidad
                          por los seres cósmicos que intervienen. Es activada y modificada a nivel cuántico en el portal
                          interdimensional de Astar Katar, manteniendo su nueva información indefinidamente.</p>
                        <ul className="space-y-1 mt-3">
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <strong>La carga es duradera:</strong> No se pierde.
                          </li>
                          <li className="flex items-center gap-2">
                            <CheckCircle className="h-4 w-4 text-green-500" />
                            <strong>Mantenimiento:</strong> No requiere ser limpiada energéticamente.
                          </li>
                        </ul>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="multidimensional">
                      <AccordionTrigger className="text-foreground hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Zap className="h-4 w-4 text-primary" />
                          Efecto Multidimensional
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        <p>Las pulseras son activadas para trabajar multidimensionalmente, limpiando y reformulando
                          tus paradigmas limitantes, tanto de esta vida, de otras encarnaciones pasadas tuyas o de
                          limitaciones subconscientes heredadas de tus antepasados. Como tal, trabajan en gran
                          profundidad y el usarlas durante largo tiempo cambiará tu vida.</p>
                      </AccordionContent>
                    </AccordionItem>

                    <AccordionItem value="fabrication">
                      <AccordionTrigger className="text-foreground hover:no-underline">
                        <div className="flex items-center gap-2">
                          <Gem className="h-4 w-4 text-primary" />
                          Fabricación Artesanal
                        </div>
                      </AccordionTrigger>
                      <AccordionContent className="text-muted-foreground">
                        <p>Cada pulsera es ideada y diseñada por los seres cósmicos que las cargan con su energía.
                          Son fabricadas artesanalmente, por lo que puede haber pequeñas variaciones; éstas no
                          afectan su efectividad energética.</p>
                      </AccordionContent>
                    </AccordionItem>
                  </Accordion>

                  {/* Usage Guide */}
                  <div className="mt-6 p-4 rounded-lg bg-primary/5 border border-primary/20">
                    <h4 className="font-semibold text-foreground mb-4 flex items-center gap-2">
                      <Star className="h-4 w-4 text-primary" />
                      Guía de Uso
                    </h4>
                    <div className="grid gap-3 sm:grid-cols-2">
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-full bg-primary/10 mt-0.5">
                          <Sparkles className="h-3 w-3 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Combinación</p>
                          <p className="text-xs text-muted-foreground">Puedes usar una o varias pulseras a la vez; se complementan y refuerzan mutuamente.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-full bg-primary/10 mt-0.5">
                          <Clock className="h-3 w-3 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Tiempo de uso</p>
                          <p className="text-xs text-muted-foreground">Si sientes la energía muy fuerte, úsala por intervalos hasta poder usarla 24 horas.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-full bg-primary/10 mt-0.5">
                          <Moon className="h-3 w-3 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Durante el sueño</p>
                          <p className="text-xs text-muted-foreground">Procura dejarlas puestas al dormir, cuando más trabajan tu subconsciente.</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="p-1.5 rounded-full bg-primary/10 mt-0.5">
                          <Heart className="h-3 w-3 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm">Público</p>
                          <p className="text-xs text-muted-foreground">Para cualquier edad (adultos, adolescentes y niños); cada uno recibe según sus desafíos.</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              )}
            </Card>
          </div>
        </div>
      </div>

      {/* Quick Navigation */}
      {!isLoading && groupedProducts.length > 0 && (
        <div className="sticky top-0 z-20 bg-background/80 backdrop-blur-md border-b border-border">
          <div className="container">
            <div className="flex flex-wrap justify-center gap-2 py-3">
              {groupedProducts.map((group) => {
                const Icon = group.icon;
                return (
                  <Button
                    key={group.id}
                    variant="outline"
                    size="sm"
                    onClick={() => scrollToGroup(group.id)}
                    className={`gap-2 ${group.borderColor} hover:bg-muted/50`}
                  >
                    <Icon className={`h-4 w-4 ${group.textColor}`} />
                    {group.label}
                    <span className="text-xs text-muted-foreground">({group.products.length})</span>
                  </Button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* Products Section - Grouped by Category */}
      <div className="container pb-16 md:pb-24 pt-8">
        {isLoading ? (
          <div className="grid gap-8 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, index) => (
              <Card key={index} className="flex flex-col overflow-hidden">
                <Skeleton className="w-full aspect-square" />
                <CardContent className="p-6 flex-grow space-y-4">
                  <Skeleton className="h-6 w-3/4" />
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-5/6" />
                  <Skeleton className="h-5 w-1/2" />
                  <Skeleton className="h-10 w-full" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <div className="space-y-16">
            {groupedProducts.map((group) => {
              const Icon = group.icon;
              return (
                <section key={group.id} id={`group-${group.id}`} className="scroll-mt-20">
                  {/* Group Header */}
                  <div className={`relative mb-8 p-6 rounded-2xl bg-gradient-to-r ${group.color} border ${group.borderColor}`}>
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-xl bg-background/80 shadow-sm`}>
                        <Icon className={`h-7 w-7 ${group.textColor}`} />
                      </div>
                      <div>
                        <h2 className="text-2xl md:text-3xl font-bold font-headline text-foreground">
                          {group.label}
                        </h2>
                        <p className="text-sm text-muted-foreground mt-1">{group.subtitle}</p>
                      </div>
                      <div className="ml-auto">
                        <span className={`text-sm font-medium ${group.textColor}`}>
                          {group.products.length} {group.products.length === 1 ? 'producto' : 'productos'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Product Grid */}
                  <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                    {group.products.map((product) => {
                      const imageId = getImageIdForProduct(product);
                      const image = PlaceHolderImages.find((p) => p.id === imageId);
                      const priceAsNumber = Number(product.price);
                      const { benefits } = parseDescription(product.description);

                      return (
                        <Card
                          key={product.id}
                          className={`flex flex-col overflow-hidden group hover:shadow-xl transition-shadow duration-300 ${group.borderColor}`}
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
                                className="object-cover aspect-square group-hover:scale-105 transition-transform duration-500"
                              />
                            </div>
                            <CardContent className="p-4 flex flex-col flex-grow text-foreground/80">
                              <h3 className="text-sm font-bold font-headline text-center uppercase text-foreground mb-2 line-clamp-2">
                                {product.name}
                              </h3>

                              {/* Short Description */}
                              <p className="text-xs text-center text-muted-foreground mb-2 line-clamp-4 whitespace-pre-line">
                                {product.short_description || 'Cargadas para potenciar tu energía'}
                              </p>

                              {/* First 2 Benefits */}
                              <div className="space-y-1 mb-3 text-xs flex-grow">
                                {benefits.slice(0, 2).map((benefit, i) => (
                                  <div key={i} className="flex items-center gap-1.5">
                                    <CheckCircle className={`h-3 w-3 ${group.textColor} flex-shrink-0`} />
                                    <span className="line-clamp-1">{benefit}</span>
                                  </div>
                                ))}
                              </div>

                              {/* Stone */}
                              {product.stone && (
                                <div className="flex items-center gap-1.5 mb-3 text-xs">
                                  <Gem className={`h-3 w-3 ${group.textColor}`} />
                                  <span className="line-clamp-1">{product.stone}</span>
                                </div>
                              )}

                              <p className="text-xl font-bold text-center text-primary">
                                ${priceAsNumber.toFixed(0)} MXN
                              </p>
                            </CardContent>
                          </Link>
                          <CardFooter className="p-4 pt-0 flex flex-col gap-2">
                            <Link href={`/tienda/${product.id}`} className="w-full">
                              <Button variant="outline" size="sm" className={`w-full ${group.borderColor} ${group.textColor} hover:bg-muted/50 transition-colors`}>
                                <Eye className="mr-2 h-3 w-3" />
                                Ver Más
                              </Button>
                            </Link>
                            <Button size="sm" className="w-full" onClick={(e) => { e.preventDefault(); handleAddToCart(product); }}>
                              <ShoppingCart className="mr-2 h-3 w-3" />
                              Añadir al Carrito
                            </Button>
                          </CardFooter>
                        </Card>
                      );
                    })}
                  </div>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
