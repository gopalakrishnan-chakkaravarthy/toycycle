'use client';

import {
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  Gift,
  CalendarClock,
  MapPin,
  Heart,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

const navItems = [
  { href: '/', label: 'Impact Report', icon: LayoutDashboard },
  { href: '/donations', label: 'My Donations', icon: Gift },
  { href: '/schedule', label: 'Schedule Pickup', icon: CalendarClock },
  { href: '/locations', label: 'Drop-off Locations', icon: MapPin },
  { href: '/partners', label: 'Our Partners', icon: Heart },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <SidebarContent>
      <SidebarMenu>
        {navItems.map((item) => (
          <SidebarMenuItem key={item.href}>
            <SidebarMenuButton
              asChild
              isActive={pathname === item.href}
              tooltip={{ children: item.label, side: 'right' }}
            >
              <Link href={item.href}>
                <item.icon />
                <span>{item.label}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        ))}
      </SidebarMenu>
    </SidebarContent>
  );
}
