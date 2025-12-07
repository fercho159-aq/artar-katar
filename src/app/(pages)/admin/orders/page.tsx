'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { useToast } from '@/hooks/use-toast';
import {
    Package,
    Truck,
    CheckCircle,
    XCircle,
    Clock,
    RefreshCw,
    MapPin,
    Phone,
    User,
    Mail,
    Loader2,
} from 'lucide-react';

type OrderItem = {
    quantity: number;
    price_at_purchase: number;
    product_name: string;
    product_sku: string;
    image_url: string;
};

type Order = {
    order_id: number;
    order_date: string;
    total_amount: number;
    status: string;
    payment_reference: string;
    shipping_name: string | null;
    shipping_phone: string | null;
    shipping_street: string | null;
    shipping_city: string | null;
    shipping_state: string | null;
    shipping_postal_code: string | null;
    shipping_country: string | null;
    shipping_notes: string | null;
    customer_name: string;
    customer_email: string;
    customer_uid: string;
    items: OrderItem[];
};

const STATUS_OPTIONS = [
    { value: 'Pendiente', label: 'Pendiente', icon: Clock, color: 'bg-yellow-500' },
    { value: 'Completado', label: 'Completado', icon: CheckCircle, color: 'bg-green-500' },
    { value: 'Enviado', label: 'Enviado', icon: Truck, color: 'bg-blue-500' },
    { value: 'Cancelado', label: 'Cancelado', icon: XCircle, color: 'bg-red-500' },
    { value: 'Reembolsado', label: 'Reembolsado', icon: RefreshCw, color: 'bg-gray-500' },
];

export default function AdminOrdersPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [statusFilter, setStatusFilter] = useState('all');
    const [updatingOrderId, setUpdatingOrderId] = useState<number | null>(null);

    // Redirect if not admin
    useEffect(() => {
        if (!authLoading && (!user || !user.is_admin)) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    // Fetch orders
    const fetchOrders = async () => {
        if (!user?.uid) return;

        setIsLoading(true);
        try {
            const url = new URL('/api/admin/orders', window.location.origin);
            url.searchParams.set('adminUid', user.uid);
            if (statusFilter !== 'all') {
                url.searchParams.set('status', statusFilter);
            }

            const response = await fetch(url.toString());
            if (response.ok) {
                const data = await response.json();
                setOrders(data);
            } else {
                throw new Error('Error fetching orders');
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudieron cargar las órdenes',
            });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        if (user?.is_admin) {
            fetchOrders();
        }
    }, [user, statusFilter]); // eslint-disable-line react-hooks/exhaustive-deps

    const updateOrderStatus = async (orderId: number, newStatus: string) => {
        if (!user?.uid) return;

        setUpdatingOrderId(orderId);
        try {
            const response = await fetch(`/api/admin/orders/${orderId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    adminUid: user.uid,
                    status: newStatus,
                }),
            });

            if (response.ok) {
                // Update local state
                setOrders(prev =>
                    prev.map(order =>
                        order.order_id === orderId
                            ? { ...order, status: newStatus }
                            : order
                    )
                );
                toast({
                    title: 'Estado actualizado',
                    description: `Orden #${orderId} marcada como ${newStatus}`,
                });
            } else {
                throw new Error('Error updating order');
            }
        } catch (error) {
            console.error('Error:', error);
            toast({
                variant: 'destructive',
                title: 'Error',
                description: 'No se pudo actualizar el estado',
            });
        } finally {
            setUpdatingOrderId(null);
        }
    };

    const getStatusBadge = (status: string) => {
        const statusConfig = STATUS_OPTIONS.find(s => s.value === status) || STATUS_OPTIONS[0];
        const Icon = statusConfig.icon;
        return (
            <Badge className={`${statusConfig.color} text-white`}>
                <Icon className="h-3 w-3 mr-1" />
                {statusConfig.label}
            </Badge>
        );
    };

    if (authLoading || !user?.is_admin) {
        return (
            <div className="container py-16 flex justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    return (
        <div className="container py-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Panel de Órdenes</h1>
                    <p className="text-muted-foreground">Gestiona las órdenes de tus clientes</p>
                </div>

                <div className="flex items-center gap-4">
                    <Select value={statusFilter} onValueChange={setStatusFilter}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="Filtrar por estado" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todas las órdenes</SelectItem>
                            {STATUS_OPTIONS.map(status => (
                                <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <Button onClick={fetchOrders} variant="outline" disabled={isLoading}>
                        <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : orders.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Package className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">No hay órdenes</h3>
                        <p className="text-muted-foreground">
                            {statusFilter === 'all'
                                ? 'Aún no hay órdenes registradas'
                                : `No hay órdenes con estado "${statusFilter}"`}
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="space-y-6">
                    {orders.map(order => (
                        <Card key={order.order_id}>
                            <CardHeader>
                                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            <Package className="h-5 w-5" />
                                            Orden #{order.order_id}
                                            {getStatusBadge(order.status)}
                                        </CardTitle>
                                        <p className="text-sm text-muted-foreground mt-1">
                                            {new Date(order.order_date).toLocaleString('es-MX', {
                                                dateStyle: 'full',
                                                timeStyle: 'short',
                                            })}
                                        </p>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <span className="text-sm text-muted-foreground">Cambiar estado:</span>
                                        <Select
                                            value={order.status}
                                            onValueChange={(value) => updateOrderStatus(order.order_id, value)}
                                            disabled={updatingOrderId === order.order_id}
                                        >
                                            <SelectTrigger className="w-40">
                                                <SelectValue />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {STATUS_OPTIONS.map(status => (
                                                    <SelectItem key={status.value} value={status.value}>
                                                        {status.label}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        {updatingOrderId === order.order_id && (
                                            <Loader2 className="h-4 w-4 animate-spin" />
                                        )}
                                    </div>
                                </div>
                            </CardHeader>

                            <CardContent className="space-y-6">
                                {/* Customer Info */}
                                <div className="grid md:grid-cols-2 gap-6">
                                    <div>
                                        <h4 className="font-semibold mb-2 flex items-center gap-2">
                                            <User className="h-4 w-4" /> Cliente
                                        </h4>
                                        <div className="text-sm space-y-1">
                                            <p>{order.customer_name}</p>
                                            <p className="flex items-center gap-1 text-muted-foreground">
                                                <Mail className="h-3 w-3" /> {order.customer_email}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Shipping Address */}
                                    {order.shipping_street && (
                                        <div>
                                            <h4 className="font-semibold mb-2 flex items-center gap-2">
                                                <MapPin className="h-4 w-4" /> Dirección de Envío
                                            </h4>
                                            <div className="text-sm space-y-1">
                                                <p>{order.shipping_name}</p>
                                                <p className="flex items-center gap-1 text-muted-foreground">
                                                    <Phone className="h-3 w-3" /> {order.shipping_phone}
                                                </p>
                                                <p>{order.shipping_street}</p>
                                                <p>
                                                    {order.shipping_city}, {order.shipping_state} C.P.{' '}
                                                    {order.shipping_postal_code}
                                                </p>
                                                {order.shipping_notes && (
                                                    <p className="text-muted-foreground italic">
                                                        Notas: {order.shipping_notes}
                                                    </p>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                </div>

                                <Separator />

                                {/* Order Items */}
                                <div>
                                    <h4 className="font-semibold mb-3">Productos</h4>
                                    <div className="space-y-2">
                                        {order.items.map((item, idx) => (
                                            <div
                                                key={idx}
                                                className="flex justify-between items-center p-2 bg-muted/50 rounded"
                                            >
                                                <div>
                                                    <p className="font-medium">{item.product_name}</p>
                                                    <p className="text-sm text-muted-foreground">
                                                        SKU: {item.product_sku} × {item.quantity}
                                                    </p>
                                                </div>
                                                <p className="font-semibold">
                                                    ${(Number(item.price_at_purchase) * item.quantity).toFixed(2)} MXN
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <Separator />

                                {/* Total */}
                                <div className="flex justify-between items-center">
                                    <div>
                                        {order.payment_reference && (
                                            <p className="text-sm text-muted-foreground">
                                                Ref. Pago: {order.payment_reference}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-sm text-muted-foreground">Total</p>
                                        <p className="text-2xl font-bold text-primary">
                                            ${Number(order.total_amount).toFixed(2)} MXN
                                        </p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </div>
    );
}
