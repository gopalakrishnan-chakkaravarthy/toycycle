import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getRedistributedInventory, getEcommerceIntegrations } from './actions';
import { LogisticsDataTable } from './_components/data-table';
import { columns } from './_components/columns';
import { EcommerceIntegrationList } from './_components/ecommerce-integration-list';
import { EcommerceIntegration } from '@/db/schema';


export default async function LogisticsPage() {
    const [inventory, integrations] = await Promise.all([
        getRedistributedInventory(),
        getEcommerceIntegrations()
    ]);

    return (
        <AppLayout>
        <div className="flex flex-col gap-8 animate-fade-in">
            <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Logistics Management</h1>
            <p className="text-muted-foreground">Track redistributed toys and manage the recollection process.</p>
            </header>
            
            <div className="grid gap-8 lg:grid-cols-2">
                <Card className="lg:col-span-2">
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

                <Card className="lg:col-span-2">
                <CardHeader>
                    <CardTitle>E-commerce API Integrations</CardTitle>
                    <CardDescription>
                        Manage your connections to third-party logistics platforms.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                   <EcommerceIntegrationList integrations={integrations as EcommerceIntegration[]} />
                </CardContent>
                </Card>
            </div>
        </div>
        </AppLayout>
    );
}
