"use server";

import { db } from "@/lib/db";
import { users } from "@/lib/schema";
import { eq } from "drizzle-orm";

export async function updateProfile({
  userId,
  name,
  whatsappNumber,
}: {
  userId: string;
  name: string;
  whatsappNumber?: string;
}) {
  await db
    .update(users)
    .set({ name, whatsappNumber, updatedAt: new Date() })
    .where(eq(users.id, userId));
}
