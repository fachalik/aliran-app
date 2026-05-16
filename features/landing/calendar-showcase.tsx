import { Card, CardContent } from "@/components/ui/card";

type CalDay = {
  d: string;
  m?: boolean;
  today?: boolean;
  recv?: boolean;
  sched?: boolean;
  dots?: string[];
};

const DAYS: CalDay[] = [
  { d: "26", m: true },
  { d: "27", m: true },
  { d: "28", m: true },
  { d: "29", m: true },
  { d: "30", m: true },
  { d: "31", m: true },
  { d: "1", dots: ["income"] },
  { d: "2" },
  { d: "3", dots: ["expense"] },
  { d: "4", dots: ["expense", "expense"] },
  { d: "5" },
  { d: "6" },
  { d: "7", today: true, dots: ["white"] },
  { d: "8", dots: ["expense"] },
  { d: "9" },
  { d: "10", dots: ["expense"] },
  { d: "11" },
  { d: "12", recv: true, dots: ["receivable"] },
  { d: "13" },
  { d: "14" },
  { d: "15", sched: true, dots: ["scheduled", "receivable"] },
  { d: "16" },
  { d: "17", dots: ["expense"] },
  { d: "18" },
  { d: "19" },
  { d: "20", sched: true, dots: ["scheduled"] },
  { d: "21" },
  { d: "22" },
  { d: "23" },
  { d: "24", dots: ["expense"] },
  { d: "25", dots: ["income"] },
  { d: "26" },
  { d: "27" },
  { d: "28", sched: true, dots: ["scheduled"] },
  { d: "29" },
];

const DOT_COLOR: Record<string, string> = {
  income: "var(--income)",
  expense: "var(--expense)",
  scheduled: "var(--scheduled)",
  receivable: "var(--receivable)",
  white: "var(--cream-50)",
};

const BULLETS = [
  ["Color-coded dots", "— income, expense, scheduled, receivable"],
  ["Balance forecast", "— prediksi sisa akhir bulan dari upcoming flow"],
  ["Filter", "by account, category, commitment"],
];

function CheckIcon() {
  return (
    <svg
      aria-hidden="true"
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="var(--forest-900)"
      strokeWidth="2.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      style={{ flexShrink: 0, marginTop: 2 }}
    >
      <path d="M5 12l5 5L20 7" />
    </svg>
  );
}

export function CalendarShowcase() {
  return (
    <section
      className="px-6 py-16 md:py-24"
      style={{ borderTop: "1px solid var(--line)" }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-[1.1fr_1fr] items-center gap-14 md:gap-20"
        style={{ maxWidth: 1180, margin: "0 auto" }}
      >
        <Card
          className="order-2 md:order-1"
          style={{
            border: "1px solid var(--line)",
            background: "var(--surface)",
            boxShadow: "var(--shadow-2)",
            maxWidth: 460,
          }}
        >
          <CardContent className="p-7">
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 26,
                letterSpacing: "-0.01em",
                marginBottom: 4,
              }}
            >
              November{" "}
              <em style={{ color: "var(--forest-900)", fontStyle: "italic" }}>
                &apos;26
              </em>
            </div>
            <p
              style={{
                fontSize: 13,
                color: "var(--ink-500)",
                marginBottom: 20,
              }}
            >
              3 commitment akan renewal ·{" "}
              <strong style={{ color: "var(--forest-900)" }}>
                net +Rp 145.000 receivable
              </strong>
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(7, 1fr)",
                gap: 5,
              }}
            >
              {["Sen", "Sel", "Rab", "Kam", "Jum", "Sab", "Min"].map((d) => (
                <div
                  key={d}
                  style={{
                    font: "500 10px/1 var(--font-mono)",
                    color: "var(--ink-500)",
                    textAlign: "center",
                    padding: "4px 0",
                    textTransform: "uppercase",
                  }}
                >
                  {d[0]}
                </div>
              ))}
              {DAYS.map((day) => {
                const dayKey = `${day.d}-${day.m ? "p" : day.today ? "t" : "c"}`;
                return (
                  <div
                    key={dayKey}
                    style={{
                      aspectRatio: "1",
                      borderRadius: 8,
                      padding: 6,
                      fontSize: 11.5,
                      display: "flex",
                      flexDirection: "column",
                      border: `1px solid ${day.recv ? "oklch(0.85 0.07 80)" : day.sched ? "oklch(0.85 0.05 260)" : "transparent"}`,
                      background: day.today
                        ? "var(--forest-900)"
                        : day.recv
                          ? "var(--amber-200)"
                          : day.sched
                            ? "var(--indigo-200)"
                            : "transparent",
                      color: day.m
                        ? "var(--ink-300)"
                        : day.today
                          ? "var(--cream-50)"
                          : "var(--ink-700)",
                      fontWeight: day.today ? 500 : "normal",
                    }}
                  >
                    {day.d}
                    {day.dots && (
                      <div
                        style={{ marginTop: "auto", display: "flex", gap: 2 }}
                      >
                        {day.dots
                          .reduce<{ key: string; dot: string }[]>(
                            (acc, dot) => {
                              const count = acc.filter(
                                (x) => x.dot === dot,
                              ).length;
                              return acc.concat({
                                key: `${day.d}-${dot}-${count}`,
                                dot,
                              });
                            },
                            [],
                          )
                          .map(({ key, dot }) => (
                            <i
                              key={key}
                              style={{
                                width: 4.5,
                                height: 4.5,
                                borderRadius: "50%",
                                display: "block",
                                background: DOT_COLOR[dot],
                                opacity: dot === "white" ? 0.7 : 1,
                              }}
                            />
                          ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <div className="order-1 md:order-2">
          <p
            style={{
              font: "500 11px/1 var(--font-mono)",
              color: "var(--ink-500)",
              letterSpacing: "0.12em",
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            02 — CALENDAR-FIRST
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(32px, 3.6vw, 48px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              margin: "0 0 20px",
            }}
          >
            Kalender,{" "}
            <em style={{ fontStyle: "italic", color: "var(--forest-900)" }}>
              bukan daftar.
            </em>
          </h2>
          <p
            style={{
              fontSize: 16.5,
              color: "var(--ink-700)",
              lineHeight: 1.6,
              margin: "0 0 28px",
            }}
          >
            Lihat persis kapan duit masuk, kapan keluar. Forecast balance akhir
            bulan terhitung otomatis dari upcoming commitments.
          </p>
          <ul className="flex flex-col gap-3 p-0" style={{ listStyle: "none" }}>
            {BULLETS.map(([bold, rest]) => (
              <li
                key={bold}
                className="flex items-start gap-3"
                style={{ fontSize: 14.5, color: "var(--ink-700)" }}
              >
                <CheckIcon />
                <span>
                  <strong style={{ color: "var(--text)", fontWeight: 600 }}>
                    {bold}
                  </strong>{" "}
                  {rest}
                </span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
