// src/lib/training-engine.ts
import type {
  UserProfile,
  Workout,
  WorkoutType,
  PlanDuration,
} from "@/types";

interface PlanConfig {
  profile: UserProfile;
  planDuration: PlanDuration;
  startDate: Date;
}

interface GeneratedPlan {
  duration_weeks: number;
  goal: string;
  workouts: Omit<Workout, "id" | "plan_id">[];
}

const WORKOUT_SCHEDULE: Record<
  string,
  Record<number, WorkoutType[]>
> = {
  beginner: {
    3: ["walkrun", "easy", "longrun"],
    4: ["walkrun", "easy", "easy", "longrun"],
    5: ["walkrun", "easy", "strength", "easy", "longrun"],
  },
  intermediate: {
    3: ["easy", "tempo", "longrun"],
    4: ["easy", "interval", "easy", "longrun"],
    5: ["easy", "interval", "tempo", "easy", "longrun"],
    6: ["easy", "interval", "easy", "tempo", "easy", "longrun"],
  },
  advanced: {
    4: ["easy", "interval", "tempo", "longrun"],
    5: ["easy", "interval", "tempo", "easy", "longrun"],
    6: ["easy", "interval", "easy", "tempo", "easy", "longrun"],
  },
};

const REST_DAYS: Record<number, number[]> = {
  3: [2, 4, 6, 7],   // Mon, Wed, Sat active → Tue, Thu, Fri, Sun rest
  4: [3, 6, 7],
  5: [3, 7],
  6: [7],
};

function parsePaceToSeconds(pace: string): number {
  const [min, sec] = pace.split(":").map(Number);
  return min * 60 + (sec || 0);
}

function secondsToPace(seconds: number): string {
  const min = Math.floor(seconds / 60);
  const sec = seconds % 60;
  return `${min}:${String(sec).padStart(2, "0")}`;
}

function getTargetPace(
  type: WorkoutType,
  basePaceSeconds: number
): string {
  const offsets: Partial<Record<WorkoutType, number>> = {
    easy: 60,
    walkrun: 90,
    longrun: 75,
    recovery: 120,
    tempo: -30,
    interval: -60,
    strength: 0,
    rest: 0,
  };
  const offset = offsets[type] ?? 0;
  return secondsToPace(basePaceSeconds + offset);
}

function getHRZone(type: WorkoutType): string {
  const zones: Partial<Record<WorkoutType, string>> = {
    easy: "Zone 2 (130–145 bpm)",
    walkrun: "Zone 1–2 (115–140 bpm)",
    longrun: "Zone 2 (130–148 bpm)",
    recovery: "Zone 1 (110–130 bpm)",
    tempo: "Zone 4 (160–175 bpm)",
    interval: "Zone 5 (175+ bpm)",
    strength: "Zone 2–3 (130–155 bpm)",
    rest: "—",
  };
  return zones[type] ?? "Zone 2";
}

function getRPE(type: WorkoutType): string {
  const rpe: Partial<Record<WorkoutType, string>> = {
    easy: "3–4",
    walkrun: "2–3",
    longrun: "4–5",
    recovery: "1–2",
    tempo: "6–7",
    interval: "8–9",
    strength: "5–6",
    rest: "—",
  };
  return rpe[type] ?? "4";
}

function getDistance(
  type: WorkoutType,
  week: number,
  experience: string,
  loadFactor: number
): number {
  const base: Partial<Record<WorkoutType, number>> = {
    easy: experience === "beginner" ? 3 : 6,
    walkrun: 2.5,
    longrun: experience === "beginner" ? 4 : 9,
    recovery: 3,
    tempo: experience === "beginner" ? 3 : 6,
    interval: experience === "beginner" ? 3 : 5,
    strength: 0,
    rest: 0,
  };
  const increment: Partial<Record<WorkoutType, number>> = {
    easy: experience === "beginner" ? 0.3 : 0.5,
    walkrun: 0.25,
    longrun: experience === "beginner" ? 0.5 : 0.8,
    recovery: 0.1,
    tempo: 0.3,
    interval: 0.2,
  };
  const b = base[type] ?? 0;
  const inc = (increment[type] ?? 0) * (week - 1);
  return Math.round((b + inc) * loadFactor * 10) / 10;
}

function getNotes(type: WorkoutType, week: number, isDeload: boolean): string {
  if (isDeload) {
    return "Deload week — reduce effort by 30%. Focus on form and recovery. Ini minggu pemulihan.";
  }
  const notes: Partial<Record<WorkoutType, string>> = {
    easy: `Week ${week}: Keep it conversational. Bisa ngobrol = sudah benar.`,
    walkrun: `Week ${week}: Walk 2 min → Run 3 min. Repeat. Jangan terburu-buru.`,
    longrun: `Week ${week}: Long run hari ini! Pace santai, fokus durasi bukan kecepatan.`,
    interval: `Week ${week}: 400m hard, 400m jog recovery. Repeat 4–6x. Fokus pada form.`,
    tempo: `Week ${week}: Uncomfortable but sustainable. Bisa ngomong 2–3 kata saja = benar.`,
    recovery: `Week ${week}: Very easy. Ini untuk pemulihan aktif, bukan workout keras.`,
    strength: `Week ${week}: Bodyweight strength. Squats, lunges, planks, glute bridges.`,
    rest: "Rest day — istirahat penuh. Tidur cukup dan makan bergizi.",
  };
  return notes[type] ?? `Week ${week} workout.`;
}

export function generateTrainingPlan(config: PlanConfig): GeneratedPlan {
  const { profile, planDuration, startDate } = config;
  const experience = profile.experience_level ?? "beginner";
  const daysPerWeek = Math.min(
    Math.max(profile.days_per_week ?? 3, 2),
    6
  );
  const weeks =
    planDuration === "30day" ? 4 : planDuration === "8week" ? 8 : 12;
  const basePaceSeconds = parsePaceToSeconds(
    profile.current_pace ?? "8:00"
  );

  const scheduleKey = Math.min(daysPerWeek, 6).toString();
  const workoutTypes =
    WORKOUT_SCHEDULE[experience]?.[daysPerWeek] ??
    WORKOUT_SCHEDULE[experience]?.[3] ??
    ["easy", "easy", "longrun"];

  const restDays = REST_DAYS[daysPerWeek] ?? [3, 6, 7];
  const workouts: Omit<Workout, "id" | "plan_id">[] = [];

  for (let w = 1; w <= weeks; w++) {
    const isDeload = w % 4 === 0 && w < weeks;
    const loadFactor = isDeload ? 0.65 : Math.min(1 + (w - 1) * 0.07, 1.6);

    let typeIndex = 0;
    for (let d = 1; d <= 7; d++) {
      const scheduledDate = new Date(startDate);
      scheduledDate.setDate(
        startDate.getDate() + (w - 1) * 7 + (d - 1)
      );

      if (restDays.includes(d)) {
        workouts.push({
          week: w,
          day: d,
          type: "rest",
          distance: 0,
          duration: 0,
          target_pace: "—",
          target_hr: "—",
          rpe: "—",
          status: "planned",
          warmup: "—",
          cooldown: "—",
          notes: getNotes("rest", w, isDeload),
          scheduled_date: scheduledDate.toISOString().split("T")[0],
          is_deload: isDeload,
        });
      } else {
        const type = workoutTypes[typeIndex % workoutTypes.length];
        typeIndex++;
        const distance = getDistance(type, w, experience, loadFactor);
        const pace = getTargetPace(type, basePaceSeconds);
        const paceSeconds = parsePaceToSeconds(pace);
        const duration =
          type === "strength" ? 30 : Math.round((distance * paceSeconds) / 60);

        workouts.push({
          week: w,
          day: d,
          type,
          distance,
          duration,
          target_pace: type === "rest" ? "—" : pace,
          target_hr: getHRZone(type),
          rpe: getRPE(type),
          status:
            w === 1 && typeIndex === 1 ? "upcoming" : "planned",
          warmup:
            type === "rest"
              ? "—"
              : "5 menit jalan santai + dynamic stretching",
          cooldown:
            type === "rest"
              ? "—"
              : "5 menit jalan + static stretching 10 menit",
          notes: getNotes(type, w, isDeload),
          scheduled_date: scheduledDate.toISOString().split("T")[0],
          is_deload: isDeload,
        });
      }
    }
  }

  return {
    duration_weeks: weeks,
    goal: profile.goal ?? "5k",
    workouts,
  };
}

// Adaptive adjustment — call this when user logs high fatigue
export function adaptWorkout(
  workout: Workout,
  fatigueScore: number
): Partial<Workout> {
  if (fatigueScore >= 8) {
    // High fatigue: downgrade workout
    if (workout.type === "interval") return { type: "easy", notes: "⚠️ Fatigue tinggi terdeteksi. Interval diubah ke Easy Run. Prioritaskan pemulihan." };
    if (workout.type === "tempo") return { type: "easy", notes: "⚠️ Fatigue tinggi. Tempo diubah ke Easy Run hari ini." };
    if (workout.type === "longrun") return { type: "recovery", notes: "⚠️ Fatigue tinggi. Long run diundur. Lakukan recovery run ringan." };
  }
  if (fatigueScore >= 6) {
    // Moderate fatigue: reduce load
    return {
      distance: workout.distance ? Math.round(workout.distance * 0.8 * 10) / 10 : undefined,
      notes: `${workout.notes ?? ""} ⚡ Load dikurangi 20% karena fatigue sedang.`,
    };
  }
  return {};
}
