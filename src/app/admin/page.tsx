
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Partner, Location, AccessoryType, ToyCondition } from '@/db/schema';
import { PartnerList } from './_components/partner-list';
import { LocationList } from './_components/location-list';
import { AccessoryTypeList } from './_components/accessory-type-list';
import { ToyConditionList } from './_components/toy-condition-list';

async function getAdminData() {
    if (!process.env.POSTGRES_URL) {
         return { partners: [], locations: [], accessoryTypes: [], toyConditions: [] };
    }
    try {
        const { db } = await import('@/db');
        const partners = await db.query.partners.findMany();
        const locations = await db.query.locations.findMany();
        const accessoryTypes = await db.query.accessoryTypes.findMany();
        const toyConditions = await db.query.toyConditions.findMany();
        return { partners, locations, accessoryTypes, toyConditions };
    } catch (error) {
        console.error("Failed to fetch admin data:", error);
        return { partners: [], locations: [], accessoryTypes: [], toyConditions: [] };
    }
}


export default async function AdminPage() {
    const { partners, locations, accessoryTypes, toyConditions } = await getAdminData();
    
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

                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Accessory Types</CardTitle>
                            <CardDescription>Add, edit, or remove types of kid accessories.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <AccessoryTypeList accessoryTypes={accessoryTypes as AccessoryType[]} />
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>Manage Toy Conditions</CardTitle>
                            <CardDescription>Add, edit, or remove the conditions of toys.</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ToyConditionList toyConditions={toyConditions as ToyCondition[]} />
                        </CardContent>
                    </Card>
                </div>
            </div>
        </AppLayout>
    );
}
