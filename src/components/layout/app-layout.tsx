'use client';

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarInset,
} from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { ToyBrick } from 'lucide-react';

export function AppLayout({ children }: { children: React.ReactNode }) {
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
