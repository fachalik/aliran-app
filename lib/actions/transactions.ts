"use server";

import { db } from "@/lib/db";
import { flows, financialAccounts, merchants } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { sql } from "drizzle-orm";

export async function createTransaction({
  userId,
  type,
  amount,
  accountId,
  toAccountId,
  merchantName,
  categoryId,
  occurredAt,
  note,
}: {
  userId: string;
  type: "expense" | "income" | "transfer";
  amount: number;
  accountId: string;
  toAccountId?: string;
  merchantName?: string;
  categoryId?: string;
  occurredAt?: Date;
  note?: string;
}) {
  let merchantId: string | undefined;

  if (merchantName) {
    const existing = await db.query.merchants.findFirst({
      where: and(
        eq(merchants.userId, userId),
        sql`lower(${merchants.name}) = lower(${merchantName})`
      ),
    });
    if (existing) {
      merchantId = existing.id;
    } else {
      const [m] = await db
        .insert(merchants)
        .values({ userId, name: merchantName })
        .returning();
      merchantId = m.id;
    }
  }

  const sourceType = type === "income" ? "merchant" : "account";
  const sourceId = type === "income" ? merchantId : accountId;
  const targetType = type === "expense" ? "merchant" : "account";
  const targetId = type === "expense" ? merchantId : (type === "transfer" ? toAccountId : accountId);

  const [flow] = await db
    .insert(flows)
    .values({
      userId,
      type,
      amount: String(amount),
      sourceType,
      sourceId,
      targetType,
      targetId,
      categoryId,
      merchantId,
      occurredAt: occurredAt ?? new Date(),
      note,
    })
    .returning();

  // Update account balances
  if (type === "expense") {
    await db
      .update(financialAccounts)
      .set({ balance: sql`${financialAccounts.balance} - ${amount}` })
      .where(eq(financialAccounts.id, accountId));
  } else if (type === "income") {
    await db
      .update(financialAccounts)
      .set({ balance: sql`${financialAccounts.balance} + ${amount}` })
      .where(eq(financialAccounts.id, accountId));
  } else if (type === "transfer" && toAccountId) {
    await db
      .update(financialAccounts)
      .set({ balance: sql`${financialAccounts.balance} - ${amount}` })
      .where(eq(financialAccounts.id, accountId));
    await db
      .update(financialAccounts)
      .set({ balance: sql`${financialAccounts.balance} + ${amount}` })
      .where(eq(financialAccounts.id, toAccountId));
  }

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/calendar");

  return flow;
}

export async function deleteTransaction(id: string, userId: string) {
  const flow = await db.query.flows.findFirst({
    where: and(eq(flows.id, id), eq(flows.userId, userId)),
  });

  if (!flow) throw new Error("Transaksi tidak ditemukan");

  await db.delete(flows).where(and(eq(flows.id, id), eq(flows.userId, userId)));

  // Reverse balance update
  const amount = Number(flow.amount);
  if (flow.type === "expense" && flow.sourceId) {
    await db
      .update(financialAccounts)
      .set({ balance: sql`${financialAccounts.balance} + ${amount}` })
      .where(eq(financialAccounts.id, flow.sourceId));
  } else if (flow.type === "income" && flow.targetId) {
    await db
      .update(financialAccounts)
      .set({ balance: sql`${financialAccounts.balance} - ${amount}` })
      .where(eq(financialAccounts.id, flow.targetId));
  }

  revalidatePath("/dashboard");
  revalidatePath("/transactions");
  revalidatePath("/calendar");
}
