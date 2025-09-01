'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface DonationsChartProps {
    data: { name: string; count: number }[];
}

export function DonationsChart({ data }: DonationsChartProps) {
    return (
        <div className="h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
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
    );
}
