import { z } from "zod";

export const createAccountSchema = z.object({
  name: z.string().min(1, "Nama rekening wajib diisi"),
  type: z.enum(["bank", "ewallet", "cash", "credit_card"]),
  balance: z.coerce.number().min(0).default(0),
  currency: z.string().default("IDR"),
  isDefault: z.boolean().default(false),
});

export const updateAccountSchema = createAccountSchema.partial().extend({
  id: z.string(),
});

export type CreateAccountInput = z.infer<typeof createAccountSchema>;
export type UpdateAccountInput = z.infer<typeof updateAccountSchema>;
