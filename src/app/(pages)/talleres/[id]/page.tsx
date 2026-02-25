export const revalidate = 0;

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { getWorkshopById, getWorkshopRegisteredCount } from '@/lib/workshops';
import { notFound } from 'next/navigation';
import WorkshopPurchaseOptions from './WorkshopPurchaseOptions';

interface TallerDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function TallerDetailPage({ params }: TallerDetailPageProps) {
  const { id } = await params;
  const workshop = await getWorkshopById(id);

  if (!workshop) {
    notFound();
  }

  // Calcular lugares disponibles si el taller tiene cupo máximo
  let spotsLeft: number | null = null;
  if (workshop.max_capacity !== null) {
    const registeredCount = await getWorkshopRegisteredCount(workshop.product_sku);
    spotsLeft = workshop.max_capacity - registeredCount;
  }
  const isSoldOut = spotsLeft !== null && spotsLeft <= 0;
  // Mostrar máximo 10 lugares para crear urgencia, sin revelar el cupo total
  const displaySpots = spotsLeft !== null ? Math.min(spotsLeft, 10) : null;

  const whatsappNumber = "528181139378";
  const whatsappMessage = encodeURIComponent(`Hola, me gustaría recibir más información sobre el taller: "${workshop.name}"`);
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${whatsappMessage}`;

  return (
    <div className="container py-16 md:py-24">
      <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
        <div>
          {workshop.image_url && (
            <Image
              src={workshop.image_url}
              alt={workshop.name}
              width={1080}
              height={1350}
              className="rounded-xl shadow-lg object-cover aspect-[4/5]"
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <div className="flex items-center gap-2 mb-2">
            <Badge
              className="w-fit"
              variant={isSoldOut ? 'destructive' : workshop.workshop_status === 'Abierto' ? 'default' : 'secondary'}
            >
              {isSoldOut ? 'Agotado' : workshop.workshop_status}
            </Badge>
            {displaySpots !== null && !isSoldOut && (
              <Badge variant="outline" className="w-fit">
                {displaySpots} {displaySpots === 1 ? 'lugar disponible' : 'lugares disponibles'}
              </Badge>
            )}
          </div>
          <h1 className="text-4xl lg:text-5xl font-bold font-headline mb-4">
            {workshop.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-6 whitespace-pre-line">
            {workshop.description}
          </p>

          {/* Opciones de compra con precio para parejas */}
          {workshop.workshop_status === 'Abierto' && !isSoldOut && (
            <WorkshopPurchaseOptions
              workshop={workshop}
              imageUrl={workshop.image_url || ''}
            />
          )}

          {isSoldOut && (
            <div className="bg-destructive/10 border border-destructive/30 rounded-lg p-4 mb-6">
              <p className="text-destructive font-semibold text-center">
                Este taller ha alcanzado su cupo máximo de {workshop.max_capacity} personas.
              </p>
              <p className="text-sm text-muted-foreground text-center mt-1">
                Contáctanos por WhatsApp para estar en la lista de espera.
              </p>
            </div>
          )}

          <Card className="bg-muted/50 mb-6">
            <CardContent className="p-4 grid grid-cols-2 gap-4">
              <div className="flex items-center text-foreground">
                <Calendar className="mr-3 text-primary" />
                <span className='font-semibold'>Fecha: {workshop.workshop_date || 'Por definir'}</span>
              </div>
              <div className="flex items-center text-foreground">
                <p className="font-semibold text-2xl text-primary">
                  {workshop.workshop_status === 'Abierto' ? `$${workshop.price.toLocaleString('es-MX')} MXN` : 'Por anunciar'}
                </p>
              </div>
            </CardContent>
          </Card>

          <div className="flex flex-col sm:flex-row gap-4">
            <Button asChild size="lg" variant="outline" className="flex-1">
              <Link href={whatsappUrl} target="_blank">
                <MessageSquare className="mr-2" />
                Pedir Información por WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
