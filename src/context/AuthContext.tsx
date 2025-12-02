'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

type User = {
  uid: string;
  name: string;
  email: string;
  photoURL?: string;
  isAdmin: boolean;
};

type AuthContextType = {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// --- Dummy Users for Local Simulation ---
const dummyUsers = [
  {
    uid: 'admin001',
    name: 'Admin User',
    email: 'admin@test.com',
    password: 'admin',
    isAdmin: true,
  },
  {
    uid: 'user001',
    name: 'Test User',
    email: 'user@test.com',
    password: 'password',
    isAdmin: false,
  },
];
// ----------------------------------------

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  
  const login = async (email: string, password: string): Promise<void> => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        const foundUser = dummyUsers.find(
          (u) => u.email === email && u.password === password
        );
        if (foundUser) {
          const { password: _, ...userToSet } = foundUser;
          setUser(userToSet);
          resolve();
        } else {
          reject(new Error('Credenciales inválidas. Por favor, inténtalo de nuevo.'));
        }
      }, 500);
    });
  };

  const signup = async (name: string, email: string, password: string): Promise<void> => {
     return new Promise((resolve, reject) => {
      setTimeout(() => {
        const existingUser = dummyUsers.find(u => u.email === email);
        if(existingUser) {
          return reject(new Error('Este email ya está en uso.'));
        }
        
        const newUser: User = {
            uid: `user${Date.now()}`,
            name,
            email,
            isAdmin: false,
        };
        // In a real scenario, you'd add the new user to your database
        // dummyUsers.push({ ...newUser, password });
        
        setUser(newUser);
        resolve();
      }, 500);
    });
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout }}>
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
