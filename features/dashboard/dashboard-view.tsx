import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { getDashboardData } from "@/lib/queries/dashboard";
import { BalanceTile } from "./balance-tile";
import { MonthSummary } from "./month-summary";
import { UpcomingObligations } from "./upcoming-obligations";
import { RecentTransactions } from "./recent-transactions";
import { SubscriptionSummary } from "./subscription-summary";
import { QuickActions } from "./quick-actions";
import { redirect } from "next/navigation";

export async function DashboardView() {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const data = await getDashboardData(session.user.id);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold" style={{ color: "var(--ink-900)", fontFamily: "var(--font-display)" }}>
            Dashboard
          </h1>
          <p className="text-sm mt-0.5" style={{ color: "var(--ink-400)" }}>
            Selamat datang, {session.user.name ?? "kamu"} 👋
          </p>
        </div>
        <QuickActions />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <BalanceTile totalBalance={data.totalBalance} accounts={data.accounts} />
        <MonthSummary income={data.monthIncome} expense={data.monthExpense} net={data.monthNet} />
        <SubscriptionSummary
          count={data.activeCommitmentsCount}
          monthlyTotal={data.monthlySubscriptionCost}
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <UpcomingObligations obligations={data.upcomingObligations} />
        <RecentTransactions flows={data.recentFlows} />
      </div>
    </div>
  );
}
