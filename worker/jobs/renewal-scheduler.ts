import type { Job } from "bullmq";
import { db } from "@/lib/db";
import { commitments } from "@/lib/schema";
import { eq, lte } from "drizzle-orm";
import { generateObligations } from "@/lib/actions/commitments";

export async function renewalScheduler(_job: Job) {
  const now = new Date();

  const dueCommitments = await db.query.commitments.findMany({
    where: (c) =>
      eq(c.status, "active") && lte(c.nextRenewalAt, now),
  });

  console.log(`[renewal-scheduler] Found ${dueCommitments.length} commitments to process`);

  for (const commitment of dueCommitments) {
    try {
      await generateObligations(commitment.id, commitment.userId);
      console.log(`[renewal-scheduler] Generated obligation for commitment ${commitment.id}`);
    } catch (err) {
      console.error(`[renewal-scheduler] Failed for commitment ${commitment.id}:`, err);
    }
  }

  return { processed: dueCommitments.length };
}
