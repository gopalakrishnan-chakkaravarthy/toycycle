'use client';

import { ColumnDef } from '@tanstack/react-table';
import Image from 'next/image';
import { Inventory, ToyCondition } from '@/db/schema';
import { ArrowUpDown, MoreHorizontal, Pencil, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';

export const columns: ColumnDef<Inventory & { condition: ToyCondition | null }>[] = [
  {
    accessorKey: 'imageUrl',
    header: 'Image',
    cell: ({ row }) => {
      const imageUrl = row.original.imageUrl;
      const imageHint = row.original.imageHint;
      return imageUrl ? (
        <Image
          src={imageUrl}
          alt={row.original.name}
          width={64}
          height={64}
          data-ai-hint={imageHint || 'toy'}
          className="rounded-md object-cover h-16 w-16"
        />
      ) : <div className="h-16 w-16 bg-muted rounded-md flex items-center justify-center text-xs text-muted-foreground">No Image</div>
    }
  },
  {
    accessorKey: 'name',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => {
       const status = row.original.status;
       const variant = status === 'listed' ? 'default' : status === 'received' ? 'secondary' : 'outline';
       return <Badge variant={variant} className="capitalize">{status}</Badge>
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },
  {
    accessorKey: 'condition.name',
    header: 'Condition',
    cell: ({ row }) => {
        return row.original.condition?.name ?? 'N/A';
    }
  },
  {
    accessorKey: 'receivedAt',
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
        >
          Received On
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
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
        openEditDialog: (item: Inventory) => void,
        openDeleteDialog: (item: Inventory) => void,
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
            <DropdownMenuItem onClick={() => meta.openEditDialog(item)}>
              <Pencil className="mr-2 h-4 w-4" />
              Edit
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta.openDeleteDialog(item)} className="text-destructive">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
];
