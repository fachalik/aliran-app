# PRD: Aliran

> Personal finance tracker dengan konsep **Money Flow Graph** dan **Shared Commitment** sebagai first-class entity. Anti-mainstream split bill app untuk circle kecil, growable jadi SaaS publik.

**Owner:** Chalik
**Status:** Draft v2 (Telegram bot smart collection)
**Last updated:** 16 Mei 2026

---

## 1. Product Overview

### 1.1 Tagline
**"Lacak uangmu. Bot yang nagih temanmu. Tanpa drama."**

### 1.2 Problem Statement
Aplikasi finance yang ada di pasar terpecah jadi tiga silo:
- **Expense tracker** (Money Lover, Wallet) — bagus untuk pribadi, lemah di shared expense
- **Split bill** (Splitwise, Tricount) — bagus untuk one-time bill, lemah untuk subscription patungan yang recurring
- **Reminder app** — terpisah dari konteks keuangan

Pain point yang gak terpecahkan dengan baik:
1. **Subscription patungan rumit di-manage**: Netflix/Spotify/YouTube Premium yang patungan 3-5 orang gak punya tempat. Splitwise treat sebagai transaksi berulang manual, bukan kontrak.
2. **Males nagih teman**: Setelah patungan, transfer reminder ke WA harus manual—nyalin nominal, no rekening, hitung selisih.
3. **Tracking dan split bill datanya terpisah**: Padahal sumber uang lo sama.
4. **Insight gak actionable**: Pie chart kategori cuma jadi pajangan, gak bantu lo decide.

### 1.3 Solution Concept

Aliran adalah **money flow graph**: setiap entity (lo, teman, merchant, subscription, rekening) adalah node, setiap perpindahan uang adalah edge. Tracking pribadi, split bill, dan subscription patungan adalah representasi yang sama, beda view aja.

**Core differentiators:**
1. **Commitment system** — subscription patungan adalah entity dengan lifecycle, bukan transaksi berulang
2. **Smart Collection via Telegram Bot** — bot otomatis broadcast tagihan ke teman, terima konfirmasi dengan inline button, dan auto-update status. Lo gak perlu nyalin nominal atau ngirim WA satu-satu.
3. **Calendar-first UI** — cashflow forecast visual, bukan list transaksi
4. **AI weekly review** — pertanyaan kontekstual, bukan dashboard mati

### 1.4 Non-Goals
- **Bukan** aplikasi investasi atau trading
- **Bukan** budgeting tool ala YNAB (envelope method) — fokusnya tracking & shared expense
- **Bukan** payment processor — Aliran gak handle uang beneran, cuma tracking dan reminder
- **Bukan** OCR receipt scanner (mungkin di v3)

---

## 2. Target User

### 2.1 Primary Persona (v0–v1)
**"Solo founder yang patungan subscription sama temennya"**
- Umur 25–35
- Tech-savvy, punya 3–8 subscription aktif (Netflix, Spotify, ChatGPT, Claude, GitHub Copilot, dll)
- Patungan setidaknya 1–2 subscription dengan 2–4 teman
- Punya beberapa rekening (bank, e-wallet, kartu kredit)
- Frustrasi dengan Splitwise yang gak natively support recurring shared subscription

### 2.2 Secondary Persona (v2 publik)
**"Pasangan/roommate yang share expense"**
- Pasangan muda atau roommate yang share rent, listrik, belanja
- Butuh visibility ke pengeluaran masing-masing tanpa harus merge rekening

### 2.3 Anti-Persona (jangan dilayani dulu)
- User yang butuh akuntansi formal (jurnal, neraca) — pakai Jurnal/Accurate
- User yang butuh import otomatis transaksi bank — pakai Brick/Finantier integration (di v3+)

---

## 3. Core Concept: Money Flow Graph

### 3.1 Entity Model

```
┌─────────────────────────────────────────────────┐
│  Node Types                                     │
├─────────────────────────────────────────────────┤
│  • User (lo, dengan auth)                       │
│  • Contact (teman, tanpa auth — v1)             │
│  • Account (rekening, e-wallet, kartu)          │
│  • Merchant (Tokopedia, Indomaret, Netflix)     │
│  • Commitment (subscription patungan/pribadi)   │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│  Edge Types (Flow)                              │
├─────────────────────────────────────────────────┤
│  • Expense:    Account → Merchant               │
│  • Income:     Merchant → Account               │
│  • Transfer:   Account → Account                │
│  • Receivable: Contact → User (teman ngutang)   │
│  • Payable:    User → Contact (lo ngutang)      │
│  • Settlement: Account → Account (across users) │
└─────────────────────────────────────────────────┘
```

### 3.2 Commitment as First-Class Citizen

Setiap subscription (pribadi maupun patungan) adalah `Commitment` dengan:
- Billing cycle (monthly, yearly, custom)
- Renewal date
- Stakeholders (kalau patungan) dengan share allocation (equal/percentage/fixed amount)
- Status: active, paused, cancelled
- Auto-generates `Obligation` per renewal cycle

`Obligation` adalah instance konkret yang harus dibayar: "Bulan November 2026, si A harus bayar Rp 46.500 ke lo untuk Netflix." Obligation bisa di-mark "paid" lewat WA confirmation atau manual.

### 3.3 Why Graph, Not Ledger?

Manfaat konkret:
- **Net position query**: "Berapa selisih uang antara gue dan si A bulan ini?" → traversal antar dua node
- **Subscription audit**: "Lacak siapa aja yang pernah patungan Netflix gue dari 2024" → query temporal di edges
- **Spending velocity**: "Merchant mana yang flow uangnya paling sering ke gue?" → degree centrality
- **Future**: Multi-currency, multi-user collaboration, audit log natural

Implementasi tetap di Postgres + Drizzle. Graph adalah logical model, bukan harus pakai Neo4j.

---

## 4. Feature Specification

### 4.1 v0 — Personal Foundation (Week 1–3)

**Goal:** Lo bisa pakai sendiri untuk track pengeluaran dan subscription pribadi. Validate data model sebelum multi-user.

#### F0.1 — Account Management
**User dapat:**
- Bikin multiple accounts (Bank BCA, GoPay, Cash, Credit Card BCA)
- Set initial balance per account
- Set currency per account (default IDR)
- Mark account sebagai "default" untuk quick entry

**Acceptance:**
- Form bikin account dengan nama, tipe (bank/ewallet/cash/credit), balance awal, currency
- Edit & soft-delete account
- Balance auto-update saat ada transaction

#### F0.2 — Transaction Entry (Expense, Income, Transfer)
**User dapat:**
- Quick add expense dengan: amount, account, merchant (auto-suggest), category, date, note
- Quick add income (sumber, account tujuan)
- Transfer antar account (dengan fee opsional)

**Acceptance:**
- Form responsive untuk mobile (PWA-ready)
- Merchant auto-suggest dari history
- Categories default: Makan, Transport, Belanja, Hiburan, Tagihan, Lainnya
- Bisa custom kategori
- Balance reflect realtime

#### F0.3 — Personal Commitment (Subscription)
**User dapat:**
- Bikin subscription pribadi: nama (Netflix), amount, billing cycle (monthly/yearly), next renewal date, account yang bayar
- Set reminder (3 hari sebelum, 1 hari sebelum, hari-H)
- Auto-generate obligation di tanggal renewal
- Saat renewal tercatat, sistem create expense transaction otomatis (linked ke commitment)

**Acceptance:**
- Daftar subscription aktif di dashboard
- Total subscription/bulan terhitung
- Reminder via in-app notification + email
- Bisa pause/cancel commitment

#### F0.4 — Calendar View
**User dapat:**
- Lihat semua transaksi & upcoming obligation di kalender (month view)
- Tap tanggal → lihat detail
- Filter by account, category, type
- Forecast: balance prediksi di akhir bulan berdasarkan upcoming obligations

**Acceptance:**
- Calendar render < 200ms
- Dot indicator per tanggal (warna by type: hijau income, merah expense, biru commitment)
- Toggle view: month / week / list

#### F0.5 — Dashboard
**Sections:**
- Total balance (sum all accounts)
- This month: income, expense, net
- Upcoming obligations (7 hari ke depan)
- Recent transactions (10 terakhir)
- Quick action: add transaction, add subscription

---

### 4.2 v1 — Social Layer (Week 4–8)

**Goal:** Lo + circle kecil bisa share subscription dan split bill. Test sama 5–10 teman.

#### F1.1 — Contacts (No Auth Required)
**User dapat:**
- Tambah contact (teman) cukup dengan nama + WA number
- Contact gak perlu daftar akun
- Edit, archive contact
- **Generate Telegram invite link** per contact: `t.me/AliranBot?start=invite_xxx` untuk dikirim ke teman supaya mereka bisa receive bot notification

**Acceptance:**
- Validasi format WA number (Indonesia: 08xx → auto-convert ke 628xx)
- Contact unique by WA number per user
- Saat teman `/start invite_xxx` di bot, contact otomatis terlink ke Telegram ID mereka

#### F1.2 — Shared Commitment (Subscription Patungan)
**User dapat:**
- Convert personal commitment jadi shared, atau bikin baru sebagai shared
- Add stakeholders (contacts) ke commitment
- Set share allocation: equal split / custom percentage / fixed amount
- Set siapa yang bayar dulu (payer rotation: lo selalu, atau rotasi per cycle)

**Acceptance:**
- Saat renewal: auto-generate obligations per stakeholder
- Total obligations = total amount (validasi)
- History payer per cycle tercatat

#### F1.3 — Obligation Lifecycle
**Per obligation:**
- Status: pending → notified → paid → settled
- Action: send WA reminder, mark as paid, dispute, defer
- Audit log per state change

**Acceptance:**
- Mark paid bisa: manual (lo confirm dapet transfer) atau via "request screenshot" (teman upload bukti transfer, lo approve)
- Defer: geser deadline tanpa hapus obligation

#### F1.4 — Smart Collection Engine (Telegram Bot)

**Concept:** Bot Telegram jadi "collection agent" otomatis. Teman cukup `/start` ke bot Aliran sekali, link sama nomor mereka di kontak lo, dan setelah itu semua tagihan flow lewat bot.

**Pre-condition:**
- Teman harus `/start` bot Aliran sekali (one-time)
- Atau lo bisa share invite link unik: `t.me/AliranBot?start=invite_xxx` → otomatis link ke contact lo

**Auto-broadcast flow:**

```
Worker scheduler (cron daily 00:00 WIB)
  → scan obligations dengan due date == today + reminderDays
  → untuk tiap obligation:
     1. Generate unique transfer code (e.g. ALIR-NTFLX-NOV-A3F2)
     2. Compose pesan dengan amount, no rek lo, kode transfer
     3. Send via Telegram Bot API ke teman
     4. Log ke bot_messages table
     5. Update obligation.status = 'notified', lastNudgedAt = now()
```

**Message template (editable per user):**

```
📌 Tagihan dari Chalik

Netflix Premium — November 2026
Total kamu: Rp 46.500
Jatuh tempo: 5 November 2026

Transfer ke:
🏦 BCA 1234567890
👤 a.n. Chalik

⚠️ Wajib pakai kode di kolom berita transfer:
ALIR-NTFLX-NOV-A3F2

[✅ Sudah Transfer]  [⏰ Belum Bisa]  [❌ Bukan Saya]
```

**Inline button handler:**

1. **Sudah Transfer** → status `notified` → `paid`, kirim notif ke lo:
   ```
   💰 Anto bilang udah transfer Rp 46.500
   Untuk: Netflix Nov 2026
   Kode: ALIR-NTFLX-NOV-A3F2
   
   Cek mutasi BCA lo?
   [✅ Konfirmasi Terima] [❌ Belum Masuk] [⚠️ Salah Nominal]
   ```

2. **Belum Bisa** → status → `deferred`, bot tanya kapan bisa bayar:
   ```
   Oke, kapan kira-kira bisa transfer?
   [Besok] [3 hari lagi] [Minggu depan] [Custom]
   ```
   → set new dueAt, schedule re-broadcast

3. **Bukan Saya** → status → `disputed`, notif lo:
   ```
   ⚠️ Anto bilang tagihan ini bukan dia.
   Mau review stakeholder commitment ini?
   ```

**Lo konfirmasi via bot juga:**

- Tap `✅ Konfirmasi Terima` → status → `settled`, create flow income di akun lo, balance auto-update
- Tap `❌ Belum Masuk` → status balik ke `notified`, bot tanya teman lagi (gentle escalation)

**Acceptance:**
- Bot deployed di Telegram, gratis (no msg cost)
- Linking flow: teman `/start invite_xxx` → otomatis matched ke contact via username/Telegram ID
- Inline button state preserved (Telegram inline keyboard with callback_data)
- Idle handling: kalau 24 jam gak ada response, auto re-send reminder
- Audit trail: tiap state change tercatat di `obligation_events` table

#### F1.4.1 — Bot Commands (Untuk User Owner)

Selain auto-broadcast, lo bisa interact langsung dengan bot:

| Command | Action |
|---------|--------|
| `/start` | Onboarding & link akun Telegram ke akun Aliran |
| `/tagih [contact]` | Manual trigger broadcast ke contact tertentu |
| `/tagih_semua` | Broadcast semua obligation yang due ≤ 7 hari |
| `/status` | List obligation pending dengan status |
| `/lapor` | Quick add transaction via natural language ("makan padang 35rb gopay") |
| `/saldo` | Cek balance semua account |
| `/help` | Show all commands |

**Natural language untuk /lapor (v1.5+):**
Pakai Claude API parsing → kalau lo ketik "abis makan padang 35rb pake gopay", bot parse jadi:
```
✅ Tercatat
Expense: Rp 35.000
Kategori: Makan Luar (auto-detected)
Akun: GoPay
Tanggal: hari ini
[Edit] [Batal]
```

#### F1.4.2 — Optional: Email Parser untuk Auto-Confirm

Pain point: lo harus konfirmasi tiap teman transfer. Solusi optional:

1. Lo set forwarding rule di Gmail: email dari `notifikasi@bca.co.id` → forward ke `parser@aliran.app`
2. Aliran parse email mutasi:
   - Extract: amount, sender name, transfer note
   - Match ke obligation by amount + transfer code dalam note
3. Kalau match: auto-update status → `settled`, zero-tap dari lo
4. Bot kirim notif ke teman: "✅ Transfer Rp 46.500 udah diterima!"

**Implementation:** Resend Inbound (atau Cloudflare Email Workers) → parse → BullMQ job. Available di v1.5, opt-in per user.

#### F1.5 — Net Position View
**User dapat:**
- Lihat per contact: total receivable, total payable, net balance
- "Si A: net +Rp 145.000 ke lo (Netflix Nov + Spotify Oct)"
- Settle button: mark all current obligations as settled in one go

**Acceptance:**
- Sorting by net amount desc
- Drill-down: tap contact → list obligation history
- Settle action create settlement transaction (audit trail)

---

### 4.3 v2 — Public Launch (Week 9–16)

**Goal:** Production-ready SaaS dengan onboarding halus, insight engine, dan billing.

#### F2.1 — Multi-User Collaboration
**Upgrade dari contact ke registered user:**
- Contact bisa di-invite jadi registered user
- Saat invite di-accept, dua sisi share data commitment (tapi tetep punya tracking pribadi masing-masing)
- Settlement otomatis sync di dua sisi

**Acceptance:**
- Invite via email atau WA link dengan magic token
- Conflict resolution: kalau dua user edit commitment yang sama, last-write-wins dengan log

#### F2.2 — Weekly Review (AI-powered)
**Setiap Minggu malam, push notification:**
- "Review pengeluaran minggu ini"
- Show 3–5 insight, contoh:
  - "Pengeluaran 'Makan Luar' naik 60% minggu ini. Apa yang beda?"
  - "Subscription [X] gak ada usage tracking 2 bulan. Mau pause?"
  - "Net receivable lo dari [A] udah 3 bulan. Mau di-nudge?"
- User isi short note (1–2 kalimat per insight)
- Note disimpan, jadi context untuk monthly review

**Acceptance:**
- Insight generated via LLM (Claude API) berdasarkan data minggu itu
- Prompt template versioned & editable di admin
- Cost cap per user per minggu (max 1 generation, ~1k tokens)

#### F2.3 — Monthly Snapshot
- Auto-generated report per akhir bulan
- Highlight: top category, biggest transaction, subscription cost, net social position
- Compare ke bulan lalu
- Export PDF/share image

#### F2.4 — Subscription Marketplace (insight)
**Sederhana:** show common subscriptions di Indonesia dengan harga current:
- Netflix Premium Rp 186k/4 acc → patungan optimal 4 orang = Rp 46.5k/org
- Spotify Family Rp 79k/6 acc → patungan optimal 6 orang = Rp 13.2k/org
- Quick add ke commitment

#### F2.5 — Pricing & Billing
**Tier suggestion:**
- **Free**: 2 accounts, 3 active commitments, 5 contacts
- **Plus (Rp 25k/bulan)**: unlimited accounts/commitments/contacts, weekly AI review, monthly snapshot export
- **Pro (Rp 50k/bulan)**: + advanced insight, custom categories, API access

**Acceptance:**
- Stripe atau Xendit integration
- Trial 14 hari Plus untuk new user
- Grace period 7 hari kalau gagal billing

---

## 5. Landing Page Specification

### 5.1 Goals
- Convert visitor → signup (target conversion: 4–6% v0, optimize ke 8%+)
- Communicate **anti-mainstream positioning** dalam 5 detik
- Build trust untuk finance app (privacy, data ownership)

### 5.2 Sections

#### 5.2.1 Hero
**Headline:** "Patungan subscription gak ribet lagi."
**Subhead:** "Aliran lacak pengeluaranmu dan auto-tagih temanmu lewat bot Telegram. Otomatis, tanpa nyalin nominal manual."
**CTA primary:** "Coba Gratis" → /signup
**CTA secondary:** "Lihat demo" → scroll to demo section
**Visual:** Animated mockup Telegram chat dengan bot kirim tagihan ke teman + inline button

#### 5.2.2 Problem Strip
**Heading:** "Capek nagih patungan?"
3 cards:
- "Bagi rata manual tiap bulan" 😩
- "Lupa siapa udah bayar" 🤔
- "Mau nagih tapi gak enak" 😬

#### 5.2.3 Core Feature Showcase (3 sections, scroll-snap)
1. **Subscription patungan sebagai kontrak**
   - Visual: commitment card with stakeholder avatars
   - Copy: "Bikin sekali, auto-generate tagihan tiap renewal"

2. **Bot Telegram nagih, lo tinggal terima**
   - Visual: Telegram chat mockup—bot kirim tagihan ke teman, teman tap "Sudah Transfer", lo dapet notif konfirmasi
   - Copy: "Lo gak nyalin nominal, gak ngetik no rekening. Bot ngerjain semuanya."

3. **Kalender, bukan daftar**
   - Visual: calendar dengan future obligation highlighted
   - Copy: "Tau persis kapan duit masuk, kapan keluar"

#### 5.2.4 How It Works
4-step visual:
1. Daftar (30 detik)
2. Tambah subscription patungan + invite teman ke bot Telegram
3. Bot auto-broadcast tagihan tiap bulan
4. Teman tap "Sudah Transfer" → lo konfirmasi → done

#### 5.2.5 Privacy & Trust
- "Datamu di server Indonesia (Supabase region SG, mirror IDN soon)"
- "Encrypted at rest"
- "Export & delete kapan aja"
- "Bukan payment processor — kami gak pegang uangmu"

#### 5.2.6 Pricing (v2)
3 tier cards (Free / Plus / Pro) — di v0/v1 cuma Free.

#### 5.2.7 FAQ
- "Beda sama Splitwise?" → Splitwise gak punya recurring commitment + bot auto-tagih
- "Teman gue harus daftar?" → Gak. Teman cukup `/start` bot Telegram sekali, gak perlu bikin akun
- "Kenapa Telegram, bukan WhatsApp?" → Telegram Bot API gratis & resmi. WA Cloud API ada cost per pesan. Migrasi ke WA di v2 setelah ada budget.
- "Datanya aman?" → encrypted, region SG, GDPR-ready
- "Free forever?" → free tier permanent, paid tier opsional
- "Bisa import dari Splitwise?" → Roadmap v2

#### 5.2.8 Footer CTA
**Heading:** "Mulai gratis. Tanpa kartu kredit."
**CTA:** "Daftar sekarang"

### 5.3 Design Direction
- **Tone:** Bahasa Indonesia kasual tapi profesional. Hindari corporate jargon.
- **Aesthetic:** Modern minimalist, warm palette (bukan biru korporat). Saran: deep green primary (#1a4d3a) + warm cream background (#faf7f0).
- **Typography:** Inter atau Geist untuk UI, Instrument Serif untuk hero headline (kasih karakter).
- **Animation:** Subtle scroll-driven, gak overdone. Pakai Motion (ex-Framer Motion) atau CSS scroll-timeline.

---

## 6. Authentication Specification

### 6.1 Provider: Better Auth

Pilihan ini karena:
- Modular, framework-agnostic, full TypeScript
- Native support untuk Drizzle + Postgres
- Built-in email/password + OAuth + magic link
- Sesi management lebih clean dari NextAuth
- Sudah lo pakai di project sebelumnya

### 6.2 Auth Flows

#### 6.2.1 Sign Up
**Methods:**
- Email + password (primary)
- Google OAuth (sekunder, untuk quick access)

**Flow:**
1. User isi email + password (min 8 char, alphanumeric)
2. POST /api/auth/sign-up
3. Send verification email (Resend)
4. User klik link → email verified
5. Auto-login, redirect ke /onboarding

**Acceptance:**
- Validate email format real-time
- Password strength indicator
- Show error dengan jelas (email already used, weak password)
- Rate limit: 5 attempts per 15 min per IP

#### 6.2.2 Sign In
**Flow:**
1. Email + password atau Google OAuth
2. POST /api/auth/sign-in
3. Set session cookie (httpOnly, secure, sameSite=lax)
4. Redirect ke /dashboard (atau ke originally-requested page)

**Acceptance:**
- "Remember me" — session 30 hari vs 1 hari
- Failed login: generic error ("email atau password salah"), gak leak info

#### 6.2.3 Forgot Password
**Flow:**
1. User input email
2. POST /api/auth/forgot-password
3. Send reset link via email (token valid 1 jam)
4. User klik → /reset-password?token=xxx
5. Input new password → POST /api/auth/reset-password
6. Auto-login

#### 6.2.4 Email Verification
- Required sebelum bisa add commitment shared (security trust)
- Bisa skip untuk personal-only usage

#### 6.2.5 Sign Out
- POST /api/auth/sign-out
- Clear session, redirect ke /

### 6.3 Onboarding (Post-Signup)

3-step onboarding wizard di /onboarding:

**Step 1 — Profile**
- Display name
- WhatsApp number (untuk no rek info di template tagihan)

**Step 2 — Link Telegram Bot**
- Show QR code + link `t.me/AliranBot?start=link_xxx` (token unik)
- Bot detect `/start link_xxx`, get Telegram ID & chat ID, link ke user akun lo
- Status indicator real-time: "Belum ter-link" → "Tersambung ✅"
- Skip available (bisa link belakangan di settings)

**Step 3 — First Account**
- "Akun mana yang biasa lo pake?" — pilih dari preset (BCA, Mandiri, GoPay, OVO, dst) atau custom
- Set initial balance

**Step 4 — First Commitment (Optional)**
- "Punya subscription yang lagi aktif?" — quick add Netflix/Spotify/dst
- Skip available

Selesai → /dashboard

### 6.4 Invite Flow (v1+)

**Untuk add contact (teman) supaya bisa receive bot notification:**
1. Lo add contact (nama + WA number) di app
2. Sistem auto-generate unique `inviteCode` per contact
3. Lo share link `t.me/AliranBot?start=invite_xxx` ke teman via WA/chat manual
4. Teman tap link → buka Telegram → tap `/start` → bot detect inviteCode → link contact ke Telegram ID mereka
5. Status di app: contact dari "Belum tersambung" → "✅ Tersambung via @username"

**Bot welcome message saat first `/start invite_xxx`:**
```
Hai! Saya bot Aliran 🌊

Chalik invite kamu untuk receive notification 
patungan subscription kalian.

Kalau ada tagihan baru, saya bakal kirim ke chat ini.
Kamu tinggal tap tombol "Sudah Transfer" kalau udah bayar.

✅ Akun kamu sudah ter-link
```

**Untuk contact yang sudah punya akun Aliran sendiri (v2):**
- Sistem detect: ada user dengan Telegram ID ini?
- Kalau ada: kirim notif "X invite kamu ke commitment Y. Accept?"
- Sync data dua arah

### 6.5 Protected Routes

Pakai Next.js middleware:
```typescript
// middleware.ts
export const config = {
  matcher: ['/dashboard/:path*', '/settings/:path*', '/api/protected/:path*']
}
```

Unauth user → redirect ke /signin dengan ?redirect=[original-path]

---

## 7. Data Model (Drizzle Schema)

```typescript
// schema.ts
import { pgTable, uuid, text, timestamp, numeric, integer, boolean, pgEnum, jsonb } from 'drizzle-orm/pg-core';

// ============ Better Auth Tables ============
export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  email: text('email').notNull().unique(),
  emailVerified: boolean('email_verified').default(false),
  name: text('name'),
  image: text('image'),
  whatsappNumber: text('whatsapp_number'), // E.164 format, e.g. 6281234567890
  createdAt: timestamp('created_at').defaultNow(),
  updatedAt: timestamp('updated_at').defaultNow(),
});

export const sessions = pgTable('sessions', { /* better-auth managed */ });
export const accounts_auth = pgTable('accounts_auth', { /* better-auth oauth */ });
export const verifications = pgTable('verifications', { /* better-auth */ });

// ============ Core Domain ============
export const accountTypeEnum = pgEnum('account_type', ['bank', 'ewallet', 'cash', 'credit_card']);

export const financialAccounts = pgTable('financial_accounts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  type: accountTypeEnum('type').notNull(),
  currency: text('currency').default('IDR').notNull(),
  balance: numeric('balance', { precision: 18, scale: 2 }).default('0').notNull(),
  isDefault: boolean('is_default').default(false),
  archivedAt: timestamp('archived_at'),
  metadata: jsonb('metadata'), // bank name, account number (encrypted), etc
  createdAt: timestamp('created_at').defaultNow(),
});

export const contacts = pgTable('contacts', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  whatsappNumber: text('whatsapp_number'),
  email: text('email'),
  telegramId: text('telegram_id'), // linked saat mereka /start bot
  telegramUsername: text('telegram_username'),
  inviteCode: text('invite_code').unique(), // untuk t.me/AliranBot?start=invite_xxx
  linkedAt: timestamp('linked_at'), // kapan mereka /start bot
  linkedUserId: uuid('linked_user_id').references(() => users.id), // when contact signs up
  archivedAt: timestamp('archived_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const merchants = pgTable('merchants', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  category: text('category'),
  isGlobal: boolean('is_global').default(false), // shared across users (Netflix, etc)
  createdAt: timestamp('created_at').defaultNow(),
});

export const categories = pgTable('categories', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }),
  name: text('name').notNull(),
  icon: text('icon'),
  color: text('color'),
  type: text('type'), // expense | income
});

// ============ Flows (the graph edges) ============
export const flowTypeEnum = pgEnum('flow_type', [
  'expense', 'income', 'transfer', 'receivable', 'payable', 'settlement'
]);

export const flows = pgTable('flows', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  type: flowTypeEnum('type').notNull(),
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
  currency: text('currency').default('IDR').notNull(),
  occurredAt: timestamp('occurred_at').notNull(),

  // Polymorphic source/destination
  sourceType: text('source_type'),    // 'account' | 'contact' | 'merchant'
  sourceId: uuid('source_id'),
  targetType: text('target_type'),
  targetId: uuid('target_id'),

  categoryId: uuid('category_id').references(() => categories.id),
  note: text('note'),

  // Linked entities
  commitmentId: uuid('commitment_id').references(() => commitments.id),
  obligationId: uuid('obligation_id').references(() => obligations.id),

  createdAt: timestamp('created_at').defaultNow(),
});

// ============ Commitments (Subscriptions) ============
export const billingCycleEnum = pgEnum('billing_cycle', ['monthly', 'yearly', 'weekly', 'custom']);
export const commitmentStatusEnum = pgEnum('commitment_status', ['active', 'paused', 'cancelled']);
export const splitMethodEnum = pgEnum('split_method', ['equal', 'percentage', 'fixed']);

export const commitments = pgTable('commitments', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  name: text('name').notNull(),
  merchantId: uuid('merchant_id').references(() => merchants.id),
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
  currency: text('currency').default('IDR').notNull(),
  billingCycle: billingCycleEnum('billing_cycle').notNull(),
  cycleConfig: jsonb('cycle_config'), // e.g. { dayOfMonth: 15 } or { intervalDays: 30 }
  nextRenewalAt: timestamp('next_renewal_at').notNull(),
  paymentAccountId: uuid('payment_account_id').references(() => financialAccounts.id),
  status: commitmentStatusEnum('status').default('active').notNull(),
  isShared: boolean('is_shared').default(false),
  splitMethod: splitMethodEnum('split_method'),
  reminderDays: integer('reminder_days').array().default([3, 1]), // remind H-3, H-1
  pausedAt: timestamp('paused_at'),
  cancelledAt: timestamp('cancelled_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const commitmentShares = pgTable('commitment_shares', {
  id: uuid('id').primaryKey().defaultRandom(),
  commitmentId: uuid('commitment_id').references(() => commitments.id, { onDelete: 'cascade' }).notNull(),
  contactId: uuid('contact_id').references(() => contacts.id),
  userId: uuid('user_id').references(() => users.id), // null if contact not yet registered
  shareValue: numeric('share_value', { precision: 18, scale: 4 }).notNull(), // percentage OR fixed amount
  isPayer: boolean('is_payer').default(false), // who pays first
  addedAt: timestamp('added_at').defaultNow(),
  removedAt: timestamp('removed_at'),
});

// ============ Obligations (auto-generated from commitments) ============
export const obligationStatusEnum = pgEnum('obligation_status', [
  'pending', 'notified', 'paid', 'settled', 'disputed', 'deferred'
]);

export const obligations = pgTable('obligations', {
  id: uuid('id').primaryKey().defaultRandom(),
  commitmentId: uuid('commitment_id').references(() => commitments.id, { onDelete: 'cascade' }).notNull(),
  cyclePeriod: text('cycle_period').notNull(), // e.g. '2026-11'
  fromContactId: uuid('from_contact_id').references(() => contacts.id),
  fromUserId: uuid('from_user_id').references(() => users.id),
  toUserId: uuid('to_user_id').references(() => users.id).notNull(), // collector
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
  dueAt: timestamp('due_at').notNull(),
  status: obligationStatusEnum('status').default('pending').notNull(),
  lastNudgedAt: timestamp('last_nudged_at'),
  paidAt: timestamp('paid_at'),
  settledAt: timestamp('settled_at'),
  proofUrl: text('proof_url'), // screenshot transfer
  createdAt: timestamp('created_at').defaultNow(),
});

// ============ Telegram Bot Integration ============
export const telegramUsers = pgTable('telegram_users', {
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).primaryKey(),
  telegramId: text('telegram_id').notNull().unique(),
  username: text('username'),
  firstName: text('first_name'),
  chatId: text('chat_id').notNull(), // untuk send message
  linkedAt: timestamp('linked_at').defaultNow(),
});

export const botMessages = pgTable('bot_messages', {
  id: uuid('id').primaryKey().defaultRandom(),
  obligationId: uuid('obligation_id').references(() => obligations.id, { onDelete: 'cascade' }),
  contactId: uuid('contact_id').references(() => contacts.id),
  userId: uuid('user_id').references(() => users.id),
  direction: text('direction').notNull(), // 'outbound' | 'inbound'
  telegramMessageId: text('telegram_message_id'),
  chatId: text('chat_id').notNull(),
  content: text('content').notNull(),
  inlineKeyboard: jsonb('inline_keyboard'), // serialized button structure
  parsedIntent: jsonb('parsed_intent'), // untuk /lapor: { type, amount, account, category }
  status: text('status'), // 'queued' | 'sent' | 'delivered' | 'read' | 'failed'
  sentAt: timestamp('sent_at'),
  createdAt: timestamp('created_at').defaultNow(),
});

export const obligationEvents = pgTable('obligation_events', {
  id: uuid('id').primaryKey().defaultRandom(),
  obligationId: uuid('obligation_id').references(() => obligations.id, { onDelete: 'cascade' }).notNull(),
  eventType: text('event_type').notNull(), // 'created' | 'notified' | 'paid_claimed' | 'paid_confirmed' | 'deferred' | 'disputed' | 'settled'
  actor: text('actor'), // 'system' | 'user' | 'contact'
  payload: jsonb('payload'), // additional context (new dueAt for deferred, etc)
  createdAt: timestamp('created_at').defaultNow(),
});

// ============ Email Parser (v1.5 optional) ============
export const emailParseRules = pgTable('email_parse_rules', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  bankName: text('bank_name').notNull(), // 'bca' | 'mandiri' | 'bni' | ...
  forwardAddress: text('forward_address').notNull().unique(), // unique parser@aliran.app/u-xxx
  isActive: boolean('is_active').default(true),
  createdAt: timestamp('created_at').defaultNow(),
});

export const parsedTransfers = pgTable('parsed_transfers', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  rawEmailHash: text('raw_email_hash').notNull(), // dedup
  amount: numeric('amount', { precision: 18, scale: 2 }).notNull(),
  senderName: text('sender_name'),
  note: text('note'),
  transferDate: timestamp('transfer_date'),
  matchedObligationId: uuid('matched_obligation_id').references(() => obligations.id),
  status: text('status').notNull(), // 'matched' | 'unmatched' | 'manual_review'
  createdAt: timestamp('created_at').defaultNow(),
});

// ============ AI Reviews (v2) ============
export const reviews = pgTable('reviews', {
  id: uuid('id').primaryKey().defaultRandom(),
  userId: uuid('user_id').references(() => users.id, { onDelete: 'cascade' }).notNull(),
  period: text('period').notNull(), // '2026-W20' or '2026-11'
  type: text('type').notNull(), // 'weekly' | 'monthly'
  insights: jsonb('insights'), // array of { question, userNote }
  generatedAt: timestamp('generated_at').defaultNow(),
});
```

### 7.1 Key Design Decisions

- **Polymorphic flow source/target**: bikin graph queryable secara fleksibel
- **`numeric(18,2)` untuk amount**: cukup untuk IDR sampai 10^16, presisi 2 desimal
- **`numeric(18,4)` untuk shareValue**: 4 desimal untuk percentage akurat
- **Soft delete via `archivedAt`**: gak ada hard delete (audit trail)
- **`cyclePeriod` as text**: format `YYYY-MM` atau `YYYY-WNN` untuk query yang gampang

---

## 8. Tech Stack & Architecture

### 8.1 Stack

| Layer | Tech | Alasan |
|-------|------|--------|
| Framework | Next.js 16 (App Router) | Pattern lo, RSC + Server Actions |
| Language | TypeScript | Strict mode |
| UI | Tailwind + shadcn/ui | Konsisten dengan kerjaan lo |
| State | TanStack Query + React Hook Form | Server state + form state |
| Auth | Better Auth | Sesuai pilihan, modular |
| DB | Supabase Postgres | Pilihan lo, plus storage untuk proof upload |
| ORM | Drizzle | Konsisten |
| Queue | BullMQ + Redis (Upstash) | Renewal scheduler, notification |
| Bot | **grammY** (Telegram Bot framework) | Modern, TS-native, plugin ecosystem |
| Email | Resend (outbound) + Resend Inbound (parser) | Verification, reminder, mutasi parsing |
| AI (v1.5+) | Claude API (claude-sonnet-4-5) | Natural language parsing untuk `/lapor` |
| File Storage | Supabase Storage | Proof transfer screenshot |
| Validation | Zod | Schema validation |
| Date | date-fns | Locale ID built-in |
| Charts | Recharts | Konsisten, lo udah pake |
| Deploy | Vercel (frontend) + Railway/Fly (worker + bot) | Worker & bot terpisah |

### 8.2 Folder Structure

```
aliran/
├── app/
│   ├── (marketing)/
│   │   ├── page.tsx              # Landing page
│   │   ├── pricing/
│   │   └── about/
│   ├── (auth)/
│   │   ├── signin/page.tsx
│   │   ├── signup/page.tsx
│   │   ├── forgot-password/page.tsx
│   │   └── reset-password/page.tsx
│   ├── (app)/
│   │   ├── layout.tsx            # Auth-protected layout
│   │   ├── dashboard/page.tsx
│   │   ├── transactions/
│   │   ├── commitments/
│   │   ├── contacts/
│   │   ├── calendar/
│   │   ├── reviews/
│   │   └── settings/
│   ├── api/
│   │   ├── auth/[...all]/route.ts   # Better Auth handler
│   │   └── webhooks/
│   │       └── stripe/route.ts
│   ├── onboarding/page.tsx
│   ├── invite/[token]/page.tsx
│   └── layout.tsx
├── components/
│   ├── ui/                       # shadcn/ui
│   ├── marketing/                # landing sections
│   ├── auth/
│   ├── transactions/
│   ├── commitments/
│   ├── calendar/
│   └── shared/
├── lib/
│   ├── auth.ts                   # Better Auth config
│   ├── db.ts                     # Drizzle client
│   ├── schema.ts                 # Drizzle schema
│   ├── queries/                  # Data access layer
│   ├── actions/                  # Server actions
│   ├── validations/              # Zod schemas
│   ├── utils/
│   │   ├── wa-link.ts            # WA nudge generator
│   │   └── currency.ts
│   └── jobs/                     # BullMQ job definitions
├── worker/                        # Separate process (deployable terpisah)
│   ├── index.ts
│   ├── jobs/
│   │   ├── renewal-scheduler.ts
│   │   ├── notification-dispatcher.ts
│   │   ├── email-parser.ts
│   │   └── weekly-review.ts
│   └── package.json
├── bot/                           # Telegram bot process (terpisah)
│   ├── index.ts                   # grammY entry
│   ├── handlers/
│   │   ├── start.ts               # /start, invite linking
│   │   ├── commands.ts            # /tagih, /status, /lapor, /saldo
│   │   ├── callbacks.ts           # inline button handlers
│   │   └── ai-parser.ts           # natural language → intent (v1.5+)
│   ├── lib/
│   │   ├── send.ts                # message sender with template
│   │   └── keyboards.ts           # inline keyboard builders
│   └── package.json
├── drizzle/                       # Migrations
├── middleware.ts                  # Auth gate
└── package.json
```

### 8.3 Key Architectural Decisions

#### Three Processes
1. **Next.js app** (Vercel): UI, auth, server actions, API routes
2. **Worker** (Railway/Fly): BullMQ consumer untuk renewal scheduler, notification dispatcher, email parser, AI review
3. **Telegram Bot** (Railway/Fly): grammY long-polling atau webhook, handle `/start`, commands, dan callback queries

**Shared:** semua process share Drizzle schema (`lib/schema.ts`) via monorepo (pnpm workspace) atau git submodule.

#### Bot ↔ Worker Communication
Worker → Bot: lewat Redis pub/sub. Worker publish event `obligation.notify`, bot subscribe dan kirim Telegram message.

Bot → Worker: bot langsung write ke DB (status update obligation), worker pick up via cron atau Redis pub/sub balik.

**Why split?** Bot process butuh long-running connection ke Telegram. Worker process butuh akses ke BullMQ. Pisahin biar bisa restart independent dan scale terpisah kalau perlu.

#### Job types (di worker):
- `renewal-scheduler` (cron daily 00:00 WIB): scan commitments yang next_renewal_at <= today, generate obligations
- `notification-dispatcher`: untuk tiap obligation H-3/H-1/H, publish event ke Redis → bot subscribe & kirim
- `email-parser`: triggered via Resend Inbound webhook, parse mutasi email, match ke obligation
- `weekly-review-generator` (cron Sunday 19:00): generate AI insight per user

#### Server Actions for Mutations
Pakai Next.js Server Actions untuk mutation (add transaction, etc) — simpler than API routes, type-safe end-to-end.

#### Server Components by Default
- Dashboard, calendar, lists → RSC dengan direct DB query
- Form, interactive widget → Client Component dengan TanStack Query (mutation)

#### Optimistic Updates
Untuk action yang sering (add transaction, mark paid), pakai optimistic update via TanStack Query.

---

## 9. API Contract (Selected Endpoints)

### 9.1 Better Auth (auto-generated)
`POST /api/auth/sign-up`
`POST /api/auth/sign-in`
`POST /api/auth/sign-out`
`POST /api/auth/forgot-password`
`POST /api/auth/reset-password`
`GET /api/auth/session`

### 9.2 Server Actions (selected signature)

```typescript
// lib/actions/transactions.ts
'use server'

export async function createTransaction(input: {
  type: 'expense' | 'income' | 'transfer';
  amount: number;
  accountId: string;
  merchantId?: string;
  categoryId: string;
  date: Date;
  note?: string;
}): Promise<Result<{ id: string }>>;

export async function deleteTransaction(id: string): Promise<Result<void>>;

// lib/actions/commitments.ts
export async function createCommitment(input: {
  name: string;
  amount: number;
  billingCycle: 'monthly' | 'yearly' | 'weekly';
  nextRenewalAt: Date;
  paymentAccountId: string;
  isShared: boolean;
  stakeholders?: Array<{
    contactId: string;
    shareValue: number;
  }>;
}): Promise<Result<{ id: string }>>;

export async function generateObligationsForCommitment(
  commitmentId: string,
  cyclePeriod: string
): Promise<Result<{ obligationIds: string[] }>>;

// lib/actions/obligations.ts
export async function markObligationPaid(input: {
  obligationId: string;
  proofUrl?: string;
}): Promise<Result<void>>;

export async function triggerTelegramBroadcast(
  obligationId: string
): Promise<Result<{ messageId: string; sentAt: Date }>>;

export async function regenerateInviteCode(
  contactId: string
): Promise<Result<{ inviteCode: string; telegramLink: string }>>;
```

### 9.3 Webhook
`POST /api/webhooks/stripe` — billing events (v2)

---

## 10. Roadmap & Milestones

### v0 — Personal Foundation + Bot Setup
**Timeline:** Minggu 1–4 (extended 1 minggu untuk bot)
**Deliverable:**
- Landing page + auth (signup, signin, forgot password)
- Onboarding wizard dengan Telegram bot linking (Step 2)
- Personal accounts, transactions, categories
- Personal commitments + auto-generate obligation
- Calendar view + dashboard
- **Telegram bot v0: `/start`, `/saldo`, `/status`** untuk owner sendiri
- Email reminder (Resend)

**Success metric:** Lo sendiri pakai daily selama 2 minggu tanpa friction major, Telegram bot bisa kirim reminder commitment personal lo.

### v1 — Social Layer + Smart Collection
**Timeline:** Minggu 5–10
**Deliverable:**
- Contacts dengan invite link Telegram
- Shared commitments + obligations
- **Smart Collection Engine via Telegram:**
  - Auto-broadcast tagihan ke teman
  - Inline button (Sudah Transfer / Belum Bisa / Bukan Saya)
  - 2-tap confirmation flow
  - Transfer code unik per obligation
- Net position view
- Settlement flow
- Proof upload (Supabase Storage) — optional, kalau lo mau request bukti transfer

**Success metric:** 5–10 teman dari circle lo aktif pakai selama 1 bulan, generate >50 obligations, >70% settled.

### v1.5 — Smart Inputs
**Timeline:** Minggu 11–13
**Deliverable:**
- Bot command `/lapor` dengan natural language parsing via Claude API
- Email parser untuk mutasi bank (Resend Inbound) — auto-confirm settled status
- Multiple message templates per user
- Re-broadcast schedule untuk deferred obligation

**Success metric:** 50% transaction di-input via bot, 70% paid obligation auto-confirmed via email parser.

### v2 — Public Launch
**Timeline:** Minggu 14–20
**Deliverable:**
- Multi-user collaboration (invite registered)
- Weekly review AI
- Monthly snapshot
- Subscription marketplace
- Pricing & billing (Stripe/Xendit)
- WA Cloud API integration (paralel ke Telegram, user pilih channel)
- QRIS dinamis via Xendit/Midtrans untuk yang mau zero-touch settlement
- Polished onboarding
- Documentation & help center

**Success metric:** 100 signup di bulan pertama, 20% conversion ke active user, NPS >40.

---

## 11. Open Questions & Risks

### 11.1 Open Questions
- **Telegram penetration di circle lo**: berapa % teman lo udah pakai Telegram? Kalau <50%, friction onboarding bakal tinggi
- **Migration ke WA**: kapan invest ke WA Cloud API? Trigger di MAU >100 atau request user
- **QRIS dinamis di v2**: Xendit vs Midtrans vs Flip — fee comparison + dev experience
- **Currency handling**: support multi-currency dari awal atau IDR-only sampai v2?
- **Data residency**: Supabase region Singapore vs self-host Indonesia (Biznet/Idcloudhost) — trade-off latency vs compliance
- **Free tier abuse**: bisa diakali bikin akun baru tiap bulan? Perlu device fingerprint atau cukup email verification?

### 11.2 Risks
- **R1**: Better Auth masih relatively new — risk breaking changes. Mitigation: pin version, watch changelog mingguan.
- **R2**: BullMQ + Redis cost di Upstash bisa naik kalau scheduler banyak. Mitigation: monitor, switch ke self-host kalau lewat $20/bulan.
- **R3**: **Telegram adoption rendah di Indonesia non-techy circle** — teman lo mungkin males install Telegram. Mitigation: onboarding video tutorial, atau opsi fallback ke `wa.me` link manual sebagai stopgap.
- **R4**: **Bot dianggap spam kalau pesan terlalu formal** — Mitigation: template dengan tone casual + emoji, user customizable.
- **R5**: **Teman bisa salah tap "Sudah Transfer" padahal belum** — Mitigation: 2-tap confirmation flow (teman claim → lo verify), audit trail di `obligation_events`.
- **R6**: Finance data sensitif — breach = reputation hancur. Mitigation: encrypted at rest, no log sensitive data, audit log akses.
- **R7**: **Bot process crash = no reminders sent** — Mitigation: health check + auto-restart, deploy ke 2 region (active-passive).

---

## 12. Success Criteria (Overall)

Aliran dianggap **successful** jika:
1. Lo sendiri pakai daily >3 bulan tanpa beralih ke tool lain
2. Setidaknya 5 teman lo pakai untuk patungan subscription dan stay aktif >1 bulan
3. >70% obligation yang di-nudge berakhir paid dalam 7 hari
4. (v2) 100 signup organic dalam bulan pertama public launch
5. (v2) NPS >40 dan churn <10%/bulan setelah 3 bulan

---

**Akhir PRD.** Next step: bikin design system + wireframe key screens (dashboard, calendar, commitment detail, nudge flow).
