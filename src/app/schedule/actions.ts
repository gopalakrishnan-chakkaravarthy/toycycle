
'use server';

import { z } from 'zod';
import sgMail from '@sendgrid/mail';
import { format, startOfDay } from 'date-fns';
import { db } from '@/db';
import { AccessoryType, Location, Partner, Pickup, ToyCondition, pickups } from '@/db/schema';
import { eq } from 'drizzle-orm';

const schedulePickupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  pickupType: z.enum(['my-address', 'drop-off', 'partner']),
  address: z.string().optional(),
  locationId: z.string().optional(),
  partnerId: z.string().optional(),
  pickupDate: z.string().min(1, "A pickup date is required."),
  timeSlot: z.string().min(1, 'Please select a time slot.'),
  toyConditionId: z.string().min(1, 'Please select a toy condition.'),
  accessoryTypeId: z.string().min(1, 'Please select an accessory type.'),
  notes: z.string().optional(),
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


const formActionState = z.object({
  message: z.string(),
  error: z.union([z.string(), z.record(z.array(z.string())), z.undefined()]).optional(),
});

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

export async function getPickupsForDate(date: Date): Promise<DetailedPickup[]> {
    if (!process.env.POSTGRES_URL) {
        // @ts-ignore
        return [];
    }
     try {
        const result = await db.query.pickups.findMany({
            where: eq(pickups.pickupDate, format(date, 'yyyy-MM-dd')),
            with: {
                location: true,
                partner: true,
            },
            orderBy: (pickups, { asc }) => [asc(pickups.timeSlot)],
        });
        return result as DetailedPickup[];
    } catch (error) {
        console.error("Failed to fetch pickups for date:", error);
        return [];
    }
}


export async function schedulePickup(prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = schedulePickupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    pickupType: formData.get('pickupType'),
    address: formData.get('address'),
    locationId: formData.get('locationId'),
    partnerId: formData.get('partnerId'),
    pickupDate: formData.get('pickupDate'),
    timeSlot: formData.get('timeSlot'),
    toyConditionId: formData.get('toyConditionId'),
    accessoryTypeId: formData.get('accessoryTypeId'),
    notes: formData.get('notes'),
  });

  if (!validatedFields.success) {
    console.log(validatedFields.error.flatten().fieldErrors);
    return {
      message: 'Validation failed',
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  // Save to database if configured
  if (process.env.POSTGRES_URL) {
    try {
        await db.insert(pickups).values({
            ...validatedFields.data,
            pickupDate: startOfDay(new Date(validatedFields.data.pickupDate)),
            locationId: validatedFields.data.locationId ? parseInt(validatedFields.data.locationId) : null,
            partnerId: validatedFields.data.partnerId ? parseInt(validatedFields.data.partnerId) : null,
            toyConditionId: parseInt(validatedFields.data.toyConditionId),
            accessoryTypeId: parseInt(validatedFields.data.accessoryTypeId),
        });
    } catch (dbError) {
        console.error("Database Error:", dbError);
        return {
            message: 'Failed to schedule pickup.',
            error: 'Could not save the appointment to the database. Please try again later.',
        };
    }
  }


  // Send confirmation email if configured
  if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const { name, email, pickupDate, timeSlot, notes, pickupType, address, locationId, partnerId } = validatedFields.data;
    
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
      return { message: 'Pickup scheduled and email sent successfully.' };
    } catch (error) {
      console.error('SendGrid Error:', error);
      // If the email fails, we still want to inform the user that the pickup was scheduled.
      // In a real application, you might handle this more robustly (e.g., retry sending).
      return { message: 'Pickup scheduled, but failed to send confirmation email.' };
    }
  }

  // Fallback if SendGrid is not configured
  return { message: 'Pickup scheduled successfully.' };
}
