
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { mockLogin, User } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, pass: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const storedUser = localStorage.getItem('toycycle-user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, pass: string) => {
    const loggedInUser = await mockLogin(email, pass);
    setUser(loggedInUser);
    localStorage.setItem('toycycle-user', JSON.stringify(loggedInUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('toycycle-user');
    router.push('/login');
  };
  
  const isAuthenticated = !!user;

  // Protect all routes except /login
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login') {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, pathname, router]);


  return (
    <AuthContext.Provider value={{ user, isAuthenticated, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
