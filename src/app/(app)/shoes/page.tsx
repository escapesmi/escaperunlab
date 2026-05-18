// src/app/(app)/shoes/page.tsx
import { createClient } from "@/lib/supabase/server";
import ShoesClient from "./ShoesClient";

export default async function ShoesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: shoes } = await supabase
    .from("shoes")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return <ShoesClient initialShoes={shoes ?? []} userId={user.id} />;
}
