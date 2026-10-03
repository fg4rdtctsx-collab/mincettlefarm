import { drizzle } from 'drizzle-orm/postgres-js';
import postgres from 'postgres';
import { pgTable, integer, text, boolean, jsonb, timestamp } from 'drizzle-orm/pg-core';

// Field names match the existing checkout engine and the migration exactly.
export const checkoutInventory = pgTable('sandbox_checkout_inventory', {
  id: integer('id').primaryKey(), name: text('name').notNull(),
  priceCents: integer('price_cents').notNull(), available: integer('available').notNull(),
});
export const checkoutOrders = pgTable('sandbox_checkout_orders', {
  id: text('id').primaryKey(), idempotencyKey: text('idempotency_key').notNull().unique(),
  fingerprint: text('fingerprint').notNull(), accessHash: text('access_hash').notNull(),
  buyer: jsonb('buyer').notNull(), lines: jsonb('lines').notNull(),
  totalCents: integer('total_cents').notNull(), status: text('status').notNull().default('creating'),
  trackId: text('track_id').unique(), paymentUrl: text('payment_url'),
  message: text('message').notNull().default('Creating your sandbox invoice.'),
  released: boolean('released').notNull().default(false),
  expiresAt: timestamp('expires_at', { withTimezone: true }).notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).notNull().defaultNow(),
  checkedAt: timestamp('checked_at', { withTimezone: true }),
});
const connectionString = Deno.env.get('CHECKOUT_DATABASE_URL') || Deno.env.get('SUPABASE_DB_URL');
if (!connectionString) throw new Error('Supabase database configuration is missing.');
// Transaction-pooler-compatible; keep edge instances from exhausting Postgres.
const client = postgres(connectionString, {
  prepare: false, max: 1, idle_timeout: 20, connect_timeout: 10,
  ssl: { rejectUnauthorized: true },
});
export const db = drizzle(client);