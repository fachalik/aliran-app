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
      <h1
        style={{
          fontFamily: "var(--font-sans)",
          fontSize: 22,
          fontWeight: 600,
          color: "var(--ink-900)",
          letterSpacing: "-0.01em",
          margin: "0 0 6px",
        }}
      >
        Password baru
      </h1>
      <p style={{ fontSize: 13, color: "var(--ink-400)", margin: "0 0 28px" }}>
        Buat password baru untuk akunmu
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        {error && (
          <div
            role="alert"
            style={{
              padding: "10px 14px",
              borderRadius: "var(--r-sm)",
              background: "var(--clay-200)",
              border: "1px solid oklch(0.65 0.14 35 / 0.4)",
              color: "var(--clay-600)",
              fontSize: 13,
              lineHeight: 1.45,
              marginBottom: 20,
            }}
          >
            {error}{" "}
            <a
              href="/forgot-password"
              style={{ color: "var(--clay-600)", fontWeight: 500 }}
            >
              Minta tautan baru
            </a>
          </div>
        )}

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div>
            <Label
              htmlFor="password"
              style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--ink-700)", marginBottom: 6 }}
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
              <p id="password-error" style={{ fontSize: 12, color: "var(--clay-600)", marginTop: 5 }}>
                {errors.password.message}
              </p>
            )}
          </div>

          <div>
            <Label
              htmlFor="confirmPassword"
              style={{ display: "block", fontSize: 13, fontWeight: 500, color: "var(--ink-700)", marginBottom: 6 }}
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
              <p id="confirm-error" style={{ fontSize: 12, color: "var(--clay-600)", marginTop: 5 }}>
                {errors.confirmPassword.message}
              </p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full"
          style={{ marginTop: 28 }}
        >
          {isSubmitting ? "Menyimpan..." : "Simpan password baru"}
        </Button>
      </form>
    </div>
  );
}
