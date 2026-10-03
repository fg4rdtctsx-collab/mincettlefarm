import { Router, type Request, type Response, type NextFunction } from "express";
import { getAuth } from "@clerk/express";
import { db, checkoutInventory, checkoutOrders } from "@workspace/db";
import { eq, desc } from "drizzle-orm";
import { CreateOrderBody } from "@workspace/api-zod";
import { applyPayment, checkoutAvailable, createSandboxOrder, readPrivateOrder, receipt, reconcile } from "../lib/checkout";
import { CheckoutError, oxapay, verifySignature, type PaymentInfo } from "../lib/oxapay";
import { publicInventory } from "../lib/admin";

const router = Router();
const windows = new Map<string, { count: number; end: number }>();
function throttle(req: Request, res: Response, next: NextFunction) {
  const now = Date.now();
  for (const [key, value] of windows) if (value.end < now) windows.delete(key);
  const key = req.ip ?? req.socket.remoteAddress ?? "unknown";
  const entry = windows.get(key) ?? { count: 0, end: now + 15 * 60000 };
  if (entry.count >= 15 || windows.size > 2000) { res.status(429).json({ error: "Too many checkout requests. Please wait before retrying." }); return; }
  entry.count++;
  windows.set(key, entry);
  next();
}
router.get("/checkout/config", async (_req, res) => {
  const products = await publicInventory();
  res.setHeader("Cache-Control", "no-store");
  res.json({
    available: checkoutAvailable(), sandbox: true,
    bankAvailable: Boolean(process.env.SESSION_SECRET),
    message: checkoutAvailable()
      ? "Sandbox test checkout only. Do not send real funds. Displayed stock is artificial test inventory; live prices and stock await merchant confirmation."
      : "Crypto checkout is unavailable. Live payments are disabled; merchant configuration and an approved public URL are required.",
    products,
  });
});
router.post("/orders", throttle, async (req, res) => {
  const parsed = CreateOrderBody.safeParse(req.body);
  if (!parsed.success) { res.status(400).json({ error: "Invalid buyer details, quantities or checkout request ID." }); return; }
  const session = await createSandboxOrder(parsed.data);
  res.setHeader("Cache-Control", "no-store");
  res.status(201).json(session);
});
router.get("/orders/:id", async (req, res) => {
  if (typeof req.query.token !== "string" || req.query.token.length !== 64 || typeof req.params.id !== "string") {
    res.status(404).json({ error: "Order not found or private access link is invalid." }); return;
  }
  let order = await readPrivateOrder(req.params.id, req.query.token);
  let outage = false;
  try { order = await reconcile(order); }
  catch { outage = true; req.log.warn({ orderId: order.id }, "Payment reconciliation unavailable; retaining verified state"); }
  res.setHeader("Cache-Control", "no-store");
  res.setHeader("Referrer-Policy", "no-referrer");
  res.json({ ...receipt(order), ...(outage ? { message: "Payment verification is temporarily unavailable. Last verified state shown; no new payment is confirmed. Check again shortly." } : {}) });
});
router.get("/owner/orders", async (req, res) => {
  const userId = getAuth(req).userId;
  if (!userId) { res.status(401).json({ error: "Sign in to review owner orders." }); return; }
  const owners = (process.env.OWNER_CLERK_USER_IDS ?? "").split(",").map(s => s.trim()).filter(Boolean);
  if (!owners.includes(userId)) { res.status(403).json({ error: "Owner access has not been approved for this account. Signing up does not grant owner access." }); return; }
  const orders = await db.select().from(checkoutOrders).orderBy(desc(checkoutOrders.createdAt)).limit(200);
  res.setHeader("Cache-Control", "no-store");
  res.json(orders.map(o => ({ order: receipt(o), buyer: o.buyer })));
});
export async function oxapayCallback(req: Request, res: Response) {
  const key = process.env.OXAPAY_MERCHANT_API_KEY;
  if (!key || !Buffer.isBuffer(req.body) || !verifySignature(req.body, req.get("hmac"), key)) {
    res.status(401).json({ error: "Invalid callback signature." }); return;
  }
  let payload: { order_id?: string; track_id?: string; type?: string; status?: string };
  try { payload = JSON.parse(req.body.toString("utf8")); }
  catch { res.status(400).json({ error: "Invalid callback JSON." }); return; }
  if (payload.type !== "invoice" || !payload.order_id || !payload.track_id || !/^\d+$/.test(String(payload.track_id))) {
    res.status(400).json({ error: "Invalid invoice callback." }); return;
  }
  const [order] = await db.select().from(checkoutOrders).where(eq(checkoutOrders.id, payload.order_id));
  if (!order || (order.trackId && order.trackId !== String(payload.track_id))) {
    res.status(404).json({ error: "Unknown invoice." }); return;
  }
  // Callback currency may be coin-denominated. Verify trusted invoice USD
  // details via payment-information, never treat callback/redirect as proof.
  const info = await oxapay<PaymentInfo>(encodeURIComponent(String(payload.track_id)));
  // A delayed lookup must not permanently acknowledge a Paid notification
  // before the authoritative endpoint reflects it; let OxaPay retry.
  if (payload.status?.toLowerCase() === "paid" && info.status.toLowerCase() !== "paid") {
    throw new CheckoutError(503, "Payment confirmation is not yet available. Retry this notification.");
  }
  await applyPayment(order.id, info);
  res.status(200).type("text/plain").send("ok");
}
export function checkoutErrorHandler(error: unknown, req: Request, res: Response, _next: NextFunction) {
  if (error instanceof CheckoutError) { res.status(error.statusCode).json({ error: error.message }); return; }
  req.log.error("Checkout request failed"); // intentionally no payload or error object
  res.status(500).json({ error: "The request could not be processed. Please try again later." });
}
export default router;