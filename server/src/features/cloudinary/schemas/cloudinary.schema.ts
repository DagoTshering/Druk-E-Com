import { z } from "zod";

export const cloudinaryTypeSchema = z.enum(["product", "avatar"]);

export const cloudinaryQuerySchema = z.object({
  type: cloudinaryTypeSchema,
});

export const cloudinaryUploadSchema = z.object({
  query: cloudinaryQuerySchema,
});

export type CloudinaryType = z.infer<typeof cloudinaryTypeSchema>;
