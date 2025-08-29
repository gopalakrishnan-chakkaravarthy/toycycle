'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/db';
import { partners, locations } from '@/db/schema';
import { eq } from 'drizzle-orm';
import { z } from 'zod';

const formActionState = z.object({
  message: z.string(),
  error: z.union([z.string(), z.record(z.array(z.string())), z.undefined()]).optional(),
});


// Zod Schemas for validation
const partnerSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  logoUrl: z.string().url('Must be a valid URL').optional().or(z.literal('')),
  logoHint: z.string().optional(),
});

const locationSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  address: z.string().min(1, 'Address is required'),
  hours: z.string().optional(),
});

// Partner Actions
export async function createPartner(prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = partnerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { 
        message: 'Validation failed',
        error: validatedFields.error.flatten().fieldErrors 
    };
  }

  try {
    await db.insert(partners).values(validatedFields.data);
    revalidatePath('/admin');
    revalidatePath('/partners');
    return { message: 'Partner created successfully.' };
  } catch (error) {
    return { message: 'Failed to create partner.', error: 'Failed to create partner.' };
  }
}

export async function updatePartner(id: number, prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = partnerSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { 
        message: 'Validation failed',
        error: validatedFields.error.flatten().fieldErrors 
    };
  }
  
  try {
    await db.update(partners).set(validatedFields.data).where(eq(partners.id, id));
    revalidatePath('/admin');
    revalidatePath('/partners');
    return { message: 'Partner updated successfully.' };
  } catch (error) {
    return { message: 'Failed to update partner.', error: 'Failed to update partner.' };
  }
}

export async function deletePartner(id: number) {
  try {
    await db.delete(partners).where(eq(partners.id, id));
    revalidatePath('/admin');
    revalidatePath('/partners');
    return { message: 'Partner deleted successfully.' };
  } catch (error) {
    return { error: 'Failed to delete partner.' };
  }
}


// Location Actions
export async function createLocation(prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = locationSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { 
        message: 'Validation failed',
        error: validatedFields.error.flatten().fieldErrors 
    };
  }

  try {
    await db.insert(locations).values(validatedFields.data);
    revalidatePath('/admin');
    revalidatePath('/locations');
    return { message: 'Location created successfully.' };
  } catch (error) {
    return { message: 'Failed to create location.', error: 'Failed to create location.' };
  }
}

export async function updateLocation(id: number, prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = locationSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
     return { 
        message: 'Validation failed',
        error: validatedFields.error.flatten().fieldErrors 
    };
  }

  try {
    await db.update(locations).set(validatedFields.data).where(eq(locations.id, id));
    revalidatePath('/admin');
    revalidatePath('/locations');
    return { message: 'Location updated successfully.' };
  } catch (error) {
    return { message: 'Failed to update location.', error: 'Failed to update location.' };
  }
}

export async function deleteLocation(id: number) {
  try {
    await db.delete(locations).where(eq(locations.id, id));
    revalidatePath('/admin');
    revalidatePath('/locations');
    return { message: 'Location deleted successfully.' };
  } catch (error) {
    return { error: 'Failed to delete location.' };
  }
}
