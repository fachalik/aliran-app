import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export function Testimonial() {
  return (
    <section style={{ background: "var(--cream-50)" }}>
      <Separator style={{ background: "var(--line)" }} />
      <div className="px-6 py-24 text-center">
        <div style={{ maxWidth: 720, margin: "0 auto 48px" }}>
          <h2 style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: "clamp(32px, 4vw, 48px)", lineHeight: 1.1, letterSpacing: "-0.02em", margin: "0 0 12px" }}>
            Buat circle yang males <em style={{ fontStyle: "italic", color: "var(--forest-900)" }}>ribut</em> soal patungan.
          </h2>
          <p style={{ color: "var(--ink-700)", fontSize: 16, margin: 0 }}>
            Solo founder, roommate, pasangan, atau just teman-teman patungan Netflix — semua butuh visibility tanpa drama.
          </p>
        </div>

        <Card style={{ maxWidth: 720, margin: "0 auto", border: "1px solid var(--line)", background: "var(--surface)", boxShadow: "var(--shadow-2)" }}>
          <CardContent className="p-10 text-left relative">
            <div style={{ position: "absolute", top: 20, right: 32, fontFamily: "var(--font-display)", fontStyle: "italic", fontSize: 80, lineHeight: 1, color: "var(--forest-200)" }}>&quot;</div>
            <p style={{ fontFamily: "var(--font-display)", fontWeight: 400, fontSize: 22, lineHeight: 1.4, color: "var(--text)", margin: "0 0 24px", letterSpacing: "-0.01em" }}>
              Tiap bulan dulu gue copy-paste nominal ke 4 WA group beda. Sekarang bot Aliran yang kerjain.{" "}
              <em style={{ fontStyle: "italic", color: "var(--forest-900)" }}>Yang biasanya 20 menit jadi 0 menit</em>{" "}
              — dan gak ada lagi yang lupa bayar Netflix.
            </p>
            <div className="flex items-center gap-3.5">
              <div style={{ width: 48, height: 48, borderRadius: "50%", background: "var(--forest-200)", color: "var(--forest-900)", display: "grid", placeItems: "center", fontWeight: 600, fontSize: 18 }}>C</div>
              <div>
                <div style={{ fontWeight: 600, fontSize: 15 }}>Beta tester, Jakarta</div>
                <div style={{ fontSize: 13, color: "var(--ink-500)" }}>Solo founder · patungan 5 subscription · early access user</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
      <Separator style={{ background: "var(--line)" }} />
    </section>
  );
}
