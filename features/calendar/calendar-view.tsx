import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getCalendarData } from "@/lib/queries/calendar";
import { CalendarGrid } from "./calendar-grid";

interface Props {
  searchParams?: Promise<{ month?: string; year?: string }>;
}

export async function CalendarView({ searchParams }: Props = {}) {
  const session = await auth.api.getSession({ headers: await headers() });
  if (!session) redirect("/signin");

  const params = await searchParams;
  const now = new Date();
  const year = Number(params?.year ?? now.getFullYear());
  const month = Number(params?.month ?? now.getMonth() + 1);

  const data = await getCalendarData(session.user.id, year, month);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold" style={{ color: "var(--ink-900)", fontFamily: "var(--font-display)" }}>
        Kalender
      </h1>
      <CalendarGrid year={year} month={month} flows={data.flows} obligations={data.obligations} />
    </div>
  );
}
