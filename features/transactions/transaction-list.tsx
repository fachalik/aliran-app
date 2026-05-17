import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatRupiah } from "@/lib/utils/currency";

interface Flow {
  id: string;
  type: string;
  amount: string;
  occurredAt: Date;
  note?: string | null;
  category?: { name: string } | null;
}

interface Props {
  flows: Flow[];
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

export function TransactionList({ flows }: Props) {
  if (flows.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center border"
        style={{ background: "white", borderColor: "var(--line)" }}
      >
        <p className="text-sm" style={{ color: "var(--ink-400)" }}>
          Belum ada transaksi. Tambah transaksi pertamamu!
        </p>
      </div>
    );
  }

  return (
    <div className="rounded-xl border overflow-hidden" style={{ background: "white", borderColor: "var(--line)" }}>
      {flows.map((f, i) => (
        <div
          key={f.id}
          className="flex items-center justify-between px-5 py-3.5"
          style={{ borderBottom: i < flows.length - 1 ? `1px solid var(--line)` : "none" }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{
                background: TYPE_COLOR[f.type] + "1a",
                color: TYPE_COLOR[f.type],
              }}
            >
              {f.type === "income" ? "+" : f.type === "expense" ? "-" : "⇄"}
            </div>
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--ink-700)" }}>
                {f.category?.name ?? TYPE_LABEL[f.type] ?? f.type}
              </p>
              <p className="text-xs" style={{ color: "var(--ink-400)" }}>
                {format(f.occurredAt, "d MMM yyyy", { locale: id })}
                {f.note ? ` · ${f.note}` : ""}
              </p>
            </div>
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
  );
}
