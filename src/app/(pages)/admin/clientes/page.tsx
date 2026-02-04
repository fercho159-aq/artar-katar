'use client';

import { useEffect, useState, useMemo } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import {
    RefreshCw,
    Loader2,
    Download,
    Search,
    Users,
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';

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

type ClientRow = {
    order_id: number;
    order_date: string;
    status: string;
    customer_name: string;
    customer_email: string;
    phone: string;
    product_name: string;
    product_sku: string;
    quantity: number;
    price: number;
    total: number;
    city: string;
    state: string;
};

const STATUS_COLORS: Record<string, string> = {
    Pendiente: 'bg-yellow-500',
    Completado: 'bg-green-500',
    Enviado: 'bg-blue-500',
    Cancelado: 'bg-red-500',
    Reembolsado: 'bg-gray-500',
};

export default function AdminClientesPage() {
    const { user, isLoading: authLoading } = useAuth();
    const router = useRouter();
    const { toast } = useToast();

    const [orders, setOrders] = useState<Order[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [eventFilter, setEventFilter] = useState('all');
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (!authLoading && (!user || !user.is_admin)) {
            router.push('/');
        }
    }, [user, authLoading, router]);

    const fetchOrders = async () => {
        if (!user?.uid) return;

        setIsLoading(true);
        try {
            const url = new URL('/api/admin/orders', window.location.origin);
            url.searchParams.set('adminUid', user.uid);

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
    }, [user]); // eslint-disable-line react-hooks/exhaustive-deps

    const isWorkshop = (sku: string) => sku.startsWith('taller_') || sku.startsWith('wshop_');

    // Get unique events/talleres for the filter (exclude physical products)
    const uniqueEvents = useMemo(() => {
        const events = new Map<string, string>();
        orders.forEach(order => {
            order.items.forEach(item => {
                if (isWorkshop(item.product_sku) && !events.has(item.product_sku)) {
                    events.set(item.product_sku, item.product_name);
                }
            });
        });
        return Array.from(events.entries()).map(([sku, name]) => ({ sku, name }));
    }, [orders]);

    // Flatten orders into rows (only workshop/event items)
    const clientRows: ClientRow[] = useMemo(() => {
        const rows: ClientRow[] = [];
        orders.forEach(order => {
            order.items.filter(item => isWorkshop(item.product_sku)).forEach(item => {
                rows.push({
                    order_id: order.order_id,
                    order_date: order.order_date,
                    status: order.status,
                    customer_name: order.customer_name,
                    customer_email: order.customer_email,
                    phone: order.shipping_phone || '',
                    product_name: item.product_name,
                    product_sku: item.product_sku,
                    quantity: item.quantity,
                    price: Number(item.price_at_purchase),
                    total: Number(order.total_amount),
                    city: order.shipping_city || '',
                    state: order.shipping_state || '',
                });
            });
        });
        return rows;
    }, [orders]);

    // Apply filters
    const filteredRows = useMemo(() => {
        return clientRows.filter(row => {
            const matchesEvent = eventFilter === 'all' || row.product_sku === eventFilter;
            const matchesSearch = searchTerm === '' ||
                row.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.customer_email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                row.phone.includes(searchTerm);
            return matchesEvent && matchesSearch;
        });
    }, [clientRows, eventFilter, searchTerm]);

    // Export to CSV
    const exportCSV = () => {
        const headers = [
            'Orden',
            'Fecha',
            'Estado',
            'Nombre',
            'Email',
            'Teléfono',
            'Producto',
            'SKU',
            'Cantidad',
            'Precio',
            'Total',
            'Ciudad',
            'Estado/Provincia',
        ];

        const csvRows = [
            headers.join(','),
            ...filteredRows.map(row => [
                row.order_id,
                new Date(row.order_date).toLocaleDateString('es-MX'),
                row.status,
                `"${row.customer_name}"`,
                row.customer_email,
                row.phone,
                `"${row.product_name}"`,
                row.product_sku,
                row.quantity,
                row.price.toFixed(2),
                row.total.toFixed(2),
                `"${row.city}"`,
                `"${row.state}"`,
            ].join(',')),
        ];

        const blob = new Blob(['\uFEFF' + csvRows.join('\n')], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');
        link.href = url;
        const eventName = eventFilter === 'all' ? 'todos' : eventFilter;
        link.download = `clientes_${eventName}_${new Date().toISOString().split('T')[0]}.csv`;
        link.click();
        URL.revokeObjectURL(url);
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
            <div className="flex flex-col gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold font-headline">Clientes por Evento</h1>
                    <p className="text-muted-foreground">Filtra por evento y visualiza la información de tus clientes</p>
                </div>

                {/* Filters */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3">
                    <Select value={eventFilter} onValueChange={setEventFilter}>
                        <SelectTrigger className="w-72">
                            <SelectValue placeholder="Filtrar por evento" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">Todos los eventos</SelectItem>
                            {uniqueEvents.map(event => (
                                <SelectItem key={event.sku} value={event.sku}>
                                    {event.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>

                    <div className="relative w-72">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                        <Input
                            placeholder="Buscar por nombre, email o tel..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9"
                        />
                    </div>

                    <div className="flex items-center gap-2">
                        <Button onClick={fetchOrders} variant="outline" disabled={isLoading}>
                            <RefreshCw className={`h-4 w-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                            Actualizar
                        </Button>

                        <Button onClick={exportCSV} variant="outline" disabled={filteredRows.length === 0}>
                            <Download className="h-4 w-4 mr-2" />
                            Exportar CSV
                        </Button>
                    </div>
                </div>

                {/* Stats */}
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                    <Users className="h-4 w-4" />
                    <span>{filteredRows.length} registro{filteredRows.length !== 1 ? 's' : ''}</span>
                </div>
            </div>

            {isLoading ? (
                <div className="flex justify-center py-16">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </div>
            ) : filteredRows.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Users className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
                        <h3 className="text-xl font-semibold mb-2">Sin resultados</h3>
                        <p className="text-muted-foreground">
                            No se encontraron clientes con los filtros seleccionados
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="border rounded-lg">
                    <Table>
                        <TableHeader>
                            <TableRow className="bg-muted/50">
                                <TableHead className="font-semibold">#</TableHead>
                                <TableHead className="font-semibold">Orden</TableHead>
                                <TableHead className="font-semibold">Fecha</TableHead>
                                <TableHead className="font-semibold">Estado</TableHead>
                                <TableHead className="font-semibold">Nombre</TableHead>
                                <TableHead className="font-semibold">Email</TableHead>
                                <TableHead className="font-semibold">Teléfono</TableHead>
                                <TableHead className="font-semibold">Producto</TableHead>
                                <TableHead className="font-semibold">Cantidad</TableHead>
                                <TableHead className="font-semibold text-right">Precio</TableHead>
                                <TableHead className="font-semibold">Ciudad</TableHead>
                                <TableHead className="font-semibold">Estado</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredRows.map((row, index) => (
                                <TableRow key={`${row.order_id}-${row.product_sku}-${index}`}>
                                    <TableCell className="text-muted-foreground">{index + 1}</TableCell>
                                    <TableCell className="font-medium">#{row.order_id}</TableCell>
                                    <TableCell className="whitespace-nowrap">
                                        {new Date(row.order_date).toLocaleDateString('es-MX', {
                                            day: '2-digit',
                                            month: 'short',
                                            year: 'numeric',
                                        })}
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={`${STATUS_COLORS[row.status] || 'bg-gray-500'} text-white text-xs`}>
                                            {row.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium whitespace-nowrap">{row.customer_name}</TableCell>
                                    <TableCell>{row.customer_email}</TableCell>
                                    <TableCell>{row.phone || '-'}</TableCell>
                                    <TableCell className="max-w-[200px] truncate" title={row.product_name}>
                                        {row.product_name}
                                    </TableCell>
                                    <TableCell className="text-center">{row.quantity}</TableCell>
                                    <TableCell className="text-right whitespace-nowrap">
                                        ${row.price.toFixed(2)}
                                    </TableCell>
                                    <TableCell>{row.city || '-'}</TableCell>
                                    <TableCell>{row.state || '-'}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}
        </div>
    );
}
