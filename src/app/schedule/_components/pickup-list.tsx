
'use client';

import { DetailedPickup } from '../actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Home, Building, Handshake, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from '@/components/ui/dropdown-menu';


const getPickupTypeIcon = (type: string) => {
    switch (type) {
        case 'my-address': return <Home className="h-4 w-4" />;
        case 'drop-off': return <Building className="h-4 w-4" />;
        case 'partner': return <Handshake className="h-4 w-4" />;
        default: return null;
    }
}

const getPickupLocation = (pickup: DetailedPickup) => {
    switch (pickup.pickupType) {
        case 'my-address': return pickup.address;
        case 'drop-off': return pickup.location?.name;
        case 'partner': return pickup.partner?.name;
        default: return 'N/A';
    }
}


export function PickupList({ pickups }: { pickups: DetailedPickup[] }) {
  if (pickups.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-48 text-center bg-muted/50 rounded-lg">
        <p className="font-semibold">No pickups scheduled for this date.</p>
        <p className="text-sm text-muted-foreground">Select another date or add a new pickup.</p>
      </div>
    );
  }

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Time Slot</TableHead>
            <TableHead>Contact</TableHead>
            <TableHead>Location</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {pickups.map((pickup) => (
            <TableRow key={pickup.id}>
              <TableCell>
                <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4 text-muted-foreground" />
                    <span className="font-medium">{pickup.timeSlot}</span>
                </div>
              </TableCell>
              <TableCell>
                 <div className="flex flex-col">
                    <span className="font-medium">{pickup.name}</span>
                    <span className="text-sm text-muted-foreground">{pickup.email}</span>
                 </div>
              </TableCell>
              <TableCell>
                 <div className="flex items-center gap-2">
                    <Badge variant="outline" className="flex items-center gap-1.5 capitalize">
                        {getPickupTypeIcon(pickup.pickupType)}
                        {pickup.pickupType.replace('-', ' ')}
                    </Badge>
                    <span className="text-muted-foreground truncate">{getPickupLocation(pickup)}</span>
                 </div>
              </TableCell>
              <TableCell>
                 <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0">
                            <span className="sr-only">Open menu</span>
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuItem disabled>Edit</DropdownMenuItem>
                        <DropdownMenuItem disabled className="text-destructive">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
