import { db, checkoutInventory, checkoutOrders, type CheckoutInventory } from "@workspace/db";
import { eq, sql, type SQL } from "drizzle-orm";
import { type LivestockInput, type LivestockUpdate, type OwnerLivestock } from "@workspace/api-zod";
import catalog from "../../../mini-cattle-farm/src/data/catalog.json";
import { checkoutIsSandbox, receipt } from "./checkout";
import { CheckoutError } from "./oxapay";

const prefix = () => checkoutIsSandbox() ? "sandbox_checkout" : "live_checkout";
const categorySlugs = new Set(catalog.products.flatMap(p => p.categories.map(c => c.slug)));
type Executor = Pick<typeof db, "execute">;
// Node uses node-postgres; the Supabase bundle uses postgres-js.
async function executeRows(executor: Executor, statement: SQL): Promise<Record<string, unknown>[]> {
  const result = await executor.execute(statement);
  return Array.isArray(result) ? result : result.rows;
}

async function reservedUnits(executor: Executor, id: number): Promise<number> {
  const rows = await executeRows(executor, sql`
    select coalesce(sum((line->>'qty')::integer),0) as qty
    from ${checkoutOrders}, jsonb_array_elements(${checkoutOrders.lines}) as line
    where ${checkoutOrders.released}=false and ${checkoutOrders.status} not in ('paid','expired','failed')
    and (line->>'id')::integer=${id}
  `);
  return Number(rows[0]?.qty ?? 0);
}

export function livestockDTO(p: CheckoutInventory, reserved = 0): OwnerLivestock {
  const original = catalog.products.find(c => c.id === p.id);
  return {
    id: p.id, name: p.name, price: p.priceCents / 100, available: p.available,
    reserved, stock: p.available + reserved, active: p.active, version: p.version,
    slug: p.metadata.slug ?? original?.slug ?? `animal-${p.id}`,
    category: p.metadata.category ?? original?.categories[0]?.slug ?? "",
    description: p.metadata.description ?? original?.description ?? "",
    images: p.metadata.images ?? original?.images ?? [],
  };
}

export async function ownerInventory() {
  const products = await db.select().from(checkoutInventory).orderBy(checkoutInventory.id);
  // Query reservations together rather than one DB round trip per listing.
  const rows = await executeRows(db, sql`
    select (line->>'id')::integer as id, sum((line->>'qty')::integer) as qty
    from ${checkoutOrders}, jsonb_array_elements(${checkoutOrders.lines}) as line
    where ${checkoutOrders.released}=false and ${checkoutOrders.status} not in ('paid','expired','failed')
    group by (line->>'id')::integer
  `);
  const reservations = new Map(rows.map(r => [Number(r.id), Number(r.qty)]));
  return products.map(p => livestockDTO(p, reservations.get(p.id) ?? 0));
}

export async function publicInventory() {
  const originalIds = new Set(catalog.products.map(p => p.id));
  return (await ownerInventory())
    .filter(p => p.active || originalIds.has(p.id))
    .map(({ stock, version, ...p }) => p);
}

function cleanLivestock(input: LivestockInput) {
  const name = input.name.trim();
  const priceCents = Math.round(input.price * 100);
  if (!name || !Number.isSafeInteger(priceCents) || priceCents < 1 || !categorySlugs.has(input.category)) {
    throw new CheckoutError(400, "Provide a name, valid price and one of the farm's livestock categories.");
  }
  for (const image of input.images) {
    // Preserve existing source photos; newly entered external photo URLs must use HTTPS.
    if (/^\/?(?:assets|family-assets)\/[^?#]+\.(?:jpe?g|png|webp)$/i.test(image) && !image.split("/").includes("..")) continue;
    let url: URL;
    try { url = new URL(image); } catch { throw new CheckoutError(400, "Use uploaded photos or valid HTTPS image URLs."); }
    if (url.protocol !== "https:" || url.username || url.password || url.hash) throw new CheckoutError(400, "Use valid HTTPS image URLs.");
  }
  return { name, priceCents, metadata: {
    category: input.category, description: input.description.trim(), images: input.images,
  }};
}

export async function createLivestock(input: LivestockInput) {
  const clean = cleanLivestock(input);
  const rows = await executeRows(db, sql`
    insert into ${checkoutInventory} (name,price_cents,available,metadata,active,version)
    values (${clean.name},${clean.priceCents},${input.stock},${JSON.stringify(clean.metadata)}::jsonb,${input.active !== false},0)
    returning id
  `);
  const id = Number(rows[0]?.id);
  const slug = `${clean.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "animal"}-${id}`;
  const [p] = await db.update(checkoutInventory).set({ metadata: { ...clean.metadata, slug } }).where(eq(checkoutInventory.id, id)).returning();
  return livestockDTO(p);
}

export async function updateLivestock(id: number, input: LivestockUpdate) {
  const clean = cleanLivestock(input);
  return db.transaction(async tx => {
    const [p] = await tx.select().from(checkoutInventory).where(eq(checkoutInventory.id, id)).for("update");
    if (!p) throw new CheckoutError(404, "Animal not found.");
    if (p.version !== input.version) throw new CheckoutError(409, "This listing was changed by another admin. Refresh it before saving.");
    const reserved = await reservedUnits(tx, id);
    if (p.available + reserved !== input.expectedStock) throw new CheckoutError(409, "Stock changed since this listing was opened. Refresh before saving to avoid overwriting a sale.");
    if (input.stock < reserved) throw new CheckoutError(409, `There are ${reserved} reserved units. Unsold stock cannot be less than this.`);
    if (!input.active && reserved) throw new CheckoutError(409, "An animal with an active checkout reservation cannot be archived.");
    const [updated] = await tx.update(checkoutInventory).set({
      ...clean, metadata: { ...p.metadata, ...clean.metadata }, available: input.stock - reserved,
      active: input.active, version: p.version + 1,
    }).where(eq(checkoutInventory.id, id)).returning();
    return livestockDTO(updated, reserved);
  });
}

export async function archiveLivestock(id: number, version: number) {
  return db.transaction(async tx => {
    const [p] = await tx.select().from(checkoutInventory).where(eq(checkoutInventory.id, id)).for("update");
    if (!p) throw new CheckoutError(404, "Animal not found.");
    if (p.version !== version) throw new CheckoutError(409, "This listing changed. Refresh before archiving.");
    if (await reservedUnits(tx, id)) throw new CheckoutError(409, "Wait until this animal's active checkout reservation is resolved.");
    const [updated] = await tx.update(checkoutInventory).set({ active: false, version: p.version + 1 }).where(eq(checkoutInventory.id, id)).returning();
    return livestockDTO(updated);
  });
}

export async function ownerOrderAction(id: string, action: "confirm_bank" | "cancel_bank" | "fulfill") {
  return db.transaction(async tx => {
    const [order] = await tx.select().from(checkoutOrders).where(eq(checkoutOrders.id, id)).for("update");
    if (!order) throw new CheckoutError(404, "Order not found.");
    if (action === "fulfill") {
      if (order.status !== "paid") throw new CheckoutError(409, "Only paid orders can be fulfilled.");
      if (order.fulfilledAt) return receipt(order);
      const [updated] = await tx.update(checkoutOrders).set({ fulfilledAt: new Date() }).where(eq(checkoutOrders.id, id)).returning();
      return receipt(updated);
    }
    if (order.paymentMethod !== "bank") throw new CheckoutError(409, "Crypto payment status can only be confirmed by OxaPay.");
    if (action === "confirm_bank" && order.status === "paid") return receipt(order);
    if (action === "cancel_bank" && order.status === "failed") return receipt(order);
    if (order.status !== "pending" || !order.released) throw new CheckoutError(409, "Only unpaid bank requests can be confirmed or cancelled.");
    if (action === "confirm_bank") {
      for (const line of [...order.lines].sort((a, b) => a.id - b.id)) {
        const [p] = await tx.select().from(checkoutInventory).where(eq(checkoutInventory.id, line.id)).for("update");
        if (!p?.active || p.available < line.qty) throw new CheckoutError(409, `${line.name} is unavailable or reserved. Resolve availability with the buyer before confirming.`);
        await tx.update(checkoutInventory).set({ available: p.available - line.qty }).where(eq(checkoutInventory.id, p.id));
      }
    }
    const [updated] = await tx.update(checkoutOrders).set(action === "confirm_bank"
      ? { status: "paid", released: false, paidAt: new Date(), message: "The farm has verified your bank transfer. Payment confirmed; the farm will arrange fulfillment." }
      : { status: "failed", message: "The farm cancelled this unpaid bank transfer request. No payment is confirmed." }
    ).where(eq(checkoutOrders.id, id)).returning();
    return receipt(updated);
  });
}

export async function ownerAnalytics(period: string, month?: string, year?: string) {
  const now = new Date();
  const parts = new Intl.DateTimeFormat("en", { timeZone: "Africa/Lagos", year: "numeric", month: "2-digit" }).formatToParts(now);
  const currentMonth = `${parts.find(p => p.type === "year")!.value}-${parts.find(p => p.type === "month")!.value}`;
  const selected = month || currentMonth;
  const y = Number(year || now.getUTCFullYear());
  if (!["daily", "monthly"].includes(period) || !/^\d{4}-(0[1-9]|1[0-2])$/.test(selected) || !Number.isInteger(y) || y < 2020 || y > 2100 || Number(selected.slice(0,4)) < 2020 || Number(selected.slice(0,4)) > 2100) {
    throw new CheckoutError(400, "Select a valid reporting month or year.");
  }
  const start = period === "daily" ? `${selected}-01` : `${y}-01-01`;
  const visits = sql.identifier(`${prefix()}_visits`);
  const settings = sql.identifier(`${prefix()}_analytics_start`);
  const step = period === "daily" ? "1 day" : "1 month";
  const span = period === "daily" ? "1 month" : "1 year";
  const trunc = period === "daily" ? "day" : "month";
  const format = period === "daily" ? "YYYY-MM-DD" : "YYYY-MM";
  const window = sql`created_at >= (${start}::timestamp at time zone 'Africa/Lagos') and created_at < ((${start}::timestamp + ${span}::interval) at time zone 'Africa/Lagos')`;
  const rows = await executeRows(db, sql`
    with buckets as (select generate_series(${start}::timestamp, ${start}::timestamp + ${span}::interval - ${step}::interval, ${step}::interval) as day),
    sales as (
      select date_trunc(${trunc}, ${checkoutOrders.paidAt} at time zone 'Africa/Lagos') as day,
      sum(${checkoutOrders.totalCents})/100.0 as revenue,count(*) as paid_orders
      from ${checkoutOrders} where ${checkoutOrders.status}='paid' and ${!checkoutIsSandbox()}
      and ${checkoutOrders.paidAt} >= (${start}::timestamp at time zone 'Africa/Lagos')
      and ${checkoutOrders.paidAt} < ((${start}::timestamp + ${span}::interval) at time zone 'Africa/Lagos')
      group by 1
    ), traffic as (
      select date_trunc(${trunc},created_at at time zone 'Africa/Lagos') as day,count(*) as page_views,count(distinct session_id) as visitors
      from public.${visits} where ${window} group by 1
    )
    select to_char(b.day,${format}) as bucket,coalesce(s.revenue,0) as revenue,coalesce(s.paid_orders,0) as paid_orders,
    coalesce(t.page_views,0) as page_views,coalesce(t.visitors,0) as visitors
    from buckets b left join sales s using(day) left join traffic t using(day) order by b.day
  `);
  const pages = await executeRows(db, sql`select path,count(*) as views from public.${visits} where ${window} group by path order by views desc,path limit 10`);
  const traffic = await executeRows(db, sql`select count(distinct session_id) as visitors from public.${visits} where ${window}`);
  const started = await executeRows(db, sql`select started_at from public.${settings} where id=1`);
  const buckets = rows.map(r => ({ bucket: String(r.bucket), revenue: Number(r.revenue), paidOrders: Number(r.paid_orders), visitors: Number(r.visitors), pageViews: Number(r.page_views) }));
  return {
    period, timezone: "Africa/Lagos", trackingStartedAt: new Date(String(started[0].started_at)).toISOString(),
    buckets, topPages: pages.map(p => ({ path: String(p.path), views: Number(p.views) })),
    totals: { bucket: period === "daily" ? selected : String(y), revenue: buckets.reduce((s,b) => s+b.revenue,0), paidOrders: buckets.reduce((s,b) => s+b.paidOrders,0), visitors: Number(traffic[0].visitors), pageViews: buckets.reduce((s,b) => s+b.pageViews,0) },
  };
}