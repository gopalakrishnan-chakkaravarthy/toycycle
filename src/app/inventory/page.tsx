
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { getInventoryCountsByStatus, getDonationsByLocation } from './actions';
import { InventoryJourney } from './_components/inventory-journey';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { MapPin } from 'lucide-react';


export default async function InventoryPage() {
    const inventoryCounts = await getInventoryCountsByStatus();
    const donationsByLocation = await getDonationsByLocation();

    return (
        <AppLayout>
        <div className="flex flex-col gap-8 animate-fade-in">
            <header className="space-y-2">
                <h1 className="text-3xl font-bold tracking-tight font-headline">Inventory Dashboard</h1>
                <p className="text-muted-foreground">Live insights into the toy lifecycle and collection points.</p>
            </header>

            {inventoryCounts.length > 0 && (
                <InventoryJourney counts={inventoryCounts} />
            )}
            
            {donationsByLocation.length > 0 && (
                <Card>
                    <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <MapPin className="text-primary"/>
                        Donations by Location
                    </CardTitle>
                    <CardDescription>Toys collected from each community drop-off point.</CardDescription>
                    </CardHeader>
                    <CardContent>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={donationsByLocation} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} />
                            <YAxis allowDecimals={false} />
                            <Tooltip
                            cursor={{ fill: 'hsl(var(--muted))' }}
                            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                            />
                            <Bar dataKey="count" fill="hsl(var(--primary))" name="Toys Collected" />
                        </BarChart>
                        </ResponsiveContainer>
                    </div>
                    </CardContent>
                </Card>
            )}
        </div>
        </AppLayout>
    );
}
