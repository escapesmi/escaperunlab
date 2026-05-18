# 🏃 Echo Stride Club

**Adaptive Running Coach** untuk beginner dan intermediate runner Indonesia.

> Build consistency safely with training plans that adapt to your fitness — powered by data-driven coaching.

---

## ✨ Features

| Feature | Keterangan |
|---|---|
| 🔐 Google OAuth + Email OTP | Login mudah, tanpa password |
| 📋 Adaptive Training Plan | 30 hari / 8 minggu / 12 minggu |
| 🧠 AI Training Engine | Deload otomatis, fatigue adjustment |
| 📊 Dashboard Real-time | Streak, mileage, completion rate |
| 💪 Workout Logging | Catat jarak, pace, HR, fatigue |
| 👟 Shoe Tracker | Monitor mileage + warning ganti sepatu |
| 📱 Mobile Responsive | Optimized untuk HP |
| 🌙 Dark Mode First | Desain modern dan sporty |

---

## 🛠 Tech Stack

- **Frontend**: Next.js 14 (App Router) + TailwindCSS
- **Database + Auth**: Supabase (PostgreSQL)
- **Deploy**: Vercel
- **Language**: TypeScript

---

## 🚀 Quick Start

```bash
# Install
npm install

# Setup environment
cp .env.example .env.local
# → isi NEXT_PUBLIC_SUPABASE_URL dan NEXT_PUBLIC_SUPABASE_ANON_KEY

# Run database migration
# → copy supabase/migrations/001_initial_schema.sql ke Supabase SQL Editor → Run

# Dev server
npm run dev
```

Buka [http://localhost:3000](http://localhost:3000)

---

## 📦 Deploy

Lihat panduan lengkap di **[DEPLOY.md](./DEPLOY.md)**

Singkatnya:
1. Supabase: buat project → jalankan SQL migration → enable Google OAuth
2. GitHub: push code
3. Vercel: import repo → set env vars → deploy → dapat URL publik!

---

## 📁 Structure

```
src/
├── app/
│   ├── (app)/          # Protected pages (dashboard, training, shoes, profile)
│   ├── auth/           # Login + OAuth callback
│   ├── onboarding/     # Setup profil + generate plan
│   └── page.tsx        # Landing page
├── components/
│   ├── layout/         # TopBar, BottomNav
│   └── ui/             # Shared components
├── lib/
│   ├── supabase/       # Client + server Supabase instances
│   ├── training-engine.ts  # Adaptive plan generator
│   └── utils.ts        # Helper functions
├── hooks/              # useUser, dll
├── middleware.ts        # Auth + redirect logic
└── types/              # TypeScript interfaces
```

---

## 🗄 Database

5 tabel utama dengan Row Level Security (RLS):

- `users` — profil + preferensi runner
- `training_plans` — program latihan aktif
- `workouts` — jadwal workout per hari
- `workout_logs` — hasil log setiap workout
- `shoes` — tracking mileage sepatu

---

## 🤝 Kontribusi

Dibuat untuk komunitas runner Indonesia. Feel free to fork dan kembangkan!

---

*Echo Stride Club © 2025 — Made with ❤️ for Indonesian Runners 🇮🇩*
