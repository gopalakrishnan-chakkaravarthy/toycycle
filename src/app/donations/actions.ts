"use server";

import { db } from "@/db";
import { donations, inventory } from "@/db/schema";
import type { User } from "@/lib/auth";
import { eq } from "drizzle-orm";
import type { Donation, Inventory } from "@/db/schema";

export type DetailedDonation = Donation & { inventory: Inventory | null };

export async function getDonationsForUser(
  user: User | null
): Promise<DetailedDonation[]> {
  if (!user || !process.env.POSTGRES_URL) {
    return [];
  }

  try {
    const userDonations = await db.query.donations.findMany({
      where: eq(donations.userId, user.id),
      with: {
        inventory: true,
      },
      orderBy: (donations, { desc }) => [desc(donations.donatedAt)],
    });
    return userDonations;
  } catch (error) {
    console.error("Failed to fetch user donations:", error);
    return [];
  }
}
