
'use server';

import { z } from 'zod';
import sgMail from '@sendgrid/mail';
import { format } from 'date-fns';
import { db } from '@/db';
import { AccessoryType, Location, Partner, Pickup, ToyCondition, pickups, pickupStatusEnum } from '@/db/schema';
import { and, eq } from 'drizzle-orm';
import type { User } from '@/lib/auth';
import { revalidatePath } from 'next/cache';
import { getCurrentUser } from '@/lib/actions/auth';

const schedulePickupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  pickupType: z.enum(['my-address', 'drop-off', 'partner']),
  address: z.string().optional(),
  locationId: z.string().optional(),
  partnerId: z.string().optional(),
  pickupDate: z.date({
    required_error: 'A pickup date is required.',
  }),
  timeSlot: z.string().min(1, 'Please select a time slot.'),
  toyConditionId: z.string().min(1, 'Please select a toy condition.'),
  accessoryTypeId: z.string().min(1, 'Please select an accessory type.'),
  notes: z.string().optional(),
  collectionCost: z.number().optional(),
}).refine(data => {
    if (data.pickupType === 'my-address') return !!data.address && data.address.length >= 10;
    return true;
}, {
    message: 'Please enter a valid address.',
    path: ['address'],
}).refine(data => {
    if (data.pickupType === 'drop-off') return !!data.locationId;
    return true;
}, {
    message: 'Please select a drop-off location.',
    path: ['locationId'],
}).refine(data => {
    if (data.pickupType === 'partner') return !!data.partnerId;
    return true;
}, {
    message: 'Please select a partner.',
    path: ['partnerId'],
});

export type SchedulePickupResult = {
    success: boolean;
    message: string;
}

const mockToyConditions = [
    { id: 1, name: 'New' },
    { id: 2, name: 'Gently Used' },
    { id: 3, name: 'Play-worn' },
];

const mockAccessoryTypes = [
    { id: 1, name: 'Stroller' },
    { id: 2, name: 'Car Seat' },
    { id: 3, name: 'High Chair' },
];

const mockLocations = [
  { id: 1, name: "Northwood Community Center", address: "4500 Northwood Ave", hours: "" },
  { id: 2, name: "Southside Public Library", address: "876 Library Ln", hours: "" },
];

const mockPartners = [
  { id: 1, name: "Children's Joy Foundation", description: "", logoUrl: "", logoHint: "" },
  { id: 2, name: "Northwood School District", description: "", logoUrl: "", logoHint: "" },
];

export async function getScheduleData() {
    if (!process.env.POSTGRES_URL) {
        return {
            toyConditions: mockToyConditions as ToyCondition[],
            accessoryTypes: mockAccessoryTypes as AccessoryType[],
            locations: mockLocations as Location[],
            partners: mockPartners as Partner[],
        };
    }
    try {
        const toyConditions = await db.query.toyConditions.findMany();
        const accessoryTypes = await db.query.accessoryTypes.findMany();
        const locations = await db.query.locations.findMany();
        const partners = await db.query.partners.findMany();

        return { 
            toyConditions: toyConditions.length > 0 ? toyConditions : mockToyConditions, 
            accessoryTypes: accessoryTypes.length > 0 ? accessoryTypes : mockAccessoryTypes,
            locations: locations.length > 0 ? locations : mockLocations,
            partners: partners.length > 0 ? partners: mockPartners
        };
    } catch (error) {
        console.error("Failed to fetch schedule data:", error);
        return { 
            toyConditions: mockToyConditions as ToyCondition[], 
            accessoryTypes: mockAccessoryTypes as AccessoryType[],
            locations: mockLocations as Location[],
            partners: mockPartners as Partner[]
        };
    }
}

export async function getScheduledDays() {
    if (!process.env.POSTGRES_URL) {
        return [];
    }
    try {
        const result = await db.selectDistinct({ date: pickups.pickupDate }).from(pickups);
        return result.map(r => new Date(r.date));
    } catch (error) {
        console.error("Failed to fetch scheduled days:", error);
        return [];
    }
}

export type DetailedPickup = Pickup & {
  location: Location | null;
  partner: Partner | null;
}

export async function getPickupsForDate(user: User | null, date: Date | undefined): Promise<DetailedPickup[]> {
    if (!user || !date || !process.env.POSTGRES_URL) {
        return [];
    }
     try {
        const whereClause = user.role === 'admin' 
            ? eq(pickups.pickupDate, format(date, 'yyyy-MM-dd'))
            : and(
                eq(pickups.pickupDate, format(date, 'yyyy-MM-dd')),
                eq(pickups.email, user.email)
            );

        const result = await db.query.pickups.findMany({
            where: whereClause,
            with: {
                location: true,
                partner: true,
            },
            orderBy: (pickups, { asc }) => [asc(pickups.timeSlot)],
        });
        return result;
    } catch (error) {
        console.error("Failed to fetch pickups for date:", error);
        return [];
    }
}

export async function updatePickupStatus(pickupId: number, status: 'scheduled' | 'completed' | 'cancelled') {
    const user = await getCurrentUser();
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
        const updatedPickups = await db.update(pickups)
            .set({ status })
            .where(eq(pickups.id, pickupId))
            .returning();
        
        const pickup = updatedPickups[0];

        if (status === 'completed' && pickup) {
             if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
                sgMail.setApiKey(process.env.SENDGRID_API_KEY);
                const msg = {
                    to: pickup.email,
                    from: process.env.SENDGRID_FROM_EMAIL,
                    subject: 'Your ToyCycle Pickup is Complete!',
                    html: `
                        <h1>Thank you, ${pickup.name}!</h1>
                        <p>We're writing to let you know that your toy donation pickup has been successfully completed.</p>
                        <p>Your generosity is already on its way to making a difference. The toys you've donated will soon be cleaned, sorted, and sent to children who will cherish them.</p>
                        <p>You can track the journey of your donation on your "My Donations" page.</p>
                        <p>Thank you for being a vital part of the ToyCycle community!</p>
                        <p>- The ToyCycle Team</p>
                    `,
                };
                await sgMail.send(msg);
            }
        }

        revalidatePath('/schedule');
        revalidatePath('/workflow');
        return { message: `Pickup status updated to ${status}.` };

    } catch (error) {
        console.error('Failed to update pickup status:', error);
        return { error: 'Failed to update pickup status.' };
    }
}

export async function deletePickup(pickupId: number) {
  const user = await getCurrentUser();
  if (!user) {
    return { error: 'You must be signed in to delete a pickup.' };
  }

  if (!process.env.POSTGRES_URL) {
    return { error: 'Database not configured.' };
  }

  try {
    const pickupToDelete = await db.query.pickups.findFirst({
      where: eq(pickups.id, pickupId),
    });

    if (!pickupToDelete) {
      return { error: 'Pickup not found.' };
    }

    // Admins can delete any pickup, users can only delete their own
    if (user.role !== 'admin' && pickupToDelete.email !== user.email) {
      return { error: 'You are not authorized to delete this pickup.' };
    }

    await db.delete(pickups).where(eq(pickups.id, pickupId));

    revalidatePath('/schedule');
    revalidatePath('/workflow');
    return { message: 'Pickup successfully deleted.' };
  } catch (error) {
    console.error('Failed to delete pickup:', error);
    return { error: 'Failed to delete pickup.' };
  }
}


export async function schedulePickup(validatedData: z.infer<typeof schedulePickupSchema>): Promise<SchedulePickupResult> {
  // Save to database if configured
  if (process.env.POSTGRES_URL) {
    try {
        const {
            name,
            email,
            pickupType,
            address,
            locationId,
            partnerId,
            pickupDate,
            timeSlot,
            toyConditionId,
            accessoryTypeId,
            notes,
            collectionCost
        } = validatedData;
        
        const cost: number | null = (collectionCost && !isNaN(collectionCost)) ? collectionCost : null;
       
        const dataToInsert = {
            name,
            email,
            pickupType,
            address: address || null,
            locationId: locationId ? parseInt(locationId) : null,
            partnerId: partnerId ? parseInt(partnerId) : null,
            pickupDate: format(new Date(pickupDate), 'yyyy-MM-dd'),
            timeSlot,
            toyConditionId: parseInt(toyConditionId),
            accessoryTypeId: parseInt(accessoryTypeId),
            notes: notes || null,
            collectionCost: cost,
        };

        await db.insert(pickups).values(dataToInsert);
    } catch (dbError) {
        console.error("Database Error:", dbError);
        return {
            success: false,
            message: 'Could not save the appointment to the database. Please try again later.',
        };
    }
  }

  // Send confirmation email if configured
  if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const { name, email, pickupDate, timeSlot, notes, pickupType, address, locationId, partnerId } = validatedData;
    
    let pickupLocationDetails = '';

    if (pickupType === 'my-address') {
      pickupLocationDetails = `<li><strong>Address:</strong> ${address}</li>`;
    } else if (pickupType === 'drop-off' && locationId && process.env.POSTGRES_URL) {
      const location = await db.query.locations.findFirst({ where: (l, {eq}) => eq(l.id, parseInt(locationId)) });
      pickupLocationDetails = `<li><strong>Drop-off Location:</strong> ${location?.name} - ${location?.address}</li>`;
    } else if (pickupType === 'partner' && partnerId && process.env.POSTGRES_URL) {
      const partner = await db.query.partners.findFirst({ where: (p, {eq}) => eq(p.id, parseInt(partnerId)) });
      pickupLocationDetails = `<li><strong>Partner Location:</strong> ${partner?.name}</li>`;
    }
    
    const formattedDate = format(new Date(pickupDate), 'PPPP');

    const msg = {
      to: email,
      from: process.env.SENDGRID_FROM_EMAIL,
      subject: 'Your ToyCycle Pickup is Scheduled!',
      html: `
        <h1>Thank you for your donation, ${name}!</h1>
        <p>Your pickup has been successfully scheduled.</p>
        <h2>Pickup Details:</h2>
        <ul>
          <li><strong>Date:</strong> ${formattedDate}</li>
          <li><strong>Time Slot:</strong> ${timeSlot}</li>
          ${pickupLocationDetails}
          ${notes ? `<li><strong>Notes:</strong> ${notes}</li>` : ''}
        </ul>
        <p>Our team will see you then. Thanks for helping us turn unused toys into smiles!</p>
        <p>- The ToyCycle Team</p>
      `,
    };

    try {
      await sgMail.send(msg);
      return { success: true, message: 'Pickup scheduled and email sent successfully.' };
    } catch (error) {
      console.error('SendGrid Error:', error);
      return { success: true, message: 'Pickup scheduled, but failed to send confirmation email.' };
    }
  }

  // Fallback if SendGrid is not configured
  return { success: true, message: 'Pickup scheduled successfully.' };
}
