// src/app/(app)/training/workout/[id]/page.tsx
import { createClient } from "@/lib/supabase/server";
import { notFound } from "next/navigation";
import WorkoutDetailClient from "./WorkoutDetailClient";

export default async function WorkoutDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: workout } = await supabase
    .from("workouts")
    .select("*, training_plans!inner(user_id)")
    .eq("id", params.id)
    .eq("training_plans.user_id", user.id)
    .single();

  if (!workout) notFound();

  const { data: logs } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("workout_id", params.id)
    .order("completed_at", { ascending: false })
    .limit(1);

  return (
    <WorkoutDetailClient
      workout={workout}
      previousLog={logs?.[0] ?? null}
      userId={user.id}
    />
  );
}
