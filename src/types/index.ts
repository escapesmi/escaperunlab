// src/types/index.ts

export type ExperienceLevel = "beginner" | "intermediate" | "advanced";
export type WorkoutType =
  | "easy"
  | "walkrun"
  | "interval"
  | "tempo"
  | "longrun"
  | "recovery"
  | "strength"
  | "rest";
export type WorkoutStatus = "planned" | "upcoming" | "completed" | "skipped";
export type PlanDuration = "30day" | "8week" | "12week";
export type ShoeStatus = "active" | "retired";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar_url?: string;
  age?: number;
  gender?: string;
  height?: number;
  weight?: number;
  experience_level: ExperienceLevel;
  current_pace?: string;
  goal?: string;
  days_per_week?: number;
  injury_history?: string;
  pronation?: string;
  onboarding_complete: boolean;
  created_at: string;
}

export interface TrainingPlan {
  id: string;
  user_id: string;
  plan_type: PlanDuration;
  duration_weeks: number;
  goal: string;
  start_date: string;
  end_date?: string;
  is_active: boolean;
  created_at: string;
}

export interface Workout {
  id: string;
  plan_id: string;
  week: number;
  day: number;
  type: WorkoutType;
  distance?: number;
  duration?: number;
  target_pace?: string;
  target_hr?: string;
  rpe?: string;
  status: WorkoutStatus;
  warmup?: string;
  cooldown?: string;
  notes?: string;
  scheduled_date?: string;
  is_deload: boolean;
}

export interface WorkoutLog {
  id: string;
  workout_id: string;
  user_id: string;
  actual_distance?: number;
  actual_pace?: string;
  actual_hr?: number;
  fatigue?: number;
  soreness?: number;
  notes?: string;
  completed_at: string;
}

export interface Shoe {
  id: string;
  user_id: string;
  brand: string;
  model: string;
  color?: string;
  mileage: number;
  max_mileage: number;
  status: ShoeStatus;
  added_date: string;
  notes?: string;
}

export interface DashboardStats {
  weeklyMileage: number;
  completionRate: number;
  currentStreak: number;
  avgPace?: string;
  fatigueScore?: number;
  consistencyScore?: number;
}

export interface WeeklyLog {
  date: string;
  mileage: number;
  completed: boolean;
  dayLabel: string;
}
