"use server";

import { db } from "@/lib/db";
import { commitments, obligations } from "@/lib/schema";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { format, addMonths, addYears, addWeeks } from "date-fns";

export async function createCommitment({
  userId,
  name,
  amount,
  billingCycle,
  nextRenewalAt,
  paymentAccountId,
  reminderDays,
}: {
  userId: string;
  name: string;
  amount: string;
  billingCycle: "monthly" | "yearly" | "weekly" | "custom";
  nextRenewalAt: Date;
  paymentAccountId?: string;
  reminderDays?: number[];
}) {
  const [commitment] = await db
    .insert(commitments)
    .values({
      userId,
      name,
      amount,
      billingCycle,
      nextRenewalAt,
      paymentAccountId,
      reminderDays: reminderDays ?? [3, 1],
    })
    .returning();

  revalidatePath("/commitments");
  revalidatePath("/dashboard");

  return commitment;
}

export async function updateCommitmentStatus(
  id: string,
  userId: string,
  status: "active" | "paused" | "cancelled"
) {
  const patch: Record<string, unknown> = { status };
  if (status === "paused") patch.pausedAt = new Date();
  if (status === "cancelled") patch.cancelledAt = new Date();
  if (status === "active") { patch.pausedAt = null; patch.cancelledAt = null; }

  await db
    .update(commitments)
    .set(patch)
    .where(and(eq(commitments.id, id), eq(commitments.userId, userId)));

  revalidatePath("/commitments");
}

export async function generateObligations(commitmentId: string, userId: string) {
  const commitment = await db.query.commitments.findFirst({
    where: and(eq(commitments.id, commitmentId), eq(commitments.userId, userId)),
  });

  if (!commitment || commitment.status !== "active") return;

  const cyclePeriod = format(commitment.nextRenewalAt, "yyyy-MM");

  const existing = await db.query.obligations.findFirst({
    where: and(
      eq(obligations.commitmentId, commitmentId),
      eq(obligations.cyclePeriod, cyclePeriod)
    ),
  });

  if (existing) return existing;

  const [obligation] = await db
    .insert(obligations)
    .values({
      commitmentId,
      cyclePeriod,
      toUserId: userId,
      amount: commitment.amount,
      dueAt: commitment.nextRenewalAt,
    })
    .returning();

  // Advance nextRenewalAt
  let next: Date;
  const current = commitment.nextRenewalAt;
  if (commitment.billingCycle === "monthly") next = addMonths(current, 1);
  else if (commitment.billingCycle === "yearly") next = addYears(current, 1);
  else if (commitment.billingCycle === "weekly") next = addWeeks(current, 1);
  else next = addMonths(current, 1);

  await db
    .update(commitments)
    .set({ nextRenewalAt: next })
    .where(eq(commitments.id, commitmentId));

  revalidatePath("/commitments");
  revalidatePath("/dashboard");

  return obligation;
}
