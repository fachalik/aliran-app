import { db } from "@/lib/db";
import { flows, obligations } from "@/lib/schema";
import { eq, and, gte, lte } from "drizzle-orm";
import { startOfMonth, endOfMonth } from "date-fns";

export async function getCalendarData(userId: string, year: number, month: number) {
  const date = new Date(year, month - 1, 1);
  const monthStart = startOfMonth(date);
  const monthEnd = endOfMonth(date);

  const [monthFlows, monthObligations] = await Promise.all([
    db.query.flows.findMany({
      where: and(
        eq(flows.userId, userId),
        gte(flows.occurredAt, monthStart),
        lte(flows.occurredAt, monthEnd)
      ),
      with: { category: true },
    }),

    db.query.obligations.findMany({
      where: and(
        eq(obligations.toUserId, userId),
        gte(obligations.dueAt, monthStart),
        lte(obligations.dueAt, monthEnd)
      ),
      with: { commitment: true },
    }),
  ]);

  return { flows: monthFlows, obligations: monthObligations };
}
