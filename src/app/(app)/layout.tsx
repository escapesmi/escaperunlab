// src/app/(app)/layout.tsx
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import BottomNav from "@/components/layout/BottomNav";
import TopBar from "@/components/layout/TopBar";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/auth/login");

  const { data: profile } = await supabase
    .from("users")
    .select("name, avatar_url, onboarding_complete")
    .eq("id", user.id)
    .single();

  if (!profile?.onboarding_complete) redirect("/onboarding");

  return (
    <div className="min-h-screen bg-bg flex flex-col max-w-lg mx-auto relative">
      <TopBar name={profile?.name} avatarUrl={profile?.avatar_url} />
      <main className="flex-1 overflow-y-auto pb-28 pt-2">
        {children}
      </main>
      <BottomNav />
    </div>
  );
}
