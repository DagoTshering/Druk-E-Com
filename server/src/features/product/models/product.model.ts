import { pgTable, uuid, varchar, timestamp, boolean, text, decimal, integer } from "drizzle-orm/pg-core";
import { categories } from "./category.model";

export const products = pgTable("products", {
  id: uuid("id").defaultRandom().primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: decimal("price", { precision: 10, scale: 2 }).notNull(),
  originalPrice: decimal("original_price", { precision: 10, scale: 2 }),
  categoryId: uuid("category_id").notNull().references(() => categories.id),
  sellerId: uuid("seller_id").notNull(),
  images: text("images").array().notNull().default([]),
  stock: integer("stock").notNull().default(0),
  rating: decimal("rating", { precision: 2, scale: 1 }).notNull().default("0"),
  reviewCount: integer("review_count").notNull().default(0),
  tags: text("tags").array().notNull().default([]),
  isActive: boolean("is_active").default(true).notNull(),
  isFeatured: boolean("is_featured").default(false).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
