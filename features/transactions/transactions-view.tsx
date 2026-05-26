import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { financialAccounts, flows, categories } from "@/lib/schema";
import { eq, and, isNull, desc } from "drizzle-orm";
import { TransactionList } from "./transaction-list";
import { NewTransactionButton } from "./new-transaction-button";

export async function TransactionsView() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const [userAccounts, userFlows, userCategories] = await Promise.all([
    db.query.financialAccounts.findMany({
      where: and(eq(financialAccounts.userId, session.user.id), isNull(financialAccounts.archivedAt)),
    }),
    db.query.flows.findMany({
      where: eq(flows.userId, session.user.id),
      orderBy: [desc(flows.occurredAt)],
      limit: 50,
      with: { category: true },
    }),
    db.query.categories.findMany({
      where: eq(categories.userId, session.user.id),
    }),
  ]);

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold" style={{ color: "var(--ink-900)", fontFamily: "var(--font-display)" }}>
          Transaksi
        </h1>
        <NewTransactionButton
          userId={session.user.id}
          accounts={userAccounts}
          categories={userCategories}
        />
      </div>
      <TransactionList flows={userFlows} />
    </div>
  );
}
