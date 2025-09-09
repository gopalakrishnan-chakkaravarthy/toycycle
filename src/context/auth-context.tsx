"use client";

import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useMemo,
} from "react";
import {
  login as apiLogin,
  User,
  logout as apiLogout,
  getCurrentUser,
} from "@/lib/auth";
import { usePathname, useRouter } from "next/navigation";

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

  // --- 1. Load current user on mount
  useEffect(() => {
    const checkUser = async () => {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };
    checkUser();
  }, []);

  // --- 2. Login & logout handlers
  const login = async (email: string, pass: string) => {
    const loggedInUser = await apiLogin(email, pass);
    setUser(loggedInUser);
    router.replace("/"); // replace instead of push
  };

  const logout = async () => {
    await apiLogout();
    setUser(null);
    router.replace("/login");
  };

  // --- 3. Public page check (memoized)
  const isPublicPage = useMemo(
    () => pathname === "/login" || pathname === "/signup",
    [pathname]
  );

  // --- 4. Redirect only once when needed
  useEffect(() => {
    if (!isLoading && !user && !isPublicPage) {
      // ⚡ prevent redirect loop by checking
      if (pathname !== "/login") {
        router.replace("/login");
      }
    }
  }, [isLoading, user, isPublicPage, pathname]); // no `router` dep!

  // --- 5. Loading screen
  if (isLoading) {
    return (
      <div className="flex h-screen w-screen items-center justify-center">
        <p>Loading...</p>
      </div>
    );
  }

  // --- 6. During redirect, render nothing
  if (!user && !isPublicPage) {
    return null;
  }

  return (
    <AuthContext.Provider value={{ user, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
