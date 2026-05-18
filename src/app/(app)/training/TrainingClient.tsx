// src/app/(app)/training/TrainingClient.tsx
"use client";
import { useState } from "react";
import Link from "next/link";
import { WorkoutTag, WORKOUT_META, EmptyState } from "@/components/ui";
import type { Workout, TrainingPlan } from "@/types";

interface Props {
  plan: TrainingPlan | null;
  workoutsByWeek: Record<number, Workout[]>;
  totalWeeks: number;
}

export default function TrainingClient({ plan, workoutsByWeek, totalWeeks }: Props) {
  const [selectedWeek, setSelectedWeek] = useState(1);

  if (!plan) {
    return (
      <div className="px-5 py-4">
        <EmptyState icon="📋" title="Belum ada program" subtitle="Selesaikan onboarding untuk mendapatkan program latihan adaptif kamu." />
      </div>
    );
  }

  const weekWorkouts = workoutsByWeek[selectedWeek] ?? [];
  const activeWorkouts = weekWorkouts.filter((w) => w.type !== "rest");
  const totalWeekKm = activeWorkouts.reduce((s, w) => s + (w.distance ?? 0), 0);
  const isDeload = weekWorkouts.some((w) => w.is_deload);

  const goalLabels: Record<string, string> = {
    "5k": "5K Pertama 🏁", "10k": "10K Race 🎽",
    "aerobic": "Aerobic Base 💚", "consistency": "Konsistensi 📅",
    "hm": "Half Marathon 🏅", "weight": "Turun Berat ⚡",
  };

  return (
    <div className="px-5 py-4 flex flex-col gap-5">
      {/* Header */}
      <div className="animate-fade-up">
        <h1 className="text-2xl font-bold">Training Plan</h1>
        <p className="text-text-secondary text-sm mt-0.5">
          {totalWeeks} minggu · {goalLabels[plan.goal] ?? plan.goal}
        </p>
      </div>

      {/* Week Selector */}
      <div className="flex gap-2 overflow-x-auto pb-1 animate-fade-up-1 scrollbar-none">
        {Array.from({ length: totalWeeks }, (_, i) => i + 1).map((w) => {
          const wWorkouts = workoutsByWeek[w] ?? [];
          const hasDeload = wWorkouts.some((x) => x.is_deload);
          const isActive = selectedWeek === w;
          return (
            <button key={w} onClick={() => setSelectedWeek(w)}
              className="flex-shrink-0 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 border"
              style={{
                background: isActive ? "rgba(0,229,160,0.1)" : "#111318",
                borderColor: isActive ? "#00E5A0" : "#1E2330",
                color: isActive ? "#00E5A0" : "#4A5568",
              }}>
              W{w}{hasDeload ? " 💤" : ""}
            </button>
          );
        })}
      </div>

      {/* Week Summary */}
      <div className="card animate-fade-up-2">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-bold text-lg">Week {selectedWeek}</h2>
            <p className="text-text-secondary text-sm">{activeWorkouts.length} workouts</p>
            {isDeload && (
              <span className="inline-flex items-center gap-1 mt-2 px-2.5 py-1 rounded-full text-[11px] font-bold"
                style={{ background: "rgba(107,114,128,0.15)", color: "#6B7280" }}>
                💤 Deload — Reduce load 30%
              </span>
            )}
          </div>
          <div className="text-right">
            <div className="font-display text-4xl text-accent leading-none">{totalWeekKm.toFixed(1)}</div>
            <div className="text-[11px] text-text-muted font-semibold uppercase">km week</div>
          </div>
        </div>
      </div>

      {/* Workout List */}
      <div className="flex flex-col gap-2 animate-fade-up-3">
        {weekWorkouts.map((w, i) => {
          const m = WORKOUT_META[w.type];
          const isRest = w.type === "rest";
          return (
            isRest ? (
              <div key={w.id} className="flex items-center gap-4 px-4 py-3 rounded-xl opacity-40"
                style={{ background: "#111318", border: "1px dashed #1E2330" }}>
                <div className="text-lg">{m?.icon}</div>
                <div>
                  <div className="text-sm font-semibold text-text-muted">Rest Day</div>
                  <div className="text-xs text-text-muted">Day {w.day} · {w.scheduled_date}</div>
                </div>
              </div>
            ) : (
              <Link key={w.id} href={`/training/workout/${w.id}`}
                className="workout-row"
                style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                  style={{ background: m?.bg }}>
                  {m?.icon}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="font-semibold text-sm">{m?.label}</div>
                  <div className="text-xs text-text-secondary mt-0.5">
                    {w.distance ? `${w.distance} km · ` : ""}{w.duration} min · RPE {w.rpe}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="font-mono text-sm font-bold" style={{ color: m?.color }}>
                    {w.target_pace !== "—" ? w.target_pace : "—"}
                  </div>
                  <div className="text-[10px] text-text-muted">min/km</div>
                </div>
                <svg width={16} height={16} viewBox="0 0 24 24" fill="none" stroke="#4A5568" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"/><polyline points="12,5 19,12 12,19"/>
                </svg>
              </Link>
            )
          );
        })}
      </div>
    </div>
  );
}
