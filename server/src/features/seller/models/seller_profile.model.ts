import { pgTable, uuid, varchar, text, timestamp } from "drizzle-orm/pg-core";
import { pgEnum } from "drizzle-orm/pg-core";
import { users } from "../../auth/models";

export const sellerStatusEnum = pgEnum("status", ["pending", "approved", "rejected"]);
export const businessTypeEnum = pgEnum("business_type", ["individual", "partnership", "llc", "corporation"]);

export const sellerProfiles = pgTable("seller_profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  userId: uuid("user_id").notNull().references(() => users.id),
  businessName: varchar("business_name", { length: 255 }).notNull(),
  phone: varchar("phone", { length: 20 }),
  taxId: varchar("tax_id", { length: 50 }),
  address: text("address"),
  businessType: businessTypeEnum("business_type"),
  status: sellerStatusEnum("status").default("pending").notNull(),
  rejectionReason: text("rejection_reason"),
  rejectedAt: timestamp("rejected_at"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});
