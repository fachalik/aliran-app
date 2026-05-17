"use client";

import { format } from "date-fns";
import { id } from "date-fns/locale";
import { formatRupiah } from "@/lib/utils/currency";
import { updateCommitmentStatus } from "@/lib/actions/commitments";
import { useRouter } from "next/navigation";
import type { Commitment } from "@/lib/schema";

interface Props {
  commitments: Commitment[];
  userId: string;
}

const STATUS_BADGE: Record<string, { label: string; style: React.CSSProperties }> = {
  active: {
    label: "Aktif",
    style: { background: "var(--forest-100)", color: "var(--forest-800)" },
  },
  paused: {
    label: "Dijeda",
    style: { background: "var(--amber-200)", color: "var(--amber-600)" },
  },
  cancelled: {
    label: "Dibatalkan",
    style: { background: "var(--cream-300)", color: "var(--ink-400)" },
  },
};

const CYCLE_LABEL: Record<string, string> = {
  monthly: "Bulanan",
  yearly: "Tahunan",
  weekly: "Mingguan",
  custom: "Custom",
};

export function CommitmentList({ commitments, userId }: Props) {
  const router = useRouter();

  async function handleStatusChange(id: string, status: "active" | "paused" | "cancelled") {
    await updateCommitmentStatus(id, userId, status);
    router.refresh();
  }

  if (commitments.length === 0) {
    return (
      <div
        className="rounded-xl p-8 text-center border"
        style={{ background: "white", borderColor: "var(--line)" }}
      >
        <p className="text-sm" style={{ color: "var(--ink-400)" }}>
          Belum ada subscription. Tambah subscription pertamamu!
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {commitments.map((c) => {
        const badge = STATUS_BADGE[c.status] ?? STATUS_BADGE.active;
        return (
          <div
            key={c.id}
            className="rounded-xl border p-5"
            style={{ background: "white", borderColor: "var(--line)" }}
          >
            <div className="flex items-start justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="text-base font-semibold" style={{ color: "var(--ink-700)" }}>
                    {c.name}
                  </h3>
                  <span
                    className="text-xs px-2 py-0.5 rounded-full font-medium"
                    style={badge.style}
                  >
                    {badge.label}
                  </span>
                </div>
                <p className="text-sm" style={{ color: "var(--ink-400)" }}>
                  {CYCLE_LABEL[c.billingCycle]} ·{" "}
                  Renewal {format(c.nextRenewalAt, "d MMM yyyy", { locale: id })}
                </p>
              </div>
              <p className="text-lg font-bold font-mono" style={{ color: "var(--ink-700)" }}>
                {formatRupiah(Number(c.amount))}
              </p>
            </div>

            {c.status !== "cancelled" && (
              <div className="flex gap-2 mt-3 pt-3 border-t" style={{ borderColor: "var(--line)" }}>
                {c.status === "active" && (
                  <button
                    onClick={() => handleStatusChange(c.id, "paused")}
                    className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors hover:bg-amber-50"
                    style={{ borderColor: "var(--line)", color: "var(--ink-500)" }}
                  >
                    Jeda
                  </button>
                )}
                {c.status === "paused" && (
                  <button
                    onClick={() => handleStatusChange(c.id, "active")}
                    className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors hover:bg-green-50"
                    style={{ borderColor: "var(--line)", color: "var(--ink-500)" }}
                  >
                    Aktifkan
                  </button>
                )}
                <button
                  onClick={() => handleStatusChange(c.id, "cancelled")}
                  className="text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors hover:bg-red-50"
                  style={{ borderColor: "var(--line)", color: "var(--ink-400)" }}
                >
                  Batalkan
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
