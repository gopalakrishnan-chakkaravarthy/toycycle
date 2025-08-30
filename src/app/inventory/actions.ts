
'use server';

import { db } from '@/db';
import { inventory, locations } from '@/db/schema';
import { count, eq, isNotNull } from 'drizzle-orm';


export async function getInventoryCountsByStatus() {
    if (!process.env.POSTGRES_URL) {
        return [
            { status: 'received', count: 25 },
            { status: 'sanitizing', count: 10 },
            { status: 'listed', count: 50 },
            { status: 'redistributed', count: 12543 }
        ]
    }
    try {
        const result = await db
            .select({
                status: inventory.status,
                count: count(inventory.id),
            })
            .from(inventory)
            .groupBy(inventory.status);
        return result;
    } catch (error) {
        console.error("Failed to fetch inventory counts:", error);
        return [];
    }
}

export async function getDonationsByLocation(): Promise<{ name: string, count: number }[]> {
     if (!process.env.POSTGRES_URL) {
        return [
            { name: 'Northwood Center', count: 15 },
            { name: 'Southside Library', count: 28 },
            { name: 'Greenleaf Park', count: 8 },
            { name: 'Downtown Hub', count: 42 },
        ]
    }
    try {
        const result = await db
            .select({
                name: locations.name,
                count: count(inventory.id)
            })
            .from(inventory)
            .leftJoin(locations, eq(inventory.locationId, locations.id))
            .where(isNotNull(inventory.locationId))
            .groupBy(locations.name)
            
        return result.map(r => ({ name: r.name!, count: r.count }));

    } catch (error) {
        console.error("Failed to fetch donations by location:", error);
        return [];
    }
}
