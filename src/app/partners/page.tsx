
import { AppLayout } from '@/components/layout/app-layout';
import { Card } from '@/components/ui/card';
import Image from 'next/image';

const partners = [
  {
    name: "Children's Joy Foundation",
    description: "Bringing smiles to underprivileged children across the state.",
    logoUrl: "https://picsum.photos/200/100?random=1",
    logoHint: "charity logo"
  },
  {
    name: "Northwood School District",
    description: "Supporting early childhood education with new learning tools.",
    logoUrl: "https://picsum.photos/200/100?random=2",
    logoHint: "school logo"
  },
  {
    name: "Anytown Public Libraries",
    description: "Enriching community spaces with toys for all ages.",
    logoUrl: "https://picsum.photos/200/100?random=3",
    logoHint: "library logo"
  },
  {
    name: "Family Support Network",
    description: "Providing resources and support for families in need.",
    logoUrl: "https://picsum.photos/200/100?random=4",
    logoHint: "community logo"
  },
  {
    name: "Hope Shelters",
    description: "Offering comfort and play to children in temporary housing.",
    logoUrl: "https://picsum.photos/200/100?random=5",
    logoHint: "shelter logo"
  },
  {
    name: "Bright Futures Initiative",
    description: "Investing in the next generation through play and education.",
    logoUrl: "https://picsum.photos/200/100?random=6",
    logoHint: "education logo"
  },
];

export default function PartnersPage() {
  return (
    <AppLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Our Partners</h1>
          <p className="text-muted-foreground">We're proud to work with these amazing organizations to redistribute toys.</p>
        </header>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {partners.map((partner) => (
            <Card key={partner.name} className="flex flex-col overflow-hidden transform transition-transform duration-300 hover:-translate-y-1 hover:shadow-xl">
              <div className="bg-muted flex items-center justify-center p-6 h-32">
                <Image
                    src={partner.logoUrl}
                    alt={`${partner.name} logo`}
                    width={200}
                    height={100}
                    data-ai-hint={partner.logoHint}
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
