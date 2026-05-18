// src/app/(app)/dashboard/page.tsx
import { createClient } from "@/lib/supabase/server";
import DashboardClient from "./DashboardClient";

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // Fetch user profile
  const { data: profile } = await supabase
    .from("users")
    .select("*")
    .eq("id", user.id)
    .single();

  // Fetch active training plan
  const { data: plan } = await supabase
    .from("training_plans")
    .select("*")
    .eq("user_id", user.id)
    .eq("is_active", true)
    .order("created_at", { ascending: false })
    .limit(1)
    .single();

  // Fetch today's and upcoming workouts
  const today = new Date().toISOString().split("T")[0];
  const nextWeek = new Date(Date.now() + 7 * 86400000).toISOString().split("T")[0];

  const { data: upcomingWorkouts } = plan
    ? await supabase
        .from("workouts")
        .select("*")
        .eq("plan_id", plan.id)
        .neq("type", "rest")
        .gte("scheduled_date", today)
        .lte("scheduled_date", nextWeek)
        .order("scheduled_date", { ascending: true })
        .limit(5)
    : { data: [] };

  // Fetch this week's logs
  const weekStart = new Date();
  weekStart.setDate(weekStart.getDate() - weekStart.getDay());
  const { data: weekLogs } = await supabase
    .from("workout_logs")
    .select("*")
    .eq("user_id", user.id)
    .gte("completed_at", weekStart.toISOString())
    .order("completed_at", { ascending: true });

  // Fetch total workout count and distance
  const { data: allLogs } = await supabase
    .from("workout_logs")
    .select("actual_distance, fatigue, completed_at")
    .eq("user_id", user.id)
    .order("completed_at", { ascending: false })
    .limit(30);

  // Calculate stats
  const weeklyMileage = weekLogs?.reduce((s, l) => s + (l.actual_distance ?? 0), 0) ?? 0;
  const totalWorkouts = allLogs?.length ?? 0;
  const avgFatigue = allLogs?.length
    ? Math.round(allLogs.reduce((s, l) => s + (l.fatigue ?? 5), 0) / allLogs.length * 10)
    : 50;

  // Streak calculation
  let streak = 0;
  const logDates = new Set(allLogs?.map((l) => l.completed_at.split("T")[0]) ?? []);
  for (let i = 0; i <= 30; i++) {
    const d = new Date(Date.now() - i * 86400000).toISOString().split("T")[0];
    if (logDates.has(d)) streak++;
    else if (i > 0) break;
  }

  // Weekly chart data
  const days = ["Min", "Sen", "Sel", "Rab", "Kam", "Jum", "Sab"];
  const weeklyChart = Array.from({ length: 7 }, (_, i) => {
    const d = new Date(weekStart);
    d.setDate(weekStart.getDate() + i);
    const dateStr = d.toISOString().split("T")[0];
    const dayLogs = weekLogs?.filter((l) => l.completed_at.startsWith(dateStr)) ?? [];
    return {
      date: days[i],
      mileage: dayLogs.reduce((s, l) => s + (l.actual_distance ?? 0), 0),
      completed: dayLogs.length > 0,
    };
  });

  const aiTips = [
    avgFatigue > 70
      ? "Fatigue score kamu tinggi. Pertimbangkan mengganti workout besok dengan easy run atau istirahat."
      : avgFatigue > 50
      ? "Fatigue sedang. Jaga intensity tetap rendah, tidur 7-8 jam, dan hidrasi yang cukup."
      : "Kamu dalam kondisi segar! Ini saat yang tepat untuk push sedikit lebih keras di workout berikutnya.",
    streak >= 3
      ? `${streak} hari streak! Konsistensi kamu luar biasa. Aerobic base terus berkembang.`
      : "Konsistensi adalah kunci. Workout 3-4x seminggu lebih baik dari sekali marathon training.",
  ];

  return (
    <DashboardClient
      profile={profile}
      upcomingWorkouts={upcomingWorkouts ?? []}
      weeklyChart={weeklyChart}
      stats={{ weeklyMileage, totalWorkouts, streak, avgFatigue }}
      aiTip={aiTips[streak >= 3 ? 1 : 0]}
    />
  );
}
