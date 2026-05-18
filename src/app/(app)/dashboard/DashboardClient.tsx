// src/app/(app)/dashboard/DashboardClient.tsx
"use client";
import Link from "next/link";
import { RadialProgress, MiniBarChart, StatCard, AIInsightCard, WorkoutTag, WORKOUT_META } from "@/components/ui";
import type { UserProfile, Workout } from "@/types";

interface Props {
  profile: UserProfile | null;
  upcomingWorkouts: Workout[];
  weeklyChart: { date: string; mileage: number; completed: boolean }[];
  stats: { weeklyMileage: number; totalWorkouts: number; streak: number; avgFatigue: number };
  aiTip: string;
}

export default function DashboardClient({ profile, upcomingWorkouts, weeklyChart, stats, aiTip }: Props) {
  const name = profile?.name?.split(" ")[0] ?? "Runner";
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Selamat pagi" : hour < 17 ? "Selamat siang" : "Selamat malam";
  const todayWorkout = upcomingWorkouts[0];
  const completionRate = stats.totalWorkouts > 0
    ? Math.min(Math.round((stats.totalWorkouts / Math.max(stats.totalWorkouts, 10)) * 100), 100)
    : 0;

  return (
    <div className="px-5 py-4 flex flex-col gap-5">

      {/* Greeting */}
      <div className="animate-fade-up">
        <p className="text-text-secondary text-sm font-medium">{greeting}, 👋</p>
        <h1 className="text-2xl font-bold">{name}!</h1>
      </div>

      {/* Streak + Completion */}
      <div className="grid grid-cols-2 gap-3 animate-fade-up-1">
        <div className="metric-card flex items-center gap-3">
          <div className="text-3xl">🔥</div>
          <div>
            <div className="font-display text-3xl text-warning leading-none">{stats.streak}</div>
            <div className="text-[11px] text-text-muted font-semibold uppercase tracking-wide mt-0.5">Day Streak</div>
          </div>
        </div>
        <div className="metric-card flex items-center gap-3">
          <RadialProgress value={completionRate} max={100} size={52} stroke={5} color="#00E5A0">
            <span className="text-[11px] font-bold text-accent">{completionRate}%</span>
          </RadialProgress>
          <div>
            <div className="font-bold text-base leading-none">{completionRate}%</div>
            <div className="text-[11px] text-text-muted font-semibold uppercase tracking-wide mt-0.5">Completion</div>
          </div>
        </div>
      </div>

      {/* Weekly Mileage Chart */}
      <div className="card animate-fade-up-2">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="font-bold text-base">Minggu Ini</h3>
            <p className="text-text-secondary text-xs mt-0.5">Total jarak tempuh</p>
          </div>
          <div className="text-right">
            <div className="font-display text-3xl text-accent leading-none">
              {stats.weeklyMileage.toFixed(1)}
            </div>
            <div className="text-[11px] text-text-muted font-semibold uppercase">km total</div>
          </div>
        </div>
        <MiniBarChart data={weeklyChart} />
      </div>

      {/* Today's Workout */}
      {todayWorkout && (
        <div className="animate-fade-up-3">
          <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">
            Workout Berikutnya
          </h3>
          <Link href={`/training/workout/${todayWorkout.id}`}>
            <div className="rounded-2xl p-5 cursor-pointer transition-all duration-200 hover:scale-[1.01]"
              style={{
                background: `linear-gradient(135deg, ${WORKOUT_META[todayWorkout.type]?.bg ?? "rgba(0,229,160,0.08)"} 0%, rgba(0,0,0,0) 100%)`,
                border: `1px solid ${WORKOUT_META[todayWorkout.type]?.color ?? "#00E5A0"}30`,
              }}>
              <div className="flex items-center justify-between mb-4">
                <WorkoutTag type={todayWorkout.type} />
                <div className="flex items-center gap-1 text-text-muted">
                  <span className="text-xs">{todayWorkout.scheduled_date}</span>
                  <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
                  </svg>
                </div>
              </div>
              <div className="grid grid-cols-3 gap-3">
                {[
                  ["Jarak", `${todayWorkout.distance ?? "—"} km`],
                  ["Durasi", `${todayWorkout.duration ?? "—"} min`],
                  ["Target Pace", todayWorkout.target_pace ?? "—"],
                ].map(([l, v]) => (
                  <div key={l}>
                    <div className="text-[10px] text-text-muted font-semibold uppercase tracking-wide">{l}</div>
                    <div className="font-mono font-bold text-base text-text-primary mt-0.5">{v}</div>
                  </div>
                ))}
              </div>
            </div>
          </Link>
        </div>
      )}

      {/* Metrics Grid */}
      <div className="animate-fade-up-4">
        <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest mb-3">
          Fitness Metrics
        </h3>
        <div className="grid grid-cols-2 gap-3">
          <StatCard icon="⚡" label="Fatigue Score" value={stats.avgFatigue}
            color={stats.avgFatigue > 70 ? "#FF4D6A" : stats.avgFatigue > 50 ? "#FFB347" : "#00E5A0"}
            progress={stats.avgFatigue} />
          <StatCard icon="📊" label="Total Workouts" value={stats.totalWorkouts} color="#4D9EFF" />
          <StatCard icon="🏃" label="Weekly KM" value={stats.weeklyMileage.toFixed(1)} unit="km" color="#A855F7" />
          <StatCard icon="🎯" label="Active Plan" value={profile?.goal?.toUpperCase() ?? "—"} color="#00E5A0" />
        </div>
      </div>

      {/* Upcoming */}
      {upcomingWorkouts.length > 1 && (
        <div className="animate-fade-up-5">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold text-text-secondary uppercase tracking-widest">Jadwal Mendatang</h3>
            <Link href="/training" className="text-xs text-accent font-semibold hover:underline">Lihat semua</Link>
          </div>
          <div className="flex flex-col gap-2">
            {upcomingWorkouts.slice(1, 4).map((w) => {
              const m = WORKOUT_META[w.type];
              return (
                <Link key={w.id} href={`/training/workout/${w.id}`}>
                  <div className="workout-row">
                    <div className="w-10 h-10 rounded-xl flex items-center justify-center text-lg flex-shrink-0"
                      style={{ background: m?.bg }}>
                      {m?.icon}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="font-semibold text-sm">{m?.label}</div>
                      <div className="text-xs text-text-secondary">{w.distance} km · {w.duration} min</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="font-mono text-sm font-bold" style={{ color: m?.color }}>{w.target_pace}</div>
                      <div className="text-[10px] text-text-muted">{w.scheduled_date}</div>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      )}

      {/* AI Insight */}
      <div className="animate-fade-up-5">
        <AIInsightCard message={aiTip} />
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 gap-3 pb-2">
        <Link href="/training" className="card text-center hover:border-accent transition-colors cursor-pointer">
          <div className="text-2xl mb-2">📋</div>
          <div className="font-semibold text-sm">Lihat Program</div>
          <div className="text-xs text-text-muted mt-0.5">Training plan lengkap</div>
        </Link>
        <Link href="/shoes" className="card text-center hover:border-accent transition-colors cursor-pointer">
          <div className="text-2xl mb-2">👟</div>
          <div className="font-semibold text-sm">Shoe Tracker</div>
          <div className="text-xs text-text-muted mt-0.5">Pantau mileage sepatu</div>
        </Link>
      </div>
    </div>
  );
}
