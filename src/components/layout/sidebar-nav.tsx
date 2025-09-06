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
  Warehouse,
  Megaphone,
  AreaChart,
  Truck,
  Workflow,
} from 'lucide-react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/auth-context';

const navItems = [
  { href: '/', label: 'Impact Report', icon: LayoutDashboard, roles: ['user', 'admin'] },
  { href: '/donations', label: 'My Donations', icon: Gift, roles: ['user'] },
  { href: '/schedule', label: 'Schedule Pickup', icon: CalendarClock, roles: ['user', 'admin'] },
  { href: '/locations', label: 'Community Drop-off Points', icon: MapPin, roles: ['user', 'admin'] },
  { href: '/partners', label: 'Our Partners', icon: Heart, roles: ['user', 'admin'] },
  { href: '/admin', label: 'Admin Dashboard', icon: Shield, roles: ['admin'] },
  { href: '/inventory', label: 'Inventory', icon: AreaChart, roles: ['admin'] },
  { href: '/warehouse', label: 'Warehouse', icon: Warehouse, roles: ['admin'] },
  { href: '/workflow', label: 'Workflow', icon: Workflow, roles: ['admin'] },
  { href: '/admin/campaigns', label: 'Campaigns', icon: Megaphone, roles: ['admin'] },
  { href: '/admin/logistics', label: 'Logistics', icon: Truck, roles: ['admin'] },
];

export function SidebarNav() {
  const pathname = usePathname();
  const { user } = useAuth();

  const filteredNavItems = navItems.filter(item => {
    if (!user) return false;
    // Hide "My Donations" for admins
    if (item.label === 'My Donations' && user.role === 'admin') {
      return false;
    }
    return item.roles.includes(user.role);
  });

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
