"use client";

import { useState } from "react";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { authClient } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z
  .object({
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
  });

type FormData = z.infer<typeof schema>;

export function ResetPasswordForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token") ?? "";
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: standardSchemaResolver(schema) });

  async function onSubmit(data: FormData) {
    setError(null);
    const result = await authClient.resetPassword({
      newPassword: data.password,
      token,
    });

    if (result.error) {
      setError("Tautan sudah expired atau tidak valid. Minta tautan baru.");
      return;
    }

    router.push("/signin");
  }

  return (
    <div>
      <h1 className="font-sans text-[22px] font-semibold text-ink-900 tracking-[-0.01em] mt-0 mb-1.5">
        Password baru
      </h1>
      <p className="text-[13px] text-ink-400 mt-0 mb-7">
        Buat password baru untuk akunmu
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && (
          <div
            role="alert"
            className="px-3.5 py-2.5 rounded-(--r-sm) bg-clay-200 border border-[oklch(0.65_0.14_35/0.4)] text-clay-600 text-[13px] leading-[1.45] mb-5"
          >
            {error}{" "}
            <a
              href="/forgot-password"
              className="text-clay-600 font-medium"
            >
              Minta tautan baru
            </a>
          </div>
        )}

        <div className="flex flex-col gap-5">
          <div>
            <Label
              htmlFor="password"
              className="block text-[13px] font-medium text-ink-700 mb-1.5"
            >
              Password baru
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="Min. 8 karakter"
              autoComplete="new-password"
              aria-invalid={!!errors.password}
              aria-describedby={errors.password ? "password-error" : undefined}
              {...register("password")}
            />
            {errors.password && (
              <p id="password-error" className="text-xs text-clay-600 mt-1.25">
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              className="block text-[13px] font-medium text-ink-700 mb-1.5"
            >
              Konfirmasi password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="Ulangi password"
              autoComplete="new-password"
              aria-invalid={!!errors.confirmPassword}
              aria-describedby={errors.confirmPassword ? "confirm-error" : undefined}
              {...register("confirmPassword")}
            />
            {errors.confirmPassword && (
              <p id="confirm-error" className="text-xs text-clay-600 mt-1.25">
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-7"
        >
          {isSubmitting ? "Menyimpan..." : "Simpan password baru"}
        </Button>
      </form>
    </div>
  );
}
