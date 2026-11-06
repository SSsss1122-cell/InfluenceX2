"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff, Sparkles, Building2, User } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";
import { cn } from "@/lib/utils";
import { signUpAction } from "../actions";
import { signUpSchema, ROLE_VALUES, type SignUpInput, type PublicRole } from "@/lib/validations/auth";

const ROLE_META: Record<PublicRole, { label: string; desc: string; icon: React.ElementType }> = {
  influencer: { label: "Influencer", desc: "Create content & earn", icon: Sparkles },
  brand:      { label: "Brand",      desc: "Find creators & run campaigns", icon: Building2 },
  customer:   { label: "Customer",   desc: "Explore & shop PR products", icon: User },
};

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [submittedMessage, setSubmittedMessage] = useState<string | null>(null);

  const form = useForm<SignUpInput>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { full_name: "", email: "", password: "", role: "influencer" },
  });

  const selectedRole = form.watch("role");

  function onSubmit(values: SignUpInput) {
    startTransition(async () => {
      const result = await signUpAction(values);
      if (result?.error) {
        form.setError("root", { message: result.error });
        toast.error(result.error);
      }
      if (result?.success) {
        setSubmittedMessage(result.success);
      }
    });
  }

  if (submittedMessage) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Check your inbox ✉️</CardTitle>
          <CardDescription>{submittedMessage}</CardDescription>
        </CardHeader>
        <CardFooter>
          <Link href="/login" className="text-primary hover:underline text-sm font-medium">
            Back to login
          </Link>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Create your account</CardTitle>
        <CardDescription>Join InfluenceX — pick your account type below</CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-5">
          {form.formState.errors.root && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

          {/* Role selector */}
          <div className="space-y-2">
            <label className="text-sm font-medium">I am signing up as</label>
            <div className="grid grid-cols-3 gap-2">
              {ROLE_VALUES.map((role) => {
                const Icon = ROLE_META[role].icon;
                const active = selectedRole === role;
                return (
                  <button
                    key={role}
                    type="button"
                    onClick={() => form.setValue("role", role, { shouldValidate: true })}
                    className={cn(
                      "flex flex-col items-center gap-1 rounded-lg border p-3 text-center transition-colors",
                      active
                        ? "border-primary bg-primary/5 text-primary"
                        : "border-border hover:bg-muted/60"
                    )}
                  >
                    <Icon className="size-5" />
                    <span className="text-sm font-medium">{ROLE_META[role].label}</span>
                    <span className="text-[11px] text-muted-foreground leading-tight">
                      {ROLE_META[role].desc}
                    </span>
                  </button>
                );
              })}
            </div>
            {form.formState.errors.role && (
              <p className="text-sm text-destructive">{form.formState.errors.role.message}</p>
            )}
          </div>

          <FormField
            control={form.control}
            name="full_name"
            label="Full name"
            render={(field) => (
              <Input {...field} placeholder="Your name" autoComplete="name" />
            )}
          />

          <FormField
            control={form.control}
            name="email"
            label="Email"
            render={(field) => (
              <Input {...field} type="email" placeholder="you@example.com" autoComplete="email" />
            )}
          />

          <FormField
            control={form.control}
            name="password"
            label="Password"
            description="At least 8 characters, with uppercase, lowercase and a number"
            render={(field) => (
              <div className="relative">
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="new-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground"
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            )}
          />
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Creating account…" : "Create account"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Already have an account?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Sign in
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}