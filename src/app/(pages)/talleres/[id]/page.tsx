import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Calendar, MessageSquare } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import { getWorkshopById } from '@/lib/workshops';
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
              width={800}
              height={600}
              className="rounded-xl shadow-lg object-cover aspect-[4/3]"
            />
          )}
        </div>
        <div className="flex flex-col justify-center">
          <Badge
            className="w-fit mb-2"
            variant={workshop.workshop_status === 'Abierto' ? 'default' : 'secondary'}
          >
            {workshop.workshop_status}
          </Badge>
          <h1 className="text-4xl lg:text-5xl font-bold font-headline mb-4">
            {workshop.name}
          </h1>
          <p className="text-lg text-muted-foreground mb-6 whitespace-pre-line">
            {workshop.description}
          </p>

          {/* Opciones de compra con precio para parejas */}
          {workshop.workshop_status === 'Abierto' && (
            <WorkshopPurchaseOptions
              workshop={workshop}
              imageUrl={workshop.image_url || ''}
            />
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
