// src/app/(app)/training/workout/[id]/WorkoutDetailClient.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { WorkoutTag, WORKOUT_META } from "@/components/ui";
import { adaptWorkout } from "@/lib/training-engine";
import type { Workout, WorkoutLog } from "@/types";

interface Props {
  workout: Workout;
  previousLog: WorkoutLog | null;
  userId: string;
}

export default function WorkoutDetailClient({ workout, previousLog, userId }: Props) {
  const router = useRouter();
  const supabase = createClient();
  const [logging, setLogging] = useState(false);
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);
  const [logData, setLogData] = useState({
    dist: "", pace: "", hr: "", fatigue: 5, soreness: 3, notes: "",
  });

  const meta = WORKOUT_META[workout.type] ?? WORKOUT_META.easy;
  const adaptation = adaptWorkout(workout, logData.fatigue);
  const showAdaptation = logData.fatigue >= 6 && logging;

  const hrZoneColor = workout.target_hr?.includes("Zone 5") ? "#FF4D6A"
    : workout.target_hr?.includes("Zone 4") ? "#FFB347"
    : workout.target_hr?.includes("Zone 3") ? "#4D9EFF"
    : "#00E5A0";

  const handleLog = async () => {
    setSaving(true);
    const { error: logError } = await supabase.from("workout_logs").insert({
      workout_id: workout.id,
      user_id: userId,
      actual_distance: parseFloat(logData.dist) || null,
      actual_pace: logData.pace || null,
      actual_hr: parseInt(logData.hr) || null,
      fatigue: logData.fatigue,
      soreness: logData.soreness,
      notes: logData.notes || null,
      completed_at: new Date().toISOString(),
    });

    if (!logError) {
      // Update workout status
      await supabase.from("workouts")
        .update({ status: "completed" })
        .eq("id", workout.id);

      // If high fatigue, adapt next workout
      if (logData.fatigue >= 6 && Object.keys(adaptation).length > 0) {
        // Find and adapt next workout
        const { data: nextWorkout } = await supabase
          .from("workouts")
          .select("id")
          .eq("plan_id", workout.plan_id)
          .eq("status", "planned")
          .neq("type", "rest")
          .gt("scheduled_date", workout.scheduled_date ?? "")
          .order("scheduled_date", { ascending: true })
          .limit(1)
          .single();

        if (nextWorkout && adaptation.type) {
          await supabase.from("workouts")
            .update({ type: adaptation.type, notes: adaptation.notes })
            .eq("id", nextWorkout.id);
        }
      }

      setSuccess(true);
      setTimeout(() => router.push("/training"), 1500);
    }
    setSaving(false);
  };

  if (success) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-6 text-center">
        <div className="text-6xl animate-fade-up">🎉</div>
        <h2 className="text-2xl font-bold animate-fade-up-1">Workout Selesai!</h2>
        <p className="text-text-secondary animate-fade-up-2">Data kamu sudah tersimpan. Mantap!</p>
      </div>
    );
  }

  return (
    <div className="px-5 py-4 flex flex-col gap-5">
      {/* Back */}
      <button onClick={() => router.back()}
        className="flex items-center gap-2 text-text-secondary text-sm font-semibold hover:text-text-primary transition-colors w-fit">
        <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <line x1="19" y1="12" x2="5" y2="12"/><polyline points="12,19 5,12 12,5"/>
        </svg>
        Kembali
      </button>

      {/* Hero card */}
      <div className="animate-fade-up rounded-2xl p-6"
        style={{
          background: `linear-gradient(135deg, ${meta.bg} 0%, rgba(0,0,0,0) 100%)`,
          border: `1px solid ${meta.color}30`,
        }}>
        <WorkoutTag type={workout.type} />
        <h1 className="font-display text-5xl mt-3 leading-none" style={{ color: meta.color }}>
          {meta.label.toUpperCase()}
        </h1>
        {workout.scheduled_date && (
          <p className="text-text-muted text-sm mt-2">📅 {workout.scheduled_date}</p>
        )}
        <p className="text-text-secondary text-sm mt-2 leading-relaxed">{workout.notes}</p>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-2 animate-fade-up-1">
        {[
          ["Jarak", workout.distance ? `${workout.distance}` : "—", "km"],
          ["Durasi", workout.duration ? `${workout.duration}` : "—", "min"],
          ["Target Pace", workout.target_pace ?? "—", "min/km"],
        ].map(([l, v, u]) => (
          <div key={l} className="metric-card text-center">
            <div className="font-mono font-bold text-xl" style={{ color: meta.color }}>{v}</div>
            <div className="text-[10px] text-text-muted mt-0.5">{u}</div>
            <div className="text-[10px] text-text-secondary mt-1">{l}</div>
          </div>
        ))}
      </div>

      {/* Details */}
      <div className="card animate-fade-up-2">
        <h3 className="font-bold text-sm mb-4 uppercase tracking-wider text-text-secondary">Detail Workout</h3>
        <div className="flex flex-col gap-3">
          {[
            ["HR Zone", null, (
              <span className="text-xs font-bold px-2.5 py-1 rounded-lg"
                style={{ background: `${hrZoneColor}20`, color: hrZoneColor }}>
                {workout.target_hr}
              </span>
            )],
            ["RPE Target", `${workout.rpe} / 10`, null],
            ["Warmup", workout.warmup, null],
            ["Cooldown", workout.cooldown, null],
          ].map(([l, v, custom]) => (
            <div key={l as string} className="flex justify-between items-center gap-3">
              <span className="text-xs text-text-muted font-semibold flex-shrink-0">{l}</span>
              {custom ?? <span className="text-sm text-text-secondary text-right">{v}</span>}
            </div>
          ))}
        </div>
      </div>

      {/* Previous log */}
      {previousLog && (
        <div className="card animate-fade-up-3 border-info/20" style={{ borderColor: "rgba(77,158,255,0.2)", background: "rgba(77,158,255,0.04)" }}>
          <h3 className="font-bold text-xs mb-3 text-info uppercase tracking-wider">Log Sebelumnya</h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <div className="font-mono font-bold text-info">{previousLog.actual_distance ?? "—"}</div>
              <div className="text-[10px] text-text-muted">km</div>
            </div>
            <div>
              <div className="font-mono font-bold text-info">{previousLog.actual_pace ?? "—"}</div>
              <div className="text-[10px] text-text-muted">pace</div>
            </div>
            <div>
              <div className="font-mono font-bold text-info">{previousLog.fatigue ?? "—"}/10</div>
              <div className="text-[10px] text-text-muted">fatigue</div>
            </div>
          </div>
        </div>
      )}

      {/* Adaptation warning */}
      {showAdaptation && adaptation.type && (
        <div className="rounded-xl p-4 animate-fade-up"
          style={{ background: "rgba(255,179,71,0.08)", border: "1px solid rgba(255,179,71,0.3)" }}>
          <div className="flex items-start gap-3">
            <span className="text-xl">⚠️</span>
            <div>
              <div className="text-xs font-bold text-warning uppercase tracking-wide mb-1">AI Adaptation</div>
              <p className="text-sm text-text-secondary">{adaptation.notes}</p>
            </div>
          </div>
        </div>
      )}

      {/* Log Button / Form */}
      {!logging ? (
        <button className="btn-primary w-full py-4 text-base animate-fade-up-4"
          onClick={() => setLogging(true)}>
          ✅ Log Workout Ini
        </button>
      ) : (
        <div className="card animate-fade-up flex flex-col gap-4">
          <h3 className="font-bold text-base">Catat Workout</h3>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Jarak (km)</label>
              <input className="input-field" type="number" step="0.1" placeholder={workout.distance?.toString() ?? "0"}
                value={logData.dist} onChange={(e) => setLogData({ ...logData, dist: e.target.value })} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Pace (min/km)</label>
              <input className="input-field" placeholder={workout.target_pace ?? "8:00"}
                value={logData.pace} onChange={(e) => setLogData({ ...logData, pace: e.target.value })} />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Avg Heart Rate (bpm)</label>
            <input className="input-field" type="number" placeholder="145"
              value={logData.hr} onChange={(e) => setLogData({ ...logData, hr: e.target.value })} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">
              Fatigue: <span style={{ color: logData.fatigue >= 7 ? "#FF4D6A" : logData.fatigue >= 5 ? "#FFB347" : "#00E5A0" }}>
                {logData.fatigue}/10
              </span>
            </label>
            <input type="range" min="1" max="10" className="w-full"
              value={logData.fatigue} onChange={(e) => setLogData({ ...logData, fatigue: parseInt(e.target.value) })} />
            <div className="flex justify-between text-[10px] text-text-muted mt-1">
              <span>Santai banget</span><span>Sangat kelelahan</span>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">
              Nyeri Otot: <span className="text-accent">{logData.soreness}/10</span>
            </label>
            <input type="range" min="1" max="10" className="w-full"
              value={logData.soreness} onChange={(e) => setLogData({ ...logData, soreness: parseInt(e.target.value) })} />
          </div>

          <div>
            <label className="block text-xs font-semibold text-text-muted mb-1.5 uppercase tracking-wide">Catatan</label>
            <textarea className="input-field" rows={3} placeholder="Gimana rasanya hari ini? Ada rasa sakit?"
              value={logData.notes} onChange={(e) => setLogData({ ...logData, notes: e.target.value })} />
          </div>

          <div className="flex gap-2">
            <button className="btn-ghost flex-1" onClick={() => setLogging(false)}>Batal</button>
            <button className="btn-primary flex-[2] disabled:opacity-50" disabled={saving} onClick={handleLog}>
              {saving ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
                  Menyimpan...
                </span>
              ) : "Simpan 💾"}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
