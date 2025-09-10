"use server";

/**
 * @fileOverview A conversational chat agent for ToyCycle.
 *
 * - chat - A function that handles the conversation.
 * - ChatInput - The input type for the chat function.
 */

import { ai } from "@/ai/genkit";
import { z } from "genkit";
import { db } from "@/db";
import { donations, inventory, pickups } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { startOfDay } from "date-fns";
import { getCurrentUser } from "@/lib/auth";

// Tool to get donation status
const getDonationStatusTool = ai.defineTool(
  {
    name: "getDonationStatus",
    description:
      "Get the status of the most recent toy donations for the current user.",
    inputSchema: z.object({}),
    outputSchema: z.array(
      z.object({
        id: z.number(),
        donatedAt: z.date(),
        status: z.string(),
        name: z.string().optional(),
      })
    ),
  },
  async () => {
    const user = await getCurrentUser();
    if (!user) {
      return [];
    }
    const userDonations = await db.query.donations.findMany({
      where: eq(donations.userId, user.id),
      with: {
        inventory: true,
      },
      orderBy: (donations, { desc }) => [desc(donations.donatedAt)],
      limit: 5,
    });

    return userDonations.map((d) => ({
      id: d.id,
      donatedAt: d.donatedAt,
      status: d.inventory?.status ?? "pending",
      name: d.inventory?.name,
    }));
  }
);

// Tool to schedule a pickup
const schedulePickupTool = ai.defineTool(
  {
    name: "schedulePickup",
    description:
      "Schedules a toy pickup for a user. Collect all required information first.",
    inputSchema: z.object({
      pickupDate: z
        .string()
        .describe("The desired date for the pickup in YYYY-MM-DD format."),
      timeSlot: z
        .string()
        .describe("The desired time slot, e.g., '9am - 12pm'."),
      pickupType: z
        .enum(["my-address", "drop-off", "partner"])
        .describe("The type of pickup location."),
      address: z
        .string()
        .optional()
        .describe(
          "The user's full address, required if pickupType is 'my-address'."
        ),
      locationId: z
        .number()
        .optional()
        .describe(
          "The ID of the drop-off location, required if pickupType is 'drop-off'."
        ),
      partnerId: z
        .number()
        .optional()
        .describe(
          "The ID of the partner organization, required if pickupType is 'partner'."
        ),
      notes: z
        .string()
        .optional()
        .describe("Any notes or special instructions from the user."),
    }),
    outputSchema: z.object({
      success: z.boolean(),
      message: z.string(),
    }),
  },
  async (input) => {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: "User must be logged in to schedule a pickup.",
      };
    }

    try {
      await db.insert(pickups).values({
        name: user.name,
        email: user.email,
        pickupDate: startOfDay(new Date(input.pickupDate)),
        timeSlot: input.timeSlot,
        pickupType: input.pickupType,
        address: input.address,
        locationId: input.locationId,
        partnerId: input.partnerId,
        notes: input.notes,
        // These are required by the DB but not collected by chat, so we use default values
        toyConditionId: 1,
        accessoryTypeId: 1,
      });
      return {
        success: true,
        message: `Pickup successfully scheduled on ${input.pickupDate} between ${input.timeSlot}.`,
      };
    } catch (error) {
      console.error("Failed to schedule pickup via chat:", error);
      return {
        success: false,
        message:
          "Sorry, I encountered an error while scheduling the pickup. Please try again.",
      };
    }
  }
);

const ChatInputSchema = z.object({
  history: z.array(z.any()),
  prompt: z.string(),
});
export type ChatInput = z.infer<typeof ChatInputSchema>;

const chatPrompt = ai.definePrompt({
  name: "chatPrompt",
  tools: [getDonationStatusTool, schedulePickupTool],
  input: { schema: ChatInputSchema.extend({ user: z.any().optional() }) },
  system: `You are a friendly and helpful chat assistant for ToyCycle.
        Your goal is to assist users with scheduling toy pickups and checking the status of their donations.
        Be conversational and guide the user.
        If scheduling a pickup, ensure you gather all necessary information (date, time slot, location/address) before calling the schedulePickup tool.
        Today's date is ${new Date().toLocaleDateString()}.
        {{#if user}}The current user is named {{user.name}}.{{/if}}
    `,
  history: "{{history}}",
  prompt: "{{prompt}}",
});

export async function chat(input: ChatInput) {
  const user = await getCurrentUser();

  if (!user) {
    return { text: "You must be logged in to use the chat." };
  }

  const { stream, response } = chatPrompt.stream({ ...input, user });
  for await (const chunk of stream) {
    // You can add logic here to handle streaming chunks if needed on the server
  }

  const result = await response;
  return result;
}
