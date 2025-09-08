
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { login as apiLogin, User, logout as apiLogout, getCurrentUser } from '@/lib/auth';
import { usePathname, useRouter } from 'next/navigation';

interface AuthContextType {
  user: User | null;
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
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Failed to fetch user", error);
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  const login = async (email: string, pass: string) => {
    const loggedInUser = await apiLogin(email, pass);
    setUser(loggedInUser);
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    router.push('/login');
  };

  const isPublicPage = pathname === '/login' || pathname === '/signup';

  useEffect(() => {
    if (isLoading) return;

    if (!user && !isPublicPage) {
      router.push('/login');
    }
    if (user && isPublicPage) {
      router.push('/');
    }
  }, [user, isLoading, isPublicPage, pathname, router]);

  const value = { user, isLoading, login, logout };

  if (isLoading) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    );
  }

  if (!user && !isPublicPage) {
    // While redirecting, return null to prevent rendering protected content
    return null;
  }
  
  if (user && isPublicPage) {
    // While redirecting authenticated user from public page
    return null;
  }

  return (
    <AuthContext.Provider value={value}>
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
