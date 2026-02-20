export const revalidate = 0;

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { getWorkshops, getWorkshopRegisteredCount } from "@/lib/workshops";

export default async function TalleresPage() {
  const workshops = await getWorkshops();

  return (
    <div className="bg-background">
      <div className="container py-16 md:py-24">
        <div className="flex flex-col items-center justify-center space-y-4 text-center mb-12">
          <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl font-headline">Talleres y Ciclos de Activación</h1>
          <p className="max-w-[900px] text-muted-foreground md:text-xl/relaxed">
            Sumérgete en experiencias transformadoras diseñadas para elevar tu vibración y expandir tu conciencia.
          </p>
        </div>

        {workshops.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-muted-foreground text-lg">No hay talleres disponibles en este momento.</p>
            <p className="text-muted-foreground">¡Vuelve pronto para ver nuestras próximas experiencias!</p>
          </div>
        ) : (
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {await Promise.all(workshops.map(async (workshop) => {
              let spotsLeft: number | null = null;
              if (workshop.max_capacity !== null) {
                const registeredCount = await getWorkshopRegisteredCount(workshop.product_sku);
                spotsLeft = workshop.max_capacity - registeredCount;
              }
              const isSoldOut = spotsLeft !== null && spotsLeft <= 0;

              return (
                <Card key={workshop.id} className="flex flex-col overflow-hidden hover:shadow-xl transition-shadow duration-300">
                  <Link href={`/talleres/${workshop.id}`} className="flex flex-col flex-grow">
                    <CardHeader className="p-0 relative">
                      {workshop.image_url && (
                        <Image
                          src={workshop.image_url}
                          alt={workshop.name}
                          width={1080}
                          height={1350}
                          className="rounded-t-lg object-cover aspect-[4/5]"
                        />
                      )}
                      <div className="absolute top-2 right-2 flex gap-1">
                        <Badge
                          variant={isSoldOut ? 'destructive' : workshop.workshop_status === "Abierto" ? "default" : "secondary"}
                        >
                          {isSoldOut ? 'Agotado' : workshop.workshop_status}
                        </Badge>
                      </div>
                      {spotsLeft !== null && !isSoldOut && (
                        <Badge variant="outline" className="absolute top-2 left-2 bg-background/80">
                          {spotsLeft} {spotsLeft === 1 ? 'lugar' : 'lugares'}
                        </Badge>
                      )}
                    </CardHeader>
                    <CardContent className="p-6 flex-grow flex flex-col">
                      <CardTitle>{workshop.name}</CardTitle>
                      <CardDescription className="mt-2 flex-grow">
                        {workshop.short_description || workshop.description}
                      </CardDescription>
                      <div className="mt-4 text-sm text-foreground">
                        {workshop.workshop_date && (
                          <p><span className="font-semibold text-muted-foreground">Fecha:</span> {workshop.workshop_date}</p>
                        )}
                        <p className="font-bold text-primary text-lg mt-1">
                          {workshop.workshop_status === 'Abierto' ? `$${workshop.price.toLocaleString('es-MX')} MXN` : 'Por anunciar'}
                        </p>
                        {workshop.couple_price && workshop.workshop_status === 'Abierto' && (
                          <p className="text-sm text-pink-600 font-medium mt-1">
                            Parejas: ${workshop.couple_price.toLocaleString('es-MX')} MXN
                          </p>
                        )}
                      </div>
                    </CardContent>
                  </Link>
                  <CardFooter className="p-6 pt-0">
                    <Button className="w-full" asChild disabled={isSoldOut}>
                      <Link href={`/talleres/${workshop.id}`}>
                        {isSoldOut ? 'Agotado' : 'Más Información'} <ArrowRight className="ml-2" />
                      </Link>
                    </Button>
                  </CardFooter>
                </Card>
              );
            }))}
          </div>
        )}
      </div>
    </div>
  );
}
