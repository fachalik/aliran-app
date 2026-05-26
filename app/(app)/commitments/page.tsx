import type { Metadata } from "next";
import { CommitmentsView } from "@/features/commitments";

export const metadata: Metadata = { title: "Subscription" };

export default function CommitmentsPage() {
  return <CommitmentsView />;
}
