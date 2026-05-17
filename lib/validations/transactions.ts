import { z } from "zod";

export const createTransactionSchema = z.object({
  type: z.enum(["expense", "income", "transfer"]),
  amount: z.coerce.number().positive("Amount harus lebih dari 0"),
  accountId: z.string().min(1, "Rekening wajib dipilih"),
  toAccountId: z.string().optional(), // for transfer
  merchantName: z.string().optional(),
  categoryId: z.string().optional(),
  occurredAt: z.coerce.date().default(() => new Date()),
  note: z.string().optional(),
});

export type CreateTransactionInput = z.infer<typeof createTransactionSchema>;
