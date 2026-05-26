"use client";

import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";

const ease = [0.22, 1, 0.36, 1] as const;

const TILES = [
  {
    variant: "cream",
    label: "Auto-reminder",
    value: (
      <span>
        H-3
        <span style={{ fontSize: "0.5em", color: "var(--ink-500)" }}>·H-1</span>
      </span>
    ),
    desc: "Bot kirim ke teman 3 hari & 1 hari sebelum jatuh tempo, gak overlap.",
    bg: "var(--cream-200)",
    color: "var(--text)",
  },
  {
    variant: "gray",
    label: "Konfirmasi",
    value: (
      <span>
        1{" "}
        <span style={{ fontSize: "0.4em", fontWeight: 400, opacity: 0.7 }}>
          tap
        </span>
      </span>
    ),
    desc: "Inline button di Telegram. Sudah Transfer / Belum Bisa / Bukan Saya.",
    bg: "oklch(0.42 0.012 60)",
    color: "var(--cream-50)",
  },
  {
    variant: "green",
    label: "Free tier",
    value: "Rp 0",
    desc: "Selamanya. Tanpa kartu kredit, tanpa trial yang nipu.",
    bg: "var(--forest-700)",
    color: "var(--cream-50)",
  },
];

export function KpiTiles() {
  return (
    <section className="px-6 pb-16 md:pb-24">
      <div
        className="grid grid-cols-1 sm:grid-cols-3 gap-4"
        style={{ maxWidth: 980, margin: "0 auto" }}
      >
        {TILES.map((tile, i) => (
          <motion.div
            key={tile.variant}
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.64, ease, delay: i * 0.12 }}
            whileHover={{ y: -5, transition: { duration: 0.2, ease } }}
          >
            <Card
              className="border-0"
              style={{
                aspectRatio: "1 / 1",
                borderRadius: "var(--r-xl)",
                background: tile.bg,
                color: tile.color,
              }}
            >
              <CardContent className="flex h-full flex-col justify-between p-7">
                <div
                  style={{
                    font: "500 11px/1.3 var(--font-mono)",
                    letterSpacing: "0.08em",
                    textTransform: "uppercase",
                    opacity: 0.7,
                  }}
                >
                  {tile.label}
                </div>
                <div
                  style={{
                    fontFamily: "var(--font-display)",
                    fontWeight: 400,
                    fontSize: "clamp(38px, 4vw, 56px)",
                    lineHeight: 1,
                    letterSpacing: "-0.02em",
                  }}
                >
                  {tile.value}
                </div>
                <div style={{ fontSize: 13, lineHeight: 1.5, opacity: 0.75 }}>
                  {tile.desc}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
