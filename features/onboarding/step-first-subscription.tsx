"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { createCommitment } from "@/lib/actions/commitments";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const POPULAR = [
  { name: "Netflix", amount: 186000 },
  { name: "Spotify", amount: 79000 },
  { name: "YouTube Premium", amount: 89000 },
  { name: "ChatGPT Plus", amount: 320000 },
  { name: "Claude Pro", amount: 320000 },
  { name: "GitHub Copilot", amount: 160000 },
];

const schema = z.object({
  name: z.string().min(1, "Nama wajib diisi"),
  amount: z.number().positive("Amount harus lebih dari 0"),
  billingCycle: z.enum(["monthly", "yearly", "weekly"]),
  nextRenewalAt: z.string().min(1, "Tanggal renewal wajib diisi"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  userId: string;
  onNext: () => void;
}

export function StepFirstSubscription({ userId, onNext }: Props) {
  const [selected, setSelected] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { billingCycle: "monthly" },
  });

  function selectPopular(item: (typeof POPULAR)[0]) {
    setSelected(item.name);
    setValue("name", item.name);
    setValue("amount", item.amount);
  }

  async function onSubmit(data: FormData) {
    await createCommitment({
      userId,
      name: data.name,
      amount: String(data.amount),
      billingCycle: data.billingCycle,
      nextRenewalAt: new Date(data.nextRenewalAt),
    });
    onNext();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Subscription</CardTitle>
        <CardDescription>
          Punya subscription yang aktif? Tambah sekarang — atau skip dulu.
        </CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-3 gap-2">
            {POPULAR.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => selectPopular(p)}
                className="px-2 py-2 rounded-lg text-xs font-medium border transition-all"
                style={{
                  borderColor: selected === p.name ? "var(--forest-700)" : "var(--line)",
                  background: selected === p.name ? "var(--forest-100)" : "white",
                  color: selected === p.name ? "var(--forest-800)" : "var(--ink-700)",
                }}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Subscription</Label>
            <Input id="name" placeholder="e.g. Netflix" {...register("name")} />
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
            {errors.nextRenewalAt && (
              <p className="text-xs text-red-500">{errors.nextRenewalAt.message}</p>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button type="button" variant="outline" className="flex-1" onClick={onNext}>
            Lewati
          </Button>
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan & Selesai"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
