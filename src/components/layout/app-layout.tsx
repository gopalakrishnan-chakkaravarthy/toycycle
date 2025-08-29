
'use client';

import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { LogOut, ToyBrick, UserCircle } from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Skeleton } from '../ui/skeleton';

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, isAuthenticated, isLoading, logout } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.replace('/login');
    }
  }, [isLoading, isAuthenticated, router]);

  if (isLoading || !isAuthenticated) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <ToyBrick className="h-12 w-12 animate-spin text-primary" />
        </div>
    );
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <ToyBrick className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold font-headline text-foreground">ToyCycle</h1>
          </div>
        </SidebarHeader>
        <SidebarNav />
        <SidebarFooter>
            <SidebarMenu>
                <SidebarMenuItem>
                    <div className="flex w-full items-center gap-2 rounded-md p-2 text-left text-sm">
                        <Avatar className="h-8 w-8">
                            <AvatarImage src={user?.avatar} />
                            <AvatarFallback><UserCircle /></AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col truncate">
                            <span className="font-semibold">{user?.name}</span>
                            <span className="text-xs text-muted-foreground">{user?.email}</span>
                        </div>
                         <SidebarMenuButton onClick={logout} tooltip={{children: 'Logout', side:'right'}} className="ml-auto !size-8 !p-2" variant="ghost">
                            <LogOut />
                         </SidebarMenuButton>
                    </div>
                </SidebarMenuItem>
            </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/50 backdrop-blur-sm px-6 sticky top-0 z-10 md:hidden">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold font-headline">ToyCycle</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
