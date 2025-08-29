
'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Truck, Sparkles, Warehouse, Gift, PackageCheck } from 'lucide-react';

interface InventoryJourneyProps {
    counts: { status: string; count: number }[];
}

const journeySteps = [
    { status: 'received', title: 'Collected', icon: <Truck className="h-6 w-6 text-primary" /> },
    { status: 'sanitizing', title: 'Sanitizing', icon: <Sparkles className="h-6 w-6 text-primary" /> },
    { status: 'listed', title: 'In Warehouse', icon: <Warehouse className="h-6 w-6 text-primary" /> },
    { status: 'redistributed', title: 'Redistributed', icon: <PackageCheck className="h-6 w-6 text-primary" /> },
];

export function InventoryJourney({ counts }: InventoryJourneyProps) {
    const countsMap = new Map(counts.map(c => [c.status, c.count]));

    return (
        <section>
            <div className="text-left mb-4">
                <h2 className="text-2xl font-bold tracking-tight font-headline">Toy Journey at a Glance</h2>
                <p className="text-muted-foreground">Live status of toys in our system.</p>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {journeySteps.map(step => (
                    <Card key={step.status} className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">{step.title}</CardTitle>
                            {step.icon}
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">
                                {(countsMap.get(step.status) ?? 0).toLocaleString()}
                            </div>
                             <p className="text-xs text-muted-foreground">items currently in this stage</p>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </section>
    );
}
