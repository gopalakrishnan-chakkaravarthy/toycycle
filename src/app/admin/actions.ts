'use server';

import { revalidatePath } from 'next/cache';
import { partners, locations, accessoryTypes, toyConditions, campaigns } from '@/db/schema';
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

const accessoryTypeSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

const toyConditionSchema = z.object({
  name: z.string().min(1, 'Name is required'),
});

const campaignSchema = z.object({
  name: z.string().min(1, 'Name is required'),
  description: z.string().optional(),
  endDate: z.string().min(1, 'End date is required'),
});


async function getDb() {
    if (!process.env.POSTGRES_URL) {
        throw new Error("Database not configured. POSTGRES_URL is missing.");
    }
    const { db } = await import('@/db');
    return db;
}


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
    const db = await getDb();
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
    const db = await getDb();
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
    const db = await getDb();
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
    const db = await getDb();
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
    const db = await getDb();
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
    const db = await getDb();
    await db.delete(locations).where(eq(locations.id, id));
    revalidatePath('/admin');
    revalidatePath('/locations');
    return { message: 'Location deleted successfully.' };
  } catch (error) {
    return { error: 'Failed to delete location.' };
  }
}

// Accessory Type Actions
export async function createAccessoryType(prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = accessoryTypeSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { 
        message: 'Validation failed',
        error: validatedFields.error.flatten().fieldErrors 
    };
  }

  try {
    const db = await getDb();
    await db.insert(accessoryTypes).values(validatedFields.data);
    revalidatePath('/admin');
    return { message: 'Accessory type created successfully.' };
  } catch (error) {
    return { message: 'Failed to create accessory type.', error: 'Failed to create accessory type.' };
  }
}

export async function updateAccessoryType(id: number, prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = accessoryTypeSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
     return { 
        message: 'Validation failed',
        error: validatedFields.error.flatten().fieldErrors 
    };
  }

  try {
    const db = await getDb();
    await db.update(accessoryTypes).set(validatedFields.data).where(eq(accessoryTypes.id, id));
    revalidatePath('/admin');
    return { message: 'Accessory type updated successfully.' };
  } catch (error) {
    return { message: 'Failed to update accessory type.', error: 'Failed to update accessory type.' };
  }
}

export async function deleteAccessoryType(id: number) {
  try {
    const db = await getDb();
    await db.delete(accessoryTypes).where(eq(accessoryTypes.id, id));
    revalidatePath('/admin');
    return { message: 'Accessory type deleted successfully.' };
  } catch (error) {
    return { error: 'Failed to delete accessory type.' };
  }
}

// Toy Condition Actions
export async function createToyCondition(prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = toyConditionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Validation failed',
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const db = await getDb();
    await db.insert(toyConditions).values(validatedFields.data);
    revalidatePath('/admin');
    return { message: 'Toy condition created successfully.' };
  } catch (error) {
    return { message: 'Failed to create toy condition.', error: 'Failed to create toy condition.' };
  }
}

export async function updateToyCondition(id: number, prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = toyConditionSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return {
      message: 'Validation failed',
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  try {
    const db = await getDb();
    await db.update(toyConditions).set(validatedFields.data).where(eq(toyConditions.id, id));
    revalidatePath('/admin');
    return { message: 'Toy condition updated successfully.' };
  } catch (error) {
    return { message: 'Failed to update toy condition.', error: 'Failed to update toy condition.' };
  }
}

export async function deleteToyCondition(id: number) {
  try {
    const db = await getDb();
    await db.delete(toyConditions).where(eq(toyConditions.id, id));
    revalidatePath('/admin');
    return { message: 'Toy condition deleted successfully.' };
  } catch (error) {
    return { error: 'Failed to delete toy condition.' };
  }
}

// Campaign Actions
export async function createCampaign(prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = campaignSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
    return { 
        message: 'Validation failed',
        error: validatedFields.error.flatten().fieldErrors 
    };
  }

  try {
    const db = await getDb();
    await db.insert(campaigns).values({
      ...validatedFields.data,
      endDate: new Date(validatedFields.data.endDate),
    });
    revalidatePath('/admin/campaigns');
    return { message: 'Campaign created successfully.' };
  } catch (error) {
    return { message: 'Failed to create campaign.', error: 'Failed to create campaign.' };
  }
}

export async function updateCampaign(id: number, prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = campaignSchema.safeParse(Object.fromEntries(formData.entries()));

  if (!validatedFields.success) {
     return { 
        message: 'Validation failed',
        error: validatedFields.error.flatten().fieldErrors 
    };
  }
  
  try {
    const db = await getDb();
    await db.update(campaigns).set({
      ...validatedFields.data,
      endDate: new Date(validatedFields.data.endDate),
    }).where(eq(campaigns.id, id));
    revalidatePath('/admin/campaigns');
    return { message: 'Campaign updated successfully.' };
  } catch (error) {
    return { message: 'Failed to update campaign.', error: 'Failed to update campaign.' };
  }
}

export async function deleteCampaign(id: number) {
  try {
    const db = await getDb();
    await db.delete(campaigns).where(eq(campaigns.id, id));
    revalidatePath('/admin/campaigns');
    return { message: 'Campaign deleted successfully.' };
  } catch (error) {
    return { error: 'Failed to delete campaign.' };
  }
}
