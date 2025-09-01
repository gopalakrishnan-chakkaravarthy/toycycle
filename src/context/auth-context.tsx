
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { login as apiLogin, User, logout as apiLogout, getCurrentUser } from '@/lib/auth';
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
    const fetchUser = async () => {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setIsLoading(false);
    }
    fetchUser();
  }, [pathname]);

  const login = async (email: string, pass: string) => {
    const loggedInUser = await apiLogin(email, pass);
    setUser(loggedInUser);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    router.push('/login');
  };
  
  const isAuthenticated = !!user;

  // Protect all routes except /login and /signup
  useEffect(() => {
    if (!isLoading && !isAuthenticated && pathname !== '/login' && pathname !== '/signup') {
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
