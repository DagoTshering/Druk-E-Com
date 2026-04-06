import { z } from "zod";

export const signInSchema = z.object({
  email: z
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),

  password: z.string().min(1, { message: "Password is required" }),
});

export const signUpSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(50, { message: "Name must be at most 50 characters" })
    .regex(/^[a-zA-Z\s]+$/, {
      message: "Name can only contain letters and spaces",
    })
    .transform((name) => name.trim()),

  email: z
    .email({ message: "Invalid email address" })
    .min(1, { message: "Email is required" }),
  password: z
    .string()
    .min(8, { message: "Password must be at least 8 characters" })
    .max(128, { message: "Password must be at most 128 characters" })
    .regex(/[A-Z]/, {
      message: "Password must contain at least one uppercase letter",
    })
    .regex(/[a-z]/, {
      message: "Password must contain at least one lowercase letter",
    })
    .regex(/[0-9]/, { message: "Password must contain at least one number" })
    .regex(/[\W_]/, {
      message: "Password must contain at least one special character",
    }),
});

export const registerSellerSchema = z
  .object({
    name: z
      .string()
      .min(2, { message: "Name must be at least 2 characters" })
      .max(50, { message: "Name must be at most 50 characters" })
      .regex(/^[a-zA-Z\s]+$/, {
        message: "Name can only contain letters and spaces",
      })
      .transform((name) => name.trim()),

    email: z
      .email({ message: "Invalid email address" })
      .min(1, { message: "Email is required" }),

    password: z
      .string()
      .min(8, { message: "Password must be at least 8 characters" })
      .max(128, { message: "Password must be at most 128 characters" })
      .regex(/[A-Z]/, {
        message: "Password must contain at least one uppercase letter",
      })
      .regex(/[a-z]/, {
        message: "Password must contain at least one lowercase letter",
      })
      .regex(/[0-9]/, { message: "Password must contain at least one number" })
      .regex(/[\W_]/, {
        message: "Password must contain at least one special character",
      }),

    confirmPassword: z.string().min(1, { message: "Please confirm your password" }),

    businessName: z
      .string()
      .min(2, { message: "Business name must be at least 2 characters" })
      .max(255, { message: "Business name must be at most 255 characters" }),

    phone: z.string().max(20).optional(),
    taxId: z.string().max(50).optional(),
    address: z.string().optional(),
    businessType: z.enum(["individual", "partnership", "llc", "corporation"]).optional(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

export type SignInPayload = z.infer<typeof signInSchema>;
export type SignUpPayload = z.infer<typeof signUpSchema>;
export type RegisterSellerPayload = z.infer<typeof registerSellerSchema>;

export interface AuthUser {
  userId: string;
  name: string;
  email: string;
  roles: string[];
  permissions: string[];
}

export interface AuthResponse {
  message: string;
  accessToken: string;
  data: AuthUser;
}
