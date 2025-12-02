'use client';

import { CartItem } from './CartContext';
import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';

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
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  addOrder: (items: CartItem[], total: number) => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);

  const fetchOrders = async (userId: string) => {
    try {
      const response = await fetch(`/api/orders/${userId}`);
      if (response.ok) {
        const apiOrders: ApiOrder[] = await response.json();
        
        // Transform API orders to frontend Order format
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
                    image: '', // Image is not returned from this endpoint, but might be needed elsewhere
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
    await fetchOrders(data.uid);
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
  };

  const addOrder = (items: CartItem[], total: number) => {
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
  };

  return (
    <AuthContext.Provider value={{ user, orders, login, signup, logout, addOrder }}>
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
