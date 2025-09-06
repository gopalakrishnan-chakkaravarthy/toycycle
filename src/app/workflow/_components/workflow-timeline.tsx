
'use client';

import { DetailedPickup } from '@/app/schedule/actions';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { useAuth } from '@/context/auth-context';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Building, CheckCircle, Clock, DollarSign, Handshake, Home, MoreVertical, Package, User, Workflow as WorkflowIcon } from 'lucide-react';
import { updatePickupStatus } from '@/app/schedule/actions';
import { useToast } from '@/hooks/use-toast';

interface WorkflowTimelineProps {
    pickups: DetailedPickup[];
}

const getPickupTypeIcon = (type: string) => {
    switch (type) {
        case 'my-address': return <Home className="h-4 w-4" />;
        case 'drop-off': return <Building className="h-4 w-4" />;
        case 'partner': return <Handshake className="h-4 w-4" />;
        default: return <Package className="h-4 w-4" />;
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

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'completed': return 'default';
    case 'scheduled': return 'secondary';
    case 'cancelled': return 'destructive';
    default: return 'outline';
  }
}

const formatCurrency = (amount: string | null | undefined) => {
    if (!amount) return '$0.00';
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(parseFloat(amount));
}


export function WorkflowTimeline({ pickups }: WorkflowTimelineProps) {
    const { toast } = useToast();

    const handleComplete = async (id: number) => {
        const result = await updatePickupStatus(id, 'completed');
        if (result.error) {
            toast({ variant: 'destructive', title: 'Error', description: result.error });
        } else {
            toast({ title: 'Success', description: result.message });
        }
    }


    return (
        <div className="relative pl-6 after:absolute after:inset-y-0 after:w-px after:bg-muted-foreground/20 after:left-0">
            {pickups.map((pickup, index) => (
                <div key={pickup.id} className="relative grid grid-cols-[auto_1fr] gap-x-4 mb-8">
                     <div className="flex items-center justify-center">
                        <span className={cn(
                            "absolute -left-[calc(1.5rem-1px)] top-1 flex h-6 w-6 items-center justify-center rounded-full",
                            pickup.status === 'completed' ? 'bg-primary' : 'bg-muted-foreground/30',
                        )}>
                            {pickup.status === 'completed' ? (
                                <CheckCircle className="h-4 w-4 text-primary-foreground" />
                            ) : (
                                <Clock className="h-4 w-4 text-muted-foreground" />
                            )}
                        </span>
                    </div>

                    <div className="flex flex-col">
                        <div className="text-sm font-medium text-muted-foreground mb-1">
                            {format(new Date(pickup.pickupDate), 'PPP')}
                        </div>
                        <Card>
                            <CardHeader>
                               <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="flex items-center gap-2">
                                            {getPickupTypeIcon(pickup.pickupType)}
                                            {pickup.pickupType === 'my-address' ? 'Pickup Scheduled' : `${pickup.pickupType} Drop-off`}
                                        </CardTitle>
                                        <CardDescription>{getPickupLocation(pickup)}</CardDescription>
                                    </div>
                                    <Badge variant={getStatusVariant(pickup.status)} className="capitalize">{pickup.status}</Badge>
                               </div>
                            </CardHeader>
                            <CardContent className="grid gap-4 sm:grid-cols-2 md:grid-cols-3">
                                 <div className="flex items-center gap-2 text-sm">
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{pickup.name}</span>
                                        <span className="text-muted-foreground">{pickup.email}</span>
                                    </div>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <Clock className="h-4 w-4 text-muted-foreground" />
                                    <span>{pickup.timeSlot}</span>
                                </div>
                                <div className="flex items-center gap-2 text-sm">
                                    <DollarSign className="h-4 w-4 text-muted-foreground" />
                                    <span>{formatCurrency(pickup.collectionCost)}</span>
                                </div>
                                {pickup.notes && <p className="text-sm text-muted-foreground col-span-full italic">"{pickup.notes}"</p>}
                            </CardContent>
                             {pickup.status === 'scheduled' && (
                                <CardFooter>
                                    <Button size="sm" onClick={() => handleComplete(pickup.id)}>Mark as Complete</Button>
                                </CardFooter>
                             )}
                        </Card>
                    </div>
                </div>
            ))}
             {pickups.length === 0 && (
                <div className="text-center py-12 text-muted-foreground">No workflow history found.</div>
             )}
        </div>
    );
}

