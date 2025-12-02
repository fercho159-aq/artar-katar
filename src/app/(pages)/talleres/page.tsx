import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Badge } from "@/components/ui/badge";

const workshops = [
  {
    title: "Ciclo de Activación Nocturna",
    description: "Un viaje de 21 días para despertar tus dones y talentos multidimensionales.",
    imageId: "workshop-1",
    date: "Inicia el 1 de Agosto",
    price: "$111 USD",
    status: "Abierto"
  },
  {
    title: "Conexión con tu Yo Superior",
    description: "Un taller intensivo de fin de semana para alinear tu energía con tu propósito de vida.",
    imageId: "workshop-2",
    date: "15 y 16 de Septiembre",
    price: "$222 USD",
    status: "Abierto"
  },
  {
    title: "Sanación del Niño Interior",
    description: "Libera bloqueos emocionales y patrones limitantes de tu infancia para abrazar tu verdadero ser.",
    imageId: "meditation-2",
    date: "Próximamente",
    price: "Por anunciar",
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
                <CardHeader className="p-0 relative">
                  {image && <Image src={image.imageUrl} alt={image.description} data-ai-hint={image.imageHint} width={600} height={400} className="rounded-t-lg object-cover aspect-video" />}
                  <Badge className="absolute top-2 right-2" variant={workshop.status === "Abierto" ? "default" : "secondary"}>{workshop.status}</Badge>
                </CardHeader>
                <CardContent className="p-6 flex-grow flex flex-col">
                  <CardTitle>{workshop.title}</CardTitle>
                  <CardDescription className="mt-2 flex-grow">{workshop.description}</CardDescription>
                  <div className="mt-4 text-sm text-foreground">
                    <p><span className="font-semibold text-muted-foreground">Fecha:</span> {workshop.date}</p>
                    <p className="font-bold text-primary text-lg mt-1">{workshop.price}</p>
                  </div>
                </CardContent>
                <CardFooter className="p-6 pt-0">
                  <Button className="w-full" disabled={workshop.status !== "Abierto"}>Inscribirme</Button>
                </CardFooter>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
