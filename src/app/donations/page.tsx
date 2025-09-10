
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
import { PackageCheck, PackageSearch, Truck, User, Calendar, Handshake } from 'lucide-react';
import { getDonationsForUser } from './actions';
import { DetailedDonation } from './actions';
import { getCurrentUser } from '@/lib/actions/auth';

type Status = 'Redistributed' | 'Processing' | 'Picked Up';

const getStatusVariant = (status: Status) => {
  switch (status) {
    case 'Redistributed': return 'default';
    case 'Processing': return 'secondary';
    case 'Picked Up': return 'outline';
    default: return 'secondary';
  }
};

const getStatusIcon = (status: string) => {
    switch (status) {
        case 'redistributed': return <PackageCheck className="h-4 w-4" />;
        case 'sanitizing':
        case 'listed':
             return <PackageSearch className="h-4 w-4" />;
        case 'received': return <Truck className="h-4 w-4" />;
        default: return <Handshake className="h-4 w-4" />;
    }
}

const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

const formatDateTime = (dateString: string | Date) => {
    const date = new Date(dateString);
    return `${date.toLocaleDateString()} at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
}


export default async function DonationsPage() {
  const user = await getCurrentUser();
  const donations = await getDonationsForUser(user);

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
                  <TableHead>Donated Item</TableHead>
                  <TableHead>Donated On</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Est. Value</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.length > 0 ? donations.map((donation: DetailedDonation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.inventory?.name}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-2">
                         <Calendar className="h-4 w-4 text-muted-foreground" />
                         <span>{formatDateTime(donation.donatedAt)}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(donation.inventory?.status as Status)} className="flex items-center gap-2 w-fit capitalize">
                        {getStatusIcon(donation.inventory?.status || '')}
                        {donation.inventory?.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right font-medium">{formatCurrency(5)}</TableCell>
                  </TableRow>
                )) : (
                    <TableRow>
                        <TableCell colSpan={4} className="text-center h-24">
                            You haven't made any donations yet.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </AppLayout>
  );
}
