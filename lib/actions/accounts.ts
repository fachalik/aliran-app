"use server";

import { db } from "@/lib/db";
import { financialAccounts } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createFinancialAccount({
  userId,
  name,
  type,
  balance,
  isDefault,
}: {
  userId: string;
  name: string;
  type: "bank" | "ewallet" | "cash" | "credit_card";
  balance?: string;
  isDefault?: boolean;
}) {
  if (isDefault) {
    await db
      .update(financialAccounts)
      .set({ isDefault: false })
      .where(and(eq(financialAccounts.userId, userId), isNull(financialAccounts.archivedAt)));
  }

  const [account] = await db
    .insert(financialAccounts)
    .values({ userId, name, type, balance: balance ?? "0", isDefault: isDefault ?? false })
    .returning();

  revalidatePath("/dashboard");
  revalidatePath("/settings");

  return account;
}

export async function updateFinancialAccount({
  id,
  userId,
  name,
  type,
  isDefault,
}: {
  id: string;
  userId: string;
  name?: string;
  type?: "bank" | "ewallet" | "cash" | "credit_card";
  isDefault?: boolean;
}) {
  if (isDefault) {
    await db
      .update(financialAccounts)
      .set({ isDefault: false })
      .where(and(eq(financialAccounts.userId, userId), isNull(financialAccounts.archivedAt)));
  }

  await db
    .update(financialAccounts)
    .set({ ...(name && { name }), ...(type && { type }), ...(isDefault !== undefined && { isDefault }) })
    .where(and(eq(financialAccounts.id, id), eq(financialAccounts.userId, userId)));

  revalidatePath("/settings");
  revalidatePath("/dashboard");
}

export async function archiveFinancialAccount(id: string, userId: string) {
  await db
    .update(financialAccounts)
    .set({ archivedAt: new Date() })
    .where(and(eq(financialAccounts.id, id), eq(financialAccounts.userId, userId)));

  revalidatePath("/settings");
  revalidatePath("/dashboard");
}
