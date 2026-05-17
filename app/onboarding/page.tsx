import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { OnboardingWizard } from "@/features/onboarding";

export const metadata: Metadata = { title: "Selamat Datang di Aliran" };

export default async function OnboardingPage() {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: "var(--cream-100)" }}>
      <OnboardingWizard userId={session.user.id} userName={session.user.name ?? ""} />
    </div>
  );
}
