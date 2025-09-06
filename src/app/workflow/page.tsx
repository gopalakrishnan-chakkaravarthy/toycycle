
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAllPickups, getFilterData } from './actions';
import { WorkflowFilters } from './_components/workflow-filters';
import { WorkflowView } from './_components/workflow-view';
import { ReadonlyURLSearchParams } from 'next/navigation';

export default async function WorkflowPage({ searchParams }: { searchParams: ReadonlyURLSearchParams}) {
    const [filterData, initialPickups] = await Promise.all([
        getFilterData(),
        getAllPickups(searchParams)
    ]);

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
                
                <WorkflowView initialPickups={initialPickups} />
            </div>
        </AppLayout>
    );
}
