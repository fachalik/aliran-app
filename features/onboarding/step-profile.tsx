"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { updateProfile } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";

const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  whatsappNumber: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  userId: string;
  defaultName: string;
  onNext: () => void;
}

export function StepProfile({ userId, defaultName, onNext }: Props) {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: defaultName },
  });

  async function onSubmit(data: FormData) {
    const wa = data.whatsappNumber;
    const normalized = wa ? (wa.startsWith("08") ? `62${wa.slice(1)}` : wa) : undefined;
    await updateProfile({ userId, name: data.name, whatsappNumber: normalized });
    onNext();
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lengkapi Profilmu</CardTitle>
        <CardDescription>Info ini dipake buat template tagihan ke teman kamu nanti.</CardDescription>
      </CardHeader>
      <form onSubmit={handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama Lengkap</Label>
            <Input id="name" placeholder="Nama kamu" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">
              Nomor WhatsApp <span style={{ color: "var(--ink-400)" }} className="text-xs font-normal">(opsional)</span>
            </Label>
            <Input id="whatsapp" type="tel" placeholder="08xxxxxxxxxx" {...register("whatsappNumber")} />
            <p className="text-xs" style={{ color: "var(--ink-400)" }}>
              Dipakai untuk info no. rek di template tagihan.
            </p>
          </div>
        </CardContent>
        <CardFooter>
          <Button type="submit" className="w-full" disabled={isSubmitting}>
            {isSubmitting ? "Menyimpan..." : "Lanjut →"}
          </Button>
        </CardFooter>
      </form>
    </Card>
  );
}
