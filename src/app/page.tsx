
'use client';

import { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { generateImpactReport } from '@/ai/flows/generate-impact-report';
import type { GenerateImpactReportInput } from '@/ai/flows/generate-impact-report';
import { Loader2, Zap, ToyBrick, Smile, Leaf, Truck, Sparkles, Warehouse, Wrench, Gift, MapPin } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';
import { useAuth } from '@/context/auth-context';
import { getInventoryCountsByStatus, getDonationsByLocation } from './inventory/actions';
import { InventoryJourney } from './inventory/_components/inventory-journey';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';


const stats = {
  toysRedistributed: 12543,
  environmentalImpact: '15 tons of plastic waste diverted from landfills',
  smilesCreated: 10000,
  userDonations: 5,
};

const workflowSteps = [
    {
        icon: <Truck className="h-10 w-10 text-primary" />,
        title: 'Collection',
        description: 'Toys are collected from generous donors through scheduled pickups and drop-off locations.'
    },
    {
        icon: <Sparkles className="h-10 w-10 text-primary" />,
        title: 'Sanitization',
        description: 'Every toy is thoroughly cleaned and sanitized to ensure it is safe and hygienic for the next child.'
    },
    {
        icon: <Warehouse className="h-10 w-10 text-primary" />,
        title: 'Warehouse',
        description: 'Cleaned toys are sorted and cataloged in our warehouse, ready for the next step.'
    },
    {
        icon: <Wrench className="h-10 w-10 text-primary" />,
        title: 'Refurbishing',
        description: 'Our team lovingly repairs and refurbishes toys that need a little extra care.'
    },
    {
        icon: <Gift className="h-10 w-10 text-primary" />,
        title: 'Ready for Reuse',
        description: 'Toys are redistributed to our partner organizations to bring joy to new families.'
    }
]

export default function Home() {
  const { user } = useAuth();
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [inventoryCounts, setInventoryCounts] = useState<{ status: string, count: number }[]>([]);
  const [donationsByLocation, setDonationsByLocation] = useState<{ name: string, count: number }[]>([]);

  useEffect(() => {
    async function fetchDashboardData() {
        try {
            const counts = await getInventoryCountsByStatus();
            setInventoryCounts(counts);
            const locationDonations = await getDonationsByLocation();
            setDonationsByLocation(locationDonations);
        } catch (err) {
            console.error("Failed to fetch dashboard data", err);
        }
    }
    if (user?.role === 'admin') {
        fetchDashboardData();
    }
  }, [user]);


  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);
    setReport(null);

    if (!user) {
        setError('You must be logged in to generate a report.');
        setIsLoading(false);
        return;
    }

    const input: GenerateImpactReportInput = {
      userId: user.id,
      ...stats,
      userDonations: user.role === 'user' ? stats.userDonations : undefined,
    };

    try {
      const result = await generateImpactReport(input);
      setReport(result.impactReport);
    } catch (e) {
      setError('Failed to generate report. Please try again later.');
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AppLayout>
      <div className="flex flex-col gap-8 animate-fade-in">
        <header className="space-y-2">
          <h1 className="text-3xl font-bold tracking-tight font-headline">Your Impact at a Glance</h1>
          <p className="text-muted-foreground">See the difference we're making together.</p>
        </header>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Toys Redistributed</CardTitle>
              <ToyBrick className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.toysRedistributed.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">and counting...</p>
            </CardContent>
          </Card>
          <Card className="transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Smiles Created</CardTitle>
              <Smile className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">~{stats.smilesCreated.toLocaleString()}</div>
              <p className="text-xs text-muted-foreground">Joy delivered to children</p>
            </CardContent>
          </Card>
          <Card className="md:col-span-2 lg:col-span-1 transform transition-transform duration-300 hover:scale-105 hover:shadow-xl">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Environmental Impact</CardTitle>
              <Leaf className="h-5 w-5 text-primary" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">{stats.environmentalImpact.split(' ')[0]} tons</div>
              <p className="text-xs text-muted-foreground">of plastic waste diverted</p>
            </CardContent>
          </Card>
        </div>

        {user?.role === 'admin' && inventoryCounts.length > 0 && (
          <InventoryJourney counts={inventoryCounts} />
        )}
        
        {user?.role === 'admin' && donationsByLocation.length > 0 && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <MapPin className="text-primary"/>
                Donations by Location
              </CardTitle>
              <CardDescription>Toys collected from each community drop-off point.</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={donationsByLocation} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} interval={0} />
                    <YAxis allowDecimals={false} />
                    <Tooltip
                      cursor={{ fill: 'hsl(var(--muted))' }}
                      contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
                    />
                    <Bar dataKey="count" fill="hsl(var(--primary))" name="Toys Collected" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        )}


        <Card className="bg-card/80 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Zap className="text-primary"/>
              Personalized Impact Report
            </CardTitle>
            <CardDescription>Get a unique summary of your contribution, powered by AI.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 min-h-[120px] flex items-center justify-center">
            {isLoading ? (
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            ) : error ? (
                <p className="text-destructive text-center">{error}</p>
            ) : report ? (
              <blockquote className="rounded-lg border-l-4 border-primary bg-muted/50 p-4 text-base italic text-foreground">
                "{report}"
              </blockquote>
            ) : (
              <div className="text-center text-muted-foreground p-4">Click the button to generate your report!</div>
            )}
          </CardContent>
          <CardFooter>
             <Button onClick={handleGenerateReport} disabled={isLoading} className="w-full sm:w-auto transition-all hover:shadow-lg hover:scale-105">
                {isLoading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Zap className="mr-2 h-4 w-4" />}
                Generate My Report
            </Button>
          </CardFooter>
        </Card>

        <section className="space-y-6">
             <div className="text-center">
                <h2 className="text-2xl font-bold tracking-tight font-headline">How It Works</h2>
                <p className="text-muted-foreground">The journey of a toy from one child to the next.</p>
            </div>
             <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-5">
                {workflowSteps.map((step, index) => (
                    <Card key={index} className="text-center flex flex-col items-center p-6 transform transition-transform duration-300 hover:-translate-y-2 hover:shadow-2xl">
                       <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10 mb-4">
                           {step.icon}
                       </div>
                       <h3 className="text-lg font-semibold">{step.title}</h3>
                       <p className="text-sm text-muted-foreground mt-2 flex-grow">{step.description}</p>
                    </Card>
                ))}
            </div>
        </section>
      </div>
    </AppLayout>
  );
}
