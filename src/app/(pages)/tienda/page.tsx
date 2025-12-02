"use client";

import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import { useCart, type Product } from "@/context/CartContext";

const products: Omit<Product, 'image'>[] = [
  { id: "prod_001", name: "Pulsera de Cuarzo Rosa", price: 44.00 },
  { id: "prod_002", name: "Cristal Atlante", price: 77.00 },
  { id: "prod_003", name: "Pulsera de Amatista", price: 44.00 },
  { id: "prod_004", name: "Punta de Cuarzo Lemuriano", price: 88.00 },
  { id: "prod_005", name: "Pulsera de Ojo de Tigre", price: 44.00 },
  { id: "prod_006", name: "Orgonita Pleyadiana", price: 99.00 },
  { id: "prod_007", name: "Pulsera de 7 Chakras", price: 55.00 },
  { id: "prod_008", name: "Geoda de Amatista", price: 122.00 },
];

const productDetails = [
  { name: "Pulsera de Cuarzo Rosa", price: "$44.00", imageId: "shop-bracelet", tag: "Amor", id: "prod_001" },
  { name: "Cristal Atlante", price: "$77.00", imageId: "shop-crystal", tag: "Sabiduría", id: "prod_002" },
  { name: "Pulsera de Amatista", price: "$44.00", imageId: "shop-bracelet", tag: "Protección", id: "prod_003" },
  { name: "Punta de Cuarzo Lemuriano", price: "$88.00", imageId: "shop-crystal", tag: "Conexión", id: "prod_004" },
  { name: "Pulsera de Ojo de Tigre", price: "$44.00", imageId: "shop-bracelet", tag: "Fuerza", id: "prod_005" },
  { name: "Orgonita Pleyadiana", price: "$99.00", imageId: "shop-crystal", tag: "Energía", id: "prod_006" },
  { name: "Pulsera de 7 Chakras", price: "$55.00", imageId: "shop-bracelet", tag: "Equilibrio", id: "prod_007" },
  { name: "Geoda de Amatista", price: "$122.00", imageId: "shop-crystal", tag: "Paz", id: "prod_008" },
];


export default function TiendaPage() {
  const { addToCart } = useCart();

  const handleAddToCart = (productDetail: (typeof productDetails)[0]) => {
    const image = PlaceHolderImages.find(p => p.id === productDetail.imageId);
    const product: Product = {
      id: productDetail.id,
      name: productDetail.name,
      price: parseFloat(productDetail.price.replace('$', '')),
      image: image?.imageUrl || '',
    };
    addToCart(product);
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
          {productDetails.map(product => {
            const image = PlaceHolderImages.find(p => p.id === product.imageId);
            return (
              <Card key={product.name} className="flex flex-col overflow-hidden group hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0 relative overflow-hidden">
                  {image && <Image src={image.imageUrl} alt={product.name} data-ai-hint={image.imageId === 'shop-bracelet' ? 'crystal bracelet' : 'quartz crystal'} width={500} height={500} className="object-cover aspect-square group-hover:scale-105 transition-transform duration-300" />}
                  <Badge variant="secondary" className="absolute top-3 right-3 bg-accent/90 text-accent-foreground backdrop-blur-sm">{product.tag}</Badge>
                </CardHeader>
                <CardContent className="p-4 flex-grow">
                  <CardTitle className="text-lg">{product.name}</CardTitle>
                  <p className="text-xl font-semibold mt-2 text-primary">{product.price}</p>
                </CardContent>
                <CardFooter className="p-4 pt-0">
                  <Button className="w-full" onClick={() => handleAddToCart(product)}>Añadir al Carrito</Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
