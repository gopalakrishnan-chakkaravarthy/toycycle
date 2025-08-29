
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
  Shield,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

const navItems = [
  { href: '/', label: 'Impact Report', icon: LayoutDashboard, roles: ['user', 'admin'] },
  { href: '/donations', label: 'My Donations', icon: Gift, roles: ['user', 'admin'] },
  { href: '/schedule', label: 'Schedule Pickup', icon: CalendarClock, roles: ['user', 'admin'] },
  { href: '/locations', label: 'Drop-off Locations', icon: MapPin, roles: ['user', 'admin'] },
  { href: '/partners', label: 'Our Partners', icon: Heart, roles: ['user', 'admin'] },
  { href: '/admin', label: 'Admin Dashboard', icon: Shield, roles: ['admin'] },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(item => user && item.roles.includes(user.role));

  return (
    <SidebarContent>
      <SidebarMenu>
        {filteredNavItems.map((item) => (
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
