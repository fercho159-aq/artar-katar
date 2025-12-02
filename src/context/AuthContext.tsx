'use client';

import { CartItem } from './CartContext';
import React, { createContext, useContext, useState, ReactNode } from 'react';

type User = {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  is_admin: boolean;
};

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
    setOrders([]); // Reset orders on login
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
