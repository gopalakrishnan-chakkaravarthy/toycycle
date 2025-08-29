'use client';

import { useState } from 'react';
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
import { Loader2, Zap, ToyBrick, Smile, Leaf } from 'lucide-react';
import { AppLayout } from '@/components/layout/app-layout';

const stats = {
  toysRedistributed: 12543,
  environmentalImpact: '15 tons of plastic waste diverted from landfills',
  smilesCreated: 10000,
  userDonations: 5,
};

export default function Home() {
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerateReport = async () => {
    setIsLoading(true);
    setError(null);
    setReport(null);

    const input: GenerateImpactReportInput = {
      userId: 'user-123', // Mock user ID
      ...stats,
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
      </div>
    </AppLayout>
  );
}
