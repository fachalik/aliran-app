"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { signUp } from "@/lib/auth-client";
import { standardSchemaResolver } from "@hookform/resolvers/standard-schema";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";

const schema = z
  .object({
    name: z.string().min(2, "Nama minimal 2 karakter"),
    email: z.email("Format email tidak valid"),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Password tidak cocok",
    path: ["confirmPassword"],
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

export function SignUpForm() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: standardSchemaResolver(schema) });

  async function onSubmit(data: FormData) {
    setError(null);
    const result = await signUp.email({
      email: data.email,
      password: data.password,
      name: data.name,
    });

    if (result.error) {
      setError(result.error.message ?? "Gagal mendaftar. Coba lagi.");
      return;
    }

    router.push("/onboarding");
    router.refresh();
  }

  return (
    <div
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 50,
        display: "flex",
        overflowY: "auto",
        background: "var(--cream-100)",
      }}
    >
      {/* Left panel */}
      <div
        className="hidden md:flex"
        style={{
          width: "42%",
          minWidth: 300,
          flexShrink: 0,
          background: "var(--forest-950)",
          padding: "44px 48px",
          flexDirection: "column",
          position: "sticky",
          top: 0,
          height: "100vh",
          overflowY: "auto",
        }}
      >
        <a
          href="/"
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 9,
            textDecoration: "none",
            marginBottom: 0,
          }}
        >
          <span
            style={{
              width: 26,
              height: 26,
              borderRadius: 7,
              background: "oklch(0.30 0.04 155)",
              color: "oklch(0.88 0.03 90)",
              display: "grid",
              placeItems: "center",
              fontFamily: "var(--font-display)",
              fontStyle: "italic",
              fontSize: 17,
            }}
          >
            a
          </span>
          <span
            style={{
              fontFamily: "var(--font-display)",
              fontSize: 17,
              fontWeight: 400,
              color: "oklch(0.86 0.03 90)",
              letterSpacing: "-0.015em",
            }}
          >
            Aliran
          </span>
        </a>

        <div
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            paddingTop: 48,
            paddingBottom: 48,
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(26px, 2.6vw, 36px)",
              lineHeight: 1.1,
              letterSpacing: "-0.025em",
              color: "oklch(0.90 0.03 90)",
              margin: "0 0 14px",
            }}
          >
            Satu tempat untuk semua langganan{" "}
            <em style={{ fontStyle: "italic", color: "oklch(0.68 0.10 155)" }}>
              patungan.
            </em>
          </h2>
          <p
            style={{
              fontSize: 13.5,
              color: "oklch(0.58 0.018 90)",
              lineHeight: 1.6,
              margin: "0 0 36px",
            }}
          >
            Lacak, tagih, verify — semua dari satu dashboard.
          </p>

          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {PREVIEW_ROWS.map((row) => (
              <div
                key={row.name}
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  padding: "13px 16px",
                  borderRadius: 9,
                  background: "oklch(0.16 0.022 160)",
                }}
              >
                <div>
                  <div
                    style={{
                      fontSize: 13,
                      fontWeight: 500,
                      color: "oklch(0.86 0.03 90)",
                      marginBottom: 2,
                    }}
                  >
                    {row.name}
                  </div>
                  <div
                    style={{
                      fontFamily: "var(--font-mono)",
                      fontSize: 10.5,
                      color: "oklch(0.50 0.014 90)",
                    }}
                  >
                    {row.amount}
                  </div>
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    fontWeight: 500,
                    color: row.statusColor,
                    fontFamily: "var(--font-mono)",
                    letterSpacing: "0.04em",
                  }}
                >
                  {row.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        <p style={{ fontSize: 12, color: "white" }}>
          Sudah punya akun?{" "}
          <a
            href="/signin"
            style={{
              color: "oklch(0.62 0.08 155)",
              fontWeight: 500,
              textDecoration: "none",
            }}
            onMouseOver={(e) =>
              (e.currentTarget.style.textDecoration = "underline")
            }
            onMouseOut={(e) => (e.currentTarget.style.textDecoration = "none")}
            onFocus={(e) =>
              (e.currentTarget.style.textDecoration = "underline")
            }
            onBlur={(e) => (e.currentTarget.style.textDecoration = "none")}
          >
            Masuk
          </a>
        </p>
      </div>

      {/* Right panel */}
      <div
        style={{
          flex: 1,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          padding: "48px 24px",
          minHeight: "100vh",
          background: "var(--cream-100)",
        }}
      >
        <div style={{ width: "100%", maxWidth: 380 }}>
          {/* Mobile logo */}
          <div
            className="md:hidden"
            style={{ textAlign: "center", marginBottom: 40 }}
          >
            <a href="/" style={{ textDecoration: "none" }}>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 26,
                  fontWeight: 400,
                  color: "var(--forest-800)",
                  letterSpacing: "-0.02em",
                }}
              >
                Aliran
              </span>
            </a>
          </div>

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
            Buat akun
          </h1>
          <p
            style={{
              fontSize: 13,
              color: "var(--ink-400)",
              margin: "0 0 28px",
            }}
          >
            Gratis selamanya · tanpa kartu kredit
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
                {error}
              </div>
            )}

            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              <div>
                <Label
                  htmlFor="name"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--ink-700)",
                    marginBottom: 6,
                  }}
                >
                  Nama
                </Label>
                <Input
                  id="name"
                  placeholder="Nama kamu"
                  autoComplete="name"
                  aria-invalid={!!errors.name}
                  aria-describedby={errors.name ? "name-error" : undefined}
                  {...register("name")}
                />
                {errors.name && (
                  <p
                    id="name-error"
                    style={{
                      fontSize: 12,
                      color: "var(--clay-600)",
                      marginTop: 5,
                    }}
                  >
                    {errors.name.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="email"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--ink-700)",
                    marginBottom: 6,
                  }}
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
                    style={{
                      fontSize: 12,
                      color: "var(--clay-600)",
                      marginTop: 5,
                    }}
                  >
                    {errors.email.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="password"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--ink-700)",
                    marginBottom: 6,
                  }}
                >
                  Password
                </Label>
                <Input
                  id="password"
                  type="password"
                  placeholder="Min. 8 karakter"
                  autoComplete="new-password"
                  aria-invalid={!!errors.password}
                  aria-describedby={
                    errors.password ? "password-error" : undefined
                  }
                  {...register("password")}
                />
                {errors.password && (
                  <p
                    id="password-error"
                    style={{
                      fontSize: 12,
                      color: "var(--clay-600)",
                      marginTop: 5,
                    }}
                  >
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div>
                <Label
                  htmlFor="confirmPassword"
                  style={{
                    display: "block",
                    fontSize: 13,
                    fontWeight: 500,
                    color: "var(--ink-700)",
                    marginBottom: 6,
                  }}
                >
                  Konfirmasi password
                </Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  placeholder="Ulangi password"
                  autoComplete="new-password"
                  aria-invalid={!!errors.confirmPassword}
                  aria-describedby={
                    errors.confirmPassword ? "confirm-error" : undefined
                  }
                  {...register("confirmPassword")}
                />
                {errors.confirmPassword && (
                  <p
                    id="confirm-error"
                    style={{
                      fontSize: 12,
                      color: "var(--clay-600)",
                      marginTop: 5,
                    }}
                  >
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
              {isSubmitting ? "Membuat akun..." : "Buat akun gratis"}
            </Button>

            <p
              className="md:hidden"
              style={{
                fontSize: 13,
                color: "var(--ink-400)",
                textAlign: "center",
                marginTop: 20,
              }}
            >
              Sudah punya akun?{" "}
              <a
                href="/signin"
                style={{ color: "var(--forest-700)", fontWeight: 500 }}
              >
                Masuk
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
