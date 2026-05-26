import Link from "next/link";
import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatRupiah } from "@/lib/utils/currency";

interface Props {
  obligations: Array<{
    id: string;
    amount: string;
    dueAt: Date;
    commitment?: { name: string } | null;
  }>;
}

export function UpcomingObligations({ obligations }: Props) {
  return (
    <div className="rounded-xl p-5 border" style={{ background: "white", borderColor: "var(--line)" }}>
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-semibold" style={{ color: "var(--ink-700)" }}>
          Tagihan 7 Hari ke Depan
        </h3>
        <Link href="/commitments" className="text-xs" style={{ color: "var(--forest-700)" }}>
          Lihat semua
        </Link>
      </div>
      {obligations.length === 0 ? (
        <p className="text-sm" style={{ color: "var(--ink-400)" }}>
          Tidak ada tagihan mendatang 🎉
        </p>
      ) : (
        <div className="space-y-2">
          {obligations.map((o) => (
            <div key={o.id} className="flex items-center justify-between py-2 border-b last:border-0" style={{ borderColor: "var(--line)" }}>
              <div>
                <p className="text-sm font-medium" style={{ color: "var(--ink-700)" }}>
                  {o.commitment?.name ?? "Tagihan"}
                </p>
                <p className="text-xs" style={{ color: "var(--ink-400)" }}>
                  Jatuh tempo {format(o.dueAt, "d MMM", { locale: id })}
                </p>
              </div>
              <span
                className="text-sm font-semibold font-mono"
                style={{ color: "var(--scheduled)" }}
              >
                {formatRupiah(Number(o.amount))}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
