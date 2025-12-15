export type User = {
    id: number;
    uid: string;
    name: string;
    email: string;
    password_hash: string;
    is_admin: boolean;
    created_at: string;
    updated_at: string;
};

export type Product = {
    id: number;
    product_sku: string;
    type: 'MEDITATION' | 'WORKSHOP' | 'PHYSICAL_GOOD';
    name: string;
    description: string | null;
    short_description: string | null;
    activated_by: string | null;
    stone: string | null;
    learn_more: string | null;
    category: string | null;
    price: number;
    image_url: string | null;
    workshop_date: string | null;
    workshop_status: 'Abierto' | 'Próximamente' | 'Cerrado' | null;
    meditation_duration: string | null;
    is_active: boolean;
};

export type Subscription = {
    id: number;
    user_id: number;
    status: 'Activa' | 'Cancelada' | 'Pausada';
    start_date: string;
    next_billing_date: string | null;
    end_date: string | null;
};

export type Order = {
    id: number;
    user_id: number;
    order_date: string;
    total_amount: number;
    status: string;
};

export type OrderItem = {
    id: number;
    order_id: number;
    product_id: number;
    quantity: number;
    price_at_purchase: number;
};
