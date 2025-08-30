
import { SidebarProvider, Sidebar, SidebarHeader, SidebarTrigger, SidebarInset, SidebarFooter, SidebarMenu, SidebarMenuItem } from '@/components/ui/sidebar';
import { SidebarNav } from './sidebar-nav';
import { ToyBrick } from 'lucide-react';
import { UserButton, auth } from "@clerk/nextjs/server";
import { Suspense } from 'react';
import { Skeleton } from '../ui/skeleton';

function UserInfo() {
    const { user } = auth();
    return (
         <div className="flex w-full items-center gap-3 rounded-md p-2 text-left text-sm">
            <UserButton afterSignOutUrl="/sign-in" />
            <div className="flex flex-col truncate">
                <span className="font-semibold">{user?.fullName}</span>
                <span className="text-xs text-muted-foreground">{user?.primaryEmailAddress?.emailAddress}</span>
            </div>
        </div>
    )
}


export function AppLayout({ children }: { children: React.ReactNode }) {
  const { userId } = auth();
  
  if (!userId) {
    return (
        <div className="flex h-screen w-screen items-center justify-center">
            <p>Redirecting...</p>
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
                    <Suspense fallback={<Skeleton className="h-10 w-full" />}>
                        <UserInfo />
                    </Suspense>
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
