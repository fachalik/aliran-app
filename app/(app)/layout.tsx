import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { AppSidebar } from "@/features/shell";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { Separator } from "@/components/ui/separator";

export default async function AppLayout({ children }: { children: React.ReactNode }) {
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    redirect("/signin");
  }

  return (
    <SidebarProvider>
      <AppSidebar user={session.user} />
      <SidebarInset>
        <header
          className="flex h-12 shrink-0 items-center gap-2 border-b"
          style={{ borderColor: "var(--line)", background: "var(--cream-50)" }}
        >
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator
              orientation="vertical"
              className="h-4"
              style={{ background: "var(--line)" }}
            />
          </div>
        </header>
        <div style={{ background: "var(--cream-100)", minHeight: "calc(100vh - 3rem)" }}>
          {children}
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
