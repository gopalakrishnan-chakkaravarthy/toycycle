
'use client';

import { AppLayout } from '@/components/layout/app-layout';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { BarChart, Users, Package } from 'lucide-react';

export default function AdminPage() {
    const { user, isAuthenticated, isLoading } = useAuth();
    const router = useRouter();

    useEffect(() => {
        if (!isLoading) {
            if (!isAuthenticated || user?.role !== 'admin') {
                router.replace('/');
            }
        }
    }, [user, isAuthenticated, isLoading, router]);


    if (isLoading || !isAuthenticated || user?.role !== 'admin') {
        return (
            <AppLayout>
                <div className="flex justify-center items-center h-full">
                    <p>Loading or unauthorized...</p>
                </div>
            </AppLayout>
        );
    }

    return (
        <AppLayout>
            <div className="flex flex-col gap-8 animate-fade-in">
                <header className="space-y-2">
                    <h1 className="text-3xl font-bold tracking-tight font-headline">Admin Dashboard</h1>
                    <p className="text-muted-foreground">Overview of ToyCycle operations.</p>
                </header>

                 <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Total Donations</CardTitle>
                        <Package className="h-5 w-5 text-primary" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-3xl font-bold">1,204</div>
                        <p className="text-xs text-muted-foreground">+15% from last month</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Active Users</CardTitle>
                        <Users className="h-5 w-5 text-primary" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-3xl font-bold">342</div>
                        <p className="text-xs text-muted-foreground">+50 since last week</p>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Redistribution Rate</CardTitle>
                        <BarChart className="h-5 w-5 text-primary" />
                        </CardHeader>
                        <CardContent>
                        <div className="text-3xl font-bold">85%</div>
                        <p className="text-xs text-muted-foreground">Of all donations find a new home</p>
                        </CardContent>
                    </Card>
                </div>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                        <CardDescription>Monitor recent donations and pickups.</CardDescription>
                    </CardHeader>
                    <CardContent>
                       <p className="text-muted-foreground">Activity feed coming soon...</p>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
