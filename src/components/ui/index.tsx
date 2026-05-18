// src/components/ui/index.tsx
"use client";

import type { WorkoutType } from "@/types";

// ─── RADIAL PROGRESS ─────────────────────────────────────────────────────────
interface RadialProps {
  value: number; max: number; size?: number;
  stroke?: number; color?: string; children?: React.ReactNode;
}
export function RadialProgress({ value, max, size = 80, stroke = 8, color = "#00E5A0", children }: RadialProps) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const pct = Math.min(value / max, 1);
  const offset = circ * (1 - pct);
  return (
    <div style={{ position: "relative", width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: "rotate(-90deg)" }}>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#1E2330" strokeWidth={stroke}/>
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth={stroke}
          strokeDasharray={circ} strokeDashoffset={offset} strokeLinecap="round"
          style={{ transition: "stroke-dashoffset 1s ease" }}/>
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        {children}
      </div>
    </div>
  );
}

// ─── WORKOUT TYPES CONFIG ─────────────────────────────────────────────────────
export const WORKOUT_META: Record<WorkoutType, { label: string; color: string; bg: string; icon: string }> = {
  easy:     { label: "Easy Run",    color: "#00E5A0", bg: "rgba(0,229,160,0.1)",   icon: "🏃" },
  walkrun:  { label: "Walk-Run",    color: "#4D9EFF", bg: "rgba(77,158,255,0.1)",  icon: "🚶" },
  interval: { label: "Interval",    color: "#FF4D6A", bg: "rgba(255,77,106,0.1)",  icon: "⚡" },
  tempo:    { label: "Tempo",       color: "#FFB347", bg: "rgba(255,179,71,0.1)",  icon: "🔥" },
  longrun:  { label: "Long Run",    color: "#A855F7", bg: "rgba(168,85,247,0.1)",  icon: "🛣️" },
  recovery: { label: "Recovery",    color: "#6B7280", bg: "rgba(107,114,128,0.1)", icon: "💤" },
  strength: { label: "Strength",    color: "#EC4899", bg: "rgba(236,72,153,0.1)",  icon: "💪" },
  rest:     { label: "Rest Day",    color: "#4A5568", bg: "rgba(74,85,104,0.1)",   icon: "😴" },
};

// ─── WORKOUT TAG ─────────────────────────────────────────────────────────────
export function WorkoutTag({ type }: { type: WorkoutType }) {
  const m = WORKOUT_META[type] ?? WORKOUT_META.easy;
  return (
    <span className="tag text-xs" style={{ background: m.bg, color: m.color }}>
      {m.icon} {m.label}
    </span>
  );
}

// ─── MINI BAR CHART ───────────────────────────────────────────────────────────
interface BarDay { date: string; mileage: number; completed: boolean }
export function MiniBarChart({ data }: { data: BarDay[] }) {
  const max = Math.max(...data.map((d) => d.mileage), 1);
  return (
    <div className="flex items-end gap-1.5 h-16">
      {data.map((d, i) => (
        <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
          <div className="w-full flex items-end" style={{ height: 48 }}>
            <div
              className="w-full rounded-t-sm transition-all duration-700"
              style={{
                height: d.mileage ? `${(d.mileage / max) * 100}%` : 3,
                background: d.completed ? "#00E5A0" : "#1E2330",
                opacity: d.completed ? 1 : 0.5,
                minHeight: 3,
              }}
            />
          </div>
          <span className="text-[10px] text-text-muted font-semibold">
            {d.date[0]}
          </span>
        </div>
      ))}
    </div>
  );
}

// ─── STAT CARD ────────────────────────────────────────────────────────────────
interface StatCardProps {
  icon: string; label: string; value: string | number;
  unit?: string; color?: string; progress?: number;
}
export function StatCard({ icon, label, value, unit, color = "#00E5A0", progress }: StatCardProps) {
  return (
    <div className="metric-card">
      <div className="text-xl mb-2">{icon}</div>
      <div className="font-mono text-xl font-bold" style={{ color }}>
        {value}{unit && <span className="text-xs text-text-muted ml-0.5">{unit}</span>}
      </div>
      <div className="text-[11px] text-text-muted font-semibold mt-0.5 uppercase tracking-wide">{label}</div>
      {typeof progress === "number" && (
        <div className="h-0.5 bg-border rounded-full mt-2.5">
          <div className="h-full rounded-full transition-all duration-1000"
            style={{ width: `${Math.min(progress, 100)}%`, background: color }}/>
        </div>
      )}
    </div>
  );
}

// ─── LOADING SKELETON ─────────────────────────────────────────────────────────
export function Skeleton({ className = "" }: { className?: string }) {
  return (
    <div className={`rounded-xl bg-surface-alt animate-pulse ${className}`}
      style={{ background: "linear-gradient(90deg, #161A22 25%, #1E2330 50%, #161A22 75%)", backgroundSize: "200% 100%", animation: "shimmer 1.5s infinite" }}/>
  );
}

// ─── EMPTY STATE ──────────────────────────────────────────────────────────────
export function EmptyState({ icon, title, subtitle }: { icon: string; title: string; subtitle: string }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center px-6">
      <div className="text-5xl mb-4">{icon}</div>
      <h3 className="font-bold text-lg mb-2">{title}</h3>
      <p className="text-text-secondary text-sm leading-relaxed">{subtitle}</p>
    </div>
  );
}

// ─── AI INSIGHT CARD ─────────────────────────────────────────────────────────
export function AIInsightCard({ message }: { message: string }) {
  return (
    <div className="ai-bubble">
      <div className="flex gap-3 items-start">
        <div className="w-9 h-9 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: "rgba(0,229,160,0.15)" }}>
          <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="#00E5A0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 5a3 3 0 1 0-5.997.125 4 4 0 0 0-2.526 5.77 4 4 0 0 0 .556 6.588A4 4 0 1 0 12 18Z"/>
            <path d="M12 5a3 3 0 1 1 5.997.125 4 4 0 0 1 2.526 5.77 4 4 0 0 1-.556 6.588A4 4 0 1 1 12 18Z"/>
          </svg>
        </div>
        <div>
          <div className="text-[11px] text-accent font-bold tracking-wider uppercase mb-1">AI Coach Insight</div>
          <p className="text-sm text-text-secondary leading-relaxed">{message}</p>
        </div>
      </div>
    </div>
  );
}
