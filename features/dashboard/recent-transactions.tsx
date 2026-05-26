import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatRupiah } from "@/lib/utils/currency";

interface Props {
  flows: Array<{
    id: string;
    type: string;
    amount: string;
    occurredAt: Date;
    note?: string | null;
    category?: { name: string } | null;
  }>;
}

const TYPE_COLOR: Record<string, string> = {
  income: "var(--income)",
  expense: "var(--expense)",
  transfer: "var(--scheduled)",
};

const TYPE_LABEL: Record<string, string> = {
  income: "Pemasukan",
  expense: "Pengeluaran",
  transfer: "Transfer",
};

export function RecentTransactions({ flows }: Props) {
  return (
    <div className="rounded-xl p-5 border" style={{ background: "white", borderColor: "var(--line)" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--ink-700)" }}>
          Transaksi Terbaru
        </h3>
        <Link href="/transactions" className="text-xs" style={{ color: "var(--forest-700)" }}>
          Lihat semua
        </Link>
      </div>
      {flows.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--ink-400)" }}>
          Belum ada transaksi. Tambah sekarang!
        </p>
      ) : (
        <div className="space-y-2">
          {flows.map((f) => (
            <div key={f.id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "var(--line)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--ink-700)" }}>
                  {f.category?.name ?? TYPE_LABEL[f.type] ?? f.type}
                </p>
                <p className="text-xs" style={{ color: "var(--ink-400)" }}>
                  {format(f.occurredAt, "d MMM", { locale: id })}
                  {f.note ? ` · ${f.note}` : ""}
                </p>
              </div>
              <span
                className="text-sm font-semibold font-mono"
                style={{ color: TYPE_COLOR[f.type] ?? "var(--ink-700)" }}
              >
                {f.type === "income" ? "+" : f.type === "expense" ? "-" : ""}
                {formatRupiah(Number(f.amount))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
