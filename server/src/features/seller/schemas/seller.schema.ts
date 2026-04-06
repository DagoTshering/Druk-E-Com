import { z } from "zod";

export const registerSellerSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, { message: "Name can only contain letters and spaces" })
    .transform((name) => name.trim()),

  email: z
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" })
    .transform((email) => email.toLowerCase()),

  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be at most 128 characters" })
    .regex(/[A-Z]/, { message: "Password must contain at least one uppercase letter" })
    .regex(/[a-z]/, { message: "Password must contain at least one lowercase letter" })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, { message: "Password must contain at least one special character" }),

  businessName: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters" })
    .max(255, { message: "Business name must be at most 255 characters" }),

  phone: z.string().max(20).optional(),
  taxId: z.string().max(50).optional(),
  address: z.string().optional(),
  businessType: z.enum(["individual", "partnership", "llc", "corporation"]).optional(),
});

export const applyAsSellerSchema = z.object({
  businessName: z
    .string()
    .min(2, { message: "Business name must be at least 2 characters" })
    .max(255, { message: "Business name must be at most 255 characters" }),

  phone: z.string().max(20).optional(),
  taxId: z.string().max(50).optional(),
  address: z.string().optional(),
  businessType: z.enum(["individual", "partnership", "llc", "corporation"]).optional(),
});

export const rejectSellerSchema = z.object({
  reason: z
    .string()
    .min(1, { message: "Rejection reason is required" })
    .max(500, { message: "Reason must be at most 500 characters" }),
});

export type RegisterSellerPayload = z.infer<typeof registerSellerSchema>;
export type ApplyAsSellerPayload = z.infer<typeof applyAsSellerSchema>;
export type RejectSellerPayload = z.infer<typeof rejectSellerSchema>;
