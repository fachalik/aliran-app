export function Welcome() {
  return (
    <section className="px-6 py-16 md:py-24 text-center">
      <div style={{ maxWidth: 720, margin: "0 auto" }}>
        <h2
          style={{
            fontFamily: "var(--font-display)",
            fontWeight: 400,
            fontSize: "clamp(36px, 4vw, 52px)",
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            margin: "0 0 20px",
          }}
        >
          Halo,{" "}
          <em style={{ fontStyle: "italic", color: "var(--forest-900)" }}>
            Aliran.
          </em>
        </h2>
        <p
          style={{
            fontSize: 17,
            color: "var(--ink-700)",
            lineHeight: 1.6,
            margin: "0 auto",
            maxWidth: 600,
          }}
        >
          Money flow graph yang lacak setiap aliran uang — pribadi, patungan,
          atau ke temen. Setiap subscription jadi kontrak. Setiap tagihan jadi
          inline button di Telegram. Setiap konfirmasi cuma satu tap.
        </p>
      </div>
    </section>
  );
}
