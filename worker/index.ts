import { Queue, Worker } from "bullmq";
import IORedis from "ioredis";
import { emailReminder } from "./jobs/email-reminder";
import { renewalScheduler } from "./jobs/renewal-scheduler";

const connection = new IORedis(process.env.REDIS_URL!, {
  maxRetriesPerRequest: null,
});

export const queues = {
  renewal: new Queue("renewal-scheduler", { connection }),
  reminder: new Queue("email-reminder", { connection }),
};

const renewalWorker = new Worker("renewal-scheduler", renewalScheduler, {
  connection,
});
const reminderWorker = new Worker("email-reminder", emailReminder, {
  connection,
});

renewalWorker.on("completed", (job) => {
  console.log(`[renewal] Job ${job.id} completed`);
});
renewalWorker.on("failed", (job, err) => {
  console.error(`[renewal] Job ${job?.id} failed:`, err);
});
reminderWorker.on("completed", (job) => {
  console.log(`[reminder] Job ${job.id} completed`);
});
reminderWorker.on("failed", (job, err) => {
  console.error(`[reminder] Job ${job?.id} failed:`, err);
});

// Schedule daily cron jobs
async function scheduleCrons() {
  await queues.renewal.add(
    "daily-renewal-check",
    {},
    {
      repeat: { pattern: "0 0 * * *" }, // daily at 00:00
      jobId: "daily-renewal-check",
    },
  );
  await queues.reminder.add(
    "daily-reminder-check",
    {},
    {
      repeat: { pattern: "0 7 * * *" }, // daily at 07:00 WIB
      jobId: "daily-reminder-check",
    },
  );
  console.log("[worker] Cron jobs scheduled");
}

scheduleCrons().catch(console.error);

console.log("[worker] Started");
