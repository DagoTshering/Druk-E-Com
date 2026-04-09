import { pgTable, uuid, varchar, integer, decimal, jsonb, boolean, timestamp, text } from "drizzle-orm/pg-core";
import { products } from "./product.model";

export const productVariants = pgTable("product_variants", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  attributes: jsonb("attributes").notNull().default({}),
  sku: varchar("sku", { length: 100 }).unique(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  stock: integer("stock").notNull().default(0),
  weight: decimal("weight", { precision: 10, scale: 2 }),
  images: text("images").array().default([]),
  isDefault: boolean("is_default").default(false),
  isActive: boolean("is_active").default(true),
  lowStockThreshold: integer("low_stock_threshold").default(5),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
