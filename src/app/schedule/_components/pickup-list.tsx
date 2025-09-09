
'use client';

import { DetailedPickup } from '../actions';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Clock, Home, Building, Handshake, MoreHorizontal, CheckCircle2, XCircle, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem, DropdownMenuSeparator } from '@/components/ui/dropdown-menu';
import { useAuth } from '@/context/auth-context';
import { useToast } from '@/hooks/use-toast';
import { updatePickupStatus, deletePickup } from '../actions';

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
        default: 'N/A';
    }
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed': return 'default';
    case 'scheduled': return 'secondary';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
}


export function PickupList({ pickups, onActionComplete }: { pickups: DetailedPickup[], onActionComplete: () => void }) {
  const { user } = useAuth();
  const { toast } = useToast();

  const handleStatusChange = async (pickupId: number, status: 'scheduled' | 'completed' | 'cancelled') => {
    const result = await updatePickupStatus(pickupId, status);
    if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
        toast({ title: 'Success', description: result.message });
        onActionComplete();
    }
  }

  const handleDelete = async (pickupId: number) => {
    const result = await deletePickup(pickupId);
    if (result.error) {
        toast({ variant: 'destructive', title: 'Error', description: result.error });
    } else {
        toast({ title: 'Success', description: result.message });
        onActionComplete();
    }
  }


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
            <TableHead>Status</TableHead>
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
                <Badge variant={getStatusVariant(pickup.status)} className="capitalize">{pickup.status}</Badge>
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
                         {user?.role === 'admin' && (
                          <>
                             <DropdownMenuItem onClick={() => handleStatusChange(pickup.id, 'completed')} disabled={pickup.status === 'completed'}>
                               <CheckCircle2 className="mr-2 h-4 w-4" />
                               Mark as Completed
                             </DropdownMenuItem>
                             <DropdownMenuItem onClick={() => handleStatusChange(pickup.id, 'cancelled')} disabled={pickup.status === 'cancelled'}>
                               <XCircle className="mr-2 h-4 w-4" />
                               Mark as Cancelled
                             </DropdownMenuItem>
                             <DropdownMenuSeparator />
                          </>
                         )}
                        <DropdownMenuItem onClick={() => handleDelete(pickup.id)} className="text-destructive">
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete
                        </DropdownMenuItem>
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
