# Stage 1 — Social Layer + Smart Collection

**Timeline:** Minggu 5–10  
**Goal:** Lo + circle kecil bisa share subscription dan split bill. Test sama 5–10 teman.

**Success Metric:** 5–10 teman dari circle lo aktif pakai selama 1 bulan, generate >50 obligations, >70% settled.

---

## Deliverables

- [ ] Contacts dengan invite link Telegram (tanpa perlu daftar akun)
- [ ] Shared commitments + obligations per stakeholder
- [ ] Smart Collection Engine via Telegram Bot
  - Auto-broadcast tagihan ke teman
  - Inline button: Sudah Transfer / Belum Bisa / Bukan Saya
  - 2-tap confirmation flow (teman claim → lo verify)
  - Transfer code unik per obligation
- [ ] Net position view
- [ ] Settlement flow
- [ ] Proof upload opsional (Supabase Storage)

---

## Features

### F1.1 — Contacts (No Auth Required)

User dapat:
- Tambah contact (teman) hanya dengan nama + WA number
- Contact gak perlu daftar akun Aliran
- Edit, archive contact
- Generate Telegram invite link per contact: `t.me/AliranBot?start=invite_xxx`

**Acceptance criteria:**
- Validasi format WA number Indonesia: 08xx → auto-convert ke 628xx
- Contact unique by WA number per user
- Saat teman `/start invite_xxx` di bot → contact otomatis terlink ke Telegram ID mereka

---

### F1.2 — Shared Commitment (Subscription Patungan)

User dapat:
- Convert personal commitment jadi shared, atau bikin baru langsung sebagai shared
- Add stakeholders (contacts) ke commitment
- Set share allocation:
  - Equal split
  - Custom percentage
  - Fixed amount
- Set siapa yang bayar dulu (payer rotation: lo selalu, atau rotasi per cycle)

**Acceptance criteria:**
- Saat renewal: auto-generate obligations per stakeholder
- Total obligations = total amount (validasi server-side)
- History payer per cycle tercatat

---

### F1.3 — Obligation Lifecycle

Per obligation:
- Status flow: `pending → notified → paid → settled`
- Actions: send Telegram/WA reminder, mark as paid, dispute, defer
- Audit log per state change di `obligation_events`

**Acceptance criteria:**
- Mark paid: manual (lo confirm dapet transfer) ATAU via proof upload (teman upload screenshot, lo approve)
- Defer: geser deadline tanpa hapus obligation, schedule re-broadcast

---

### F1.4 — Smart Collection Engine (Telegram Bot)

**Concept:** Bot Telegram jadi "collection agent" otomatis. Teman `/start` sekali, link ke nomor mereka, dan semua tagihan flow lewat bot.

**Pre-condition:**
- Teman harus `/start` bot Aliran sekali (one-time setup)
- Lo share invite link unik: `t.me/AliranBot?start=invite_xxx`

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

1. **Sudah Transfer** → status `notified → paid`, kirim notif ke lo:
   ```
   💰 Anto bilang udah transfer Rp 46.500
   Untuk: Netflix Nov 2026
   Kode: ALIR-NTFLX-NOV-A3F2
   
   [✅ Konfirmasi Terima] [❌ Belum Masuk] [⚠️ Salah Nominal]
   ```

2. **Belum Bisa** → status `deferred`, bot tanya kapan bisa bayar:
   ```
   Oke, kapan kira-kira bisa transfer?
   [Besok] [3 hari lagi] [Minggu depan] [Custom]
   ```
   → set new dueAt, schedule re-broadcast

3. **Bukan Saya** → status `disputed`, notif ke lo:
   ```
   ⚠️ Anto bilang tagihan ini bukan dia.
   Mau review stakeholder commitment ini?
   ```

**Lo konfirmasi via bot:**
- `✅ Konfirmasi Terima` → status `settled`, create income flow di akun lo, balance auto-update
- `❌ Belum Masuk` → status balik ke `notified`, bot gentle escalation ke teman

**Idle handling:** Kalau 24 jam gak ada response → auto re-send reminder.

---

### F1.4.1 — Bot Commands (Owner)

| Command | Action |
|---------|--------|
| `/tagih [contact]` | Manual trigger broadcast ke contact tertentu |
| `/tagih_semua` | Broadcast semua obligation yang due ≤ 7 hari |
| `/status` | List obligation pending dengan status |
| `/lapor` | Quick add transaction (natural language — lihat v1.5) |

---

### F1.5 — Net Position View

User dapat:
- Lihat per contact: total receivable, total payable, net balance
- Contoh: "Si A: net +Rp 145.000 ke lo (Netflix Nov + Spotify Oct)"
- Settle button: mark all current obligations as settled in one go

**Acceptance criteria:**
- Sort by net amount descending
- Drill-down: tap contact → list obligation history
- Settle action create settlement transaction (audit trail)

---

### F1.6 — Invite Flow (Contact Linking)

1. Lo add contact (nama + WA number) di app
2. Sistem auto-generate unique `inviteCode` per contact
3. Lo share `t.me/AliranBot?start=invite_xxx` ke teman via WA/chat manual
4. Teman tap link → buka Telegram → `/start` → bot detect inviteCode → link ke Telegram ID mereka
5. Status di app: "Belum tersambung" → "✅ Tersambung via @username"

**Bot welcome message:**
```
Hai! Saya bot Aliran 🌊

Chalik invite kamu untuk receive notification 
patungan subscription kalian.

Kalau ada tagihan baru, saya bakal kirim ke chat ini.
Kamu tinggal tap tombol "Sudah Transfer" kalau udah bayar.

✅ Akun kamu sudah ter-link
```

---

## New Data Model (Stage 1 additions)

Tables baru:
- `contacts` — teman lo (nama, WA, telegramId, inviteCode, linkedAt)
- `commitment_shares` — stakeholder allocation per commitment
- `bot_messages` — log semua message keluar/masuk bot
- `obligation_events` — audit trail tiap state change obligation

Schema additions to existing tables:
- `commitments.isShared`, `commitments.splitMethod`, `commitments.reminderDays`
- `obligations.fromContactId`, `obligations.proofUrl`

---

## Tech Stack Additions (Stage 1)

| Layer | Tech |
|-------|------|
| File Storage | Supabase Storage — proof transfer screenshot |
| Bot | grammY + inline keyboards + callback handlers |
| Queue | BullMQ `notification-dispatcher` job |

**New worker jobs:**
- `notification-dispatcher` — tiap obligation H-3/H-1/H, publish ke Redis → bot kirim
- `renewal-scheduler` update — generate obligations per stakeholder (bukan hanya owner)

**Bot ↔ Worker communication:**
- Worker → Bot: Redis pub/sub, publish `obligation.notify`
- Bot → Worker: bot write langsung ke DB (status update), worker pick up via cron

---

## New Folder Structure (Stage 1)

```
app/(app)/contacts/           # Contact management
app/(app)/commitments/        # Shared commitment detail
bot/handlers/
  callbacks.ts                # Inline button handlers: paid/deferred/disputed
  invite.ts                   # Invite linking flow
bot/lib/
  keyboards.ts                # Inline keyboard builders
  send.ts                     # Message sender with template
worker/jobs/
  notification-dispatcher.ts  # Obligation broadcast scheduler
```

---

## Risks (Stage 1 relevant)

- **R3** — Telegram adoption rendah di circle non-techy. Mitigation: tutorial video, fallback ke `wa.me` link manual.
- **R4** — Bot dianggap spam kalau terlalu formal. Mitigation: tone casual + emoji, template customizable.
- **R5** — Teman salah tap "Sudah Transfer" padahal belum. Mitigation: 2-tap confirmation (teman claim → lo verify).
- **R7** — Bot process crash = no reminders sent. Mitigation: health check + auto-restart di Railway.
