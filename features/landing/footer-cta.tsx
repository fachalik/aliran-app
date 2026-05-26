"use client";

import { motion } from "framer-motion";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const ease = [0.22, 1, 0.36, 1] as const;

export function FooterCta() {
  return (
    <section
      className="relative overflow-hidden px-6 py-32 text-center"
      style={{ background: "var(--forest-950)", color: "var(--cream-50)" }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          pointerEvents: "none",
          background:
            "radial-gradient(ellipse 60% 50% at 50% 0%, oklch(0.40 0.07 155) 0%, transparent 70%), radial-gradient(ellipse 80% 40% at 50% 100%, oklch(0.30 0.05 155) 0%, transparent 70%)",
        }}
      />
      <motion.div
        className="relative"
        style={{ maxWidth: 720, margin: "0 auto" }}
        initial={{ opacity: 0, y: 28 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 0.72, ease }}
      >
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(44px, 5.5vw, 72px)",
            letterSpacing: "-0.025em",
            lineHeight: 1.05,
            margin: "0 0 20px",
            color: "var(--cream-50)",
          }}
        >
          Mulai{" "}
          <em style={{ fontStyle: "italic", color: "oklch(0.85 0.08 90)" }}>
            gratis.
          </em>
          <br />
          Tanpa kartu kredit.
        </h2>
        <p
          style={{
            fontSize: 18,
            color: "oklch(0.82 0.03 90)",
            maxWidth: 480,
            margin: "0 auto 32px",
          }}
        >
          Setup 30 detik. Subscription patungan pertama-mu udah jalan sebelum
          kopi siap.
        </p>
        <a
          href="/signup"
          className={cn(
            buttonVariants({ size: "lg" }),
            "rounded-full px-8 text-base",
          )}
          style={{ background: "var(--cream-50)", color: "var(--forest-950)" }}
        >
          Daftar sekarang →
        </a>
        <p
          style={{ marginTop: 20, fontSize: 13, color: "oklch(0.72 0.03 90)" }}
        >
          Free tier selamanya · setup 30 detik · bot Telegram included
        </p>
      </motion.div>
    </section>
  );
}
