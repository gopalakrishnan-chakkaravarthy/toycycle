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
import { PackageCheck, PackageSearch, Truck } from 'lucide-react';

const donations = [
  { id: 'DON-00781', date: '2024-05-15', status: 'Redistributed', items: 12, icon: <PackageCheck className="h-4 w-4" /> },
  { id: 'DON-00765', date: '2024-04-22', status: 'Processing', items: 8, icon: <PackageSearch className="h-4 w-4" /> },
  { id: 'DON-00753', date: '2024-03-10', status: 'Picked Up', items: 5, icon: <Truck className="h-4 w-4" /> },
  { id: 'DON-00741', date: '2024-02-01', status: 'Redistributed', items: 25, icon: <PackageCheck className="h-4 w-4" /> },
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
                  <TableHead>Date</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead className="text-right">Items</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {donations.map((donation) => (
                  <TableRow key={donation.id}>
                    <TableCell className="font-medium">{donation.id}</TableCell>
                    <TableCell>{donation.date}</TableCell>
                    <TableCell>
                      <Badge variant={getStatusVariant(donation.status as Status)} className="flex items-center gap-2 w-fit">
                        {donation.icon}
                        {donation.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">{donation.items}</TableCell>
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
