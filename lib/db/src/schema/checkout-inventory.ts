import { pgTable, integer, text, jsonb, boolean } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Sandbox inventory is deliberately separate from any future live catalog.
export const checkoutInventory = pgTable("sandbox_checkout_inventory", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  priceCents: integer("price_cents").notNull(),
  available: integer("available").notNull(),
  metadata: jsonb("metadata").$type<{ slug?: string; category?: string; description?: string; images?: string[] }>().notNull().default({}),
  active: boolean("active").notNull().default(true),
  version: integer("version").notNull().default(0),
});
export const insertCheckoutInventorySchema = createInsertSchema(checkoutInventory);
export type CheckoutInventory = typeof checkoutInventory.$inferSelect;
export type InsertCheckoutInventory = typeof checkoutInventory.$inferInsert;