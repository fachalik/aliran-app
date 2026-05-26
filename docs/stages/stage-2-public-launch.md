# Stage 2 — Public Launch

**Timeline:** Minggu 14–20  
**Goal:** Production-ready SaaS dengan onboarding halus, insight engine, dan billing. Launch ke publik.

**Success Metric:**
- 100 signup organic di bulan pertama
- 20% conversion ke active user (pakai minimal 1x/minggu)
- NPS > 40
- Churn < 10%/bulan setelah 3 bulan

---

## Deliverables

- [ ] Multi-user collaboration (contact bisa di-invite jadi registered user)
- [ ] Weekly AI review (Claude API generated insights)
- [ ] Monthly snapshot + PDF export
- [ ] Subscription marketplace (insight harga patungan optimal)
- [ ] Pricing & billing (Stripe atau Xendit)
- [ ] WA Cloud API integration (pilihan paralel ke Telegram)
- [ ] QRIS dinamis via Xendit/Midtrans (opsional, zero-touch settlement)
- [ ] Polished onboarding
- [ ] Documentation & help center

---

## Features

### F2.1 — Multi-User Collaboration

**Upgrade dari contact ke registered user:**
- Contact bisa di-invite jadi registered user Aliran
- Setelah invite di-accept, dua sisi share data commitment (tetap punya tracking pribadi masing-masing)
- Settlement otomatis sync di dua sisi

**Invite flow:**
1. Lo invite contact via email atau WA link dengan magic token
2. Contact daftar akun Aliran
3. Sistem detect: Telegram ID / email sudah linked ke contact lo → merge
4. Keduanya kini lihat commitment yang sama dari perspektif masing-masing

**Conflict resolution:**
- Kalau dua user edit commitment yang sama → last-write-wins + audit log
- Notif ke dua sisi kalau ada perubahan signifikan (amount, stakeholder)

**Acceptance criteria:**
- Invite via email atau WA link (magic token, expire 7 hari)
- Saat contact jadi registered user, obligation history terbawa
- Dua sisi bisa lihat net position masing-masing
- Privacy: tracking pribadi (non-shared) gak terlihat oleh sisi lain

---

### F2.2 — Weekly AI Review

**Trigger:** Push notification setiap Minggu malam

**Flow:**
1. Cron `weekly-review-generator` (Sunday 19:00 WIB) generate review per user
2. Claude API dipanggil dengan data 7 hari terakhir:
   - Expenses by category (vs week before)
   - Subscription yang jarang dipakai (berdasarkan pattern — best effort)
   - Outstanding receivables dari contacts
3. Generate 3–5 insight kontekstual, contoh:
   - "Pengeluaran 'Makan Luar' naik 60% minggu ini. Apa yang beda?"
   - "Subscription [X] gak ada usage 2 bulan. Mau pause?"
   - "Net receivable dari [A] udah 3 bulan. Mau di-nudge?"
4. User diberi prompt: isi short note (1–2 kalimat) per insight
5. Notes disimpan, jadi context untuk monthly review

**Implementation:**
- Prompt template versioned & editable di admin panel
- Cost cap: max 1 generation per user per minggu, ~1k tokens
- Rate: claude-sonnet-4-5, ~$0.003/review → acceptable untuk <1000 user

**Acceptance criteria:**
- Insight relevan (bukan generic) — test dengan data nyata sebelum launch
- User bisa skip / dismiss insight yang gak relevan
- Note field max 200 karakter
- Review tersimpan di `reviews` table untuk lookback

---

### F2.3 — Monthly Snapshot

Auto-generated report setiap akhir bulan:
- Top spending category
- Biggest single transaction
- Total subscription cost vs bulan lalu
- Net social position (total receivable vs payable)
- Compare vs bulan lalu dengan persentase change

**Delivery:**
- In-app card di dashboard
- Optional: push notification "Review bulan lo siap"
- Export: PDF download ATAU share image (square, social-friendly)

**Acceptance criteria:**
- PDF generated server-side (Puppeteer atau @react-pdf)
- Share image: 1080x1080, branded, no sensitive numbers kalau shared
- Data accuracy: semua angka match dengan transaksi yang tercatat

---

### F2.4 — Subscription Marketplace (Insight)

Bukan marketplace sesungguhnya — ini adalah referensi harga patungan:

```
Netflix Premium   Rp 186.000 / 4 akun   → patungan optimal: 4 orang = Rp 46.500/org
Spotify Family    Rp 79.000 / 6 akun    → patungan optimal: 6 orang = Rp 13.200/org
YouTube Premium   Rp 79.000 / 6 akun    → patungan optimal: 6 orang = Rp 13.200/org
ChatGPT Plus      $20 / 1 akun          → no family plan, estimate share 2 orang = Rp 163k/org
```

Features:
- Search/filter subscription populer di Indonesia
- Quick add ke commitment langsung dari marketplace
- Harga di-update manual oleh admin (atau semi-automated scraping — v3)

**Acceptance criteria:**
- Static list awal: ~20 subscription paling umum
- Quick add pre-fill form commitment dengan data dari marketplace
- "Suggest edit" kalau user tahu harga sudah berubah

---

### F2.5 — Pricing & Billing

**Tier:**

| Tier | Harga | Limits |
|------|-------|--------|
| Free | Gratis selamanya | 2 accounts, 3 active commitments, 5 contacts |
| Plus | Rp 25.000/bulan | Unlimited accounts/commitments/contacts, weekly AI review, monthly snapshot export |
| Pro | Rp 50.000/bulan | Plus + advanced insight, custom categories (lebih dari 10), API access |

**Billing flow:**
- Stripe untuk internasional / kartu kredit
- Xendit untuk Indonesia (transfer bank, QRIS, e-wallet)
- Trial 14 hari Plus untuk semua new user (no credit card required)
- Grace period 7 hari kalau payment gagal sebelum downgrade ke Free

**Implementation:**
- Stripe webhook: `POST /api/webhooks/stripe`
- Feature flag per tier di middleware (check `users.plan`)
- Upgrade/downgrade mid-cycle: prorated via Stripe

**Acceptance criteria:**
- Trial auto-start saat onboarding selesai
- Email reminder 3 hari sebelum trial berakhir
- Downgrade graceful: data tetap ada, fitur dikunci (bukan dihapus)

---

### F2.6 — WhatsApp Cloud API Integration

**Context:** WA Cloud API ada cost per conversation, jadi ini opt-in dan tersedia di Plus/Pro.

**Flow (sama dengan Telegram bot, channel berbeda):**
- User setup WA Business Number di settings
- Aliran kirim tagihan via WA Cloud API ke nomor WA teman
- Teman reply dengan keyword atau tap button (WA interactive messages)
- Status obligation update sama seperti Telegram flow

**Acceptance criteria:**
- User pilih channel: Telegram, WA, atau keduanya
- Cost per pesan di-absorb Aliran untuk Plus/Pro tier
- WA template messages pre-approved oleh Meta sebelum launch
- Fallback: kalau WA gagal kirim → retry 3x → notif ke user

---

### F2.7 — QRIS Dinamis (Opsional)

**Goal:** Zero-touch settlement. Teman scan QRIS → transfer langsung ke rekening lo → obligation auto-settle.

**Flow:**
1. Lo generate QRIS dinamis per obligation via Xendit/Midtrans API
2. QRIS di-include dalam pesan tagihan Telegram/WA
3. Teman scan → bayar langsung → payment webhook masuk
4. Aliran match webhook dengan obligation → auto-settle
5. Balance update otomatis

**Trade-off:**
- Pro: zero-tap konfirmasi dari dua sisi
- Con: fee MDR (~0.7% untuk QRIS), lo yang absorb atau pass ke teman
- Scope: opt-in per commitment, tersedia di Plus/Pro

---

## Data Model (Stage 2 additions)

Fields/tables baru:
- `users.plan` — `'free' | 'plus' | 'pro'`
- `users.planExpiresAt` — untuk grace period
- `users.stripeCustomerId`, `users.xenditCustomerId`
- `reviews` — weekly/monthly AI review records
- `subscriptionMarketplace` — static list langganan populer
- `waConfig` — WA Cloud API setup per user (opsional)
- `qrisPayments` — QRIS payment records (opsional)

---

## Tech Stack Additions (Stage 2)

| Layer | Tech |
|-------|------|
| Payment | Stripe (internasional) + Xendit (Indonesia) |
| WA API | WhatsApp Cloud API (Meta) |
| AI | Claude API — weekly review generation |
| PDF | Puppeteer atau @react-pdf |
| QRIS | Xendit atau Midtrans Dynamic QRIS API |

**New worker jobs:**
- `weekly-review-generator` — cron Sunday 19:00, generate AI insight
- `monthly-snapshot-generator` — cron hari terakhir bulan, generate report
- `qris-payment-checker` — webhook handler atau polling untuk QRIS status

---

## New Folder Structure (Stage 2)

```
app/(app)/
  reviews/page.tsx              # Weekly review + notes
  snapshot/page.tsx             # Monthly snapshot + export
  marketplace/page.tsx          # Subscription marketplace
  settings/
    billing/page.tsx            # Plan, payment method, invoices
    wa-integration/page.tsx     # WA Cloud API setup
app/api/webhooks/
  stripe/route.ts               # Stripe billing events
  xendit/route.ts               # Xendit payment events
  wa/route.ts                   # WA Cloud API webhook
worker/jobs/
  weekly-review-generator.ts    # AI insight generation
  monthly-snapshot-generator.ts # End-of-month report
components/
  marketing/pricing.tsx         # 3 tier pricing cards
  reviews/insight-card.tsx      # Per-insight + note input
  snapshot/share-image.tsx      # Exportable snapshot
```

---

## Launch Checklist

**Technical:**
- [ ] Load test: simulate 100 concurrent users, scheduler jalan 1000+ obligations
- [ ] Error monitoring: Sentry di semua 3 processes
- [ ] Uptime monitoring: Better Uptime atau Checkly
- [ ] DB backup automated (Supabase built-in, verifikasi restore)
- [ ] Rate limiting di API routes (bot spam prevention)
- [ ] GDPR compliance: export user data, delete account flow

**Product:**
- [ ] Onboarding video tutorial (< 2 menit)
- [ ] Help center: FAQ, "cara nagih teman", "cara setup email parser"
- [ ] Landing page diupdate: pricing section, WA integration mention
- [ ] Waitlist email drip untuk pre-launch signups

**Business:**
- [ ] Terms of Service + Privacy Policy (bahasa Indonesia + English)
- [ ] Stripe/Xendit merchant account verified
- [ ] WA Business API approved template messages

---

## Open Questions (to resolve before v2)

1. **Telegram penetration** — kalau < 50% teman lo pakai Telegram, WA jadi mandatory, bukan optional
2. **WA Cloud API cost** — bisa absorb sampai berapa MAU sebelum harus pass ke user?
3. **QRIS MDR** — absorb Aliran (marketing cost) atau pass 0.7% ke teman?
4. **Multi-currency** — IDR-only sampai ada user request? (estimate: 95% user IDR)
5. **Data residency** — Supabase SG vs self-host Indonesia (Biznet)? Trigger: ada compliance request dari enterprise user
6. **Free tier abuse** — email verification cukup, atau perlu phone verification?

---

## Risks (Stage 2 relevant)

- **R1** — Better Auth breaking changes. Mitigation: pin version, dedicate 1 sprint untuk upgrade kalau perlu.
- **R2** — BullMQ + Redis cost naik di Upstash. Mitigation: monitor weekly, switch ke self-host kalau > $20/bulan.
- **R6** — Finance data breach. Mitigation: pentest sebelum public launch, encrypted at rest, audit log akses.
- **WA API approval** — Meta bisa reject template messages. Buffer 2 minggu untuk approval, punya Telegram sebagai fallback.
