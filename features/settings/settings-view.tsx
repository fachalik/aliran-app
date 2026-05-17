import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { financialAccounts } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";
import { AccountsSection } from "./accounts-section";
import { ProfileSection } from "./profile-section";

export async function SettingsView() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const userAccounts = await db.query.financialAccounts.findMany({
    where: and(
      eq(financialAccounts.userId, session.user.id),
      isNull(financialAccounts.archivedAt)
    ),
  });

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-8">
      <h1 className="text-2xl font-bold" style={{ color: "var(--ink-900)", fontFamily: "var(--font-display)" }}>
        Pengaturan
      </h1>
      <ProfileSection user={session.user} />
      <AccountsSection userId={session.user.id} accounts={userAccounts} />
    </div>
  );
}
