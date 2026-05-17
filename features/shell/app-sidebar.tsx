"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  ArrowLeftRight,
  Calendar,
  RefreshCw,
  Settings,
  LogOut,
} from "lucide-react";

const NAV = [
  { href: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { href: "/transactions", label: "Transaksi", icon: ArrowLeftRight },
  { href: "/commitments", label: "Subscription", icon: RefreshCw },
  { href: "/calendar", label: "Kalender", icon: Calendar },
  { href: "/settings", label: "Pengaturan", icon: Settings },
];

interface Props {
  user: { name?: string | null; email: string };
}

export function AppSidebar({ user }: Props) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <aside
      className="hidden md:flex flex-col w-56 min-h-screen border-r shrink-0"
      style={{ borderColor: "var(--line)", background: "white" }}
    >
      {/* Logo */}
      <div className="px-5 py-5 border-b" style={{ borderColor: "var(--line)" }}>
        <span className="text-xl font-bold" style={{ color: "var(--forest-800)", fontFamily: "var(--font-display)" }}>
          Aliran
        </span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {NAV.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors"
              style={{
                background: active ? "var(--forest-100)" : "transparent",
                color: active ? "var(--forest-800)" : "var(--ink-500)",
              }}
            >
              <Icon size={17} />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* User */}
      <div className="px-4 py-4 border-t" style={{ borderColor: "var(--line)" }}>
        <div className="flex items-center gap-3 mb-3">
          <div
            className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
            style={{ background: "var(--forest-200)", color: "var(--forest-800)" }}
          >
            {(user.name ?? user.email)[0].toUpperCase()}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium truncate" style={{ color: "var(--ink-700)" }}>
              {user.name ?? "User"}
            </p>
            <p className="text-xs truncate" style={{ color: "var(--ink-400)" }}>
              {user.email}
            </p>
          </div>
        </div>
        <button
          onClick={handleSignOut}
          className="flex items-center gap-2 w-full px-3 py-2 rounded-lg text-sm transition-colors hover:bg-red-50"
          style={{ color: "var(--ink-400)" }}
        >
          <LogOut size={15} />
          Keluar
        </button>
      </div>
    </aside>
  );
}
