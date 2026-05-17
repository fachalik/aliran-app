"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CommitmentForm } from "./commitment-form";
import type { FinancialAccount } from "@/lib/schema";

interface Props {
  userId: string;
  accounts: FinancialAccount[];
}

export function NewCommitmentButton({ userId, accounts }: Props) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button onClick={() => setOpen(true)} size="sm">
        <Plus size={15} className="mr-1" />
        Tambah Subscription
      </Button>

      {open && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4" style={{ background: "rgba(0,0,0,.4)" }}>
          <div className="w-full max-w-md rounded-2xl p-6 max-h-[90vh] overflow-y-auto" style={{ background: "white" }}>
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-lg font-semibold" style={{ color: "var(--ink-900)" }}>Tambah Subscription</h2>
              <button onClick={() => setOpen(false)} className="text-sm" style={{ color: "var(--ink-400)" }}>✕</button>
            </div>
            <CommitmentForm
              userId={userId}
              accounts={accounts}
              onSuccess={() => setOpen(false)}
            />
          </div>
        </div>
      )}
    </>
  );
}
