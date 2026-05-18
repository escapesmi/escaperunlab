// src/app/(app)/training/page.tsx
import { createClient } from "@/lib/supabase/server";
import TrainingClient from "./TrainingClient";

export default async function TrainingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: plan } = await supabase
    .from("training_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  const { data: workouts } = plan
    ? await supabase
        .from("workouts")
        .select("*")
        .eq("plan_id", plan.id)
        .order("week", { ascending: true })
        .order("day", { ascending: true })
    : { data: [] };

  // Group by week
  const byWeek: Record<number, typeof workouts> = {};
  for (const w of workouts ?? []) {
    if (!byWeek[w.week]) byWeek[w.week] = [];
    byWeek[w.week]!.push(w);
  }

  return (
    <TrainingClient
      plan={plan}
      workoutsByWeek={byWeek}
      totalWeeks={plan?.duration_weeks ?? 0}
    />
  );
}
