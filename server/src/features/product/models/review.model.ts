import { pgTable, uuid, varchar, integer, text, timestamp, boolean, uniqueIndex } from "drizzle-orm/pg-core";
import { products } from "./product.model";

export const reviews = pgTable("reviews", {
  id: uuid("id").defaultRandom().primaryKey(),
  productId: uuid("product_id")
    .notNull()
    .references(() => products.id, { onDelete: "cascade" }),
  userId: uuid("user_id").notNull(),
  rating: integer("rating").notNull(),
  title: varchar("title", { length: 255 }),
  comment: text("comment"),
  isApproved: boolean("is_approved").default(true).notNull(),
  helpfulCount: integer("helpful_count").default(0).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
}, (table) => ({
  productUserUnique: uniqueIndex("product_user_unique").on(table.productId, table.userId),
}));
