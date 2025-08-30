'use server';

import { z } from 'zod';
import sgMail from '@sendgrid/mail';
import { format } from 'date-fns';

const schedulePickupSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters.'),
  email: z.string().email('Please enter a valid email.'),
  address: z.string().min(10, 'Please enter a valid address.'),
  pickupDate: z.string().min(1, "A pickup date is required."),
  timeSlot: z.string().min(1, 'Please select a time slot.'),
  toyConditionId: z.string().min(1, 'Please select a toy condition.'),
  accessoryTypeId: z.string().min(1, 'Please select an accessory type.'),
  notes: z.string().optional(),
});

const formActionState = z.object({
  message: z.string(),
  error: z.union([z.string(), z.record(z.array(z.string())), z.undefined()]).optional(),
});


export async function schedulePickup(prevState: z.infer<typeof formActionState>, formData: FormData) {
  const validatedFields = schedulePickupSchema.safeParse({
    name: formData.get('name'),
    email: formData.get('email'),
    address: formData.get('address'),
    pickupDate: formData.get('pickupDate'),
    timeSlot: formData.get('timeSlot'),
    toyConditionId: formData.get('toyConditionId'),
    accessoryTypeId: formData.get('accessoryTypeId'),
    notes: formData.get('notes'),
  });

  if (!validatedFields.success) {
    return {
      message: 'Validation failed',
      error: validatedFields.error.flatten().fieldErrors,
    };
  }

  // In a real app, you would save this data to your database.
  // For now, we will just simulate success and send an email.

  if (process.env.SENDGRID_API_KEY && process.env.SENDGRID_FROM_EMAIL) {
    sgMail.setApiKey(process.env.SENDGRID_API_KEY);

    const { name, email, address, pickupDate, timeSlot, notes } = validatedFields.data;
    
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
          <li><strong>Address:</strong> ${address}</li>
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
