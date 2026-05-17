"use client";

import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { Plus } from "lucide-react";
import Link from "next/link";

export function QuickActions() {
  return (
    <div className="flex gap-2">
      <Link
        href="/commitments?new=1"
        className={cn(buttonVariants({ variant: "outline", size: "sm" }))}
      >
        <Plus size={15} className="mr-1" />
        Subscription
      </Link>
      <Link
        href="/transactions?new=1"
        className={cn(buttonVariants({ size: "sm" }))}
      >
        <Plus size={15} className="mr-1" />
        Transaksi
      </Link>
    </div>
  );
}
