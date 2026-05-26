import { z } from "zod";

export const createCommitmentSchema = z.object({
  name: z.string().min(1, "Nama subscription wajib diisi"),
  amount: z.coerce.number().positive("Amount harus lebih dari 0"),
  billingCycle: z.enum(["monthly", "yearly", "weekly", "custom"]),
  nextRenewalAt: z.coerce.date(),
  paymentAccountId: z.string().optional(),
  reminderDays: z.array(z.number()).default([3, 1]),
});

export const updateCommitmentSchema = createCommitmentSchema
  .partial()
  .extend({ id: z.string() });

export type CreateCommitmentInput = z.infer<typeof createCommitmentSchema>;
export type UpdateCommitmentInput = z.infer<typeof updateCommitmentSchema>;
