"use client";

import { motion } from "framer-motion";

const ease = [0.22, 1, 0.36, 1] as const;

const STEPS = [
  {
    num: "01",
    title: "Tambah komitmen",
    desc: "Input nama layanan, jumlah, anggota, dan tanggal renewal. Selesai dalam 30 detik.",
  },
  {
    num: "02",
    title: "Bot auto-tagih",
    desc: "H-3 & H-1 sebelum jatuh tempo, bot Telegram kirim reminder ke setiap anggota secara otomatis.",
  },
  {
    num: "03",
    title: "Verify & catat",
    desc: "Anggota tap konfirmasi, kamu verify saat duit masuk. Audit trail lengkap, tanpa drama.",
  },
];

export function HowItWorks() {
  return (
    <section
      id="how"
      className="px-6 py-16 md:py-24"
      style={{ background: "var(--cream-100)", borderTop: "1px solid var(--line)" }}
    >
      <div style={{ maxWidth: 980, margin: "0 auto" }}>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.3 }}
          transition={{ duration: 0.6, ease }}
        >
          <p
            style={{
              font: "500 11px/1 var(--font-mono)",
              color: "var(--ink-500)",
              letterSpacing: "0.12em",
              marginBottom: 14,
              textTransform: "uppercase",
            }}
          >
            Cara kerja
          </p>
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(28px, 3vw, 40px)",
              lineHeight: 1.05,
              letterSpacing: "-0.02em",
              color: "var(--ink-900)",
              margin: "0 0 52px",
            }}
          >
            Setup sekali,{" "}
            <em style={{ fontStyle: "italic", color: "var(--forest-900)" }}>
              jalan sendiri.
            </em>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-10 md:grid-cols-3 md:gap-8">
          {STEPS.map((step, i) => (
            <motion.div
              key={step.num}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.64, ease, delay: i * 0.12 }}
            >
              <div
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: 52,
                  fontWeight: 400,
                  lineHeight: 1,
                  letterSpacing: "-0.03em",
                  color: "var(--cream-300)",
                  marginBottom: 16,
                }}
              >
                {step.num}
              </div>
              <h3
                style={{
                  fontSize: 17,
                  fontWeight: 600,
                  color: "var(--ink-900)",
                  letterSpacing: "-0.01em",
                  margin: "0 0 10px",
                }}
              >
                {step.title}
              </h3>
              <p
                style={{
                  fontSize: 14.5,
                  color: "var(--ink-700)",
                  lineHeight: 1.6,
                  margin: 0,
                }}
              >
                {step.desc}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
