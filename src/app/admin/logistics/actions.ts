
'use server';

import { db } from '@/db';
import { inventory, logisticsStatusEnum } from '@/db/schema';
import { eq, isNotNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';

export async function getRedistributedInventory() {
    if (!process.env.POSTGRES_URL) {
        return [];
    }

    try {
        const redistributedInventory = await db.query.inventory.findMany({
            where: and(
                eq(inventory.status, 'redistributed'),
                isNotNull(inventory.redistributedToPartnerId)
            ),
            with: {
                partner: true,
            },
            orderBy: (inventory, { desc }) => [desc(inventory.receivedAt)],
        });
        
        // @ts-ignore
        return redistributedInventory;
    } catch (error) {
        console.error("Failed to fetch redistributed inventory:", error);
        return [];
    }
}


export async function requestRecollection(itemId: number) {
    if (!process.env.POSTGRES_URL) {
        return { error: 'Database not configured.' };
    }
    
    try {
        await db.update(inventory)
            .set({ logisticsStatus: 'recollection_requested' })
            .where(eq(inventory.id, itemId));
        
        revalidatePath('/admin/logistics');
        // Here you would typically trigger an email or notification to the partner
        console.log(`Recollection requested for item ${itemId}`);
        return { message: 'Recollection has been requested.' };
    } catch (error) {
        console.error("Failed to request recollection:", error);
        return { error: 'Failed to request recollection.' };
    }
}
