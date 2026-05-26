import Link from "next/link";
import { formatRupiah } from "@/lib/utils/currency";

interface Props {
  count: number;
  monthlyTotal: number;
}

export function SubscriptionSummary({ count, monthlyTotal }: Props) {
  return (
    <div className="rounded-xl p-5 border" style={{ background: "white", borderColor: "var(--line)" }}>
      <p className="text-xs font-medium uppercase tracking-wide" style={{ color: "var(--ink-400)" }}>
        Subscription Aktif
      </p>
      <div className="mt-3 space-y-2.5">
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "var(--ink-500)" }}>Jumlah</span>
          <span className="text-sm font-semibold" style={{ color: "var(--ink-700)" }}>
            {count} subscription
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm" style={{ color: "var(--ink-500)" }}>Total/bulan</span>
          <span className="text-sm font-semibold font-mono" style={{ color: "var(--scheduled)" }}>
            {formatRupiah(monthlyTotal)}
          </span>
        </div>
      </div>
      <Link
        href="/commitments"
        className="mt-4 block text-xs font-medium"
        style={{ color: "var(--forest-700)" }}
      >
        Lihat semua →
      </Link>
    </div>
  );
}
