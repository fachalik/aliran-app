import { db } from "@/lib/db";
import { financialAccounts, flows, commitments, obligations } from "@/lib/schema";
import { eq, and, isNull, gte, lte, desc, sql } from "drizzle-orm";
import { startOfMonth, endOfMonth, addDays } from "date-fns";

export async function getDashboardData(userId: string) {
  const now = new Date();
  const monthStart = startOfMonth(now);
  const monthEnd = endOfMonth(now);
  const sevenDaysLater = addDays(now, 7);

  const [accounts, monthFlows, upcomingObligations, recentFlows, activeCommitments] =
    await Promise.all([
      db.query.financialAccounts.findMany({
        where: and(eq(financialAccounts.userId, userId), isNull(financialAccounts.archivedAt)),
      }),

      db.query.flows.findMany({
        where: and(
          eq(flows.userId, userId),
          gte(flows.occurredAt, monthStart),
          lte(flows.occurredAt, monthEnd)
        ),
      }),

      db.query.obligations.findMany({
        where: and(
          eq(obligations.toUserId, userId),
          gte(obligations.dueAt, now),
          lte(obligations.dueAt, sevenDaysLater),
          sql`${obligations.status} IN ('pending', 'notified')`
        ),
        orderBy: [obligations.dueAt],
        with: { commitment: true },
      }),

      db.query.flows.findMany({
        where: eq(flows.userId, userId),
        orderBy: [desc(flows.occurredAt)],
        limit: 10,
        with: { category: true },
      }),

      db.query.commitments.findMany({
        where: and(eq(commitments.userId, userId), eq(commitments.status, "active")),
      }),
    ]);

  const totalBalance = accounts.reduce((sum, a) => sum + Number(a.balance), 0);

  const monthIncome = monthFlows
    .filter((f) => f.type === "income")
    .reduce((sum, f) => sum + Number(f.amount), 0);

  const monthExpense = monthFlows
    .filter((f) => f.type === "expense")
    .reduce((sum, f) => sum + Number(f.amount), 0);

  const monthlySubscriptionCost = activeCommitments
    .filter((c) => c.billingCycle === "monthly")
    .reduce((sum, c) => sum + Number(c.amount), 0);

  return {
    totalBalance,
    monthIncome,
    monthExpense,
    monthNet: monthIncome - monthExpense,
    accounts,
    upcomingObligations,
    recentFlows,
    activeCommitmentsCount: activeCommitments.length,
    monthlySubscriptionCost,
  };
}
