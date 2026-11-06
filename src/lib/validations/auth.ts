import { z } from "zod";

export const ROLE_VALUES = ["influencer", "brand", "customer"] as const;
export type PublicRole = (typeof ROLE_VALUES)[number];

export const signUpSchema = z.object({
  full_name: z
    .string()
    .min(2, "Name must be at least 2 characters")
    .max(80, "Name too long"),
  email: z.string().email("Enter a valid email"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .regex(/[A-Z]/, "Must contain an uppercase letter")
    .regex(/[a-z]/, "Must contain a lowercase letter")
    .regex(/[0-9]/, "Must contain a number"),
  role: z.enum(ROLE_VALUES, { message: "Choose an account type" }),
});

export const signInSchema = z.object({
  email: z.string().email("Enter a valid email"),
  password: z.string().min(1, "Password is required"),
});

export const resetSchema = z.object({
  email: z.string().email("Enter a valid email"),
});

export type SignUpInput = z.infer<typeof signUpSchema>;
export type SignInInput = z.infer<typeof signInSchema>;
export type ResetInput = z.infer<typeof resetSchema>;