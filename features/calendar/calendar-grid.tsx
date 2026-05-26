"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  startOfMonth,
  endOfMonth,
  startOfWeek,
  endOfWeek,
  eachDayOfInterval,
  format,
  isSameMonth,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
} from "date-fns";
import { id } from "date-fns/locale";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { formatRupiah } from "@/lib/utils/currency";

interface CalendarItem {
  id: string;
  type?: string;
  amount: string;
  occurredAt?: Date;
  dueAt?: Date;
  commitment?: { name: string } | null;
  category?: { name: string } | null;
}

interface Props {
  year: number;
  month: number;
  flows: CalendarItem[];
  obligations: CalendarItem[];
}

export function CalendarGrid({ year, month, flows, obligations }: Props) {
  const router = useRouter();
  const [selectedDay, setSelectedDay] = useState<Date | null>(null);

  const currentDate = new Date(year, month - 1, 1);
  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calStart = startOfWeek(monthStart, { weekStartsOn: 1 });
  const calEnd = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const days = eachDayOfInterval({ start: calStart, end: calEnd });

  function navigate(direction: "prev" | "next") {
    const next = direction === "prev" ? subMonths(currentDate, 1) : addMonths(currentDate, 1);
    router.push(`/calendar?year=${next.getFullYear()}&month=${next.getMonth() + 1}`);
  }

  function getDayItems(day: Date) {
    const dayFlows = flows.filter((f) => f.occurredAt && isSameDay(f.occurredAt, day));
    const dayObligations = obligations.filter((o) => o.dueAt && isSameDay(o.dueAt, day));
    return { dayFlows, dayObligations };
  }

  const selectedItems = selectedDay ? getDayItems(selectedDay) : null;

  const DAY_LABELS = ["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"];

  return (
    <div className="space-y-4">
      {/* Month navigation */}
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate("prev")}
          className="p-2 rounded-lg hover:bg-gray-100"
          style={{ color: "var(--ink-500)" }}
        >
          <ChevronLeft size={20} />
        </button>
        <h2 className="text-lg font-semibold" style={{ color: "var(--ink-700)" }}>
          {format(currentDate, "MMMM yyyy", { locale: id })}
        </h2>
        <button
          onClick={() => navigate("next")}
          className="p-2 rounded-lg hover:bg-gray-100"
          style={{ color: "var(--ink-500)" }}
        >
          <ChevronRight size={20} />
        </button>
      </div>

      {/* Calendar grid */}
      <div className="rounded-xl border overflow-hidden" style={{ background: "white", borderColor: "var(--line)" }}>
        {/* Day headers */}
        <div className="grid grid-cols-7 border-b" style={{ borderColor: "var(--line)" }}>
          {DAY_LABELS.map((d) => (
            <div key={d} className="py-2 text-center text-xs font-medium" style={{ color: "var(--ink-400)" }}>
              {d}
            </div>
          ))}
        </div>

        {/* Days */}
        <div className="grid grid-cols-7">
          {days.map((day, i) => {
            const { dayFlows, dayObligations } = getDayItems(day);
            const inMonth = isSameMonth(day, currentDate);
            const isSelected = selectedDay ? isSameDay(day, selectedDay) : false;
            const today = isToday(day);

            return (
              <button
                key={day.toISOString()}
                onClick={() => setSelectedDay(isSelected ? null : day)}
                className="relative p-2 min-h-[60px] text-left transition-colors hover:bg-gray-50"
                style={{
                  borderRight: (i + 1) % 7 !== 0 ? `1px solid var(--line)` : "none",
                  borderBottom: i < days.length - 7 ? `1px solid var(--line)` : "none",
                  background: isSelected ? "var(--forest-50)" : "white",
                }}
              >
                <span
                  className="text-sm font-medium inline-flex w-6 h-6 items-center justify-center rounded-full"
                  style={{
                    color: !inMonth ? "var(--ink-300)" : today ? "white" : "var(--ink-700)",
                    background: today ? "var(--forest-700)" : "transparent",
                  }}
                >
                  {format(day, "d")}
                </span>
                {inMonth && (
                  <div className="flex gap-1 mt-1 flex-wrap">
                    {dayFlows.filter((f) => f.type === "income").length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--income)" }} />
                    )}
                    {dayFlows.filter((f) => f.type === "expense").length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--expense)" }} />
                    )}
                    {dayObligations.length > 0 && (
                      <span className="w-1.5 h-1.5 rounded-full" style={{ background: "var(--scheduled)" }} />
                    )}
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Legend */}
      <div className="flex gap-4 text-xs" style={{ color: "var(--ink-400)" }}>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--income)" }} />
          Pemasukan
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--expense)" }} />
          Pengeluaran
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2 h-2 rounded-full" style={{ background: "var(--scheduled)" }} />
          Tagihan
        </span>
      </div>

      {/* Day detail */}
      {selectedDay && selectedItems && (
        <div className="rounded-xl border p-5" style={{ background: "white", borderColor: "var(--line)" }}>
          <h3 className="text-sm font-semibold mb-3" style={{ color: "var(--ink-700)" }}>
            {format(selectedDay, "d MMMM yyyy", { locale: id })}
          </h3>
          {selectedItems.dayFlows.length === 0 && selectedItems.dayObligations.length === 0 ? (
            <p className="text-sm" style={{ color: "var(--ink-400)" }}>Tidak ada aktivitas hari ini.</p>
          ) : (
            <div className="space-y-2">
              {selectedItems.dayFlows.map((f) => (
                <div key={f.id} className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--ink-600)" }}>
                    {f.category?.name ?? f.type}
                  </span>
                  <span
                    className="font-mono font-medium"
                    style={{ color: f.type === "income" ? "var(--income)" : "var(--expense)" }}
                  >
                    {f.type === "income" ? "+" : "-"}{formatRupiah(Number(f.amount))}
                  </span>
                </div>
              ))}
              {selectedItems.dayObligations.map((o) => (
                <div key={o.id} className="flex items-center justify-between text-sm">
                  <span style={{ color: "var(--ink-600)" }}>
                    🔵 {o.commitment?.name ?? "Tagihan"}
                  </span>
                  <span className="font-mono font-medium" style={{ color: "var(--scheduled)" }}>
                    {formatRupiah(Number(o.amount))}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
