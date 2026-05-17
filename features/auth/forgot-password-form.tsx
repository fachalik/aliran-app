"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const schema = z.object({
  email: z.email("Format email tidak valid"),
});

type FormData = z.infer<typeof schema>;

export function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<FormData>({ resolver: zodResolver(schema) });

  async function onSubmit(data: FormData) {
    await fetch("/api/auth/request-password-reset", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: data.email, redirectTo: "/reset-password" }),
    });
    setSent(true);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Lupa Password</CardTitle>
        <CardDescription>Masukkan email kamu untuk menerima link reset password</CardDescription>
      </CardHeader>
      {sent ? (
        <CardContent>
          <p className="text-sm p-3 rounded-md bg-green-50 text-green-700 border border-green-200">
            Link reset password sudah dikirim ke email kamu. Cek inbox (atau spam folder).
          </p>
        </CardContent>
      ) : (
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Email</Label>
              <Input id="email" type="email" placeholder="kamu@email.com" {...register("email")} />
              {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-3">
            <Button type="submit" className="w-full" disabled={isSubmitting}>
              {isSubmitting ? "Mengirim..." : "Kirim Link Reset"}
            </Button>
            <p className="text-sm text-center" style={{ color: "var(--ink-500)" }}>
              Ingat password?{" "}
              <a href="/signin" style={{ color: "var(--forest-700)" }} className="font-medium">
                Masuk
              </a>
            </p>
          </CardFooter>
        </form>
      )}
    </Card>
  );
}
