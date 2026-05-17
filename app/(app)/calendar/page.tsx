import type { Metadata } from "next";
import { CalendarView } from "@/features/calendar";

export const metadata: Metadata = { title: "Kalender" };

export default function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string; year?: string }>;
}) {
  return <CalendarView searchParams={searchParams} />;
}
