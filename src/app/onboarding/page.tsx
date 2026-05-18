// src/app/onboarding/page.tsx
"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { generateTrainingPlan } from "@/lib/training-engine";
import type { ExperienceLevel, PlanDuration } from "@/types";

interface OnboardingData {
  name: string;
  age: string;
  gender: string;
  height: string;
  weight: string;
  experience_level: ExperienceLevel;
  current_pace: string;
  goal: string;
  days_per_week: string;
  injury_history: string;
  pronation: string;
  plan_duration: PlanDuration;
}

export default function OnboardingPage() {
  const router = useRouter();
  const supabase = createClient();
  const [step, setStep] = useState(0);
  const [saving, setSaving] = useState(false);
  const [data, setData] = useState<OnboardingData>({
    name: "", age: "", gender: "", height: "", weight: "",
    experience_level: "beginner", current_pace: "8:00",
    goal: "5k", days_per_week: "3", injury_history: "none",
    pronation: "neutral", plan_duration: "8week",
  });

  const set = (k: keyof OnboardingData, v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  const ChipGroup = ({
    field, options,
  }: {
    field: keyof OnboardingData;
    options: [string, string][];
  }) => (
    <div className="flex flex-wrap gap-2">
      {options.map(([v, l]) => (
        <button
          key={v}
          type="button"
          className={`chip ${data[field] === v ? "active" : ""}`}
          onClick={() => set(field, v)}
        >
          {l}
        </button>
      ))}
    </div>
  );

  const steps = [
    {
      title: "Halo! Kenalan dulu 👋",
      subtitle: "Setup cepat — 2 menit maksimal",
      content: (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">
              Nama kamu
            </label>
            <input className="input-field" placeholder="e.g. Budi Santoso"
              value={data.name} onChange={(e) => set("name", e.target.value)} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">Usia</label>
              <input className="input-field" type="number" placeholder="25"
                value={data.age} onChange={(e) => set("age", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">Gender</label>
              <select className="input-field" value={data.gender} onChange={(e) => set("gender", e.target.value)}>
                <option value="">Pilih</option>
                <option value="male">Pria</option>
                <option value="female">Wanita</option>
                <option value="other">Lainnya</option>
              </select>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">Tinggi (cm)</label>
              <input className="input-field" type="number" placeholder="170"
                value={data.height} onChange={(e) => set("height", e.target.value)} />
            </div>
            <div>
              <label className="block text-xs font-semibold text-text-muted mb-2 uppercase tracking-wide">Berat (kg)</label>
              <input className="input-field" type="number" placeholder="65"
                value={data.weight} onChange={(e) => set("weight", e.target.value)} />
            </div>
          </div>
        </div>
      ),
    },
    {
      title: "Pengalaman lari kamu 🏃",
      subtitle: "Jujur saja — tidak ada penilaian di sini!",
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-3 uppercase tracking-wide">Level pengalaman</label>
            <div className="grid grid-cols-3 gap-2">
              {([["beginner","🌱 Beginner","Baru mulai"],["intermediate","💪 Intermediate","6+ bulan"],["advanced","🏆 Advanced","1+ tahun"]] as [string,string,string][]).map(([v,l,s]) => (
                <button key={v} type="button"
                  className={`chip flex-col py-3 px-2 rounded-xl text-center h-auto ${data.experience_level === v ? "active" : ""}`}
                  onClick={() => set("experience_level", v)}>
                  <span className="font-bold text-xs">{l}</span>
                  <span className="text-[10px] opacity-60 mt-0.5">{s}</span>
                </button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-3 uppercase tracking-wide">Pace rata-rata (menit/km)</label>
            <ChipGroup field="current_pace" options={[["7:00","7:00"],["7:30","7:30"],["8:00","8:00"],["8:30","8:30"],["9:00","9:00"],["9:30+","9:30+"]]}/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-3 uppercase tracking-wide">Riwayat cedera</label>
            <ChipGroup field="injury_history" options={[["none","✅ Tidak ada"],["shin","Shin splints"],["knee","Lutut"],["plantar","Plantar fasciitis"],["other","Lainnya"]]}/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-3 uppercase tracking-wide">Tipe pronasi</label>
            <ChipGroup field="pronation" options={[["neutral","Neutral"],["overpronation","Overpronation"],["supination","Supination"],["unknown","Tidak tahu"]]}/>
          </div>
        </div>
      ),
    },
    {
      title: "Atur target kamu 🎯",
      subtitle: "Kita buat program yang pas buat kamu",
      content: (
        <div className="flex flex-col gap-6">
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-3 uppercase tracking-wide">Tujuan / target race</label>
            <div className="grid grid-cols-2 gap-2">
              {([["5k","🏁 5K Pertama"],["10k","🎽 10K Race"],["aerobic","💚 Aerobic Base"],["consistency","📅 Konsistensi"],["hm","🏅 Half Marathon"],["weight","⚡ Turun Berat"]] as [string,string][]).map(([v,l]) => (
                <button key={v} type="button"
                  className={`chip rounded-xl py-3 text-left ${data.goal === v ? "active" : ""}`}
                  onClick={() => set("goal", v)}>{l}</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-3 uppercase tracking-wide">Hari latihan per minggu</label>
            <ChipGroup field="days_per_week" options={[["2","2 hari"],["3","3 hari"],["4","4 hari"],["5","5 hari"],["6","6 hari"]]}/>
          </div>
          <div>
            <label className="block text-xs font-semibold text-text-muted mb-3 uppercase tracking-wide">Durasi program</label>
            <ChipGroup field="plan_duration" options={[["30day","30 Hari"],["8week","8 Minggu"],["12week","12 Minggu"]]}/>
          </div>
        </div>
      ),
    },
  ];

  const handleComplete = async () => {
    setSaving(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) return;

      // Update user profile
      await supabase.from("users").update({
        name: data.name || user.user_metadata?.full_name,
        age: parseInt(data.age) || null,
        gender: data.gender || null,
        height: parseFloat(data.height) || null,
        weight: parseFloat(data.weight) || null,
        experience_level: data.experience_level,
        current_pace: data.current_pace,
        goal: data.goal,
        days_per_week: parseInt(data.days_per_week),
        injury_history: data.injury_history,
        pronation: data.pronation,
        onboarding_complete: true,
      }).eq("id", user.id);

      // Generate plan
      const { data: profileRow } = await supabase
        .from("users").select("*").eq("id", user.id).single();

      const generated = generateTrainingPlan({
        profile: { ...profileRow, id: user.id, email: user.email! },
        planDuration: data.plan_duration,
        startDate: new Date(),
      });

      // Insert plan
      const { data: plan } = await supabase.from("training_plans").insert({
        user_id: user.id,
        plan_type: data.plan_duration,
        duration_weeks: generated.duration_weeks,
        goal: generated.goal,
        start_date: new Date().toISOString().split("T")[0],
        is_active: true,
      }).select().single();

      // Insert workouts in batches of 50
      if (plan) {
        const workoutsWithPlanId = generated.workouts.map((w) => ({
          ...w, plan_id: plan.id,
        }));
        for (let i = 0; i < workoutsWithPlanId.length; i += 50) {
          await supabase.from("workouts").insert(workoutsWithPlanId.slice(i, i + 50));
        }
      }

      router.push("/dashboard");
    } catch (err) {
      console.error(err);
      setSaving(false);
    }
  };

  const curr = steps[step];
  const progress = ((step + 1) / steps.length) * 100;

  return (
    <div className="min-h-screen px-6 py-8 max-w-md mx-auto">
      {/* Logo */}
      <div className="flex items-center gap-2 mb-8">
        <div className="w-8 h-8 rounded-lg bg-accent flex items-center justify-center">
          <svg width={16} height={16} viewBox="0 0 24 24" fill="#000">
            <polygon points="13,2 3,14 12,14 11,22 21,10 12,10 13,2" />
          </svg>
        </div>
        <span className="font-display text-xl tracking-widest">ECHO STRIDE</span>
      </div>

      {/* Progress */}
      <div className="mb-8">
        <div className="flex justify-between mb-2">
          <span className="text-xs text-text-muted font-bold uppercase tracking-wider">Step {step + 1} of {steps.length}</span>
          <span className="text-xs text-accent font-bold">{Math.round(progress)}%</span>
        </div>
        <div className="h-1 bg-border rounded-full">
          <div className="h-full bg-accent rounded-full transition-all duration-500"
            style={{ width: `${progress}%` }} />
        </div>
      </div>

      {/* Content */}
      <div className="animate-fade-up" key={step}>
        <h2 className="text-2xl font-bold mb-1">{curr.title}</h2>
        <p className="text-text-secondary text-sm mb-7">{curr.subtitle}</p>
        {curr.content}
      </div>

      {/* Buttons */}
      <div className="flex gap-3 mt-8">
        {step > 0 && (
          <button className="btn-ghost flex-1" onClick={() => setStep((s) => s - 1)}>
            ← Kembali
          </button>
        )}
        <button
          className="btn-primary flex-[2] disabled:opacity-50"
          disabled={saving}
          onClick={() => step < steps.length - 1 ? setStep((s) => s + 1) : handleComplete()}
        >
          {saving ? (
            <span className="flex items-center justify-center gap-2">
              <span className="w-4 h-4 border-2 border-black/20 border-t-black rounded-full animate-spin" />
              Membuat program...
            </span>
          ) : step < steps.length - 1 ? "Lanjut →" : "Buat Program Saya 🚀"}
        </button>
      </div>
    </div>
  );
}
