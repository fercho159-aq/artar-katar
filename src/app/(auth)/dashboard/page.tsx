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
import { BookUser, CreditCard, History, Music, PlayCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRouter } from 'next/navigation';

// --- Dummy Data for Demonstration ---
const purchasedMeditations = [
  {
    id: 'med_001',
    title: 'Meditación de Anclaje a Tierra',
    duration: '15 min',
    imageId: 'meditation-1',
  },
  {
    id: 'med_004',
    title: 'Limpieza Energética Profunda',
    duration: '20 min',
    imageId: 'workshop-2',
  },
];

const orderHistory = [
  {
    id: 'ORD-001',
    date: '2023-10-26',
    total: '88.00',
    status: 'Completado',
    items: ['Pulsera de Cuarzo Rosa', 'Pulsera de Amatista'],
  },
  {
    id: 'ORD-002',
    date: '2023-09-15',
    total: '300.00',
    status: 'Completado',
    items: ['Suscripción Mensual'],
  },
];

const subscription = {
  status: 'Activa',
  nextBilling: '2024-08-15',
  amount: '300.00',
};
// ------------------------------------

export default function DashboardPage() {
  const { user, logout } = useAuth();
  const router = useRouter();

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
          Aquí puedes gestionar tus meditaciones, suscripciones y detalles de tu cuenta.
        </p>
      </div>

      <Tabs defaultValue="meditations" className="w-full">
        <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 h-auto">
          <TabsTrigger value="meditations" className="py-2"><Music className="mr-2"/>Mis Meditaciones</TabsTrigger>
          <TabsTrigger value="subscriptions" className="py-2"><CreditCard className="mr-2"/>Suscripción</TabsTrigger>
          <TabsTrigger value="history" className="py-2"><History className="mr-2"/>Historial</TabsTrigger>
          <TabsTrigger value="profile" className="py-2"><BookUser className="mr-2"/>Mi Perfil</TabsTrigger>
        </TabsList>
        
        <TabsContent value="meditations" className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Meditaciones Compradas</CardTitle>
              <CardDescription>
                Aquí encontrarás todas las meditaciones que has adquirido.
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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Pedido</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead className="text-right">Total</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {orderHistory.map((order) => (
                    <TableRow key={order.id}>
                      <TableCell className="font-medium">{order.id}</TableCell>
                      <TableCell>{order.date}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{order.status}</Badge>
                      </TableCell>
                      <TableCell className="text-right">${order.total}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
