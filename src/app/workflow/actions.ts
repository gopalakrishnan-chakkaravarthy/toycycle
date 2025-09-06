
'use server';

import { db } from '@/db';
import { Location, Partner, Pickup, pickups } from '@/db/schema';
import { and, desc, eq } from 'drizzle-orm';
import type { ReadonlyURLSearchParams } from 'next/navigation';


export type DetailedPickup = Pickup & {
  location: Location | null;
  partner: Partner | null;
}

export async function getFilterData() {
    if (!process.env.POSTGRES_URL) {
        return { partners: [], locations: [] };
    }
    try {
        const partners = await db.query.partners.findMany();
        const locations = await db.query.locations.findMany();
        return { partners, locations };
    } catch (error) {
        console.error("Failed to fetch filter data:", error);
        return { partners: [], locations: [] };
    }
}


export async function getAllPickups(searchParams: ReadonlyURLSearchParams): Promise<DetailedPickup[]> {
    if (!process.env.POSTGRES_URL) {
        return [];
    }

    const date = searchParams.get('date');
    const partnerId = searchParams.get('partnerId');
    const locationId = searchParams.get('locationId');
    
    const filters = [];
    if (date) {
        filters.push(eq(pickups.pickupDate, date));
    }
    if (partnerId) {
        filters.push(eq(pickups.partnerId, parseInt(partnerId)));
    }
    if (locationId) {
        filters.push(eq(pickups.locationId, parseInt(locationId)));
    }


     try {
        const result = await db.query.pickups.findMany({
            where: filters.length > 0 ? and(...filters) : undefined,
            with: {
                location: true,
                partner: true,
            },
            orderBy: [desc(pickups.pickupDate), desc(pickups.createdAt)],
        });
        return result as DetailedPickup[];
    } catch (error) {
        console.error("Failed to fetch pickups:", error);
        return [];
    }
}
