import { createHash, createHmac, timingSafeEqual } from "node:crypto";
import { Buffer } from "node:buffer";

export class CheckoutError extends Error {
  constructor(public statusCode: number, message: string) { super(message); }
}
export const sha256 = (value: string) => createHash("sha256").update(value).digest("hex");
export function accessToken(id: string): string {
  const secret = process.env.SESSION_SECRET;
  if (!secret) throw new CheckoutError(503, "Checkout security configuration is missing.");
  const namespace = process.env.CHECKOUT_LIVE_ENABLED === "true" ? "live-order" : "sandbox-order";
  return createHmac("sha256", secret).update(`${namespace}:${id}`).digest("hex");
}
export function verifySignature(raw: Buffer, signature: string | undefined, secret: string): boolean {
  if (!signature || !/^[a-f\d]{128}$/i.test(signature)) return false;
  const expected = createHmac("sha512", secret).update(raw).digest();
  return timingSafeEqual(expected, Buffer.from(signature, "hex"));
}
export function safeEqual(a: string, b: string): boolean {
  return a.length === b.length && timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
export type Invoice = { track_id: string; payment_url: string; expired_at: number };
export type PaymentInfo = { track_id: string; order_id: string; amount: number; currency: string; status: string; type: string };

export async function oxapay<T>(path: string, body?: Record<string, unknown>): Promise<T> {
  const key = process.env.OXAPAY_MERCHANT_API_KEY;
  if (!key) throw new CheckoutError(503, "OxaPay merchant configuration is missing.");
  let response: Response;
  try {
    response = await fetch(`https://api.oxapay.com/v1/payment/${path}`, {
      method: body ? "POST" : "GET",
      headers: { merchant_api_key: key, "Content-Type": "application/json" },
      body: body ? JSON.stringify(body) : undefined,
      signal: AbortSignal.timeout(15000),
      redirect: "error",
    });
  } catch {
    // Never log the request, response payload or credentials.
    throw new CheckoutError(502, "OxaPay did not respond. Invoice creation may have succeeded; do not submit a new order.");
  }
  let result: { status?: number; data?: T };
  try { result = await response.json() as { status?: number; data?: T }; }
  catch { throw new CheckoutError(502, "OxaPay returned an unreadable response."); }
  if (!response.ok || result.status !== 200 || !result.data) {
    const rejected = response.status >= 400 && response.status < 500;
    throw new CheckoutError(rejected ? 424 : 502, rejected
      ? "OxaPay rejected the invoice. Check the merchant key and merchant settings."
      : "OxaPay could not confirm the request. Keep this receipt for review.");
  }
  return result.data;
}
export function securePaymentUrl(value: string): string {
  let url: URL;
  try { url = new URL(value); } catch { throw new CheckoutError(502, "OxaPay returned an invalid payment link."); }
  if (url.hostname !== "pay.oxapay.com" || url.username || url.password || url.port || !["https:", "http:"].includes(url.protocol)) {
    throw new CheckoutError(502, "OxaPay returned an unexpected payment link.");
  }
  // Official examples use http; upgrade to HTTPS before exposing to buyers.
  url.protocol = "https:";
  return url.href;
}