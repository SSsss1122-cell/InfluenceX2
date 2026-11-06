import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { ROLE_HOME, type Role } from "@/lib/auth/roles";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = searchParams.get("next");

  if (!code) {
    return NextResponse.redirect(`${origin}/login?error=missing_code`);
  }

  const supabase = await createClient();
  const { error, data } = await supabase.auth.exchangeCodeForSession(code);

  if (error || !data.user) {
    return NextResponse.redirect(`${origin}/login?error=callback_failed`);
  }

  // If a `next` param is present (e.g. password reset), honor it
  if (next) {
    return NextResponse.redirect(`${origin}${next}`);
  }

  // Otherwise send them to their role-specific dashboard
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  const home = profile?.role ? ROLE_HOME[profile.role as Role] : "/";
  return NextResponse.redirect(`${origin}${home}`);
}