import { AppLayout } from '@/components/layout/app-layout';
import { ScheduleForm } from './_components/schedule-form';
import { AccessoryType, Location, Partner, ToyCondition } from '@/db/schema';


const mockToyConditions = [
    { id: 1, name: 'New' },
    { id: 2, name: 'Gently Used' },
    { id: 3, name: 'Play-worn' },
];

const mockAccessoryTypes = [
    { id: 1, name: 'Stroller' },
    { id: 2, name: 'Car Seat' },
    { id: 3, name: 'High Chair' },
];

const mockLocations = [
  { id: 1, name: "Northwood Community Center", address: "4500 Northwood Ave", hours: "" },
  { id: 2, name: "Southside Public Library", address: "876 Library Ln", hours: "" },
];

const mockPartners = [
  { id: 1, name: "Children's Joy Foundation", description: "", logoUrl: "", logoHint: "" },
  { id: 2, name: "Northwood School District", description: "", logoUrl: "", logoHint: "" },
];


async function getScheduleData() {
    if (!process.env.POSTGRES_URL) {
        return {
            toyConditions: mockToyConditions as ToyCondition[],
            accessoryTypes: mockAccessoryTypes as AccessoryType[],
            locations: mockLocations as Location[],
            partners: mockPartners as Partner[],
        };
    }
    try {
        const { db } = await import('@/db');
        const toyConditions = await db.query.toyConditions.findMany();
        const accessoryTypes = await db.query.accessoryTypes.findMany();
        const locations = await db.query.locations.findMany();
        const partners = await db.query.partners.findMany();

        return { 
            toyConditions: toyConditions.length > 0 ? toyConditions : mockToyConditions, 
            accessoryTypes: accessoryTypes.length > 0 ? accessoryTypes : mockAccessoryTypes,
            locations: locations.length > 0 ? locations : mockLocations,
            partners: partners.length > 0 ? partners: mockPartners
        };
    } catch (error) {
        console.error("Failed to fetch schedule data:", error);
        return { 
            toyConditions: mockToyConditions as ToyCondition[], 
            accessoryTypes: mockAccessoryTypes as AccessoryType[],
            locations: mockLocations as Location[],
            partners: mockPartners as Partner[]
        };
    }
}


export default async function SchedulePage() {
  const { toyConditions, accessoryTypes, locations, partners } = await getScheduleData();

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Schedule a Pickup</h1>
          <p className="text-muted-foreground">Arrange a convenient time for us to collect your donations.</p>
        </header>

        <ScheduleForm 
          toyConditions={toyConditions} 
          accessoryTypes={accessoryTypes}
          locations={locations}
          partners={partners}
        />
      </div>
    </AppLayout>
  );
}
