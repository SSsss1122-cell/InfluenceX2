"use server";

import { redirect } from "next/navigation";
import { headers } from "next/headers";
import { createClient } from "@/lib/supabase/server";
import { ROLE_HOME } from "@/lib/auth/roles";
import {
  signUpSchema,
  signInSchema,
  resetSchema,
  type SignUpInput,
  type SignInInput,
  type ResetInput,
} from "@/lib/validations/auth";

type ActionResult = { error?: string; success?: string };

// ============================================
// SIGN UP
// ============================================
export async function signUpAction(input: SignUpInput): Promise<ActionResult> {
  const parsed = signUpSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid form data. Please check your fields." };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  const { data, error } = await supabase.auth.signUp({
    email: parsed.data.email,
    password: parsed.data.password,
    options: {
      emailRedirectTo: `${origin}/callback`,
      data: {
        role: parsed.data.role,
        full_name: parsed.data.full_name,
      },
    },
  });

  if (error) {
    return { error: error.message };
  }

  // Email confirmation is enabled → no session returned yet
  if (!data.session) {
    return { success: "Check your email to confirm your account, then log in." };
  }

  // Email confirmation disabled (common in dev) → user is logged in
  redirect(ROLE_HOME[parsed.data.role]);
}

// ============================================
// SIGN IN
// ============================================
export async function signInAction(input: SignInInput): Promise<ActionResult> {
  const parsed = signInSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Invalid credentials format." };
  }

  const supabase = await createClient();
  const { data, error } = await supabase.auth.signInWithPassword({
    email: parsed.data.email,
    password: parsed.data.password,
  });

  if (error) {
    return { error: error.message };
  }

  // Fetch role to redirect correctly
  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", data.user.id)
    .single();

  if (!profile?.role) {
    return { error: "Profile not found. Contact support." };
  }

  redirect(ROLE_HOME[profile.role as keyof typeof ROLE_HOME]);
}

// ============================================
// PASSWORD RESET EMAIL
// ============================================
export async function resetPasswordAction(input: ResetInput): Promise<ActionResult> {
  const parsed = resetSchema.safeParse(input);
  if (!parsed.success) {
    return { error: "Enter a valid email." };
  }

  const supabase = await createClient();
  const origin = (await headers()).get("origin") ?? "";

  const { error } = await supabase.auth.resetPasswordForEmail(parsed.data.email, {
    redirectTo: `${origin}/callback?next=/reset-password`,
  });

  if (error) {
    return { error: error.message };
  }

  // Always return success to prevent email enumeration
  return {
    success: "If an account exists, a reset link has been sent to your email.",
  };
}