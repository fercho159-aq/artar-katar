"use client";

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export const workshops = [
  {
    id: "wshop_001",
    title: "Ciclo de Activación Nocturna",
    description: "Un viaje de 21 días para despertar tus dones y talentos multidimensionales.",
    longDescription: "Sumérgete en un profundo viaje de autodescubrimiento y activación espiritual con nuestro Ciclo de Activación Nocturna. Durante 21 noches consecutivas, recibirás activaciones energéticas mientras duermes, diseñadas para despertar tus dones psíquicos, conectar con tus guías y alinear tu ser con las frecuencias más elevadas del universo. Este ciclo es ideal para quienes buscan una transformación profunda y sostenida en el tiempo.",
    imageId: "workshop-1",
    date: "Inicia el 1 de Agosto",
    price: 111,
    status: "Abierto"
  },
  {
    id: "wshop_002",
    title: "Conexión con tu Yo Superior",
    description: "Un taller intensivo de fin de semana para alinear tu energía con tu propósito de vida.",
    longDescription: "Este taller intensivo de fin de semana es una oportunidad única para establecer una conexión clara y directa con tu Yo Superior. A través de meditaciones guiadas, ejercicios prácticos y canalizaciones en vivo, aprenderás a escuchar la voz de tu alma, recibir guía divina y alinear tus acciones diarias con tu propósito de vida más elevado. Ideal para quienes sienten el llamado a dar un salto cuántico en su camino espiritual.",
    imageId: "workshop-2",
    date: "15 y 16 de Septiembre",
    price: 222,
    status: "Abierto"
  },
  {
    id: "wshop_003",
    title: "Sanación del Niño Interior",
    description: "Libera bloqueos emocionales y patrones limitantes de tu infancia para abrazar tu verdadero ser.",
    longDescription: "En este taller sanador, nos adentraremos en las memorias de nuestra infancia para rescatar, sanar y reintegrar a nuestro niño interior. A través de técnicas de visualización, regresión consciente y trabajo energético, liberaremos heridas emocionales, patrones limitantes y creencias que nos impiden vivir en plenitud. Prepárate para abrazar a tu ser más auténtico y vulnerable con amor y compasión.",
    imageId: "meditation-2",
    date: "Próximamente",
    price: 0,
    status: "Próximamente"
  }
];

export default function TalleresPage() {
  return (
    <div className="bg-background">
      <div className="container py-16 md:py-24">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Talleres y Ciclos de Activación</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            Sumérgete en experiencias transformadoras diseñadas para elevar tu vibración y expandir tu conciencia.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {workshops.map(workshop => {
            const image = PlaceHolderImages.find(p => p.id === workshop.imageId);
            return (
              <Card key={workshop.title} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
                <Link href={`/talleres/${workshop.id}`} className="flex flex-col flex-grow">
                  <CardHeader className="p-0 relative">
                    {image && <Image src={image.imageUrl} alt={image.description} data-ai-hint={image.imageHint} width={600} height={400} className="rounded-t-lg object-cover aspect-video" />}
                    <Badge className="absolute top-2 right-2" variant={workshop.status === "Abierto" ? "default" : "secondary"}>{workshop.status}</Badge>
                  </CardHeader>
                  <CardContent className="p-6 flex-grow flex flex-col">
                    <CardTitle>{workshop.title}</CardTitle>
                    <CardDescription className="mt-2 flex-grow">{workshop.description}</CardDescription>
                    <div className="mt-4 text-sm text-foreground">
                      <p><span className="font-semibold text-muted-foreground">Fecha:</span> {workshop.date}</p>
                       <p className="font-bold text-primary text-lg mt-1">{workshop.status === 'Abierto' ? `$${workshop.price} USD` : 'Por anunciar'}</p>
                    </div>
                  </CardContent>
                </Link>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full" asChild>
                    <Link href={`/talleres/${workshop.id}`}>
                      Más Información <ArrowRight className="ml-2" />
                    </Link>
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
