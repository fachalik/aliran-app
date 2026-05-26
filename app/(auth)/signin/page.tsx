import type { Metadata } from "next";
import { Suspense } from "react";
import { SignInForm } from "@/features/auth";

export const metadata: Metadata = { title: "Masuk" };

export default function SignInPage() {
  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
