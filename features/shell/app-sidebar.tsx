"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { signOut } from "@/lib/auth-client";
import {
  ArrowLeftRight,
  Calendar,
  ChevronsUpDown,
  LayoutDashboard,
  LogOut,
  RefreshCw,
  Settings,
} from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar";

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

  const initials = (user.name ?? user.email)
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  async function handleSignOut() {
    await signOut();
    router.push("/");
    router.refresh();
  }

  return (
    <Sidebar collapsible="icon">
      {/* Logo */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" render={<Link href="/dashboard" />}>
              <div
                style={{
                  width: 28,
                  height: 28,
                  borderRadius: 7,
                  background: "var(--forest-900)",
                  color: "var(--cream-50)",
                  display: "grid",
                  placeItems: "center",
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 17,
                  flexShrink: 0,
                }}
              >
                a
              </div>
              <span
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 18,
                  fontWeight: 400,
                  color: "var(--forest-800)",
                  letterSpacing: "-0.015em",
                }}
              >
                Aliran
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Nav */}
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {NAV.map(({ href, label, icon: Icon }) => {
                const active =
                  pathname === href || pathname.startsWith(`${href}/`);
                return (
                  <SidebarMenuItem key={href}>
                    <SidebarMenuButton
                      render={<Link href={href} />}
                      isActive={active}
                      tooltip={label}
                    >
                      <Icon />
                      <span>{label}</span>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                );
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User */}
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger
                render={
                  <SidebarMenuButton
                    size="lg"
                    className="data-open:bg-sidebar-accent data-open:text-sidebar-accent-foreground"
                    tooltip={user.name ?? user.email}
                  />
                }
              >
                <Avatar className="h-7 w-7 rounded-lg">
                  <AvatarFallback
                    className="rounded-lg text-xs font-medium"
                    style={{
                      background: "var(--forest-200)",
                      color: "var(--forest-800)",
                    }}
                  >
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="grid flex-1 text-left text-sm leading-tight">
                  <span
                    className="truncate font-medium"
                    style={{ color: "var(--ink-700)" }}
                  >
                    {user.name ?? "User"}
                  </span>
                  <span
                    className="truncate text-xs"
                    style={{ color: "var(--ink-400)" }}
                  >
                    {user.email}
                  </span>
                </div>
                <ChevronsUpDown
                  className="ml-auto size-4"
                  style={{ color: "var(--ink-400)" }}
                />
              </DropdownMenuTrigger>
              <DropdownMenuContent side="top" align="end" className="min-w-52 rounded-lg">
                <DropdownMenuItem render={<Link href="/settings" />}>
                  <Settings className="size-4" />
                  Pengaturan
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={handleSignOut}
                  className="cursor-pointer"
                  style={{ color: "var(--clay-600)" }}
                >
                  <LogOut className="size-4" />
                  Keluar
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      <SidebarRail />
    </Sidebar>
  );
}
