import type { Metadata } from "next";
import { ResetPasswordForm } from "@/features/auth";

export const metadata: Metadata = { title: "Reset Password" };

export default function ResetPasswordPage() {
  return <ResetPasswordForm />;
}
