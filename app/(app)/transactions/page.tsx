import type { Metadata } from "next";
import { TransactionsView } from "@/features/transactions";

export const metadata: Metadata = { title: "Transaksi" };

export default function TransactionsPage() {
  return <TransactionsView />;
}
