import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { PlaceHolderImages } from "@/lib/placeholder-images";
import { Headphones, Clock } from "lucide-react";

const meditations = [
  { title: "Meditación de Anclaje a Tierra", duration: "15 min", description: "Conecta con la energía de Gaia y encuentra tu centro.", imageId: "meditation-1" },
  { title: "Activación del Corazón Cristalino", duration: "25 min", description: "Abre tu corazón a la frecuencia del amor incondicional.", imageId: "meditation-2" },
  { title: "Viaje al Templo de Sanación", duration: "30 min", description: "Recibe sanación y guía de los maestros ascendidos.", imageId: "workshop-1" },
  { title: "Limpieza Energética Profunda", duration: "20 min", description: "Libera energías densas y revitaliza tu campo áurico.", imageId: "workshop-2" },
  { title: "Conexión con tu Llama Gemela", duration: "22 min", description: "Armoniza la energía sagrada masculina y femenina en tu interior.", imageId: "meditation-1" },
  { title: "Activación del ADN Cósmico", duration: "33 min", description: "Despierta tu potencial dormido y activa tus hebras de ADN.", imageId: "meditation-2" },
];

export default function MeditacionesPage() {
  return (
    <div className="bg-background">
      <div className="container py-16 md:py-24">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Biblioteca de Meditaciones</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            Encuentra paz, claridad y conexión a través de nuestras meditaciones guiadas por Frank Alexander.
          </p>
        </div>
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {meditations.map(meditation => {
            const image = PlaceHolderImages.find(p => p.id === meditation.imageId);
            return (
              <Card key={meditation.title} className="overflow-hidden flex flex-col hover:shadow-xl transition-shadow duration-300">
                <CardHeader className="p-0">
                  {image && <Image src={image.imageUrl} alt={meditation.title} data-ai-hint="serene meditation" width={600} height={400} className="object-cover aspect-video" />}
                </CardHeader>
                <CardContent className="p-6 flex flex-col flex-grow">
                  <CardTitle>{meditation.title}</CardTitle>
                  <div className="flex items-center text-muted-foreground text-sm mt-2">
                    <Clock className="h-4 w-4 mr-2" />
                    <span>{meditation.duration}</span>
                  </div>
                  <CardDescription className="mt-2 flex-grow">{meditation.description}</CardDescription>
                  <Button className="w-full mt-4">
                    <Headphones className="mr-2 h-4 w-4" /> Escuchar Ahora
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </div>
    </div>
  );
}
