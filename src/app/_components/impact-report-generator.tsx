
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
import { Loader2, Zap } from 'lucide-react';
import { useUser } from '@clerk/nextjs';

interface ImpactReportGeneratorProps {
    stats: {
        toysRedistributed: number;
        environmentalImpact: string;
        smilesCreated: number;
        userDonations: number;
    };
    isUser: boolean;
}

export function ImpactReportGenerator({ stats, isUser }: ImpactReportGeneratorProps) {
  const { user } = useUser();
  const [report, setReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

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
      userDonations: isUser ? stats.userDonations : undefined,
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
  );
}
