"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { createTransaction } from "@/lib/actions/transactions";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FinancialAccount, Category } from "@/lib/schema";

const schema = z.object({
  type: z.enum(["expense", "income", "transfer"]),
  amount: z.number().positive("Amount harus lebih dari 0"),
  accountId: z.string().min(1, "Pilih rekening"),
  toAccountId: z.string().optional(),
  merchantName: z.string().optional(),
  categoryId: z.string().optional(),
  occurredAt: z.string().min(1, "Tanggal wajib diisi"),
  note: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  userId: string;
  accounts: FinancialAccount[];
  categories: Category[];
  onSuccess?: () => void;
}

const TYPE_TABS = [
  { value: "expense", label: "Pengeluaran" },
  { value: "income", label: "Pemasukan" },
  { value: "transfer", label: "Transfer" },
] as const;

export function TransactionForm({ userId, accounts, categories, onSuccess }: Props) {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(schema),
    defaultValues: {
      type: "expense",
      occurredAt: new Date().toISOString().slice(0, 10),
    },
  });

  const type = watch("type");
  const expenseCategories = categories.filter((c) => c.type === "expense");
  const incomeCategories = categories.filter((c) => c.type === "income");
  const relevantCategories = type === "income" ? incomeCategories : expenseCategories;

  async function onSubmit(data: FormData) {
    setError(null);
    try {
      await createTransaction({
        userId,
        type: data.type,
        amount: data.amount,
        accountId: data.accountId,
        toAccountId: data.toAccountId,
        merchantName: data.merchantName,
        categoryId: data.categoryId,
        occurredAt: new Date(data.occurredAt),
        note: data.note,
      });
      onSuccess?.();
      router.refresh();
    } catch {
      setError("Gagal menyimpan transaksi.");
    }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      {error && (
        <p className="text-sm p-3 rounded-md bg-red-50 text-red-600 border border-red-200">{error}</p>
      )}

      {/* Type tabs */}
      <div className="flex rounded-lg p-1 gap-1" style={{ background: "var(--cream-200)" }}>
        {TYPE_TABS.map((t) => (
          <button
            key={t.value}
            type="button"
            onClick={() => setValue("type", t.value)}
            className="flex-1 py-1.5 text-sm font-medium rounded-md transition-all"
            style={{
              background: type === t.value ? "white" : "transparent",
              color: type === t.value ? "var(--ink-700)" : "var(--ink-400)",
              boxShadow: type === t.value ? "0 1px 3px rgba(0,0,0,.08)" : "none",
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="amount">Jumlah (Rp)</Label>
        <Input id="amount" type="number" placeholder="0" {...register("amount", { valueAsNumber: true })} />
        {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
      </div>

      <div className="space-y-1.5">
        <Label htmlFor="accountId">{type === "transfer" ? "Dari Rekening" : "Rekening"}</Label>
        <select
          id="accountId"
          className="flex h-9 w-full rounded-md border px-3 py-1 text-sm"
          style={{ borderColor: "var(--line)", background: "white" }}
          {...register("accountId")}
        >
          <option value="">Pilih rekening</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.name}</option>
          ))}
        </select>
        {errors.accountId && <p className="text-xs text-red-500">{errors.accountId.message}</p>}
      </div>

      {type === "transfer" && (
        <div className="space-y-1.5">
          <Label htmlFor="toAccountId">Ke Rekening</Label>
          <select
            id="toAccountId"
            className="flex h-9 w-full rounded-md border px-3 py-1 text-sm"
            style={{ borderColor: "var(--line)", background: "white" }}
            {...register("toAccountId")}
          >
            <option value="">Pilih rekening tujuan</option>
            {accounts.map((a) => (
              <option key={a.id} value={a.id}>{a.name}</option>
            ))}
          </select>
        </div>
      )}

      {type !== "transfer" && (
        <>
          <div className="space-y-1.5">
            <Label htmlFor="merchantName">{type === "expense" ? "Merchant" : "Sumber"}</Label>
            <Input
              id="merchantName"
              placeholder={type === "expense" ? "e.g. Indomaret, Gojek" : "e.g. Gaji, Freelance"}
              {...register("merchantName")}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="categoryId">Kategori</Label>
            <select
              id="categoryId"
              className="flex h-9 w-full rounded-md border px-3 py-1 text-sm"
              style={{ borderColor: "var(--line)", background: "white" }}
              {...register("categoryId")}
            >
              <option value="">Pilih kategori</option>
              {relevantCategories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>
        </>
      )}

      <div className="grid grid-cols-2 gap-3">
        <div className="space-y-1.5">
          <Label htmlFor="occurredAt">Tanggal</Label>
          <Input id="occurredAt" type="date" {...register("occurredAt")} />
        </div>
        <div className="space-y-1.5">
          <Label htmlFor="note">Catatan</Label>
          <Input id="note" placeholder="Opsional" {...register("note")} />
        </div>
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? "Menyimpan..." : "Simpan Transaksi"}
      </Button>
    </form>
  );
}
