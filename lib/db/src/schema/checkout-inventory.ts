import { pgTable, integer, text } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

// Sandbox inventory is deliberately separate from any future live catalog.
export const checkoutInventory = pgTable("sandbox_checkout_inventory", {
  id: integer("id").primaryKey(),
  name: text("name").notNull(),
  priceCents: integer("price_cents").notNull(),
  available: integer("available").notNull(),
});
export const insertCheckoutInventorySchema = createInsertSchema(checkoutInventory);
export type CheckoutInventory = typeof checkoutInventory.$inferSelect;
export type InsertCheckoutInventory = typeof checkoutInventory.$inferInsert;