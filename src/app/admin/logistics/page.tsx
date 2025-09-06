import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRedistributedInventory } from './actions';
import { LogisticsDataTable } from './_components/data-table';
import { columns } from './_components/columns';

export default async function LogisticsPage() {
    const inventory = await getRedistributedInventory();

    return (
        <AppLayout>
        <div className="flex flex-col gap-8 animate-fade-in">
            <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Logistics Management</h1>
            <p className="text-muted-foreground">Track redistributed toys and manage the recollection process.</p>
            </header>

            <Card>
            <CardHeader>
                <CardTitle>Redistributed Toy Tracking</CardTitle>
                <CardDescription>
                    A list of all toys that have been delivered to partner organizations.
                </CardDescription>
            </CardHeader>
            <CardContent>
               <LogisticsDataTable columns={columns} data={inventory} />
            </CardContent>
            </Card>
        </div>
        </AppLayout>
    );
}
