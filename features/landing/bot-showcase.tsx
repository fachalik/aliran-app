import { Card } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

const BULLETS = [
  ["Auto-broadcast", "H-3 & H-1 sebelum jatuh tempo"],
  ["Inline button", "— Sudah Transfer / Belum Bisa / Bukan Saya"],
  ["Kode transfer unik", "per tagihan untuk auto-matching"],
  ["2-tap confirmation", "— teman claim, lo verify, audit trail lengkap"],
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

function TelegramMockup() {
  return (
    <Card
      className="border-0 p-3.5"
      style={{
        maxWidth: 380,
        margin: "0 auto",
        background: "linear-gradient(180deg, #b8c4ce 0%, #c8d4dc 100%)",
        borderRadius: "var(--r-xl)",
        boxShadow: "var(--shadow-3)",
      }}
    >
      {/* Header */}
      <div
        className="mb-3.5 flex items-center gap-2.5 pb-3.5"
        style={{ borderBottom: "1px solid rgba(255,255,255,0.35)" }}
      >
        <div
          style={{
            width: 38,
            height: 38,
            borderRadius: "50%",
            background: "var(--forest-900)",
            color: "var(--cream-50)",
            display: "grid",
            placeItems: "center",
            fontFamily: "var(--font-display)",
            fontStyle: "italic",
            fontSize: 22,
            flexShrink: 0,
          }}
        >
          a
        </div>
        <div>
          <div style={{ fontSize: 14, fontWeight: 600, color: "#1A1A1A" }}>
            Aliran Bot
          </div>
          <div style={{ fontSize: 11, color: "#4A6B82" }}>@AliranBot · bot</div>
        </div>
      </div>

      {/* Message bubble */}
      <div
        style={{
          background: "white",
          color: "#111B21",
          borderRadius: "4px 12px 12px 12px",
          padding: "10px 12px 8px",
          fontSize: 12.5,
          lineHeight: 1.45,
          maxWidth: "92%",
          boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
        }}
      >
        <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 6 }}>
          📌 Tagihan dari alice
        </div>
        <div>
          <strong>Netflix Premium</strong> — November 2026
        </div>
        <div>
          Total kamu: <strong>Rp 46.500</strong>
        </div>
        <div style={{ color: "#667781", fontSize: 11.5 }}>
          Jatuh tempo: 5 Nov 2026
        </div>
        <div style={{ height: 6 }} />
        <div>Transfer ke:</div>
        <div>🏦 BCA 1234567890 · 👤 a.n. alice</div>
        <div style={{ height: 6 }} />
        <div
          style={{ color: "var(--clay-600)", fontWeight: 500, marginTop: 4 }}
        >
          ⚠️ Pakai kode di berita transfer:
        </div>
        <div
          style={{
            display: "inline-block",
            fontFamily: "var(--font-mono)",
            fontSize: 12,
            fontWeight: 600,
            background: "oklch(0.94 0.04 80)",
            color: "var(--clay-600)",
            padding: "4px 10px",
            borderRadius: 5,
            letterSpacing: "0.04em",
            marginTop: 4,
            border: "1px dashed oklch(0.85 0.08 60)",
          }}
        >
          ALIR-NTFLX-NOV-A3F2
        </div>
        <span
          style={{
            fontSize: 10,
            color: "#999",
            float: "right",
            marginLeft: 8,
            marginTop: 6,
          }}
        >
          19:00
        </span>
      </div>

      {/* Inline keyboard */}
      <div
        style={{
          background: "white",
          maxWidth: "92%",
          overflow: "hidden",
          boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
          borderTop: "1px solid #f0f2f4",
          borderRadius: "0 0 12px 12px",
          marginBottom: 10,
        }}
      >
        <div>
          <button
            type="button"
            style={{
              width: "100%",
              padding: "11px 8px",
              fontSize: 12.5,
              fontWeight: 500,
              background: "oklch(0.92 0.05 200)",
              color: "#0F7CB8",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            ✅ Sudah Transfer
          </button>
        </div>
        <Separator style={{ background: "#f0f2f4" }} />
        <div style={{ display: "flex" }}>
          <button
            type="button"
            style={{
              flex: 1,
              padding: "11px 8px",
              fontSize: 12.5,
              fontWeight: 500,
              color: "#2AABEE",
              background: "white",
              border: "none",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            ⏰ Belum Bisa
          </button>
          <button
            type="button"
            style={{
              flex: 1,
              padding: "11px 8px",
              fontSize: 12.5,
              fontWeight: 500,
              color: "#2AABEE",
              background: "white",
              border: "none",
              borderLeft: "1px solid #f0f2f4",
              cursor: "pointer",
              fontFamily: "var(--font-sans)",
            }}
          >
            ❌ Bukan Saya
          </button>
        </div>
      </div>

      {/* Confirmation bubble */}
      <div
        style={{
          background: "white",
          color: "#111B21",
          borderRadius: "4px 12px 12px 12px",
          padding: "10px 12px 8px",
          fontSize: 12.5,
          lineHeight: 1.45,
          maxWidth: "92%",
          boxShadow: "0 1px 0.5px rgba(0,0,0,0.13)",
          marginTop: 6,
        }}
      >
        <div
          style={{
            fontSize: 11.5,
            fontWeight: 600,
            color: "var(--forest-900)",
            marginBottom: 6,
          }}
        >
          Aliran Bot
        </div>
        <div>
          Sip! 🎉 Status diupdate ke <strong>paid</strong>.
        </div>
        <div style={{ color: "#667781", fontSize: 11.5 }}>
          Alice bakal verify pas duit masuk.
        </div>
        <span
          style={{
            fontSize: 10,
            color: "#999",
            float: "right",
            marginLeft: 8,
            marginTop: 6,
          }}
        >
          19:01
        </span>
      </div>
    </Card>
  );
}

export function BotShowcase() {
  return (
    <section
      id="features"
      className="px-6 py-16 md:py-24"
      style={{ borderTop: "1px solid var(--line)" }}
    >
      <div
        className="grid grid-cols-1 md:grid-cols-[1fr_1.1fr] items-center gap-14 md:gap-20"
        style={{ maxWidth: 1180, margin: "0 auto" }}
      >
        <div>
          <p
            style={{
              font: "500 11px/1 var(--font-mono)",
              color: "var(--ink-500)",
              letterSpacing: "0.12em",
              marginBottom: 16,
              textTransform: "uppercase",
            }}
          >
            01 — SMART COLLECTION
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
            Bot nagih,{" "}
            <em style={{ fontStyle: "italic", color: "var(--forest-900)" }}>
              lo tinggal terima.
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
            Setup sekali, bot auto-broadcast tagihan ke teman tiap renewal.
            Mereka tap &quot;Sudah Transfer&quot;, lo verify pas duit masuk —
            gak ada nyalin nominal.
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
        <TelegramMockup />
      </div>
    </section>
  );
}
