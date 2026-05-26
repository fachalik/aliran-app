import type { Job } from "bullmq";
import { addDays, startOfDay } from "date-fns";
import { and, eq, gte, inArray, lte } from "drizzle-orm";
import { db } from "@/lib/db";
import { sendEmail } from "@/lib/email";
import { obligations, users } from "@/lib/schema";

export async function emailReminder(_job: Job) {
  const now = new Date();
  const today = startOfDay(now);

  // Find obligations due within reminderDays
  const upcoming = await db.query.obligations.findMany({
    where: and(
      inArray(obligations.status, ["pending"]),
      gte(obligations.dueAt, today),
      lte(obligations.dueAt, addDays(today, 7))
    ),
    with: {
      commitment: true,
    },
  });

  console.log(`[email-reminder] Found ${upcoming.length} upcoming obligations`);

  for (const obligation of upcoming) {
    const user = await db.query.users.findFirst({
      where: eq(users.id, obligation.toUserId),
    });

    if (!user?.email) continue;

    const commitment = obligation.commitment;
    if (!commitment) continue;

    const daysUntilDue = Math.ceil(
      (obligation.dueAt.getTime() - today.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (![0, 1, 3].includes(daysUntilDue)) continue;

    const dueLabelShort =
      daysUntilDue === 0 ? "hari ini" : daysUntilDue === 1 ? "besok" : `dalam ${daysUntilDue} hari`;

    try {
      await sendEmail({
        to: user.email,
        subject: `Reminder: ${commitment.name} jatuh tempo ${dueLabelShort}`,
        html: `
          <p>Halo ${user.name ?? ""}!</p>
          <p>Subscription <strong>${commitment.name}</strong> kamu jatuh tempo ${dueLabelShort}.</p>
          <p>Jumlah: <strong>Rp ${Number(obligation.amount).toLocaleString("id-ID")}</strong></p>
          <p><a href="${process.env.NEXT_PUBLIC_APP_URL}/commitments">Lihat di Aliran →</a></p>
        `,
      });

      console.log(`[email-reminder] Sent reminder for obligation ${obligation.id} to ${user.email}`);
    } catch (err) {
      console.error(`[email-reminder] Failed to send for obligation ${obligation.id}:`, err);
    }
  }

  return { processed: upcoming.length };
}
