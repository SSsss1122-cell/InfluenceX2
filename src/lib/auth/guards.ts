import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { ROLE_HOME, type Role } from "./roles";

export async function requireRole(expected: Role) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (!profile || profile.role !== expected) {
    redirect(ROLE_HOME[(profile?.role as Role) ?? "customer"]);
  }
  return { user, profile };
}