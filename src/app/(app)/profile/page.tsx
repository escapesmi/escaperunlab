// src/app/(app)/profile/page.tsx
import { createClient } from "@/lib/supabase/server";
import ProfileClient from "./ProfileClient";

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("users").select("*").eq("id", user.id).single();

  const { data: plan } = await supabase
    .from("training_plans").select("*")
    .eq("user_id", user.id).eq("is_active", true)
    .order("created_at", { ascending: false }).limit(1).single();

  const { count: totalLogs } = await supabase
    .from("workout_logs").select("*", { count: "exact", head: true })
    .eq("user_id", user.id);

  const { data: distanceData } = await supabase
    .from("workout_logs").select("actual_distance").eq("user_id", user.id);

  const totalKm = distanceData?.reduce((s, l) => s + (l.actual_distance ?? 0), 0) ?? 0;

  return (
    <ProfileClient
      profile={profile}
      plan={plan}
      stats={{ totalWorkouts: totalLogs ?? 0, totalKm }}
      userEmail={user.email ?? ""}
    />
  );
}
