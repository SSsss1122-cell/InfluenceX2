"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { FormField } from "@/components/shared/form-field";
import { resetPasswordAction } from "../actions";
import { resetSchema, type ResetInput } from "@/lib/validations/auth";

export default function ForgotPasswordPage() {
  const [isPending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const form = useForm<ResetInput>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: "" },
  });

  function onSubmit(values: ResetInput) {
    startTransition(async () => {
      const result = await resetPasswordAction(values);
      if (result?.error) {
        form.setError("root", { message: result.error });
        toast.error(result.error);
      }
      if (result?.success) {
        setMessage(result.success);
      }
    });
  }

  if (message) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Check your email</CardTitle>
          <CardDescription>{message}</CardDescription>
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
        <CardTitle className="text-2xl">Reset your password</CardTitle>
        <CardDescription>We&apos;ll email you a secure reset link</CardDescription>
      </CardHeader>

      <form onSubmit={form.handleSubmit(onSubmit)}>
        <CardContent className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            label="Email"
            render={(field) => (
              <Input {...field} type="email" placeholder="you@example.com" autoComplete="email" />
            )}
          />
        </CardContent>
        <CardFooter className="flex flex-col gap-3">
          <Button type="submit" className="w-full" disabled={isPending}>
            {isPending ? "Sending…" : "Send reset link"}
          </Button>
          <p className="text-sm text-muted-foreground text-center">
            Remembered it?{" "}
            <Link href="/login" className="text-primary hover:underline font-medium">
              Back to login
            </Link>
          </p>
        </CardFooter>
      </form>
    </Card>
  );
}