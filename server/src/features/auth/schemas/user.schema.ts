import { z } from "zod";

export const UserSchema = z.object({
  name: z
    .string()
    .min(2, { error: "Name must be at least 2 characters" })
    .max(50, { error: "Name must be at most 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, { error: "Name can only contain letters and spaces" })
    .transform((name) => name.trim()),

  email: z
    .email()
    .max(100, { error: "Email must be at most 100 characters" })
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, { error: "Password must be at least 8 characters" })
    .max(128, { error: "Password must be at most 128 characters" })
    .regex(/[A-Z]/, { error: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { error: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { error: "Password must contain at least one number" })
    .regex(/[\W_]/, { error: "Password must contain at least one special character" }),
});

export type UserPayload = z.infer<typeof UserSchema>;
