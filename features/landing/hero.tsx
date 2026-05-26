"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

const ROWS = [
  {
    name: "Netflix Premium",
    members: "4 anggota",
    amount: "Rp 46.500",
    status: "Lunas",
    statusBg: "oklch(0.20 0.05 155)",
    statusColor: "oklch(0.68 0.10 155)",
  },
  {
    name: "Spotify Family",
    members: "6 anggota",
    amount: "Rp 13.200",
    status: "Aktif",
    statusBg: "oklch(0.22 0.035 90)",
    statusColor: "oklch(0.76 0.09 90)",
  },
  {
    name: "iCloud+",
    members: "3 anggota",
    amount: "Rp 33.000",
    status: "Jatuh tempo",
    statusBg: "oklch(0.22 0.04 35)",
    statusColor: "oklch(0.74 0.10 35)",
  },
];

function DashboardMockup() {
  return (
    <div
      style={{
        maxWidth: 480,
        margin: "0 auto",
        borderRadius: 14,
        overflow: "hidden",
        background: "oklch(0.13 0.018 160)",
        border: "1px solid oklch(0.20 0.02 160)",
        boxShadow:
          "0 40px 80px -20px oklch(0.08 0.02 160 / 0.9), 0 0 0 1px oklch(0.20 0.02 160)",
      }}
    >
      {/* Window chrome */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          padding: "12px 18px",
          borderBottom: "1px solid oklch(0.18 0.018 160)",
        }}
      >
        {["oklch(0.60 0.18 25)", "oklch(0.72 0.16 85)", "oklch(0.60 0.14 155)"].map(
          (c, i) => (
            <span
              // biome-ignore lint/suspicious/noArrayIndexKey: static decorative dots
              key={i}
              style={{
                width: 9,
                height: 9,
                borderRadius: "50%",
                background: c,
                display: "block",
              }}
            />
          ),
        )}
        <span
          style={{
            marginLeft: "auto",
            fontFamily: "var(--font-mono)",
            fontSize: 10,
            color: "oklch(0.42 0.012 90)",
            letterSpacing: "0.06em",
          }}
        >
          NOVEMBER 2026
        </span>
      </div>

      {/* Summary bar */}
      <div
        style={{
          display: "flex",
          gap: 20,
          padding: "14px 18px",
          borderBottom: "1px solid oklch(0.18 0.018 160)",
          flexWrap: "wrap",
        }}
      >
        {[
          { label: "Komitmen aktif", value: "3" },
          { label: "Total receivable", value: "Rp 277.700" },
          { label: "Lunas", value: "1 / 3" },
        ].map((stat) => (
          <div key={stat.label}>
            <div
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 9,
                color: "oklch(0.42 0.012 90)",
                letterSpacing: "0.08em",
                textTransform: "uppercase",
                marginBottom: 3,
              }}
            >
              {stat.label}
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 17,
                color: "oklch(0.86 0.03 90)",
                letterSpacing: "-0.01em",
              }}
            >
              {stat.value}
            </div>
          </div>
        ))}
      </div>

      {/* Commitment rows */}
      <div style={{ display: "flex", flexDirection: "column" }}>
        {ROWS.map((row, i) => (
          <div
            key={row.name}
            style={{
              display: "flex",
              alignItems: "center",
              padding: "14px 18px",
              borderBottom:
                i < ROWS.length - 1
                  ? "1px solid oklch(0.17 0.015 160)"
                  : "none",
              gap: 14,
            }}
          >
            <div style={{ flex: 1, minWidth: 0 }}>
              <div
                style={{
                  fontSize: 13,
                  fontWeight: 500,
                  color: "oklch(0.86 0.03 90)",
                  marginBottom: 2,
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                {row.name}
              </div>
              <div
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 10,
                  color: "oklch(0.46 0.012 90)",
                }}
              >
                {row.members}
              </div>
            </div>
            <div
              style={{
                fontFamily: "var(--font-display)",
                fontSize: 14,
                color: "oklch(0.80 0.04 90)",
                letterSpacing: "-0.01em",
                whiteSpace: "nowrap",
              }}
            >
              {row.amount}
              <span
                style={{
                  fontFamily: "var(--font-mono)",
                  fontSize: 9,
                  color: "oklch(0.46 0.012 90)",
                  marginLeft: 2,
                }}
              >
                /org
              </span>
            </div>
            <div
              style={{
                padding: "3px 9px",
                borderRadius: 20,
                background: row.statusBg,
                color: row.statusColor,
                fontSize: 10,
                fontFamily: "var(--font-mono)",
                fontWeight: 500,
                letterSpacing: "0.04em",
                whiteSpace: "nowrap",
              }}
            >
              {row.status}
            </div>
          </div>
        ))}
      </div>

      {/* Footer bar */}
      <div
        style={{
          padding: "12px 18px",
          borderTop: "1px solid oklch(0.18 0.018 160)",
          display: "flex",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: 7,
        }}
      >
        <span
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 9.5,
            color: "oklch(0.36 0.01 90)",
            letterSpacing: "0.06em",
            textTransform: "uppercase",
          }}
        >
          Bot Telegram aktif
        </span>
        <span
          style={{
            width: 5,
            height: 5,
            borderRadius: "50%",
            background: "oklch(0.62 0.12 155)",
            display: "inline-block",
          }}
        />
      </div>
    </div>
  );
}

export function Hero() {
  return (
    <section
      style={{
        background: "var(--forest-950)",
      }}
    >
      <div
        className="grid items-center gap-10 px-6 py-20 md:grid-cols-2 md:gap-16 md:py-28"
        style={{ maxWidth: 1180, margin: "0 auto" }}
      >
        {/* Copy */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.56, ease, delay: 0.08 }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "5px 14px",
              borderRadius: "var(--r-full)",
              border: "1px solid oklch(0.28 0.04 155)",
              background: "oklch(0.16 0.025 160)",
              marginBottom: 28,
            }}
          >
            <motion.span
              animate={{
                boxShadow: [
                  "0 0 0 0 oklch(0.62 0.12 155 / 0)",
                  "0 0 0 4px oklch(0.62 0.12 155 / 0.35)",
                  "0 0 0 0 oklch(0.62 0.12 155 / 0)",
                ],
              }}
              transition={{ duration: 2.6, repeat: Infinity, ease: "easeInOut", delay: 1.4 }}
              style={{
                width: 6,
                height: 6,
                borderRadius: "50%",
                background: "oklch(0.62 0.12 155)",
                display: "inline-block",
              }}
            />
            <span
              style={{
                fontFamily: "var(--font-mono)",
                fontSize: 10,
                color: "oklch(0.62 0.06 155)",
                letterSpacing: "0.1em",
                textTransform: "uppercase",
              }}
            >
              Bot Telegram · Smart collection
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.68, ease, delay: 0.2 }}
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(38px, 5vw, 66px)",
              lineHeight: 1.02,
              letterSpacing: "-0.025em",
              color: "oklch(0.92 0.03 90)",
              margin: "0 0 20px",
            }}
          >
            Patungan gak ribet{" "}
            <em style={{ fontStyle: "italic", color: "oklch(0.68 0.10 155)" }}>
              lagi.
            </em>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.68, ease, delay: 0.32 }}
            style={{
              fontSize: 16.5,
              lineHeight: 1.65,
              color: "oklch(0.62 0.022 90)",
              maxWidth: 420,
              margin: "0 0 36px",
            }}
          >
            Lacak subscription patungan dan auto-tagih temanmu lewat{" "}
            <strong style={{ color: "oklch(0.80 0.04 90)", fontWeight: 600 }}>
              bot Telegram
            </strong>
            . Setup sekali, gak ada lagi nyalin nominal manual.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.68, ease, delay: 0.44 }}
            style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}
          >
            <a
              href="/signup"
              className={cn(buttonVariants(), "rounded-full px-6 text-[15px]")}
              style={{
                background: "oklch(0.92 0.03 90)",
                color: "var(--forest-950)",
              }}
            >
              Coba gratis
            </a>
            <a
              href="#features"
              style={{
                fontSize: 14,
                color: "oklch(0.52 0.018 90)",
                textDecoration: "none",
              }}
            >
              Lihat fitur ↓
            </a>
          </motion.div>
        </div>

        {/* Mockup */}
        <motion.div
          className="hidden md:block"
          initial={{ opacity: 0, y: 32 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.26 }}
        >
          <DashboardMockup />
        </motion.div>
      </div>
    </section>
  );
}
