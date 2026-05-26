"use client";

import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createCommitment } from "@/lib/actions/commitments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FinancialAccount } from "@/lib/schema";

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  amount: z.number().positive("Amount harus lebih dari 0"),
  billingCycle: z.enum(["monthly", "yearly", "weekly"]),
  nextRenewalAt: z.string().min(1, "Tanggal renewal wajib diisi"),
  paymentAccountId: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  userId: string;
  accounts: FinancialAccount[];
  onSuccess?: () => void;
}

export function CommitmentForm({ userId, accounts, onSuccess }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(schema),
    defaultValues: { billingCycle: "monthly" },
  });

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      await createCommitment({
        userId,
        name: data.name,
        amount: String(data.amount),
        billingCycle: data.billingCycle,
        nextRenewalAt: new Date(data.nextRenewalAt),
        paymentAccountId: data.paymentAccountId || undefined,
      });
      onSuccess?.();
      router.refresh();
    } catch {
      setError("Gagal menyimpan subscription.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <p className="text-sm p-3 rounded-md bg-red-50 text-red-600 border border-red-200">{error}</p>
      )}

      <div className="space-y-1.5">
        <Label htmlFor="name">Nama Subscription</Label>
        <Input id="name" placeholder="e.g. Netflix, Spotify" {...register("name")} />
        {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="amount">Biaya (Rp)</Label>
          <Input id="amount" type="number" placeholder="186000" {...register("amount", { valueAsNumber: true })} />
          {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="billingCycle">Siklus</Label>
          <select
            id="billingCycle"
            className="flex h-9 w-full rounded-md border px-3 py-1 text-sm"
            style={{ borderColor: "var(--line)", background: "white" }}
            {...register("billingCycle")}
          >
            <option value="monthly">Bulanan</option>
            <option value="yearly">Tahunan</option>
            <option value="weekly">Mingguan</option>
          </select>
        </div>
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="nextRenewalAt">Tanggal Renewal Berikutnya</Label>
        <Input id="nextRenewalAt" type="date" {...register("nextRenewalAt")} />
        {errors.nextRenewalAt && <p className="text-xs text-red-500">{errors.nextRenewalAt.message}</p>}
      </div>

      {accounts.length > 0 && (
        <div className="space-y-1.5">
          <Label htmlFor="paymentAccountId">
            Rekening Bayar <span className="text-xs font-normal" style={{ color: "var(--ink-400)" }}>(opsional)</span>
          </Label>
          <select
            id="paymentAccountId"
            className="flex h-9 w-full rounded-md border px-3 py-1 text-sm"
            style={{ borderColor: "var(--line)", background: "white" }}
            {...register("paymentAccountId")}
          >
            <option value="">Pilih rekening</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      )}

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan..." : "Simpan Subscription"}
      </Button>
    </form>
  );
}
