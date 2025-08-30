
import { AppLayout } from '@/components/layout/app-layout';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Campaign } from '@/db/schema';
import { CampaignList } from './_components/campaign-list';

async function getCampaignData() {
    if (!process.env.POSTGRES_URL) {
         return { campaigns: [] };
    }
    try {
        const { db } = await import('@/db');
        const campaigns = await db.query.campaigns.findMany({
          orderBy: (campaigns, { desc }) => [desc(campaigns.endDate)],
        });
        return { campaigns };
    } catch (error) {
        console.error("Failed to fetch campaign data:", error);
        return { campaigns: [] };
    }
}


export default async function CampaignsPage() {
    const { campaigns } = await getCampaignData();
    
    return (
        <AppLayout>
            <div className="flex flex-col gap-8 animate-fade-in">
                <header className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Campaign Management</h1>
                    <p className="text-muted-foreground">Create, manage, and track your social media campaigns.</p>
                </header>

                <Card>
                    <CardHeader>
                        <CardTitle>Manage Campaigns</CardTitle>
                        <CardDescription>Add, edit, or remove social media campaigns.</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <CampaignList campaigns={campaigns as Campaign[]} />
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
