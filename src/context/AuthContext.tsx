'use client';

import { CartItem } from './CartContext';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import type { Subscription } from '@/lib/types';

type User = {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  is_admin: boolean;
};

export type ApiOrder = {
    order_id: string;
    order_date: string;
    total_amount: number;
    status: string;
    items: {
        product_id: string; // Corresponds to product_sku
        name: string;
        quantity: number;
        price_at_purchase: number;
        image_url: string;
    }[];
}

type Order = {
  id: string;
  date: string;
  total: number;
  items: CartItem[];
};

type AuthContextType = {
  user: User | null;
  orders: Order[];
  subscription: Subscription | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [isLoading, setIsLoading] = useState(true);


  const fetchUserData = async (userId: string) => {
    // Fetch Orders
    try {
      const ordersResponse = await fetch(`/api/orders/${userId}`);
      if (ordersResponse.ok) {
        const apiOrders: ApiOrder[] = await ordersResponse.json();
        const formattedOrders: Order[] = apiOrders.map(apiOrder => ({
            id: apiOrder.order_id.toString(),
            date: new Date(apiOrder.order_date).toLocaleDateString('es-ES'),
            total: parseFloat(apiOrder.total_amount as any),
            items: apiOrder.items.map(item => ({
                quantity: item.quantity,
                product: {
                    id: item.product_id, // product_sku
                    name: item.name,
                    price: parseFloat(item.price_at_purchase as any),
                    image: item.image_url || '', 
                }
            }))
        }));
        setOrders(formattedOrders);
      } else {
        setOrders([]);
      }
    } catch (error) {
      console.error("Failed to fetch orders:", error);
      setOrders([]);
    }

    // Fetch Subscription
    try {
      const subResponse = await fetch(`/api/subscriptions/${userId}`);
      if (subResponse.ok) {
        const subData: Subscription | null = await subResponse.json();
        setSubscription(subData);
      } else {
        setSubscription(null);
      }
    } catch (error) {
      console.error("Failed to fetch subscription:", error);
      setSubscription(null);
    }
  };
  
  useEffect(() => {
    // Aquí podrías implementar la lógica para recuperar la sesión del usuario
    // Por ejemplo, desde localStorage o una cookie de sesión.
    // Por ahora, simplemente terminamos la carga.
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    setIsLoading(true);
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      setIsLoading(false);
      throw new Error(data.message || 'Error al iniciar sesión.');
    }
    
    setUser(data);
    await fetchUserData(data.uid);
    setIsLoading(false);
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
     setIsLoading(true);
     const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
     });

     const data = await response.json();

     if (!response.ok) {
        setIsLoading(false);
        throw new Error(data.message || 'Error al registrarse.');
     }

     setUser(data);
     setOrders([]);
     setSubscription(null);
     setIsLoading(false);
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    setSubscription(null);
    // Aquí también podrías limpiar la sesión de localStorage/cookie
  };

  return (
    <AuthContext.Provider value={{ user, orders, subscription, isLoading, login, signup, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
