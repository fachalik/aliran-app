"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { Mail } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z.object({
  email: z.email("Format email tidak valid"),
});

type FormData = z.infer<typeof schema>;

const PREVIEW_ROWS = [
  {
    name: "Netflix Premium",
    amount: "Rp 46.500/orang",
    status: "Lunas",
    statusColor: "oklch(0.68 0.10 155)",
  },
  {
    name: "Spotify Family",
    amount: "Rp 13.200/orang",
    status: "Aktif",
    statusColor: "oklch(0.76 0.09 90)",
  },
  {
    name: "iCloud+",
    amount: "Rp 33.000/orang",
    status: "Jatuh tempo",
    statusColor: "oklch(0.74 0.10 35)",
  },
];

function LeftPanel() {
  return (
    <div className="hidden md:flex w-[42%] min-w-[300px] shrink-0 bg-[var(--forest-950)] px-12 py-[44px] flex-col sticky top-0 h-screen overflow-y-auto">
      <Link
        href="/"
        className="inline-flex items-center gap-[9px] no-underline"
      >
        <span className="w-[26px] h-[26px] rounded-[7px] bg-[oklch(0.30_0.04_155)] text-[oklch(0.88_0.03_90)] grid place-items-center font-[family-name:var(--font-display)] italic text-[17px]">
          a
        </span>
        <span className="font-[family-name:var(--font-display)] text-[17px] font-normal text-[oklch(0.86_0.03_90)] tracking-[-0.015em]">
          Aliran
        </span>
      </Link>

      <div className="flex-1 flex flex-col justify-center py-12">
        <h2 className="font-[family-name:var(--font-display)] font-normal text-[clamp(26px,2.6vw,36px)] leading-[1.1] tracking-[-0.025em] text-[oklch(0.90_0.03_90)] mt-0 mb-[14px]">
          Satu tempat untuk semua langganan{" "}
          <em className="italic text-[oklch(0.68_0.10_155)]">patungan.</em>
        </h2>
        <p className="text-[13.5px] text-[oklch(0.58_0.018_90)] leading-[1.6] mt-0 mb-9">
          Lacak, tagih, verify — semua dari satu dashboard.
        </p>

        <div className="flex flex-col gap-0.5">
          {PREVIEW_ROWS.map((row) => (
            <div
              key={row.name}
              className="flex items-center justify-between px-4 py-[13px] rounded-[9px] bg-[oklch(0.16_0.022_160)]"
            >
              <div>
                <div className="text-[13px] font-medium text-[oklch(0.86_0.03_90)] mb-0.5">
                  {row.name}
                </div>
                <div className="font-[family-name:var(--font-mono)] text-[10.5px] text-[oklch(0.50_0.014_90)]">
                  {row.amount}
                </div>
              </div>
              <div
                className="text-[10.5px] font-medium font-[family-name:var(--font-mono)] tracking-[0.04em]"
                style={{ color: row.statusColor }}
              >
                {row.status}
              </div>
            </div>
          ))}
        </div>
      </div>

      <p className="text-xs text-white">
        Ingat password?{" "}
        <a
          href="/signin"
          className="text-[oklch(0.62_0.08_155)] font-medium no-underline hover:underline focus:underline"
        >
          Masuk
        </a>
      </p>
    </div>
  );
}

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: standardSchemaResolver(schema) });

  async function onSubmit(data: FormData) {
    await fetch("/api/auth/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: data.email,
        redirectTo: "/reset-password",
      }),
    });
    setSent(true);
  }

  return (
    <div className="fixed inset-0 z-50 flex overflow-y-auto bg-[var(--cream-100)]">
      <LeftPanel />

      {/* Right panel */}
      <div className="flex-1 flex items-center justify-center px-6 py-12 min-h-screen bg-[var(--cream-100)]">
        <div className="w-full max-w-[380px]">
          {/* Mobile logo */}
          <div className="md:hidden text-center mb-10">
            <Link href="/" className="no-underline">
              <span className="font-[family-name:var(--font-display)] text-[26px] font-normal text-[var(--forest-800)] tracking-[-0.02em]">
                Aliran
              </span>
            </Link>
          </div>

          {sent ? (
            <div className="text-center py-2">
              <div className="w-11 h-11 rounded-[var(--r-md)] bg-[var(--forest-100)] flex items-center justify-center mx-auto mb-5">
                <Mail size={20} className="text-[var(--forest-700)]" />
              </div>
              <h2 className="font-[family-name:var(--font-sans)] text-lg font-semibold text-[var(--ink-900)] tracking-[-0.01em] mt-0 mb-2">
                Tautan terkirim
              </h2>
              <p className="text-[13px] text-[var(--ink-500)] leading-[1.55] mt-0 mb-7">
                Cek inbox kamu (atau folder spam). Tautan berlaku 1 jam.
              </p>
              <a
                href="/signin"
                className="text-[13px] text-[var(--forest-700)] font-medium no-underline hover:underline focus:underline"
              >
                Kembali ke masuk
              </a>
            </div>
          ) : (
            <>
              <h1 className="font-[family-name:var(--font-sans)] text-[22px] font-semibold text-[var(--ink-900)] tracking-[-0.01em] mt-0 mb-[6px]">
                Lupa password?
              </h1>
              <p className="text-[13px] text-[var(--ink-400)] mt-0 mb-7">
                Kirimkan tautan reset ke email kamu
              </p>

              <form onSubmit={handleSubmit(onSubmit)} noValidate>
                <div>
                  <Label
                    htmlFor="email"
                    className="block text-[13px] font-medium text-[var(--ink-700)] mb-[6px]"
                  >
                    Email
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="kamu@email.com"
                    autoComplete="email"
                    aria-invalid={!!errors.email}
                    aria-describedby={errors.email ? "email-error" : undefined}
                    {...register("email")}
                  />
                  {errors.email && (
                    <p
                      id="email-error"
                      className="text-xs text-[var(--clay-600)] mt-[5px]"
                    >
                      {errors.email.message}
                    </p>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6"
                >
                  {isSubmitting ? "Mengirim..." : "Kirim tautan reset"}
                </Button>

                <p className="text-[13px] text-[var(--ink-400)] text-center mt-5">
                  <a
                    href="/signin"
                    className="text-[var(--ink-400)] no-underline hover:text-[var(--ink-700)] focus:text-[var(--ink-700)]"
                  >
                    Kembali ke masuk
                  </a>
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
