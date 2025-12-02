'use client';

import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from '@/components/ui/tabs';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import Image from 'next/image';
import { PlaceHolderImages } from '@/lib/placeholder-images';
import { BookUser, CreditCard, History, Music, PlayCircle, Users } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';
import { useMemo } from 'react';

// --- Meditations Data ---
const allMeditations = [
  { id: "med_001", title: "Meditación de Anclaje a Tierra", duration: "15 min", description: "Conecta con la energía de Gaia y encuentra tu centro.", imageId: "meditation-1", price: 40 },
  { id: "med_002", title: "Activación del Corazón Cristalino", duration: "25 min", description: "Abre tu corazón a la frecuencia del amor incondicional.", imageId: "meditation-2", price: 40 },
  { id: "med_003", title: "Viaje al Templo de Sanación", duration: "30 min", description: "Recibe sanación y guía de los maestros ascendidos.", imageId: "workshop-1", price: 40 },
  { id: "med_004", title: "Limpieza Energética Profunda", duration: "20 min", description: "Libera energías densas y revitaliza tu campo áurico.", imageId: "workshop-2", price: 40 },
  { id: "med_005", title: "Conexión con tu Llama Gemela", duration: "22 min", description: "Armoniza la energía sagrada masculina y femenina en tu interior.", imageId: "meditation-1", price: 40 },
  { id: "med_006", title: "Activación del ADN Cósmico", duration: "33 min", description: "Despierta tu potencial dormido y activa tus hebras de ADN.", imageId: "meditation-2", price: 40 },
];

const allWorkshops = [
    { id: "wshop_001", title: "Ciclo de Activación Nocturna", imageId: "workshop-1" },
    { id: "wshop_002", title: "Conexión con tu Yo Superior", imageId: "workshop-2" },
    { id: "wshop_003", title: "Sanación del Niño Interior", imageId: "meditation-2" },
];


// --- Dummy Data for Demonstration ---
const subscription = {
  status: 'Activa',
  nextBilling: '2024-08-15',
  amount: '300.00',
};
// ------------------------------------

export default function MisComprasPage() {
  const { user, logout, orders } = useAuth();
  const router = useRouter();

  const purchasedItems = useMemo(() => {
    return orders.flatMap(order => order.items.map(item => item.product));
  }, [orders]);

  const individualPurchases = useMemo(() => 
    purchasedItems.filter(p => p.id.startsWith('med_')),
    [purchasedItems]
  );
  
  const purchasedWorkshops = useMemo(() =>
    purchasedItems.filter(p => p.id.startsWith('wshop_')),
    [purchasedItems]
  );

  const purchasedMeditations = subscription.status === 'Activa' 
    ? allMeditations 
    : individualPurchases.map(p => {
        const medData = allMeditations.find(m => m.id === p.id);
        return {
            id: p.id,
            title: p.name,
            duration: medData?.duration || 'N/A',
            imageId: medData?.imageId || 'meditation-1',
        };
    });
    
  if (!user) {
    // This could redirect to login or show a loading state
    return null; 
  }
  
  return (
    <div className="container py-16 md:py-24">
      <div className="space-y-4 mb-12">
        <h1 className="text-3xl md:text-4xl font-bold font-headline">
          Bienvenido, {user.name}
        </h1>
        <p className="text-muted-foreground">
          Aquí puedes gestionar tus meditaciones, talleres, suscripciones y detalles de tu cuenta.
        </p>
      </div>

      <Tabs defaultValue="meditations" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-5 h-auto">
          <TabsTrigger value="meditations" className="py-2"><Music className="mr-2"/>Meditaciones</TabsTrigger>
          <TabsTrigger value="workshops" className="py-2"><Users className="mr-2"/>Talleres</TabsTrigger>
          <TabsTrigger value="subscriptions" className="py-2"><CreditCard className="mr-2"/>Suscripción</TabsTrigger>
          <TabsTrigger value="history" className="py-2"><History className="mr-2"/>Historial</TabsTrigger>
          <TabsTrigger value="profile" className="py-2"><BookUser className="mr-2"/>Mi Perfil</TabsTrigger>
        </TabsList>
        
        <TabsContent value="meditations" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Mis Meditaciones</CardTitle>
              <CardDescription>
                {subscription.status === 'Activa'
                  ? 'Acceso total a todas las meditaciones gracias a tu suscripción.'
                  : 'Aquí encontrarás todas las meditaciones que has adquirido.'}
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {purchasedMeditations.length > 0 ? (
                purchasedMeditations.map((meditation) => {
                  const image = PlaceHolderImages.find(p => p.id === meditation.imageId);
                  return (
                  <div key={meditation.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                    <div className="flex items-center gap-4">
                       {image && <Image src={image.imageUrl} alt={meditation.title} width={80} height={80} className="rounded-md object-cover aspect-square" />}
                      <div>
                        <h3 className="font-semibold">{meditation.title}</h3>
                        <p className="text-sm text-muted-foreground">{meditation.duration}</p>
                      </div>
                    </div>
                    <Button variant="ghost" size="icon">
                      <PlayCircle className="h-6 w-6 text-primary" />
                    </Button>
                  </div>
                )})
              ) : (
                <p className="text-muted-foreground text-center py-8">Aún no has comprado ninguna meditación.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="workshops" className="mt-8">
            <Card>
                <CardHeader>
                    <CardTitle>Mis Talleres</CardTitle>
                    <CardDescription>
                        Aquí encontrarás todos los talleres que has adquirido.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                    {purchasedWorkshops.length > 0 ? (
                        purchasedWorkshops.map((workshop) => {
                            const workshopData = allWorkshops.find(w => w.id === workshop.id);
                            const image = PlaceHolderImages.find(p => p.id === workshopData?.imageId);
                            return (
                                <div key={workshop.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50">
                                    <div className="flex items-center gap-4">
                                        {image && <Image src={image.imageUrl} alt={workshop.name} width={80} height={80} className="rounded-md object-cover aspect-square" />}
                                        <div>
                                            <h3 className="font-semibold">{workshop.name}</h3>
                                        </div>
                                    </div>
                                    <Button variant="outline">
                                        Ver Taller
                                    </Button>
                                </div>
                            )
                        })
                    ) : (
                        <p className="text-muted-foreground text-center py-8">Aún no has comprado ningún taller.</p>
                    )}
                </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="subscriptions" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Gestionar Suscripción</CardTitle>
              <CardDescription>
                Consulta el estado de tu suscripción mensual de acceso total.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
               <div className="flex justify-between items-center p-4 border rounded-lg">
                <div>
                  <h3 className="font-semibold text-lg">Acceso Total a Meditaciones</h3>
                  <p className="text-sm text-muted-foreground">Próximo cobro: {subscription.nextBilling}</p>
                </div>
                <div className="text-right">
                  <Badge variant={subscription.status === 'Activa' ? 'default' : 'secondary'} className="mb-2">{subscription.status}</Badge>
                  <p className="font-bold text-lg text-primary">${subscription.amount} MXN/mes</p>
                </div>
              </div>
              <Button variant="outline" className="w-full sm:w-auto">
                Cancelar Suscripción
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Historial de Pedidos</CardTitle>
              <CardDescription>
                Un resumen de tus compras anteriores.
              </CardDescription>
            </CardHeader>
            <CardContent>
              {orders.length > 0 ? (
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Pedido</TableHead>
                            <TableHead>Fecha</TableHead>
                            <TableHead>Estado</TableHead>
                            <TableHead>Items</TableHead>
                            <TableHead className="text-right">Total</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {orders.map((order) => (
                            <TableRow key={order.id}>
                                <TableCell className="font-medium">{order.id}</TableCell>
                                <TableCell>{order.date}</TableCell>
                                <TableCell>
                                    <Badge variant="outline">Completado</Badge>
                                </TableCell>
                                <TableCell>
                                    {order.items.map(item => item.product.name).join(', ')}
                                </TableCell>
                                <TableCell className="text-right">${order.total.toFixed(2)}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
              ) : (
                <p className="text-muted-foreground text-center py-8">No tienes pedidos anteriores.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="profile" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Mi Perfil</CardTitle>
              <CardDescription>
                Actualiza la información de tu cuenta.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name">Nombre</Label>
                <Input id="name" defaultValue={user.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" type="email" defaultValue={user.email} disabled />
              </div>
              <Separator />
              <div className="space-y-4">
                <h4 className="font-semibold">Cambiar Contraseña</h4>
                 <div className="space-y-2">
                    <Label htmlFor="current-password">Contraseña Actual</Label>
                    <Input id="current-password" type="password" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="new-password">Nueva Contraseña</Label>
                    <Input id="new-password" type="password" />
                  </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-2">
                <Button>Guardar Cambios</Button>
                <Button variant="destructive" onClick={() => {
                  logout();
                  router.push('/');
                }}>Cerrar Sesión</Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
