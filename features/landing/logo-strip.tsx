import { Separator } from "@/components/ui/separator";

const LOGOS = [
  { letter: "N", name: "Netflix", bg: "oklch(0.45 0.18 25)" },
  { letter: "S", name: "Spotify", bg: "oklch(0.65 0.18 145)" },
  { letter: "C", name: "Claude", bg: "oklch(0.35 0.06 280)" },
  { letter: "Y", name: "YouTube", bg: "oklch(0.55 0.16 30)" },
  { letter: "D", name: "Disney+", bg: "oklch(0.45 0.14 260)" },
];

export function LogoStrip() {
  return (
    <section style={{ background: "var(--cream-50)" }}>
      <Separator style={{ background: "var(--line)" }} />
      <div className="px-6 py-12 text-center">
        <p
          style={{
            font: "400 13px/1 var(--font-sans)",
            color: "var(--ink-500)",
            marginBottom: 28,
          }}
        >
          Dipake buat patungan subscription populer di Indonesia
        </p>
        <div
          className="flex flex-wrap items-center justify-center gap-x-14 gap-y-4"
          style={{ color: "var(--ink-700)" }}
        >
          {LOGOS.map(({ letter, name, bg }) => (
            <span
              key={name}
              className="flex items-center gap-2 opacity-65"
              style={{
                fontWeight: 600,
                fontSize: 16,
                letterSpacing: "-0.01em",
              }}
            >
              <span
                style={{
                  width: 22,
                  height: 22,
                  borderRadius: 5,
                  display: "grid",
                  placeItems: "center",
                  fontWeight: 700,
                  fontSize: 12,
                  background: bg,
                  color: "var(--cream-50)",
                }}
              >
                {letter}
              </span>
              {name}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
