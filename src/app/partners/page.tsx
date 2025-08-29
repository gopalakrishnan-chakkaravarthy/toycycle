import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import Image from 'next/image';
import { Partner } from '@/db/schema';


const mockPartners = [
  {
    id: 1,
    name: "Children's Joy Foundation",
    description: "Bringing smiles to underprivileged children across the state.",
    logoUrl: "https://picsum.photos/200/100?random=1",
    logoHint: "charity logo"
  },
  {
    id: 2,
    name: "Northwood School District",
    description: "Supporting early childhood education with new learning tools.",
    logoUrl: "https://picsum.photos/200/100?random=2",
    logoHint: "school logo"
  },
  {
    id: 3,
    name: "Anytown Public Libraries",
    description: "Enriching community spaces with toys for all ages.",
    logoUrl: "https://picsum.photos/200/100?random=3",
    logoHint: "library logo"
  },
  {
    id: 4,
    name: "Family Support Network",
    description: "Providing resources and support for families in need.",
    logoUrl: "https://picsum.photos/200/100?random=4",
    logoHint: "community logo"
  },
];

async function getPartners(): Promise<Partner[]> {
    if (!process.env.POSTGRES_URL) {
        // @ts-ignore
        return mockPartners;
    }
    try {
        const { db } = await import('@/db');
        const partners = await db.query.partners.findMany();
        // If there are no partners in the DB, return the mock data.
        if (partners.length === 0) {
            // @ts-ignore
            return mockPartners;
        }
        return partners;
    } catch (error) {
        console.error("Failed to fetch partners:", error);
        // @ts-ignore
        return mockPartners;
    }
}


export default async function PartnersPage() {
    const partners = await getPartners();

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Our Partners</h1>
          <p className="text-muted-foreground">We're proud to work with these amazing organizations to redistribute toys.</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <Card key={partner.id} className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="bg-muted flex items-center justify-center p-6 h-32">
                <Image
                    src={partner.logoUrl || `https://picsum.photos/200/100?random=${partner.id}`}
                    alt={`${partner.name} logo`}
                    width={200}
                    height={100}
                    data-ai-hint={partner.logoHint || 'logo'}
                    className="object-contain h-16 w-auto rounded-md"
                />
              </div>
              <div className="flex flex-col flex-grow p-6 bg-card">
                <h3 className="font-semibold text-lg">{partner.name}</h3>
                <p className="text-sm text-muted-foreground mt-2 flex-grow">{partner.description}</p>
              </div>
            </Card>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}
