
'use server';

import { db } from '@/db';
import { Location, Partner, Pickup } from '@/db/schema';
import { desc } from 'drizzle-orm';


export type DetailedPickup = Pickup & {
  location: Location | null;
  partner: Partner | null;
}

export async function getAllPickups(): Promise<DetailedPickup[]> {
    if (!process.env.POSTGRES_URL) {
        return [];
    }
     try {
        const result = await db.query.pickups.findMany({
            with: {
                location: true,
                partner: true,
            },
            orderBy: [desc(pickups.pickupDate)],
        });
        return result as DetailedPickup[];
    } catch (error) {
        console.error("Failed to fetch pickups:", error);
        return [];
    }
}
