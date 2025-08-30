
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';
import Image from 'next/image';
import { Location } from '@/db/schema';


const mockLocations = [
  {
    id: 1,
    name: "Northwood Community Center",
    address: "4500 Northwood Ave, Anytown, USA",
    hours: "Mon-Fri: 9am - 6pm, Sat: 10am - 4pm",
  },
  {
    id: 2,
    name: "Southside Public Library",
    address: "876 Library Ln, Anytown, USA",
    hours: "Tue-Sat: 11am - 7pm",
  },
  {
    id: 3,
    name: "Greenleaf Park Office",
    address: "123 Park Dr, Anytown, USA",
    hours: "Mon-Sun: 8am - 8pm (Outdoor bin)",
  },
   {
    id: 4,
    name: "Downtown ToyCycle Hub",
    address: "55 Central Plaza, Anytown, USA",
    hours: "Mon-Fri: 10am - 5pm",
  },
];


async function getLocations(): Promise<Location[]> {
    if (!process.env.POSTGRES_URL) {
        // @ts-ignore
        return mockLocations;
    }

    try {
        const { db } = await import('@/db');
        const locations = await db.query.locations.findMany();
        // If there are no locations in the DB, return the mock data.
        if (locations.length === 0) {
            // @ts-ignore
            return mockLocations;
        }
        return locations;
    } catch (error) {
        console.error("Failed to fetch locations:", error);
         // @ts-ignore
        return mockLocations; // Return mock data on error
    }
}


export default async function LocationsPage() {
  const dropOffLocations = await getLocations();

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Community Drop-off Points</h1>
          <p className="text-muted-foreground">Find a convenient spot to drop off your toy donations.</p>
        </header>

        <Card>
            <CardContent className="p-0">
                 <div className="aspect-[16/9] w-full overflow-hidden rounded-t-lg">
                    <Image
                        src="https://picsum.photos/1200/675"
                        alt="Map of drop-off locations"
                        width={1200}
                        height={675}
                        data-ai-hint="map city"
                        className="object-cover w-full h-full"
                    />
                </div>
            </CardContent>
        </Card>

        <div className="grid gap-6 sm:grid-cols-2">
          {dropOffLocations.map((location) => (
            <Card key={location.id} className="flex flex-col">
              <CardHeader>
                <CardTitle>{location.name}</CardTitle>
              </CardHeader>
              <CardContent className="flex-grow space-y-3">
                <div className="flex items-start gap-3">
                  <MapPin className="h-5 w-5 mt-1 shrink-0 text-primary" />
                  <p className="text-sm text-muted-foreground">{location.address}</p>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="h-5 w-5 mt-1 shrink-0 text-primary" />
                  <p className="text-sm text-muted-foreground">{location.hours}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
