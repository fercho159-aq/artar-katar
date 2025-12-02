'use client';

import { CartItem } from './CartContext';
import React, { createContext, useContext, useState, ReactNode } from 'react';
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
        product_id: string;
        name: string;
        quantity: number;
        price_at_purchase: number;
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
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addOrder: (items: CartItem[], total: number) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [subscription, setSubscription] = useState<Subscription | null>(null);

  const fetchUserData = async (userId: string) => {
    // Fetch Orders
    try {
      const ordersResponse = await fetch(`/api/orders/${userId}`);
      if (ordersResponse.ok) {
        const apiOrders: ApiOrder[] = await ordersResponse.json();
        const formattedOrders: Order[] = apiOrders.map(apiOrder => ({
            id: apiOrder.order_id,
            date: new Date(apiOrder.order_date).toLocaleDateString('es-ES'),
            total: parseFloat(apiOrder.total_amount as any),
            items: apiOrder.items.map(item => ({
                quantity: item.quantity,
                product: {
                    id: item.product_id,
                    name: item.name,
                    price: parseFloat(item.price_at_purchase as any),
                    image: '', 
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

  const login = async (email: string, password: string): Promise<void> => {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || 'Error al iniciar sesión.');
    }
    
    setUser(data);
    await fetchUserData(data.uid);
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
     const response = await fetch('/api/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password }),
     });

     const data = await response.json();

     if (!response.ok) {
        throw new Error(data.message || 'Error al registrarse.');
     }

     setUser(data);
     setOrders([]);
     setSubscription(null);
  };

  const addOrder = (items: CartItem[], total: number) => {
    // This is a simulation, in a real app this would call an API to create the order
    const newOrder: Order = {
      id: `ORD-${Date.now()}`,
      date: new Date().toLocaleDateString('es-ES'),
      total,
      items,
    };
    setOrders(prevOrders => [...prevOrders, newOrder]);
  };

  const logout = () => {
    setUser(null);
    setOrders([]);
    setSubscription(null);
  };

  return (
    <AuthContext.Provider value={{ user, orders, subscription, login, signup, logout, addOrder }}>
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
