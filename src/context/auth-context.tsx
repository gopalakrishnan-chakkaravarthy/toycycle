
'use client';

import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';
import { User, getCurrentUser } from '@/lib/auth';
import { login as apiLogin, logout as apiLogout } from '@/lib/actions/auth';
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
      setIsLoading(true);
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

  useEffect(() => {
    if (isLoading) return;

    const isPublicPage = pathname === '/login' || pathname === '/signup';

    if (!user && !isPublicPage) {
      router.push('/login');
    } else if (user && isPublicPage) {
      router.push('/');
    }
  }, [user, isLoading, pathname, router]);

  const login = async (email: string, pass: string) => {
    const loggedInUser = await apiLogin(email, pass);
    setUser(loggedInUser);
    router.push('/');
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    router.push('/login');
  };
  
  const value = { user, isLoading, login, logout };

  const isPublicPage = pathname === '/login' || pathname === '/signup';
  if (isLoading || (!user && !isPublicPage) || (user && isPublicPage)) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <p>Loading...</p>
        </div>
    );
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
