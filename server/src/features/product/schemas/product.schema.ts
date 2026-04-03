import { z } from "zod";

const stringSchema = z.string().min(1);
const uuidSchema = z.uuid();
const stringArraySchema = z.array(z.string()).default([]);

export const createProductSchema = z.object({
  name: z
    .string()
    .min(2, { message: "Name must be at least 2 characters" })
    .max(255, { message: "Name must be at most 255 characters" }),

  description: z
    .string()
    .min(10, { message: "Description must be at least 10 characters" })
    .max(5000, { message: "Description must be at most 5000 characters" }),

  price: z
    .string()
    .min(1, { message: "Price is required" })
    .regex(/^\d+(\.\d{1,2})?$/, {
      message: "Price must be a valid number with up to 2 decimal places",
    }),

  originalPrice: z
    .string()
    .regex(/^\d+(\.\d{1,2})?$/, {
      message:
        "Original price must be a valid number with up to 2 decimal places",
    })
    .optional(),

  categoryId: uuidSchema,

  images: z
    .array(z.url())
    .min(1, { message: "At least one image is required" }),

  stock: z.number().int().min(0, { message: "Stock must be at least 0" }),

  tags: z.array(z.string()).default([]),

  isFeatured: z.boolean().default(false),
});

export const updateProductSchema = createProductSchema.partial();


export const getProductsQuerySchema = z.object({
  category: z.string().trim().min(1).optional(),

  seller: z.string().trim().min(1).optional(),

  featured: z.enum(["true", "false"]).optional(),

  search: z.string().trim().min(1).optional(),

  page: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((val) => val > 0, {
      message: "Page must be greater than 0",
    })
    .optional(),

  limit: z
    .string()
    .regex(/^\d+$/)
    .transform(Number)
    .refine((val) => val > 0 && val <= 100, {
      message: "Limit must be between 1 and 100",
    })
    .optional(),
}).strict(); // strict() -> Reject any extra fields not defined in the schema 

export type CreateProductPayload = z.infer<typeof createProductSchema>;
export type UpdateProductPayload = z.infer<typeof updateProductSchema>;
export type GetProductsPayload = z.infer<typeof getProductsQuerySchema>
