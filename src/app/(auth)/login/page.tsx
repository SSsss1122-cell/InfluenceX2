"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";
import { signInAction } from "../actions";
import { signInSchema, type SignInInput } from "@/lib/validations/auth";

export default function LoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [isPending, startTransition] = useTransition();

  const form = useForm<SignInInput>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: "", password: "" },
  });

  function onSubmit(values: SignInInput) {
    startTransition(async () => {
      const result = await signInAction(values);
      if (result?.error) {
        form.setError("root", { message: result.error });
        toast.error(result.error);
      }
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Welcome back</CardTitle>
        <CardDescription>Sign in to your InfluenceX account</CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          {form.formState.errors.root && (
            <div className="rounded-md bg-destructive/10 border border-destructive/30 p-3 text-sm text-destructive">
              {form.formState.errors.root.message}
            </div>
          )}

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
            render={(field) => (
              <div className="relative">
                <Input
                  {...field}
                  type={showPassword ? "text" : "password"}
                  placeholder="••••••••"
                  autoComplete="current-password"
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

          <div className="flex justify-end">
            <Link href="/forgot-password" className="text-sm text-primary hover:underline">
              Forgot password?
            </Link>
          </div>
        </CardContent>

        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Signing in…" : "Sign in"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Don&apos;t have an account?{" "}
            <Link href="/register" className="text-primary hover:underline font-medium">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}