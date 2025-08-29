
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Partner, Location } from '@/db/schema';
import { PartnerList } from './_components/partner-list';
import { LocationList } from './_components/location-list';

async function getAdminData() {
    if (!process.env.POSTGRES_URL) {
         return { partners: [], locations: [] };
    }
    try {
        const { db } = await import('@/db');
        const partners = await db.query.partners.findMany();
        const locations = await db.query.locations.findMany();
        return { partners, locations };
    } catch (error) {
        console.error("Failed to fetch admin data:", error);
        return { partners: [], locations: [] };
    }
}


export default async function AdminPage() {
    const { partners, locations } = await getAdminData();
    
    return (
        <AppLayout>
            <div className="flex flex-col gap-8 animate-fade-in">
                <header className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Manage ToyCycle operations.</p>
                </header>

                <div className="grid gap-8 lg:grid-cols-2">
                   <Card>
                        <CardHeader>
                            <CardTitle>Manage Partners</CardTitle>
                            <CardDescription>Add, edit, or remove partner organizations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <PartnerList partners={partners as Partner[]} />
                        </CardContent>
                    </Card>

                     <Card>
                        <CardHeader>
                            <CardTitle>Manage Drop-off Locations</CardTitle>
                            <CardDescription>Add, edit, or remove drop-off locations.</CardDescription>
                        </CardHeader>
                        <CardContent>
                           <LocationList locations={locations as Location[]} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
