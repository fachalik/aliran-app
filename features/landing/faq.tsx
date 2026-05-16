"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const FAQ_ITEMS = [
  {
    id: "item-1",
    q: "Teman gue harus daftar juga?",
    a: (
      <>
        Gak perlu. Teman cukup tap link invite +{" "}
        <code
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: 13,
            background: "var(--cream-200)",
            padding: "2px 6px",
            borderRadius: 4,
          }}
        >
          /start
        </code>{" "}
        bot Telegram sekali — setelah itu mereka cuma terima tagihan dari bot
        Aliran. Gak ada install app, gak ada bikin akun.
      </>
    ),
  },
  {
    id: "item-2",
    q: "Kenapa Telegram, bukan WhatsApp?",
    a: (
      <>
        Telegram Bot API <strong>gratis &amp; resmi</strong> — bisa kirim pesan
        dengan inline button, callback handler, dan natural-language command.
        WhatsApp Cloud API ada cost per pesan &amp; aturan template ketat. Kami
        mulai dari Telegram dulu biar gratis selamanya buat free tier.
        Migrasi/paralel ke WA dijadwalkan di v2 setelah ada budget.
      </>
    ),
  },
  {
    id: "item-3",
    q: "Datanya aman gak?",
    a: (
      <>
        Data sensitif (no rekening, note) di-encrypt at rest dengan AES-256.
        Region server Singapore via Supabase, latency tetap rendah dari
        Indonesia. <strong>Aliran bukan payment processor</strong> — gak megang
        uangmu, jadi gak ada exposure ke fund movement.
      </>
    ),
  },
  {
    id: "item-4",
    q: "Bisa import dari Splitwise?",
    a: "Belum di v0/v1, tapi ada di roadmap v2. Expense lama dari Splitwise bisa di-archive di sana, dan commitment baru di-setup fresh di Aliran. Mass-import via CSV juga akan tersedia.",
  },
  {
    id: "item-5",
    q: "Support kartu kredit, e-wallet, kas?",
    a: (
      <>
        Semua. Tipe akun yang didukung:{" "}
        <strong>bank, e-wallet, cash, credit card</strong>. Bisa multi-currency
        (IDR default), dengan fee opsional untuk transfer antar akun.
      </>
    ),
  },
];

export function Faq() {
  return (
    <section id="faq" className="px-6 py-16 md:py-24">
      <div style={{ maxWidth: 880, margin: "0 auto" }}>
        <div className="mb-12 text-center">
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 400,
              fontSize: "clamp(32px, 4vw, 48px)",
              margin: "0 0 12px",
              letterSpacing: "-0.02em",
            }}
          >
            Yang sering{" "}
            <em style={{ fontStyle: "italic", color: "var(--forest-900)" }}>
              ditanya.
            </em>
          </h2>
          <p style={{ color: "var(--ink-700)", margin: 0 }}>
            Masih ada pertanyaan? Email{" "}
            <a
              href="mailto:halo@aliran.app"
              style={{ color: "var(--forest-900)", fontWeight: 500 }}
            >
              halo@aliran.app
            </a>{" "}
            — biasanya bales dalam beberapa jam.
          </p>
        </div>

        <Accordion
          multiple={false}
          defaultValue={["item-1"]}
          className="flex flex-col gap-2.5"
        >
          {FAQ_ITEMS.map((item) => (
            <AccordionItem
              key={item.id}
              value={item.id}
              style={{
                border: "1px solid var(--line)",
                borderRadius: "var(--r-lg)",
                background: "var(--surface)",
                padding: "0 24px",
              }}
              className="overflow-hidden"
            >
              <AccordionTrigger
                style={{
                  fontSize: 16,
                  fontWeight: 500,
                  color: "var(--text)",
                  paddingBlock: 20,
                }}
              >
                {item.q}
              </AccordionTrigger>
              <AccordionContent
                style={{
                  fontSize: 14.5,
                  lineHeight: 1.6,
                  color: "var(--ink-700)",
                  paddingBottom: 20,
                }}
              >
                {item.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </section>
  );
}
