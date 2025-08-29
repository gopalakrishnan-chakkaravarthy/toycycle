
import { AppLayout } from '@/components/layout/app-layout';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { PackageCheck, PackageSearch, Truck, User, Calendar } from 'lucide-react';

const donations = [
  { id: 'DON-00781', date: '2024-05-15T10:00:00Z', status: 'Redistributed', items: 12, amount: 50.00, pickupPerson: 'John D.', icon: <PackageCheck className="h-4 w-4" /> },
  { id: 'DON-00765', date: '2024-04-22T14:30:00Z', status: 'Processing', items: 8, amount: 35.00, pickupPerson: 'Jane S.', icon: <PackageSearch className="h-4 w-4" /> },
  { id: 'DON-00753', date: '2024-03-10T09:00:00Z', status: 'Picked Up', items: 5, amount: 25.00, pickupPerson: 'Mike R.', icon: <Truck className="h-4 w-4" /> },
  { id: 'DON-00741', date: '2024-02-01T11:45:00Z', status: 'Redistributed', items: 25, amount: 120.00, pickupPerson: 'Sarah L.', icon: <PackageCheck className="h-4 w-4" /> },
];

type Status = 'Redistributed' | 'Processing' | 'Picked Up';

const getStatusVariant = (status: Status) => {
  switch (status) {
    case 'Redistributed': return 'default';
    case 'Processing': return 'secondary';
    case 'Picked Up': return 'outline';
    default: return 'secondary';
  }
};

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}


export default function DonationsPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">My Donations</h1>
          <p className="text-muted-foreground">Track the journey of your donated toys and the smiles they create.</p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Donation History</CardTitle>
            <CardDescription>A record of all your generous contributions.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[150px]">Donation ID</TableHead>
                  <TableHead>Pickup Details</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                  <TableHead className="text-right">Amount</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.id}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <div className="flex items-center gap-2">
                           <Calendar className="h-4 w-4 text-muted-foreground" />
                           <span>{formatDateTime(donation.date)}</span>
                        </div>
                         <div className="flex items-center gap-2 text-muted-foreground">
                           <User className="h-4 w-4" />
                           <span className="text-sm">{donation.pickupPerson}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(donation.status as Status)} className="flex items-center gap-2 w-fit">
                        {donation.icon}
                        {donation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{donation.items}</TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(donation.amount)}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
