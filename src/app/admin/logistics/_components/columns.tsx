'use client';

import { ColumnDef } from '@tanstack/react-table';
import { Inventory, Partner } from '@/db/schema';
import { ArrowUpDown, MoreHorizontal, Package, RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

type LogisticsInventory = Inventory & { partner: Partner | null };

export const columns: ColumnDef<LogisticsInventory>[] = [
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Toy Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'partner.name',
    header: 'Redistributed To',
    cell: ({ row }) => {
        return (
            <div className="flex items-center gap-2">
                <Package className="h-4 w-4 text-muted-foreground" />
                <span>{row.original.partner?.name ?? 'N/A'}</span>
            </div>
        )
    }
  },
  {
    accessorKey: 'logisticsStatus',
    header: 'Logistics Status',
    cell: ({ row }) => {
       const status = row.original.logisticsStatus || 'delivered';
       const variant = status === 'recollection_requested' ? 'secondary' : status === 'recollected' ? 'outline' : 'default';
       return <Badge variant={variant} className="capitalize">{status.replace('_', ' ')}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'receivedAt', // Using receivedAt as a proxy for redistribution date for now
    header: 'Delivered On',
    cell: ({ row }) => {
        const date = new Date(row.original.receivedAt);
        return date.toLocaleDateString();
    }
  },
  {
    id: 'actions',
    cell: ({ row, table }) => {
      const item = row.original
      const meta = table.options.meta as {
        requestRecollection: (item: LogisticsInventory) => void,
      };
 
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem 
                onClick={() => meta.requestRecollection(item)}
                disabled={item.logisticsStatus === 'recollection_requested' || item.logisticsStatus === 'recollected'}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Request Recollection
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
