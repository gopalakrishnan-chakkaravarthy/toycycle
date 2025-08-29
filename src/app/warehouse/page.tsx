import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Inventory, ToyCondition } from '@/db/schema';
import { InventoryDataTable } from './_components/inventory-data-table';
import { columns } from './_components/columns';

async function getWarehouseData(): Promise<{ inventory: Inventory[], conditions: ToyCondition[] }> {
    if (!process.env.POSTGRES_URL) {
        return { inventory: [], conditions: [] };
    }

    try {
        const { db } = await import('@/db');
        const inventory = await db.query.inventory.findMany({
            with: {
                condition: true,
            }
        });
        const conditions = await db.query.toyConditions.findMany();

        // @ts-ignore
        return { inventory, conditions };
    } catch (error) {
        console.error("Failed to fetch warehouse data:", error);
        return { inventory: [], conditions: [] };
    }
}


export default async function WarehousePage() {
    const { inventory, conditions } = await getWarehouseData();

    return (
        <AppLayout>
        <div className="flex flex-col gap-8 animate-fade-in">
            <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Warehouse Management</h1>
            <p className="text-muted-foreground">Track and manage all collected toys through the inventory process.</p>
            </header>

            <Card>
            <CardHeader>
                <CardTitle>Toy Inventory</CardTitle>
                <CardDescription>
                    A complete list of all toys currently in the warehouse.
                </CardDescription>
            </CardHeader>
            <CardContent>
               <InventoryDataTable columns={columns} data={inventory} conditions={conditions} />
            </CardContent>
            </Card>
        </div>
        </AppLayout>
    );
}
