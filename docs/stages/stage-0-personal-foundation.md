# Stage 0 — Personal Finance Tracker

**Timeline:** Minggu 1–3  
**Goal:** Lo bisa pakai sendiri untuk track pengeluaran dan subscription pribadi. Validate data model sebelum masuk ke social layer dan bot.

**Success Metric:** Lo sendiri pakai daily selama 2 minggu tanpa friction major. Semua transaksi dan subscription tercatat dengan benar.

---

## Deliverables

- [ ] Landing page + auth (signup, signin, forgot password)
- [ ] Onboarding wizard (profile + first account + first subscription)
- [ ] Account management (bank, e-wallet, cash, credit card)
- [ ] Transaction entry: expense, income, transfer
- [ ] Category management (default + custom)
- [ ] Personal commitment (subscription) + auto-generate obligation
- [ ] Email reminder via Resend
- [ ] Calendar view
- [ ] Dashboard

---

## Features

### F0.1 — Account Management

User dapat:
- Bikin multiple accounts (Bank BCA, GoPay, Cash, Credit Card BCA)
- Set initial balance per account
- Set currency per account (default IDR)
- Mark account sebagai "default" untuk quick entry

**Acceptance criteria:**
- Form bikin account: nama, tipe (bank/ewallet/cash/credit), balance awal, currency
- Edit & soft-delete (soft via `archivedAt`)
- Balance auto-update setiap ada transaksi masuk/keluar

---

### F0.2 — Transaction Entry (Expense, Income, Transfer)

User dapat:
- Quick add expense: amount, account, merchant (auto-suggest dari history), category, date, note
- Quick add income: sumber, account tujuan, category, date, note
- Transfer antar account dengan fee opsional

**Acceptance criteria:**
- Form responsive, mobile-first (PWA-ready)
- Merchant auto-suggest dari history transaksi sebelumnya
- Default categories: Makan, Transport, Belanja, Hiburan, Tagihan, Lainnya
- Custom kategori bisa ditambah
- Balance semua account reflect realtime setelah transaksi

---

### F0.3 — Category Management

User dapat:
- Lihat daftar kategori default
- Tambah kategori custom dengan nama + icon + warna
- Edit & hapus kategori custom (kategori default tidak bisa dihapus)
- Assign tipe kategori: expense atau income

**Acceptance criteria:**
- Kategori default seeded saat onboarding
- Kategori custom milik user, gak bocor ke user lain
- Saat kategori dihapus, transaksi lama tetap ada (kategori → "Lainnya")

---

### F0.4 — Personal Commitment (Subscription Tracker)

User dapat:
- Tambah subscription pribadi: nama (Netflix), amount, billing cycle (monthly/yearly/weekly), next renewal date, account yang bayar
- Set reminder: pilih berapa hari sebelum jatuh tempo (H-3, H-1, hari-H)
- Lihat daftar subscription aktif + total biaya/bulan
- Pause atau cancel subscription

**Auto-generate obligation:**
- Saat cron daily jalan dan menemukan commitment yang `nextRenewalAt <= today`, generate 1 `Obligation` untuk periode tersebut
- Status obligation mulai dari `pending`
- Saat obligation di-mark `paid` → system create expense transaction otomatis (linked ke commitment + obligation)
- `nextRenewalAt` di-advance ke cycle berikutnya

**Reminder:**
- Cron daily cek obligations yang jatuh tempo dalam `reminderDays` hari ke depan
- Send email reminder via Resend

**Acceptance criteria:**
- Total biaya subscription/bulan dihitung di dashboard
- Bisa edit semua field subscription, kecuali billing history yang sudah ada
- Pause: stop generate obligations sampai di-resume
- Cancel: stop permanently, existing obligations tetap ada

---

### F0.5 — Calendar View

User dapat:
- Lihat semua transaksi & upcoming obligation di calendar (month view)
- Tap tanggal → lihat detail transaksi/obligation di hari itu
- Filter by: account, category, type (expense/income/commitment)
- Balance forecast: prediksi saldo di akhir bulan berdasarkan upcoming obligations

**Acceptance criteria:**
- Calendar render < 200ms
- Dot indicator per tanggal dengan warna by type: hijau = income, merah = expense, biru = commitment
- Toggle view: month / week / list

---

### F0.6 — Dashboard

Sections:
- **Total balance** — sum semua account aktif
- **This month** — income, expense, net (income - expense)
- **Upcoming obligations** — 7 hari ke depan, sorted by date
- **Recent transactions** — 10 terakhir
- **Subscription summary** — total/bulan, jumlah aktif
- **Quick actions** — add transaction, add subscription

---

### F0.7 — Auth & Onboarding

**Auth flows:**
- Sign up: email + password (min 8 char) → send verification email (Resend) → klik link → auto-login → /onboarding
- Sign in: email + password atau Google OAuth → session cookie (httpOnly, secure)
- Forgot password: input email → reset link via email (valid 1 jam) → input new password → auto-login
- Sign out: clear session → redirect ke /

**Rate limiting:** 5 attempts per 15 menit per IP untuk sign-in dan sign-up.

**Onboarding wizard (3 steps):**

1. **Profile** — display name, WhatsApp number (untuk keperluan tagihan nanti di Stage 1)
2. **First Account** — pilih dari preset (BCA, Mandiri, GoPay, OVO, Cash) atau custom, set initial balance
3. **First Subscription** *(optional)* — quick add Netflix/Spotify/dll, bisa skip

Selesai → /dashboard

---

## Data Model (Stage 0 scope)

Tables yang dibutuhkan di stage ini:

```
users                    Better Auth managed
sessions                 Better Auth
accounts_auth            Better Auth (OAuth)
verifications            Better Auth

financial_accounts       Rekening/wallet user
merchants                Auto-suggest merchant dari history
categories               Default + custom per user
flows                    Semua transaksi (expense, income, transfer)
commitments              Subscription pribadi
obligations              Instance tagihan per billing cycle
```

**Belum dibutuhkan di stage ini:**
- `contacts` — masuk Stage 1
- `commitment_shares` — masuk Stage 1
- `telegram_users`, `bot_messages` — masuk Stage 1
- `obligation_events` — masuk Stage 1 (audit trail multi-user)

---

## Tech Stack (Stage 0)

| Layer | Tech |
|-------|------|
| Framework | Next.js 16 (App Router) |
| UI | Tailwind + shadcn/ui |
| State | TanStack Query + React Hook Form |
| Auth | Better Auth |
| DB | Supabase Postgres + Drizzle |
| Queue | BullMQ + Redis (Upstash) — renewal scheduler & reminder |
| Email | Resend — verification + reminder |
| Validation | Zod |
| Date | date-fns |
| Charts | Recharts — dashboard chart |
| Deploy | Vercel (frontend) + Railway (worker) |

**Hanya 2 processes di stage ini:**
1. **Next.js app** (Vercel) — UI, auth, server actions
2. **Worker** (Railway) — BullMQ consumer untuk renewal scheduler + email reminder

Bot process belum ada — masuk Stage 1.

---

## Folder Structure (Stage 0 scope)

```
app/
  (marketing)/page.tsx          # Landing page
  (auth)/
    signin/page.tsx
    signup/page.tsx
    forgot-password/page.tsx
    reset-password/page.tsx
  (app)/
    layout.tsx                  # Auth-protected layout
    dashboard/page.tsx
    transactions/page.tsx
    commitments/page.tsx
    calendar/page.tsx
    settings/page.tsx
  onboarding/page.tsx
lib/
  auth.ts                       # Better Auth config
  db.ts                         # Drizzle client
  schema.ts                     # Drizzle schema
  actions/
    transactions.ts
    commitments.ts
    accounts.ts
  queries/
    dashboard.ts
    calendar.ts
  validations/
worker/
  index.ts
  jobs/
    renewal-scheduler.ts        # Cron: generate obligations
    email-reminder.ts           # Cron: send reminder email
```

---

## Risks (Stage 0 relevant)

- **R1** — Better Auth masih relatively new. Mitigation: pin version, watch changelog.
- **R6** — Finance data sensitif. Mitigation: encrypted at rest, no log sensitive data, httpOnly session cookie.
