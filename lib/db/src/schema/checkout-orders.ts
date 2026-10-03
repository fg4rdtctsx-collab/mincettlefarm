import { pgTable, text, integer, boolean, jsonb, timestamp } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";

export type PaymentState = "creating" | "pending" | "paying" | "paid" | "expired" | "failed" | "review";
export const checkoutOrders = pgTable("sandbox_checkout_orders", {
  id: text("id").primaryKey(),
  idempotencyKey: text("idempotency_key").notNull().unique(),
  fingerprint: text("fingerprint").notNull(),
  accessHash: text("access_hash").notNull(),
  buyer: jsonb("buyer").$type<{ name: string; email: string; phone: string }>().notNull(),
  lines: jsonb("lines").$type<{ id: number; name: string; qty: number; unitPrice: number }[]>().notNull(),
  totalCents: integer("total_cents").notNull(),
  status: text("status").$type<PaymentState>().notNull().default("creating"),
  trackId: text("track_id").unique(),
  paymentUrl: text("payment_url"),
  message: text("message").notNull().default("Creating your sandbox invoice."),
  // Deduction on reservation; paid commits it. Expired/failed releases once.
  released: boolean("released").notNull().default(false),
  expiresAt: timestamp("expires_at", { withTimezone: true }).notNull(),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
  checkedAt: timestamp("checked_at", { withTimezone: true }),
  paymentMethod: text("payment_method").$type<"crypto" | "bank">().notNull().default("crypto"),
  fulfilledAt: timestamp("fulfilled_at", { withTimezone: true }),
  paidAt: timestamp("paid_at", { withTimezone: true }),
});
export const insertCheckoutOrderSchema = createInsertSchema(checkoutOrders);
export type CheckoutOrder = typeof checkoutOrders.$inferSelect;
export type InsertCheckoutOrder = typeof checkoutOrders.$inferInsert;