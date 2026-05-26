"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { z } from "zod";
import { createFinancialAccount } from "@/lib/actions/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const PRESETS = [
  { name: "BCA", type: "bank" as const },
  { name: "Mandiri", type: "bank" as const },
  { name: "BRI", type: "bank" as const },
  { name: "GoPay", type: "ewallet" as const },
  { name: "OVO", type: "ewallet" as const },
  { name: "Dana", type: "ewallet" as const },
  { name: "Cash", type: "cash" as const },
];

const schema = z.object({
  name: z.string().min(1, "Nama rekening wajib diisi"),
  type: z.enum(["bank", "ewallet", "cash", "credit_card"]),
  balance: z.number().min(0, "Saldo tidak boleh negatif"),
});

type FormData = z.infer<typeof schema>;

interface Props {
  userId: string;
  onNext: () => void;
}

export function StepFirstAccount({ userId, onNext }: Props) {
  const [selected, setSelected] = useState<(typeof PRESETS)[0] | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: standardSchemaResolver(schema),
    defaultValues: { type: "bank", balance: 0 },
  });

  function selectPreset(preset: (typeof PRESETS)[0]) {
    setSelected(preset);
    setValue("name", preset.name);
    setValue("type", preset.type);
  }

  async function onSubmit(data: FormData) {
    await createFinancialAccount({
      userId,
      name: data.name,
      type: data.type,
      balance: String(data.balance),
      isDefault: true,
    });
    onNext();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Tambah Rekening Pertama</CardTitle>
        <CardDescription>Pilih rekening yang paling sering kamu pakai.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-5">
          <div className="grid grid-cols-4 gap-2">
            {PRESETS.map((p) => (
              <button
                key={p.name}
                type="button"
                onClick={() => selectPreset(p)}
                className="px-3 py-2 rounded-lg text-sm font-medium border transition-all"
                style={{
                  borderColor: selected?.name === p.name ? "var(--forest-700)" : "var(--line)",
                  background: selected?.name === p.name ? "var(--forest-100)" : "white",
                  color: selected?.name === p.name ? "var(--forest-800)" : "var(--ink-700)",
                }}
              >
                {p.name}
              </button>
            ))}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Rekening</Label>
            <Input id="name" placeholder="e.g. BCA Utama" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="balance">Saldo Awal (Rp)</Label>
            <Input id="balance" type="number" placeholder="0" {...register("balance", { valueAsNumber: true })} />
            {errors.balance && <p className="text-xs text-red-500">{errors.balance.message}</p>}
          </div>
        </CardContent>
        <CardFooter className="flex gap-3">
          <Button type="submit" className="flex-1" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Simpan & Lanjut →"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
