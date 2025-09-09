"use client";

import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarTrigger,
  SidebarInset,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { SidebarNav } from "./sidebar-nav";
import {
  AreaChart,
  CalendarClock,
  Gift,
  Heart,
  LayoutDashboard,
  LogOut,
  MapPin,
  Megaphone,
  Shield,
  ToyBrick,
  Truck,
  User as UserIcon,
  Warehouse,
  Workflow,
} from "lucide-react";
import { useAuth, User } from "@/context/auth-context";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Button } from "../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ChatWidget } from "../chat/chat-widget";
import { useMemo } from "react";

function UserNav({ user, onLogout }: { user: User; onLogout: () => void }) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="relative h-10 w-full justify-start p-2 text-left"
        >
          <Avatar className="h-8 w-8 mr-2">
            <AvatarImage src={user.avatar} alt={user.name} />
            <AvatarFallback>
              <UserIcon />
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col truncate">
            <span className="font-semibold text-sm">{user.name}</span>
            <span className="text-xs text-muted-foreground">{user.email}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">
              {user.email}
            </p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          <span>Log out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function AppLayout({ children }: { children: React.ReactNode }) {
  const { user, logout, isLoading } = useAuth();
  const navItems = useMemo(
    () => [
      {
        href: "/",
        label: "Impact Report",
        icon: LayoutDashboard,
        roles: ["user", "admin"],
      },
      {
        href: "/donations",
        label: "My Donations",
        icon: Gift,
        roles: ["user"],
      },
      {
        href: "/schedule",
        label: "Schedule Pickup",
        icon: CalendarClock,
        roles: ["user", "admin"],
      },
      {
        href: "/locations",
        label: "Community Drop-off Points",
        icon: MapPin,
        roles: ["user", "admin"],
      },
      {
        href: "/partners",
        label: "Our Partners",
        icon: Heart,
        roles: ["user", "admin"],
      },
      {
        href: "/admin",
        label: "Admin Dashboard",
        icon: Shield,
        roles: ["admin"],
      },
      {
        href: "/inventory",
        label: "Inventory",
        icon: AreaChart,
        roles: ["admin"],
      },
      {
        href: "/warehouse",
        label: "Warehouse",
        icon: Warehouse,
        roles: ["admin"],
      },
      {
        href: "/workflow",
        label: "Workflow",
        icon: Workflow,
        roles: ["admin"],
      },
      {
        href: "/admin/campaigns",
        label: "Campaigns",
        icon: Megaphone,
        roles: ["admin"],
      },
      {
        href: "/admin/logistics",
        label: "Logistics",
        icon: Truck,
        roles: ["admin"],
      },
    ],
    []
  );
  const filteredNavItems = useMemo(() => {
    if (!user) return [];
    return navItems.filter((item) => {
      if (item.label === "My Donations" && user.role === "admin") return false;
      return item.roles.includes(user.role);
    });
  }, [user, navItems]);

  if (isLoading || !user) {
    return null; // Return null or a loading spinner, but AuthProvider already handles the main loading state
  }

  return (
    <SidebarProvider>
      <Sidebar>
        <SidebarHeader>
          <div className="flex items-center gap-2 p-1">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
              <ToyBrick className="h-6 w-6 text-primary-foreground" />
            </div>
            <h1 className="text-xl font-bold font-headline text-foreground">
              ToyCycle
            </h1>
          </div>
        </SidebarHeader>
        <SidebarNav navItems={filteredNavItems} />

        <SidebarFooter>
          <SidebarMenu>
            <SidebarMenuItem>
              {user && <UserNav user={user} onLogout={logout} />}
            </SidebarMenuItem>
          </SidebarMenu>
        </SidebarFooter>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 items-center gap-4 border-b bg-background/50 backdrop-blur-sm px-6 sticky top-0 z-10 md:hidden">
          <SidebarTrigger />
          <h1 className="text-lg font-semibold font-headline">ToyCycle</h1>
        </header>
        <main className="flex-1 p-4 md:p-6 lg:p-8">{children}</main>
        <ChatWidget />
      </SidebarInset>
    </SidebarProvider>
  );
}
