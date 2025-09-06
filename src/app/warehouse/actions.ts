'use server';

import { revalidatePath } from 'next/cache';
import { inventory } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const formActionState = z.object({
  message: z.string(),
  error: z.union([z.string(), z.record(z.array(z.string())), z.undefined()]).optional(),
});


const inventorySchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  conditionId: z.coerce.number().min(1, 'Please select a condition'),
  status: z.enum(['received', 'sanitizing', 'listed', 'redistributed']),
  imageUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  imageHint: z.string().optional(),
  redistributedToPartnerId: z.coerce.number().optional(),
});

async function getDb() {
    if (!process.env.POSTGRES_URL) {
        throw new Error("Database not configured. POSTGRES_URL is missing.");
    }
    const { db } = await import('@/db');
    return db;
}


export async function createInventoryItem(prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = inventorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { 
        message: 'Validation failed',
        error: validatedFields.error.flatten().fieldErrors 
    };
  }

  try {
    const db = await getDb();
    await db.insert(inventory).values(validatedFields.data);
    revalidatePath('/warehouse');
    return { message: 'Item created successfully.' };
  } catch (error) {
    console.error(error);
    return { message: 'Failed to create item.', error: 'Failed to create item.' };
  }
}

export async function updateInventoryItem(id: number, prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = inventorySchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { 
        message: 'Validation failed',
        error: validatedFields.error.flatten().fieldErrors 
    };
  }
  
  try {
    const db = await getDb();
    const dataToUpdate = { ...validatedFields.data };
    
    if(dataToUpdate.status === 'redistributed' && dataToUpdate.redistributedToPartnerId) {
        // @ts-ignore
        dataToUpdate.logisticsStatus = 'delivered';
    }


    await db.update(inventory).set(dataToUpdate).where(eq(inventory.id, id));
    revalidatePath('/warehouse');
    revalidatePath('/admin/logistics');
    return { message: 'Item updated successfully.' };
  } catch (error) {
     console.error(error);
    return { message: 'Failed to update item.', error: 'Failed to update item.' };
  }
}

export async function deleteInventoryItem(id: number) {
  try {
    const db = await getDb();
    await db.delete(inventory).where(eq(inventory.id, id));
    revalidatePath('/warehouse');
    return { message: 'Item deleted successfully.' };
  } catch (error) {
     console.error(error);
    return { error: 'Failed to delete item.' };
  }
}
