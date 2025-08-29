
'use server';

import { db } from '@/db';
import { inventory } from '@/db/schema';
import { count, eq } from 'drizzle-orm';


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
