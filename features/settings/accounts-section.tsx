"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Plus } from "lucide-react";
import { createFinancialAccount, archiveFinancialAccount } from "@/lib/actions/accounts";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { FinancialAccount } from "@/lib/schema";
import { formatRupiah } from "@/lib/utils/currency";

const ACCOUNT_TYPE_LABEL: Record<string, string> = {
  bank: "Bank",
  ewallet: "E-Wallet",
  cash: "Tunai",
  credit_card: "Kartu Kredit",
};

interface Props {
  userId: string;
  accounts: FinancialAccount[];
}

export function AccountsSection({ userId, accounts }: Props) {
  const router = useRouter();
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [type, setType] = useState<"bank" | "ewallet" | "cash" | "credit_card">("bank");
  const [balance, setBalance] = useState("0");
  const [saving, setSaving] = useState(false);

  async function handleAdd() {
    if (!name.trim()) return;
    setSaving(true);
    await createFinancialAccount({ userId, name, type, balance, isDefault: accounts.length === 0 });
    setSaving(false);
    setShowForm(false);
    setName("");
    setBalance("0");
    router.refresh();
  }

  async function handleArchive(id: string) {
    if (!confirm("Hapus rekening ini?")) return;
    await archiveFinancialAccount(id, userId);
    router.refresh();
  }

  return (
    <section>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-semibold" style={{ color: "var(--ink-700)" }}>Rekening</h2>
        <Button size="sm" variant="outline" onClick={() => setShowForm(!showForm)}>
          <Plus size={14} className="mr-1" />
          Tambah
        </Button>
      </div>

      <div className="rounded-xl border overflow-hidden" style={{ background: "white", borderColor: "var(--line)" }}>
        {accounts.map((a, i) => (
          <div
            key={a.id}
            className="flex items-center justify-between px-5 py-3.5"
            style={{ borderBottom: i < accounts.length - 1 ? `1px solid var(--line)` : "none" }}
          >
            <div>
              <p className="text-sm font-medium" style={{ color: "var(--ink-700)" }}>
                {a.name}
                {a.isDefault && (
                  <span className="ml-2 text-xs px-1.5 py-0.5 rounded" style={{ background: "var(--forest-100)", color: "var(--forest-700)" }}>
                    Default
                  </span>
                )}
              </p>
              <p className="text-xs" style={{ color: "var(--ink-400)" }}>
                {ACCOUNT_TYPE_LABEL[a.type] ?? a.type}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <span className="text-sm font-mono font-semibold" style={{ color: "var(--ink-700)" }}>
                {formatRupiah(Number(a.balance))}
              </span>
              <button
                onClick={() => handleArchive(a.id)}
                className="text-xs"
                style={{ color: "var(--ink-300)" }}
              >
                Hapus
              </button>
            </div>
          </div>
        ))}

        {accounts.length === 0 && !showForm && (
          <div className="px-5 py-8 text-center">
            <p className="text-sm" style={{ color: "var(--ink-400)" }}>
              Belum ada rekening. Tambah sekarang!
            </p>
          </div>
        )}

        {showForm && (
          <div className="p-5 border-t space-y-3" style={{ borderColor: "var(--line)" }}>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <Label>Nama Rekening</Label>
                <Input
                  placeholder="e.g. BCA Utama"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label>Tipe</Label>
                <select
                  className="flex h-9 w-full rounded-md border px-3 py-1 text-sm"
                  style={{ borderColor: "var(--line)", background: "white" }}
                  value={type}
                  onChange={(e) => setType(e.target.value as typeof type)}
                >
                  <option value="bank">Bank</option>
                  <option value="ewallet">E-Wallet</option>
                  <option value="cash">Tunai</option>
                  <option value="credit_card">Kartu Kredit</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label>Saldo Awal (Rp)</Label>
              <Input
                type="number"
                placeholder="0"
                value={balance}
                onChange={(e) => setBalance(e.target.value)}
              />
            </div>
            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} disabled={saving}>
                {saving ? "Menyimpan..." : "Simpan"}
              </Button>
              <Button size="sm" variant="outline" onClick={() => setShowForm(false)}>
                Batal
              </Button>
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
