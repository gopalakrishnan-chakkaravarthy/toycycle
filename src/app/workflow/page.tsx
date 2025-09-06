
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAllPickups, getFilterData } from './actions';
import { WorkflowTimeline } from './_components/workflow-timeline';
import { useSearchParams } from 'next/navigation';
import { useEffect, useState, useTransition } from 'react';
import { DetailedPickup } from './actions';
import { Loader2 } from 'lucide-react';
import { WorkflowFilters } from './_components/workflow-filters';
import type { Location, Partner } from '@/db/schema';


export default function WorkflowPage() {
    const searchParams = useSearchParams();
    const [pickups, setPickups] = useState<DetailedPickup[]>([]);
    const [filterData, setFilterData] = useState<{ partners: Partner[]; locations: Location[] }>({ partners: [], locations: [] });
    const [isPending, startTransition] = useTransition();
    
    useEffect(() => {
        async function loadData() {
            const data = await getFilterData();
            setFilterData(data);
        }
        loadData();
    }, []);

    useEffect(() => {
        startTransition(async () => {
            const fetchedPickups = await getAllPickups(searchParams);
            setPickups(fetchedPickups);
        });
    }, [searchParams]);

    return (
        <AppLayout>
            <div className="flex flex-col gap-8 animate-fade-in">
                <header className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Donation Workflow</h1>
                    <p className="text-muted-foreground">Track all scheduled pickups from start to finish. Filter by date, partner, or location.</p>
                </header>

                 <Card>
                    <CardHeader>
                        <CardTitle>Filter Pickups</CardTitle>
                        <CardDescription>Select criteria to narrow down the results in the timeline below.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <WorkflowFilters partners={filterData.partners} locations={filterData.locations} />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <div className="flex items-center gap-4">
                             <CardTitle>Pickup History</CardTitle>
                             {isPending && <Loader2 className="h-5 w-5 animate-spin" />}
                        </div>
                        <CardDescription>A timeline of donation pickups based on your filters.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       {isPending ? (
                           <div className="flex justify-center items-center h-64">
                                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                           </div>
                       ) : (
                           <WorkflowTimeline pickups={pickups} />
                       )}
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
