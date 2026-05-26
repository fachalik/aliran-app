import { formatRupiah } from "@/lib/utils/currency";
import { format } from "date-fns";
import { id } from "date-fns/locale";

interface Props {
  income: number;
  expense: number;
  net: number;
}

export function MonthSummary({ income, expense, net }: Props) {
  const monthLabel = format(new Date(), "MMMM yyyy", { locale: id });

  return (
    <div className="rounded-xl p-5 border" style={{ background: "white", borderColor: "var(--line)" }}>
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ink-400)" }}>
        {monthLabel}
      </p>
      <div className="mt-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "var(--ink-500)" }}>Pemasukan</span>
          <span className="text-sm font-semibold font-mono" style={{ color: "var(--income)" }}>
            +{formatRupiah(income)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "var(--ink-500)" }}>Pengeluaran</span>
          <span className="text-sm font-semibold font-mono" style={{ color: "var(--expense)" }}>
            -{formatRupiah(expense)}
          </span>
        </div>
        <div className="h-px" style={{ background: "var(--line)" }} />
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium" style={{ color: "var(--ink-700)" }}>Net</span>
          <span
            className="text-base font-bold font-mono"
            style={{ color: net >= 0 ? "var(--income)" : "var(--expense)" }}
          >
            {net >= 0 ? "+" : ""}{formatRupiah(net)}
          </span>
        </div>
      </div>
    </div>
  );
}
