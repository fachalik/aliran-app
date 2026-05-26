import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { commitments, financialAccounts } from "@/lib/schema";
import { eq, and, isNull } from "drizzle-orm";
import { CommitmentList } from "./commitment-list";
import { NewCommitmentButton } from "./new-commitment-button";
import { formatRupiah } from "@/lib/utils/currency";

export async function CommitmentsView() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const [userCommitments, userAccounts] = await Promise.all([
    db.query.commitments.findMany({
      where: eq(commitments.userId, session.user.id),
      orderBy: [commitments.nextRenewalAt],
    }),
    db.query.financialAccounts.findMany({
      where: and(
        eq(financialAccounts.userId, session.user.id),
        isNull(financialAccounts.archivedAt)
      ),
    }),
  ]);

  const activeCommitments = userCommitments.filter((c) => c.status === "active");
  const monthlyTotal = activeCommitments
    .filter((c) => c.billingCycle === "monthly")
    .reduce((sum, c) => sum + Number(c.amount), 0);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--ink-900)", fontFamily: "var(--font-display)" }}>
            Subscription
          </h1>
          {activeCommitments.length > 0 && (
            <p className="text-sm mt-0.5" style={{ color: "var(--ink-400)" }}>
              {activeCommitments.length} aktif · Total {formatRupiah(monthlyTotal)}/bulan
            </p>
          )}
        </div>
        <NewCommitmentButton userId={session.user.id} accounts={userAccounts} />
      </div>
      <CommitmentList commitments={userCommitments} userId={session.user.id} />
    </div>
  );
}
