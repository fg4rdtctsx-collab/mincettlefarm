import { randomUUID } from "node:crypto";
import { db, checkoutInventory, checkoutOrders, type CheckoutOrder } from "@workspace/db";
import { and, eq, sql } from "drizzle-orm";
import { type OrderInput, type OrderReceipt } from "@workspace/api-zod";
import catalog from "../../../mini-cattle-farm/src/data/catalog.json";
import { accessToken, CheckoutError, oxapay, safeEqual, securePaymentUrl, sha256, type Invoice, type PaymentInfo } from "./oxapay";

export function sandboxOrigin(): string | null {
  const explicit = process.env.MCF_SANDBOX_PUBLIC_URL;
  if (explicit) {
    if (process.env.CHECKOUT_SANDBOX_ENABLED !== "true" && process.env.CHECKOUT_LIVE_ENABLED !== "true") return null;
    if (process.env.CHECKOUT_SANDBOX_ENABLED === "true" && process.env.CHECKOUT_LIVE_ENABLED === "true") return null;
    try {
      const url = new URL(explicit);
      if (url.protocol !== "https:" || url.username || url.password || url.port || url.search || url.hash ||
        !url.hostname.includes(".") || /^(localhost|127\.|0\.|10\.|192\.168\.)/.test(url.hostname)) return null;
      return url.href.replace(/\/$/, "");
    } catch { return null; }
  }
  // Development origin only. Published URLs must be obtained/configured explicitly.
  if (process.env.NODE_ENV !== "development") return null;
  const domain = process.env.REPLIT_DEV_DOMAIN;
  if (!domain || !/^[a-z\d.-]+\.replit\.dev$/i.test(domain)) return null;
  return `https://${domain}`;
}
export function sandboxCallbackUrl(): string | null {
  const explicit = process.env.MCF_SANDBOX_CALLBACK_URL;
  if (explicit) {
    try {
      const url = new URL(explicit);
      if (url.protocol !== "https:" || url.username || url.password || url.port || url.search || url.hash ||
        !url.hostname.includes(".") || /^(localhost|127\.|0\.|10\.|192\.168\.)/.test(url.hostname)) return null;
      return url.href;
    } catch { return null; }
  }
  // Published frontend and API may be on different hosts: never infer the
  // callback from an explicitly configured static frontend.
  if (process.env.MCF_SANDBOX_PUBLIC_URL) return null;
  const origin = sandboxOrigin();
  return origin ? `${origin}/api/payments/oxapay/callback` : null;
}
export const checkoutAvailable = () => Boolean(sandboxOrigin() && sandboxCallbackUrl() && process.env.OXAPAY_MERCHANT_API_KEY && process.env.SESSION_SECRET);
export const checkoutIsSandbox = () => process.env.CHECKOUT_LIVE_ENABLED !== "true";

export async function seedSandboxInventory() {
  // Live inventory is explicitly approved and provisioned separately. Never
  // turn artificial test quantities into livestock available for purchase.
  if (!checkoutIsSandbox()) return;
  const rows = catalog.products.map(p => ({
    id: p.id, name: p.name, priceCents: Math.round(p.price * 100),
    available: p.inStock ? 10 : 0, // artificial test stock, NOT real herd quantities
  }));
  if (rows.length) await db.insert(checkoutInventory).values(rows).onConflictDoNothing();
}
export function receipt(o: CheckoutOrder): OrderReceipt {
  const bankEmailUrl = o.paymentMethod === "bank" ? `mailto:salesminicattlefarm@gmail.com?${new URLSearchParams({
    subject: `Bank transfer arrangement — Mini Cattle Farm order ${o.id}`,
    body: `Hello Mini Cattle Farm,\n\nPlease confirm availability and provide bank transfer instructions for order ${o.id}.\n\nName: ${o.buyer.name}\nEmail: ${o.buyer.email}\nPhone: ${o.buyer.phone}\n\n${o.lines.map(l => `${l.name} × ${l.qty}: $${(l.unitPrice * l.qty).toFixed(2)}`).join("\n")}\nTotal: $${(o.totalCents / 100).toFixed(2)} USD\n\nI understand that this request is not a payment confirmation or stock reservation.`,
  }).toString().replace(/\+/g, "%20")}` : null;
  return {
    id: o.id, status: o.status, total: o.totalCents / 100, currency: "USD", sandbox: checkoutIsSandbox(),
    lines: o.lines, paymentUrl: o.paymentUrl, trackId: o.trackId,
    expiresAt: o.expiresAt.toISOString(), createdAt: o.createdAt.toISOString(), message: o.message,
    paymentMethod: o.paymentMethod, bankEmailUrl,
    fulfilledAt: o.fulfilledAt?.toISOString() ?? null, paidAt: o.paidAt?.toISOString() ?? null,
  };
}
export async function readPrivateOrder(id: string, token: string) {
  const [order] = await db.select().from(checkoutOrders).where(eq(checkoutOrders.id, id));
  if (!order || !safeEqual(order.accessHash, sha256(token))) throw new CheckoutError(404, "Order not found or private access link is invalid.");
  return order;
}
function canonical(input: OrderInput) {
  return {
    buyer: { name: input.buyer.name.trim(), email: input.buyer.email.trim().toLowerCase(), phone: input.buyer.phone.trim() },
    lines: [...input.lines].sort((a, b) => a.id - b.id),
    // Preserve old crypto fingerprints so retries of existing invoices remain safe.
    ...(input.paymentMethod === "bank" ? { paymentMethod: "bank" } : {}),
  };
}
export async function createSandboxOrder(input: OrderInput) {
  const bank = input.paymentMethod === "bank";
  if (bank ? !sandboxOrigin() || !process.env.SESSION_SECRET : !checkoutAvailable()) throw new CheckoutError(503, "Checkout is unavailable. Payment configuration must be completed.");
  const clean = canonical(input);
  if (clean.buyer.name.length < 2 || clean.buyer.phone.length < 5 || new Set(clean.lines.map(l => l.id)).size !== clean.lines.length) {
    throw new CheckoutError(400, "Provide valid buyer details and one line per product.");
  }
  const fingerprint = sha256(JSON.stringify(clean));
  const id = randomUUID();
  // Serialise identical requests across server processes, not just double clicks.
  const created = await db.transaction(async tx => {
    await tx.execute(sql`select pg_advisory_xact_lock(hashtext(${input.idempotencyKey}))`);
    const [existing] = await tx.select().from(checkoutOrders).where(eq(checkoutOrders.idempotencyKey, input.idempotencyKey));
    if (existing) {
      if (existing.fingerprint !== fingerprint) throw new CheckoutError(409, "This checkout request has already been used with different details.");
      return { order: existing, fresh: false };
    }
    const lines = [];
    let totalCents = 0;
    for (const line of clean.lines) {
      const [p] = await tx.select().from(checkoutInventory).where(eq(checkoutInventory.id, line.id)).for("update");
      if (!p || !p.active || p.priceCents <= 0) throw new CheckoutError(409, "An item is no longer listed. Edit your cart.");
      if (!bank && p.available < line.qty) throw new CheckoutError(409, `${p.name} is sold out or temporarily reserved by another checkout. Please contact the farm or edit your cart.`);
      if (!bank) await tx.update(checkoutInventory).set({ available: p.available - line.qty }).where(eq(checkoutInventory.id, p.id));
      lines.push({ id: p.id, name: p.name, qty: line.qty, unitPrice: p.priceCents / 100 });
      totalCents += p.priceCents * line.qty;
    }
    const [order] = await tx.insert(checkoutOrders).values({
      id, idempotencyKey: input.idempotencyKey, fingerprint, accessHash: sha256(accessToken(id)),
      buyer: clean.buyer, lines, totalCents, expiresAt: new Date(Date.now() + 30 * 60000),
      paymentMethod: bank ? "bank" : "crypto",
      ...(bank ? { status: "pending" as const, released: true, message: "Bank transfer request recorded. Email salesminicattlefarm@gmail.com to confirm availability and arrange payment. No payment is confirmed and no stock is reserved. Bank confirmation may take longer during busy periods." } : {}),
    }).returning();
    return { order, fresh: true };
  });
  if (!created.fresh || bank) return { order: receipt(created.order), accessToken: accessToken(created.order.id) };
  const origin = sandboxOrigin()!;
  try {
    const invoice = await oxapay<Invoice>("invoice", {
      amount: created.order.totalCents / 100, currency: "USD", lifetime: 30,
      order_id: id, callback_url: sandboxCallbackUrl()!,
      return_url: `${origin}/order/${id}#access=${accessToken(id)}`,
      // Never live, never change merchant coin/fee/settlement settings implicitly.
      sandbox: checkoutIsSandbox(), description: `Mini Cattle Farm ${checkoutIsSandbox() ? "SANDBOX " : ""}order ${id}`,
    });
    if (!invoice.track_id || !Number.isFinite(invoice.expired_at)) throw new CheckoutError(502, "OxaPay returned an incomplete invoice.");
    const paymentUrl = securePaymentUrl(invoice.payment_url);
    const [updated] = await db.update(checkoutOrders).set({
      trackId: String(invoice.track_id), paymentUrl, expiresAt: new Date(invoice.expired_at * 1000),
    }).where(eq(checkoutOrders.id, id)).returning();
    // Callback may have arrived before invoice response; never overwrite paid.
    await db.update(checkoutOrders).set({ status: "pending", message: checkoutIsSandbox()
      ? "Sandbox invoice ready. No real funds or livestock orders are accepted."
      : "Invoice ready. Payment must be confirmed by OxaPay before fulfillment." })
      .where(and(eq(checkoutOrders.id, id), eq(checkoutOrders.status, "creating")));
    const [ready] = await db.select().from(checkoutOrders).where(eq(checkoutOrders.id, updated.id));
    return { order: receipt(ready), accessToken: accessToken(id) };
  } catch (error) {
    const definitive = error instanceof CheckoutError && error.statusCode === 424;
    await db.transaction(async tx => {
      const [o] = await tx.select().from(checkoutOrders).where(eq(checkoutOrders.id, id)).for("update");
      if (o.status !== "creating") return;
      if (definitive && !o.released) for (const line of o.lines) {
        await tx.update(checkoutInventory).set({ available: sql`${checkoutInventory.available} + ${line.qty}` }).where(eq(checkoutInventory.id, line.id));
      }
      await tx.update(checkoutOrders).set({
        status: definitive ? "failed" : "review", released: definitive,
        message: definitive ? "OxaPay rejected this invoice. No payment was accepted."
          : "Invoice creation could not be confirmed. Do not start another payment; retain this receipt for owner review.",
      }).where(eq(checkoutOrders.id, id));
    });
    const [order] = await db.select().from(checkoutOrders).where(eq(checkoutOrders.id, id));
    // Return the durable receipt even on ambiguous network errors.
    return { order: receipt(order), accessToken: accessToken(id) };
  }
}

export function validatePayment(order: CheckoutOrder, info: PaymentInfo): void {
  if (order.paymentMethod === "bank" || String(info.order_id) !== order.id || (order.trackId && String(info.track_id) !== order.trackId) ||
    !info.track_id || info.type !== "invoice" || info.currency !== "USD" ||
    !Number.isFinite(Number(info.amount)) || Math.abs(Number(info.amount) * 100 - order.totalCents) > 0.001) {
    throw new CheckoutError(409, "Invoice association, amount or currency does not match the order.");
  }
}
export async function applyPayment(id: string, info: PaymentInfo) {
  await db.transaction(async tx => {
    const [o] = await tx.select().from(checkoutOrders).where(eq(checkoutOrders.id, id)).for("update");
    if (!o) throw new CheckoutError(404, "Unknown order.");
    validatePayment(o, info);
    if (o.status === "paid") return; // paid is irreversible, repeated/out-of-order events safe
    const status = info.status.toLowerCase();
    let next: CheckoutOrder["status"];
    if (status === "paid") next = o.released ? "review" : "paid";
    else if (o.released) return;
    else if (status === "expired" || status === "failed") next = status;
    else if (status === "paying") next = "paying";
    else if (["new", "waiting", "pending"].includes(status)) next = o.status === "paying" ? "paying" : "pending";
    else throw new CheckoutError(409, "Unrecognized OxaPay payment status.");
    const release = (next === "expired" || next === "failed") && !o.released;
    if (release) for (const line of [...o.lines].sort((a, b) => a.id - b.id)) {
      await tx.update(checkoutInventory).set({ available: sql`${checkoutInventory.available} + ${line.qty}` }).where(eq(checkoutInventory.id, line.id));
    }
    const messages = {
      paid: checkoutIsSandbox()
        ? "Sandbox payment confirmed by OxaPay. This is a test, not a real order for fulfillment."
        : "Payment confirmed by OxaPay. The farm will contact you to arrange fulfillment.",
      paying: "OxaPay is awaiting network confirmation. Payment is not confirmed.",
      pending: "Awaiting payment. Returning to this page is not proof of payment.",
      expired: "OxaPay reports this invoice expired. Stock reservation released.",
      failed: "OxaPay reports this payment failed. Stock reservation released.",
      review: "A payment arrived after stock was released. Owner review is required; do not fulfill automatically.",
    };
    await tx.update(checkoutOrders).set({
      trackId: String(info.track_id), status: next, released: o.released || release,
      message: messages[next], checkedAt: new Date(),
      ...(next === "paid" ? { paidAt: new Date() } : {}),
    }).where(eq(checkoutOrders.id, id));
  });
}
export async function reconcile(order: CheckoutOrder): Promise<CheckoutOrder> {
  if (!order.trackId || ["paid", "expired", "failed"].includes(order.status)) return order;
  // Atomically rate-limit remote lookups across clients and server processes.
  const claimed = await db.update(checkoutOrders).set({ checkedAt: new Date() }).where(and(
    eq(checkoutOrders.id, order.id),
    sql`(${checkoutOrders.checkedAt} is null or ${checkoutOrders.checkedAt} < now() - interval '8 seconds')`,
  )).returning();
  if (claimed.length) {
    const info = await oxapay<PaymentInfo>(encodeURIComponent(order.trackId));
    await applyPayment(order.id, info);
  }
  const [fresh] = await db.select().from(checkoutOrders).where(eq(checkoutOrders.id, order.id));
  return fresh;
}

// Reconcile abandoned invoices too: inventory must not depend on a customer
// keeping their receipt open. Expiration is always verified with OxaPay.
export async function reconcileAbandonedOrders() {
  await db.update(checkoutOrders).set({
    status: "review",
    message: "Invoice creation was interrupted. Keep this receipt for owner review; do not make a second payment.",
  }).where(and(
    eq(checkoutOrders.status, "creating"),
    sql`${checkoutOrders.trackId} is null and ${checkoutOrders.createdAt} < now() - interval '1 minute'`,
  ));
  const waiting = await db.select().from(checkoutOrders).where(sql`
    ${checkoutOrders.trackId} is not null
    and ${checkoutOrders.released} = false
    and ${checkoutOrders.status} in ('pending', 'paying', 'review')
    and (${checkoutOrders.checkedAt} is null or ${checkoutOrders.checkedAt} < now() - interval '30 seconds')
  `).orderBy(sql`${checkoutOrders.checkedAt} asc nulls first`).limit(5);
  await Promise.all(waiting.map(reconcile));
}