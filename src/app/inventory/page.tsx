
import { AppLayout } from '@/components/layout/app-layout';

export default function InventoryPage() {
    return (
        <AppLayout>
        <div className="flex flex-col gap-8 animate-fade-in">
            <header className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight font-headline">Inventory</h1>
            <p className="text-muted-foreground">This is a placeholder for the inventory page.</p>
            </header>
        </div>
        </AppLayout>
    );
}
