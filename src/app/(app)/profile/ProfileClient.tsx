// src/app/(app)/profile/ProfileClient.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import type { UserProfile, TrainingPlan } from "@/types";

interface Props {
  profile: UserProfile | null;
  plan: TrainingPlan | null;
  stats: { totalWorkouts: number; totalKm: number };
  userEmail: string;
}

const EXPERIENCE_LABELS = {
  beginner: "Beginner Runner 🌱",
  intermediate: "Intermediate Runner 💪",
  advanced: "Advanced Runner 🏆",
};

const GOAL_LABELS: Record<string, string> = {
  "5k": "5K Pertama 🏁", "10k": "10K Race 🎽",
  aerobic: "Aerobic Base 💚", consistency: "Konsistensi 📅",
  hm: "Half Marathon 🏅", weight: "Turun Berat ⚡",
};

const PLAN_LABELS: Record<string, string> = {
  "30day": "30 Hari", "8week": "8 Minggu", "12week": "12 Minggu",
};

export default function ProfileClient({ profile, plan, stats, userEmail }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [signingOut, setSigningOut] = useState(false);

  const signOut = async () => {
    setSigningOut(true);
    await supabase.auth.signOut();
    router.push("/");
  };

  const name = profile?.name ?? userEmail.split("@")[0];
  const initials = name[0]?.toUpperCase() ?? "R";

  return (
    <div className="px-5 py-4 flex flex-col gap-5">

      {/* Profile Card */}
      <div className="card text-center animate-fade-up">
        <div className="mx-auto mb-4 w-20 h-20 rounded-full overflow-hidden bg-gradient-to-br from-accent to-info flex items-center justify-center ring-4 ring-border">
          {profile?.avatar_url ? (
            <Image src={profile.avatar_url} alt={name} width={80} height={80} className="object-cover" />
          ) : (
            <span className="font-bold text-3xl text-black">{initials}</span>
          )}
        </div>
        <h2 className="font-bold text-xl">{name}</h2>
        <p className="text-text-secondary text-sm mt-1">{userEmail}</p>
        <div className="flex justify-center gap-2 mt-3 flex-wrap">
          <span className="chip" style={{ cursor: "default" }}>
            {EXPERIENCE_LABELS[profile?.experience_level ?? "beginner"]}
          </span>
          {profile?.current_pace && (
            <span className="chip" style={{ cursor: "default" }}>
              {profile.current_pace} min/km
            </span>
          )}
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-3 gap-3 animate-fade-up-1">
        {[
          ["Total Runs", stats.totalWorkouts, ""],
          ["Total KM", stats.totalKm.toFixed(1), ""],
          ["Pace", profile?.current_pace ?? "—", ""],
        ].map(([l, v, u]) => (
          <div key={l as string} className="metric-card text-center">
            <div className="font-mono font-bold text-xl text-accent">{v}{u}</div>
            <div className="text-[11px] text-text-muted font-semibold uppercase tracking-wide mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* Active Plan */}
      {plan && (
        <div className="card animate-fade-up-2">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Program Aktif</h3>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center text-2xl"
              style={{ background: "rgba(0,229,160,0.1)" }}>🎯</div>
            <div>
              <div className="font-bold">{GOAL_LABELS[plan.goal] ?? plan.goal}</div>
              <div className="text-text-secondary text-sm">{PLAN_LABELS[plan.plan_type]} · Mulai {plan.start_date}</div>
            </div>
          </div>
          <div className="mt-4 flex gap-2">
            <span className="chip active" style={{ cursor: "default" }}>✅ Aktif</span>
            <span className="chip" style={{ cursor: "default" }}>{plan.duration_weeks} minggu</span>
          </div>
        </div>
      )}

      {/* Physical Profile */}
      <div className="card animate-fade-up-3">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-4">Data Fisik</h3>
        <div className="flex flex-col gap-3">
          {[
            ["Usia", profile?.age ? `${profile.age} tahun` : "—"],
            ["Tinggi", profile?.height ? `${profile.height} cm` : "—"],
            ["Berat", profile?.weight ? `${profile.weight} kg` : "—"],
            ["Pronasi", profile?.pronation ?? "—"],
            ["Cedera", profile?.injury_history === "none" ? "Tidak ada" : (profile?.injury_history ?? "—")],
            ["Tujuan", GOAL_LABELS[profile?.goal ?? ""] ?? "—"],
          ].map(([l, v]) => (
            <div key={l} className="flex justify-between items-center">
              <span className="text-text-muted text-sm">{l}</span>
              <span className="font-semibold text-sm">{v}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Integrations (future) */}
      <div className="card animate-fade-up-4 opacity-60">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">Integrasi (Segera)</h3>
        <div className="flex flex-col gap-2">
          {["🏃 Garmin Connect", "📊 Strava", "🍎 Apple Health", "⌚ Coros"].map((item) => (
            <div key={item} className="flex items-center justify-between py-2">
              <span className="text-sm text-text-secondary">{item}</span>
              <span className="text-[11px] font-bold text-text-muted bg-surface-alt px-2 py-0.5 rounded-full">Segera</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sign Out */}
      <button
        onClick={signOut}
        disabled={signingOut}
        className="w-full py-4 rounded-xl border border-danger/30 text-danger font-bold text-sm
                   hover:bg-danger/10 transition-all disabled:opacity-50 animate-fade-up-5"
      >
        {signingOut ? "Keluar..." : "Keluar dari Akun"}
      </button>

      <p className="text-center text-text-muted text-xs pb-2">
        Echo Stride Club v0.1.0 · Made with ❤️ for Indonesian Runners
      </p>
    </div>
  );
}
