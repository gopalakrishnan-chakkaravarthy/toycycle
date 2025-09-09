
'use server';

import { db } from '@/db';
import { inventory, logisticsStatusEnum, ecommerceIntegrations } from '@/db/schema';
import { and, eq, isNotNull } from 'drizzle-orm';
import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import type { User } from '@/lib/auth';

const formActionState = z.object({
  message: z.string(),
  error: z.union([z.string(), z.record(z.array(z.string())), z.undefined()]).optional(),
});


const ecommerceIntegrationSchema = z.object({
  platform: z.string().min(1, 'Platform name is required'),
  apiKey: z.string().min(1, 'API Key is required'),
  apiSecret: z.string().optional(),
});

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


export async function requestRecollection(user: User | null, itemId: number) {
    if (!user) {
      return {error: "You must be logged in to perform this action."};
    }
    if (user.role !== 'admin') {
        return { error: 'You are not authorized to perform this action.' };
    }

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


// EcommerceIntegration Actions
export async function getEcommerceIntegrations() {
    if (!process.env.POSTGRES_URL) {
        return [];
    }
    try {
        return await db.query.ecommerceIntegrations.findMany();
    } catch (error) {
        console.error("Failed to fetch ecommerce integrations:", error);
        return [];
    }
}

export async function createEcommerceIntegration(prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = ecommerceIntegrationSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { 
        message: 'Validation failed',
        error: validatedFields.error.flatten().fieldErrors 
    };
  }

  try {
    await db.insert(ecommerceIntegrations).values(validatedFields.data);
    revalidatePath('/admin/logistics');
    return { message: 'Integration created successfully.' };
  } catch (error) {
    return { message: 'Failed to create integration.', error: 'Failed to create integration.' };
  }
}

export async function updateEcommerceIntegration(id: number, prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = ecommerceIntegrationSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
     return { 
        message: 'Validation failed',
        error: validatedFields.error.flatten().fieldErrors 
    };
  }

  try {
    await db.update(ecommerceIntegrations).set(validatedFields.data).where(eq(ecommerceIntegrations.id, id));
    revalidatePath('/admin/logistics');
    return { message: 'Integration updated successfully.' };
  } catch (error) {
    return { message: 'Failed to update integration.', error: 'Failed to update integration.' };
  }
}

export async function deleteEcommerceIntegration(id: number) {
  try {
    await db.delete(ecommerceIntegrations).where(eq(ecommerceIntegrations.id, id));
    revalidatePath('/admin/logistics');
    return { message: 'Integration deleted successfully.' };
  } catch (error) {
    return { error: 'Failed to delete integration.' };
  }
}
