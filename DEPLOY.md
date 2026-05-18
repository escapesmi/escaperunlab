# 🚀 Echo Stride Club — Panduan Deploy Lengkap

## Overview
Panduan ini akan membantu kamu deploy Echo Stride Club ke production sehingga kamu dan teman-teman bisa langsung menggunakannya dari browser / HP.

Stack:
- **Frontend + Backend**: Next.js 14 → Vercel (gratis)
- **Database + Auth**: Supabase (gratis tier)
- **Login**: Google OAuth + Email OTP

---

## STEP 1 — Setup Supabase (Database & Auth)

### 1.1 Buat Akun & Project Supabase
1. Buka [supabase.com](https://supabase.com) → klik **Start your project**
2. Daftar dengan GitHub atau Google
3. Klik **New Project**
4. Isi:
   - **Name**: `echo-stride-club`
   - **Database Password**: buat password yang kuat (simpan!)
   - **Region**: pilih `Southeast Asia (Singapore)` — paling dekat ke Indonesia
5. Tunggu ~2 menit sampai project siap

### 1.2 Jalankan Database Schema
1. Di Supabase Dashboard → klik **SQL Editor** (ikon database di sidebar kiri)
2. Klik **New Query**
3. Copy seluruh isi file `supabase/migrations/001_initial_schema.sql`
4. Paste ke SQL Editor
5. Klik **Run** (Ctrl+Enter)
6. Pastikan muncul "Success" — database siap!

### 1.3 Setup Google OAuth
1. Buka [console.cloud.google.com](https://console.cloud.google.com)
2. Buat project baru atau pilih yang ada
3. Cari **"OAuth consent screen"** → setup:
   - User Type: **External**
   - App name: `Echo Stride Club`
   - Support email: email kamu
4. Cari **"Credentials"** → **Create Credentials** → **OAuth Client ID**
   - Application type: **Web application**
   - Name: `Echo Stride Club`
   - Authorized redirect URIs — tambahkan:
     ```
     https://YOUR_PROJECT_ID.supabase.co/auth/v1/callback
     ```
     (ganti YOUR_PROJECT_ID dengan ID Supabase kamu)
5. Copy **Client ID** dan **Client Secret**

6. Kembali ke Supabase → **Authentication** → **Providers** → **Google**
7. Toggle Enable → masukkan Client ID & Client Secret → **Save**

### 1.4 Ambil API Keys
Di Supabase → **Settings** → **API**:
- Copy **Project URL** → ini `NEXT_PUBLIC_SUPABASE_URL`
- Copy **anon/public key** → ini `NEXT_PUBLIC_SUPABASE_ANON_KEY`

---

## STEP 2 — Setup Project Lokal

```bash
# Clone atau extract project
cd echo-stride-club

# Install dependencies
npm install

# Buat file environment
cp .env.example .env.local
```

Edit `.env.local`:
```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

```bash
# Jalankan development server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000) — app sudah berjalan! 🎉

---

## STEP 3 — Push ke GitHub

```bash
# Inisialisasi git (jika belum)
git init
git add .
git commit -m "feat: initial Echo Stride Club"

# Buat repo di github.com lalu:
git remote add origin https://github.com/USERNAME/echo-stride-club.git
git branch -M main
git push -u origin main
```

> ⚠️ Pastikan `.env.local` TIDAK ikut di-push. Cek `.gitignore` sudah ada.

---

## STEP 4 — Deploy ke Vercel

### 4.1 Connect ke Vercel
1. Buka [vercel.com](https://vercel.com) → Sign up dengan GitHub
2. Klik **Add New → Project**
3. Import repo `echo-stride-club` dari GitHub
4. Framework: otomatis terdeteksi sebagai **Next.js**

### 4.2 Set Environment Variables di Vercel
Di halaman deploy Vercel, buka **Environment Variables** → tambahkan:

| Key | Value |
|-----|-------|
| `NEXT_PUBLIC_SUPABASE_URL` | `https://xxxxx.supabase.co` |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | `eyJhbGc...` |
| `NEXT_PUBLIC_APP_URL` | `https://echo-stride-club.vercel.app` |

### 4.3 Deploy!
Klik **Deploy** → tunggu ~2-3 menit.

Kamu akan mendapat URL seperti: `https://echo-stride-club.vercel.app` 🚀

---

## STEP 5 — Update Callback URL di Google & Supabase

Setelah dapat URL Vercel:

### Di Google Cloud Console:
Credentials → Edit OAuth Client → tambahkan Authorized redirect URI:
```
https://echo-stride-club.vercel.app/auth/callback
```

### Di Supabase:
**Authentication** → **URL Configuration**:
- **Site URL**: `https://echo-stride-club.vercel.app`
- **Redirect URLs**: tambahkan `https://echo-stride-club.vercel.app/auth/callback`

---

## STEP 6 — Selesai! Share ke Teman

URL kamu sudah bisa diakses siapa saja:
```
https://echo-stride-club.vercel.app
```

Setiap user yang daftar akan otomatis mendapat profil dan program latihan sendiri.
Data masing-masing user terpisah (Row Level Security).

---

## Troubleshooting

### Login Google tidak muncul
→ Cek Authorized redirect URI di Google Console sudah benar

### Database error saat onboarding
→ Pastikan SQL migration sudah dijalankan di Supabase

### Workout tidak generate
→ Cek console browser untuk error Supabase

### Deploy gagal di Vercel
→ Pastikan semua env vars sudah diset di Vercel dashboard

---

## Auto-Deploy (Bonus)

Setelah connected ke Vercel, setiap kali kamu:
```bash
git push origin main
```
Vercel otomatis re-deploy! Tidak perlu manual deploy lagi.

---

## Struktur File Lengkap

```
echo-stride-club/
├── src/
│   ├── app/
│   │   ├── (app)/                    # Protected routes (perlu login)
│   │   │   ├── layout.tsx            # App shell dengan TopBar + BottomNav
│   │   │   ├── dashboard/            # Halaman utama
│   │   │   ├── training/             # Program latihan + workout detail
│   │   │   ├── shoes/                # Shoe tracker
│   │   │   └── profile/              # Profil user + sign out
│   │   ├── auth/
│   │   │   ├── login/page.tsx        # Login dengan Google / Email OTP
│   │   │   └── callback/route.ts     # OAuth callback handler
│   │   ├── onboarding/page.tsx       # Setup profil + generate plan
│   │   ├── layout.tsx                # Root layout dengan fonts
│   │   ├── globals.css               # Global styles + Tailwind
│   │   └── page.tsx                  # Landing page
│   ├── components/
│   │   ├── layout/
│   │   │   ├── TopBar.tsx            # Header dengan logo + avatar
│   │   │   └── BottomNav.tsx         # Bottom navigation
│   │   └── ui/index.tsx              # Shared components (RadialProgress, dll)
│   ├── lib/
│   │   ├── supabase/
│   │   │   ├── client.ts             # Browser Supabase client
│   │   │   └── server.ts             # Server Supabase client
│   │   └── training-engine.ts        # Adaptive training logic
│   ├── middleware.ts                  # Auth + redirect middleware
│   └── types/index.ts                # TypeScript types
├── supabase/
│   └── migrations/
│       └── 001_initial_schema.sql    # Database schema + RLS
├── .env.example                      # Template env vars
├── .gitignore
├── next.config.js
├── tailwind.config.ts
└── package.json
```

---

*Echo Stride Club — Built for Indonesian Runners 🇮🇩*
