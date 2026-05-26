# Stage 1.5 — Smart Inputs

**Timeline:** Minggu 11–13  
**Goal:** Reduce friction input transaksi dan konfirmasi pembayaran lewat AI parsing dan email integration.

**Success Metric:**
- 50% transaksi di-input via bot (natural language)
- 70% paid obligation auto-confirmed via email parser

---

## Deliverables

- [ ] Bot command `/lapor` dengan natural language parsing via Claude API
- [ ] Email parser untuk mutasi bank — auto-confirm settled status
- [ ] Multiple message templates per user
- [ ] Re-broadcast schedule untuk deferred obligation

---

## Features

### F1.5.1 — Natural Language Transaction Input (`/lapor`)

User ketik ke bot dalam bahasa natural:
```
/lapor makan padang 35rb pake gopay
```

Bot parse via Claude API → respond:
```
✅ Tercatat
Expense: Rp 35.000
Kategori: Makan Luar (auto-detected)
Akun: GoPay
Tanggal: hari ini

[Edit] [Batal]
```

**Implementation:**
- Bot forward teks ke Claude API (claude-sonnet-4-5)
- Prompt extract: `{ type, amount, account, category, date, note }`
- Kalau ambiguous (akun gak jelas) → bot tanya balik
- Result create `flows` entry via server action
- Parsed intent disimpan di `bot_messages.parsedIntent` untuk audit

**Acceptance criteria:**
- Works untuk expense, income, transfer
- Handle variasi penulisan: "35rb", "35.000", "35k", "tiga puluh lima ribu"
- Kalau parsing gagal → fallback ke form manual
- Tombol [Edit] buka link ke form dengan data pre-filled
- Tombol [Batal] tidak simpan apapun

---

### F1.5.2 — Email Parser (Auto-Confirm Settlement)

**Problem:** Lo harus konfirmasi manual setiap teman klaim sudah transfer. Solusi: match email notifikasi bank dengan obligation.

**Flow:**
1. Lo set forwarding rule di Gmail: email dari `notifikasi@bca.co.id` → forward ke `parser@aliran.app`
2. Aliran parse email mutasi (via Resend Inbound atau Cloudflare Email Workers):
   - Extract: amount, sender name, transfer note/kode
   - Match ke obligation by amount + transfer code dalam note
3. Kalau match: auto-update status → `settled`, zero-tap dari lo
4. Bot kirim notif ke teman: "✅ Transfer Rp 46.500 udah diterima!"

**Implementation:**
- Resend Inbound webhook → `POST /api/webhooks/email-inbound`
- BullMQ job `email-parser` parse email, regex extract fields
- Match logic: exact amount + transfer code (ALIR-NTFLX-NOV-A3F2) di note
- Dedup via `raw_email_hash`
- Unmatched email → status `manual_review`, lo dapat notif di app

**Acceptance criteria:**
- Opt-in per user (gak wajib setup)
- Support bank awal: BCA (email `notifikasi@bca.co.id`)
- False positive rate < 1%: hanya auto-settle kalau amount DAN kode transfer match
- Audit trail: `parsed_transfers` table dengan status `matched | unmatched | manual_review`

---

### F1.5.3 — Custom Message Templates

User dapat:
- Edit template pesan tagihan (default template bisa di-override)
- Preview template sebelum disimpan
- Reset ke template default

**Variables tersedia dalam template:**
```
{{ownerName}}     → nama lo
{{contactName}}   → nama teman
{{commitmentName}} → nama subscription
{{period}}        → bulan/periode (e.g. "November 2026")
{{amount}}        → nominal tagihan
{{dueDate}}       → tanggal jatuh tempo
{{accountName}}   → nama rekening lo
{{accountNumber}} → nomor rekening lo
{{transferCode}}  → kode unik transfer
```

**Acceptance criteria:**
- Form edit di settings, bukan hardcoded
- Template disimpan di `users` table (jsonb field atau separate table)
- Preview rendered dengan data sample

---

### F1.5.4 — Re-Broadcast for Deferred Obligations

Saat obligation di-defer (teman pilih "Belum Bisa" + pilih tanggal), sistem:
1. Set `obligations.dueAt` ke tanggal baru
2. Queue BullMQ job `deferred-rebroadcast` untuk tanggal tersebut
3. Pada tanggal yang ditentukan, broadcast ulang dengan pesan baru:
   ```
   📌 Reminder Tagihan dari Chalik
   
   Kamu janji bayar hari ini untuk Netflix Nov 2026.
   Total: Rp 46.500
   
   [✅ Sudah Transfer] [⏰ Belum Bisa]
   ```

**Acceptance criteria:**
- Max 3x defer per obligation (setelah itu → disputed otomatis, notif ke lo)
- Defer count tercatat di `obligation_events`

---

## Data Model (Stage 1.5 additions)

New tables:
- `email_parse_rules` — forwarding config per user (bank name, forward address)
- `parsed_transfers` — hasil parse email (amount, sender, note, matched obligation, status)

Fields baru:
- `bot_messages.parsedIntent` — jsonb hasil parsing `/lapor`
- `users` — jsonb field untuk custom template (atau table `message_templates`)
- `obligations.deferCount` — integer, counter berapa kali di-defer

---

## Tech Stack Additions (Stage 1.5)

| Layer | Tech |
|-------|------|
| AI | Claude API (claude-sonnet-4-5) — natural language parsing |
| Email Inbound | Resend Inbound atau Cloudflare Email Workers |

**New worker jobs:**
- `email-parser` — triggered via webhook, parse + match mutasi email
- `deferred-rebroadcast` — scheduled job untuk re-send tagihan setelah defer

**API cost management:**
- Claude API hanya dipanggil saat ada `/lapor` command
- Estimate: ~200 tokens per parse, $0.0006/request → sangat low cost
- Fallback ke form manual kalau Claude API timeout

---

## New Folder Structure (Stage 1.5)

```
app/api/webhooks/
  email-inbound/route.ts        # Resend Inbound webhook handler
bot/handlers/
  ai-parser.ts                  # /lapor → Claude API intent extraction
worker/jobs/
  email-parser.ts               # Parse mutasi bank email
  deferred-rebroadcast.ts       # Re-send deferred obligation
app/(app)/settings/
  templates/page.tsx            # Edit message templates
```

---

## Risks (Stage 1.5 relevant)

- **Claude API latency** — parsing bisa lambat kalau cold start. Mitigation: stream response, timeout 5s → fallback ke form.
- **Email parser false positive** — auto-settle salah obligation. Mitigation: require BOTH amount AND transfer code match.
- **Bank email format changes** — regex bisa break kalau bank update template email. Mitigation: fallback ke manual review, monitor `unmatched` rate.
