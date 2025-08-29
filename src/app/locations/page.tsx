import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { MapPin, Clock } from 'lucide-react';
import Image from 'next/image';

const dropOffLocations = [
  {
    name: "Northwood Community Center",
    address: "4500 Northwood Ave, Anytown, USA",
    hours: "Mon-Fri: 9am - 6pm, Sat: 10am - 4pm",
  },
  {
    name: "Southside Public Library",
    address: "876 Library Ln, Anytown, USA",
    hours: "Tue-Sat: 11am - 7pm",
  },
  {
    name: "Greenleaf Park Office",
    address: "123 Park Dr, Anytown, USA",
    hours: "Mon-Sun: 8am - 8pm (Outdoor bin)",
  },
   {
    name: "Downtown ToyCycle Hub",
    address: "55 Central Plaza, Anytown, USA",
    hours: "Mon-Fri: 10am - 5pm",
  },
];

export default function LocationsPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Drop-off Locations</h1>
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
            <Card key={location.name} className="flex flex-col">
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
