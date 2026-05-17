"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useRouter } from "next/navigation";
import { updateProfile } from "@/lib/actions/onboarding";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  name: z.string().min(2, "Nama minimal 2 karakter"),
  whatsappNumber: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

interface Props {
  user: { id: string; name?: string | null; email: string };
}

export function ProfileSection({ user }: Props) {
  const router = useRouter();
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isDirty },
  } = useForm<FormData>({
    resolver: zodResolver(schema),
    defaultValues: { name: user.name ?? "" },
  });

  async function onSubmit(data: FormData) {
    await updateProfile({ userId: user.id, name: data.name, whatsappNumber: data.whatsappNumber });
    router.refresh();
  }

  return (
    <section>
      <h2 className="text-base font-semibold mb-4" style={{ color: "var(--ink-700)" }}>Profil</h2>
      <div className="rounded-xl border p-5" style={{ background: "white", borderColor: "var(--line)" }}>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1.5">
            <Label htmlFor="email">Email</Label>
            <Input id="email" value={user.email} disabled style={{ background: "var(--cream-100)", color: "var(--ink-400)" }} />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="name">Nama</Label>
            <Input id="name" {...register("name")} />
            {errors.name && <p className="text-xs text-red-500">{errors.name.message}</p>}
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="whatsapp">
              Nomor WhatsApp <span className="text-xs font-normal" style={{ color: "var(--ink-400)" }}>(opsional)</span>
            </Label>
            <Input id="whatsapp" type="tel" placeholder="08xxxxxxxxxx" {...register("whatsappNumber")} />
          </div>
          <Button type="submit" disabled={isSubmitting || !isDirty}>
            {isSubmitting ? "Menyimpan..." : "Simpan Perubahan"}
          </Button>
        </form>
      </div>
    </section>
  );
}
