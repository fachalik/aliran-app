import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const CARDS = [
  {
    status: "Paid",
    statusStyle: "paid",
    num: "#NOV-007",
    name: "Spotify Family",
    period: "Nov 2026 · 6 anggota",
    total: "Rp 79.000",
    perOrang: "Rp 13.200",
    accent: "var(--forest-700)",
    transform: "rotate(-10deg) translate(40px, 20px)",
    zIndex: 1,
    width: "clamp(170px, 16vw, 220px)",
  },
  {
    status: "Active",
    statusStyle: "active",
    num: "#NOV-013",
    name: "Netflix Premium",
    period: "Nov 2026 · 4 anggota",
    total: "Rp 186.000",
    perOrang: "Rp 46.500",
    accent: "var(--clay-600)",
    transform: "rotate(-2deg) translateY(-30px)",
    zIndex: 3,
    width: "clamp(190px, 18vw, 240px)",
  },
  {
    status: "Due",
    statusStyle: "due",
    num: "#NOV-021",
    name: "Claude Pro",
    period: "Nov 2026 · 3 anggota",
    total: "Rp 279.000",
    perOrang: "Rp 93.000",
    accent: "var(--amber-600)",
    transform: "rotate(10deg) translate(-40px, 15px)",
    zIndex: 2,
    width: "clamp(170px, 16vw, 220px)",
  },
];

const STATUS_BG: Record<string, string> = {
  paid: "var(--forest-700)",
  due: "var(--clay-600)",
  active: "var(--ink-900)",
};

function HeroCard({
  status,
  statusStyle,
  num,
  name,
  period,
  total,
  perOrang,
  accent,
  transform,
  zIndex,
  width,
}: (typeof CARDS)[0]) {
  return (
    <div
      style={{
        width,
        aspectRatio: "0.72 / 1",
        borderRadius: 6,
        padding: "18px 16px",
        position: "relative",
        display: "flex",
        flexDirection: "column",
        fontFamily: "var(--font-sans)",
        background: "var(--cream-50)",
        overflow: "hidden",
        boxShadow:
          "0 24px 60px -16px oklch(0.18 0.012 60 / 0.32), 0 0 0 1px oklch(0.18 0.012 60 / 0.06)",
        color: "var(--ink-900)",
        transform,
        zIndex,
      }}
    >
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 6,
          background: accent,
        }}
      />
      <div
        style={{
          position: "absolute",
          top: 14,
          right: 14,
          font: "500 9px/1 var(--font-mono)",
          letterSpacing: "0.12em",
          textTransform: "uppercase",
          padding: "4px 8px",
          borderRadius: "var(--r-full)",
          background: STATUS_BG[statusStyle],
          color: "white",
        }}
      >
        {status}
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          fontFamily: "var(--font-mono)",
          fontSize: "9.5px",
          letterSpacing: "0.1em",
          color: "var(--ink-500)",
          textTransform: "uppercase",
          paddingBottom: 10,
          borderBottom: "1px dashed var(--cream-400)",
          marginBottom: 12,
          marginTop: 8,
        }}
      >
        <span>Tagihan</span>
        <span style={{ color: "var(--text)", fontWeight: 500 }}>{num}</span>
      </div>

      <div
        style={{
          fontFamily: "var(--font-display)",
          fontSize: 20,
          lineHeight: 1.05,
          color: "var(--text)",
          marginBottom: 6,
        }}
      >
        {name}
      </div>
      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10.5px",
          color: "var(--ink-500)",
          marginBottom: 12,
        }}
      >
        {period}
      </div>

      <div
        style={{
          fontFamily: "var(--font-mono)",
          fontSize: "10.5px",
          color: "var(--ink-700)",
          display: "flex",
          flexDirection: "column",
          gap: 5,
          padding: "10px 0",
          borderTop: "1px dashed var(--cream-400)",
          borderBottom: "1px dashed var(--cream-400)",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Total cycle</span>
          <span style={{ color: "var(--text)" }}>{total}</span>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span>Split</span>
          <span style={{ color: "var(--text)" }}>equal</span>
        </div>
      </div>

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "baseline",
          marginTop: "auto",
          paddingTop: 14,
        }}
      >
        <span
          style={{
            font: "500 9.5px/1 var(--font-mono)",
            letterSpacing: "0.1em",
            textTransform: "uppercase",
            color: "var(--ink-500)",
          }}
        >
          Per orang
        </span>
        <span
          style={{
            fontFamily: "var(--font-display)",
            fontSize: 24,
            color: "var(--text)",
            letterSpacing: "-0.015em",
          }}
        >
          {perOrang}
        </span>
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section className="px-6 pt-14 text-center">
      <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.35; } }`}</style>

      <Badge
        variant="outline"
        className="mb-7 gap-2 rounded-full px-4 py-2 text-xs uppercase tracking-widest"
        style={{
          fontFamily: "var(--font-mono)",
          color: "var(--forest-900)",
          borderColor: "var(--forest-200)",
          background: "var(--surface)",
        }}
      >
        <span
          style={{
            width: 6,
            height: 6,
            borderRadius: "50%",
            background: "var(--forest-900)",
            display: "inline-block",
            animation: "pulse 2s ease-in-out infinite",
          }}
        />
        Bot Telegram smart collection
      </Badge>

      <h1
        className="mx-auto mb-6"
        style={{
          fontFamily: "var(--font-display)",
          fontWeight: 400,
          fontSize: "clamp(48px, 6.5vw, 88px)",
          lineHeight: 1,
          letterSpacing: "-0.025em",
          maxWidth: "12ch",
          color: "var(--text)",
        }}
      >
        Patungan gak ribet{" "}
        <em style={{ fontStyle: "italic", color: "var(--forest-900)" }}>
          lagi.
        </em>
      </h1>

      <p
        style={{
          fontSize: 18,
          lineHeight: 1.55,
          color: "var(--ink-700)",
          maxWidth: 520,
          margin: "0 auto 36px",
        }}
      >
        Aliran lacak subscription patungan-mu dan auto-tagih temanmu lewat{" "}
        <strong style={{ color: "var(--text)", fontWeight: 600 }}>
          bot Telegram
        </strong>
        . Setup sekali — gak ada lagi nyalin nominal manual.
      </p>

      <div
        className="inline-flex flex-wrap items-center justify-center gap-2.5 rounded-full p-1.5"
        style={{
          background: "var(--surface)",
          border: "1px solid var(--line)",
        }}
      >
        <Button className="rounded-full px-6 py-3.5 text-[15px]">
          Coba Gratis
        </Button>
        <Button
          variant="ghost"
          className="rounded-full px-6 py-3.5 text-[15px]"
          style={{ color: "var(--text)" }}
        >
          <a href="#features">Lihat demo ↓</a>
        </Button>
      </div>

      {/* Stage */}
      <div
        style={{
          margin: "56px auto 0",
          maxWidth: 1180,
          height: "clamp(260px, 52vw, 560px)",
          borderRadius: "var(--r-xl) var(--r-xl) 0 0",
          position: "relative",
          overflow: "hidden",
          background:
            "linear-gradient(180deg, oklch(0.92 0.045 220) 0%, oklch(0.95 0.025 210) 35%, oklch(0.97 0.012 95) 55%)",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(ellipse 40% 30% at 20% 30%, oklch(1 0 0 / 0.4), transparent 60%), radial-gradient(ellipse 30% 20% at 75% 20%, oklch(1 0 0 / 0.35), transparent 60%)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "-5%",
            right: "-5%",
            height: "50%",
            background:
              "radial-gradient(ellipse 70% 100% at 30% 100%, var(--forest-700) 0%, var(--forest-900) 100%)",
            borderTopLeftRadius: "50% 90%",
            borderTopRightRadius: "50% 90%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: "50%",
            transform: "translateX(-50%)",
            display: "flex",
            alignItems: "flex-end",
            perspective: 1200,
          }}
        >
          {CARDS.map((card) => (
            <HeroCard key={card.num} {...card} />
          ))}
        </div>
      </div>
    </section>
  );
}
