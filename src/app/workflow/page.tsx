
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { getAllPickups } from './actions';
import { WorkflowTimeline } from './_components/workflow-timeline';

export default async function WorkflowPage() {
    const pickups = await getAllPickups();

    return (
        <AppLayout>
            <div className="flex flex-col gap-8 animate-fade-in">
                <header className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Donation Workflow</h1>
                    <p className="text-muted-foreground">Track all scheduled pickups from start to finish.</p>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Pickup History</CardTitle>
                        <CardDescription>A complete timeline of all donation pickups.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <WorkflowTimeline pickups={pickups} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}

