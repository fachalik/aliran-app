import { type FinancialAccount } from "@/lib/schema";
import { formatRupiah } from "@/lib/utils/currency";

interface Props {
  totalBalance: number;
  accounts: FinancialAccount[];
}

export function BalanceTile({ totalBalance, accounts }: Props) {
  return (
    <div
      className="rounded-xl p-5 col-span-1 md:col-span-1"
      style={{ background: "var(--forest-800)", color: "white" }}
    >
      <p className="text-xs font-medium opacity-70 uppercase tracking-wide">Total Saldo</p>
      <p className="text-3xl font-bold mt-1 font-mono">{formatRupiah(totalBalance)}</p>
      <div className="mt-4 space-y-1.5">
        {accounts.slice(0, 3).map((a) => (
          <div key={a.id} className="flex items-center justify-between text-xs opacity-80">
            <span>{a.name}</span>
            <span className="font-mono">{formatRupiah(Number(a.balance))}</span>
          </div>
        ))}
        {accounts.length > 3 && (
          <p className="text-xs opacity-60">+{accounts.length - 3} rekening lainnya</p>
        )}
      </div>
    </div>
  );
}
