import { Card, CardContent, CardHeader } from "@/components/ui/card";

const NODES = [
  { type: "contact", label: "Andi", left: "17%", top: "33%" },
  { type: "contact", label: "Rara", left: "17%", top: "72%" },
  { type: "user", label: "Lo · Aliran", left: "50%", top: "50%" },
  { type: "account", label: "BCA", left: "80%", top: "28%" },
  { type: "merchant", label: "Netflix", left: "80%", top: "70%" },
];

const EDGE_LABELS = [
  { label: "receivable", left: "33%", top: "36%", id: "recv-1" },
  { label: "receivable", left: "33%", top: "62%", id: "recv-2" },
  { label: "income", left: "67%", top: "32%", id: "income" },
  { label: "expense", left: "67%", top: "64%", id: "expense" },
];

const DOT_COLORS: Record<string, string> = {
  user: "var(--cream-50)",
  contact: "var(--amber-600)",
  account: "var(--indigo-600)",
  merchant: "var(--clay-600)",
};

const VALUES = [
  {
    num: "01",
    title: "Commitment as contract",
    body: "Subscription patungan bukan transaksi berulang, tapi entity dengan lifecycle: stakeholder, split allocation, payer rotation, pause/cancel — semua tercatat.",
  },
  {
    num: "02",
    title: "Bot, bukan formulir",
    body: "Telegram bot broadcast tagihan, terima inline button, dan kirim konfirmasi balik. Tanpa nyalin nominal, tanpa template di chat WhatsApp.",
  },
  {
    num: "03",
    title: "Calendar-first",
    body: "Forecast cashflow sebagai kalender, bukan list panjang. Tau persis kapan duit masuk, kapan keluar, dan berapa sisa di akhir bulan.",
  },
];

export function CoreValues() {
  return (
    <section id="how" className="px-6 py-16 md:py-24 text-center">
      <div style={{ maxWidth: 680, margin: "0 auto 48px" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(36px, 4vw, 52px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: "0 0 16px",
          }}
        >
          Setiap uang adalah{" "}
          <em style={{ fontStyle: "italic", color: "var(--forest-900)" }}>
            aliran.
          </em>
        </h2>
        <p style={{ color: "var(--ink-700)", fontSize: 16, margin: 0 }}>
          Aliran model setiap transaksi sebagai edge di graph: dari akun ke
          merchant, dari teman ke kamu, dari kamu ke subscription. Tracking
          pribadi, split bill, dan langganan patungan — beda view dari data yang
          sama.
        </p>
      </div>

      {/* Flow graph viz */}
      <div
        style={{
          maxWidth: 1180,
          margin: "0 auto 56px",
          height: "clamp(260px, 32vw, 360px)",
          background:
            "radial-gradient(ellipse at 50% 50%, var(--surface) 0%, var(--cream-100) 100%)",
          border: "1px solid var(--line)",
          borderRadius: "var(--r-xl)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            position: "absolute",
            inset: 0,
            opacity: 0.4,
            backgroundImage:
              "linear-gradient(var(--line) 1px, transparent 1px), linear-gradient(90deg, var(--line) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
            WebkitMaskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 80%)",
            maskImage:
              "radial-gradient(ellipse at center, black 30%, transparent 80%)",
          }}
        />
        <svg
          aria-hidden="true"
          style={{
            position: "absolute",
            inset: 0,
            width: "100%",
            height: "100%",
          }}
          viewBox="0 0 1180 360"
          preserveAspectRatio="none"
        >
          <line
            x1="200"
            y1="120"
            x2="590"
            y2="180"
            stroke="oklch(0.85 0.02 80)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <line
            x1="200"
            y1="260"
            x2="590"
            y2="180"
            stroke="oklch(0.85 0.02 80)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
          <line
            x1="590"
            y1="180"
            x2="950"
            y2="100"
            stroke="oklch(0.85 0.05 155)"
            strokeWidth="2"
          />
          <line
            x1="590"
            y1="180"
            x2="950"
            y2="250"
            stroke="oklch(0.85 0.05 155)"
            strokeWidth="2"
          />
          <line
            x1="950"
            y1="100"
            x2="950"
            y2="250"
            stroke="oklch(0.88 0.04 80)"
            strokeWidth="1.5"
            strokeDasharray="4 4"
          />
        </svg>

        {NODES.map((n) => (
          <div
            key={n.label}
            style={{
              position: "absolute",
              transform: "translate(-50%, -50%)",
              background:
                n.type === "user" ? "var(--forest-900)" : "var(--surface)",
              border: `1px solid ${n.type === "user" ? "var(--forest-900)" : "var(--line)"}`,
              borderRadius: "var(--r-full)",
              padding: "10px 16px",
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              fontSize: 13,
              fontWeight: 500,
              boxShadow: "var(--shadow-2)",
              whiteSpace: "nowrap",
              color: n.type === "user" ? "var(--cream-50)" : "inherit",
              left: n.left,
              top: n.top,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                borderRadius: "50%",
                background: DOT_COLORS[n.type],
                display: "block",
                flexShrink: 0,
              }}
            />
            {n.label}
          </div>
        ))}

        {EDGE_LABELS.map((e) => (
          <div
            key={e.id}
            style={{
              position: "absolute",
              transform: "translate(-50%, -50%)",
              background: "var(--cream-100)",
              font: "500 10px/1 var(--font-mono)",
              color: "var(--ink-500)",
              padding: "3px 8px",
              borderRadius: "var(--r-full)",
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              left: e.left,
              top: e.top,
            }}
          >
            {e.label}
          </div>
        ))}
      </div>

      {/* Value cards */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4"
        style={{ maxWidth: 1180, margin: "0 auto" }}
      >
        {VALUES.map((v) => (
          <Card
            key={v.num}
            style={{
              border: "1px solid var(--line)",
              background: "var(--surface)",
            }}
          >
            <CardHeader className="pb-3">
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontStyle: "italic",
                  fontSize: 44,
                  color: "var(--forest-900)",
                  lineHeight: 1,
                }}
              >
                {v.num}
              </div>
            </CardHeader>
            <CardContent className="text-left">
              <h3
                style={{
                  fontSize: 19,
                  fontWeight: 600,
                  margin: "0 0 10px",
                  letterSpacing: "-0.01em",
                }}
              >
                {v.title}
              </h3>
              <p
                style={{
                  fontSize: 14.5,
                  color: "var(--ink-700)",
                  margin: 0,
                  lineHeight: 1.6,
                }}
              >
                {v.body}
              </p>
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  );
}
