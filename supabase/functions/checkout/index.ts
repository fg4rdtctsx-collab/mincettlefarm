import { Buffer } from 'node:buffer';
import { db, checkoutInventory, checkoutOrders, rateLimitTable } from '@workspace/db';
import { eq, desc, sql } from 'drizzle-orm';
import {
  CheckoutError, CreateOrderBody, applyPayment, checkoutAvailable, checkoutIsSandbox,
  createSandboxOrder, readPrivateOrder, receipt, reconcile,
  reconcileAbandonedOrders, seedSandboxInventory, oxapay, verifySignature,
  safeEqual, sha256,
} from './core.generated.js';

let seeded: Promise<void> | null = null;
const initialize = () => seeded ??= seedSandboxInventory().catch((error: unknown) => { seeded = null; throw error; });
const privateHeaders = { 'Cache-Control': 'no-store', 'Referrer-Policy': 'no-referrer' };

function allowedOrigin(): string | null {
  try { return new URL(Deno.env.get('MCF_SANDBOX_PUBLIC_URL') || '').origin; }
  catch { return null; }
}
function json(data: unknown, status = 200) {
  return Response.json(data, { status, headers: privateHeaders });
}
async function rawBody(req: Request) {
  const reader = req.body?.getReader();
  if (!reader) return new Uint8Array();
  const chunks: Uint8Array[] = [];
  let size = 0;
  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    size += value.length;
    if (size > 65536) { await reader.cancel(); throw new CheckoutError(413, 'Request is too large.'); }
    chunks.push(value);
  }
  return Buffer.concat(chunks.map(c => Buffer.from(c)));
}
async function throttle(req: Request) {
  // The global bucket also bounds abuse when client address headers are absent
  // or vary. Both counters are persistent across edge instances.
  const address = req.headers.get('x-forwarded-for')?.split(',')[0].trim() || 'unknown';
  const identity = sha256(address);
  const table = sql.identifier(rateLimitTable);
  for (const [key, maximum] of [[`ip:${identity}`, 15], ['global', 150]] as const) {
    const rows = await db.execute(sql`
      insert into public.${table} (key, window_start, requests)
      values (${key}, now(), 1)
      on conflict (key) do update set
        requests = case when ${table}.window_start < now() - interval '15 minutes' then 1 else ${table}.requests + 1 end,
        window_start = case when ${table}.window_start < now() - interval '15 minutes' then now() else ${table}.window_start end
      returning requests
    `);
    if (Number(rows[0]?.requests) > maximum) throw new CheckoutError(429, 'Too many checkout requests. Please wait before retrying.');
  }
}
async function ownerId(req: Request) {
  const bearer = req.headers.get('authorization');
  if (!bearer?.startsWith('Bearer ') || bearer.length > 8192) throw new CheckoutError(401, 'Sign in to review owner orders.');
  const project = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_ANON_KEY');
  if (!project || !key) throw new CheckoutError(503, 'Owner authentication is not configured.');
  const response = await fetch(`${project}/auth/v1/user`, {
    headers: { apikey: key, Authorization: bearer }, redirect: 'error', signal: AbortSignal.timeout(10000),
  });
  if (response.status === 401 || response.status === 403) throw new CheckoutError(401, 'Sign in to review owner orders.');
  if (!response.ok) throw new CheckoutError(503, 'Owner sign-in verification is temporarily unavailable.');
  const user = await response.json();
  const owners = (Deno.env.get('OWNER_SUPABASE_USER_IDS') || '').split(',').map(s => s.trim()).filter(Boolean);
  if (typeof user.id !== 'string' || !owners.includes(user.id)) throw new CheckoutError(403, 'Owner access has not been approved for this account. Signing up does not grant owner access.');
  return user.id;
}
async function handle(req: Request): Promise<Response> {
  const url = new URL(req.url);
  const path = url.pathname.replace(/^\/(?:functions\/v1\/)?checkout(?=\/|$)/, '');
  if (path === '/api/healthz' && req.method === 'GET') return json({ status: 'ok' });
  if (path === '/api/internal/reconcile' && req.method === 'POST') {
    const expected = Deno.env.get('MCF_RECONCILE_SECRET');
    const token = req.headers.get('authorization')?.replace(/^Bearer /, '');
    if (!expected || !token || !safeEqual(sha256(expected), sha256(token))) throw new CheckoutError(401, 'Unauthorized scheduled request.');
    await initialize();
    await reconcileAbandonedOrders();
    await db.execute(sql`delete from public.${sql.identifier(rateLimitTable)} where window_start < now() - interval '1 day'`);
    return json({ ok: true });
  }
  if (path === '/api/payments/oxapay/callback' && req.method === 'POST') {
    const bytes = Buffer.from(await rawBody(req));
    const key = Deno.env.get('OXAPAY_MERCHANT_API_KEY');
    if (!key || !verifySignature(bytes, req.headers.get('hmac') ?? undefined, key)) throw new CheckoutError(401, 'Invalid callback signature.');
    let payload;
    try { payload = JSON.parse(bytes.toString('utf8')); }
    catch { throw new CheckoutError(400, 'Invalid callback JSON.'); }
    if (payload.type !== 'invoice' || typeof payload.order_id !== 'string' || !/^\d+$/.test(String(payload.track_id))) throw new CheckoutError(400, 'Invalid invoice callback.');
    const [order] = await db.select().from(checkoutOrders).where(eq(checkoutOrders.id, payload.order_id));
    if (!order || (order.trackId && order.trackId !== String(payload.track_id))) throw new CheckoutError(404, 'Unknown invoice.');
    const info = await oxapay(encodeURIComponent(String(payload.track_id)));
    if (payload.status?.toLowerCase() === 'paid' && info.status.toLowerCase() !== 'paid') throw new CheckoutError(503, 'Payment confirmation is not yet available. Retry this notification.');
    await applyPayment(order.id, info);
    return new Response('ok', { headers: { ...privateHeaders, 'Content-Type': 'text/plain' } });
  }
  if (path === '/api/owner/orders' && req.method === 'GET') {
    await ownerId(req);
    const orders = await db.select().from(checkoutOrders).orderBy(desc(checkoutOrders.createdAt)).limit(200);
    return json(orders.map(o => ({ order: receipt(o), buyer: o.buyer })));
  }
  if (path === '/api/checkout/config' && req.method === 'GET') {
    await initialize();
    const products = await db.select().from(checkoutInventory);
    // Old cached pages explicitly describe payments as sandbox-only. Do not let
    // those pages issue real invoices during the frontend release transition.
    const compatible = checkoutIsSandbox() || req.headers.get('x-mcf-checkout-client') === 'live-v1';
    const available = checkoutAvailable() && compatible;
    return json({
      available, sandbox: checkoutIsSandbox(),
      message: !compatible ? 'Please refresh this page after the checkout update has been published.'
        : available
        ? (checkoutIsSandbox()
          ? 'Sandbox test checkout only. Do not send real funds. Displayed stock is artificial test inventory.'
          : 'Pay securely through OxaPay. Prices and availability are verified before your invoice is created.')
        : 'Crypto checkout is unavailable. Payment configuration must be completed.',
      products: products.map(p => ({ id: p.id, name: p.name, price: p.priceCents / 100, available: p.available })),
    });
  }
  if (path === '/api/orders' && req.method === 'POST') {
    if (!checkoutIsSandbox() && req.headers.get('x-mcf-checkout-client') !== 'live-v1') {
      throw new CheckoutError(409, 'Please refresh checkout to use the updated payment page.');
    }
    await throttle(req);
    let input;
    try { input = JSON.parse(Buffer.from(await rawBody(req)).toString('utf8')); }
    catch (error) {
      if (error instanceof CheckoutError) throw error;
      throw new CheckoutError(400, 'Invalid checkout request.');
    }
    const parsed = CreateOrderBody.safeParse(input);
    if (!parsed.success) throw new CheckoutError(400, 'Invalid buyer details, quantities or checkout request ID.');
    await initialize();
    return json(await createSandboxOrder(parsed.data), 201);
  }
  const match = /^\/api\/orders\/([^/]+)$/.exec(path);
  if (match && req.method === 'GET') {
    const token = url.searchParams.get('token') || '';
    if (!/^[a-f0-9]{64}$/i.test(token)) throw new CheckoutError(404, 'Order not found or private access link is invalid.');
    let order = await readPrivateOrder(match[1], token);
    let outage = false;
    try { order = await reconcile(order); } catch { outage = true; }
    return json({ ...receipt(order), ...(outage ? { message: 'Payment verification is temporarily unavailable. Last verified state shown; no new payment is confirmed.' } : {}) });
  }
  return json({ error: 'Not found.' }, 404);
}

Deno.serve(async req => {
  const origin = req.headers.get('origin');
  const allowed = allowedOrigin();
  if (origin && origin !== allowed) return json({ error: 'Origin is not allowed.' }, 403);
  const cors: Record<string, string> = origin && allowed ? {
    'Access-Control-Allow-Origin': allowed, 'Vary': 'Origin',
    'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    'Access-Control-Allow-Headers': 'authorization, content-type, x-mcf-checkout-client',
    'Access-Control-Max-Age': '600',
  } : {};
  let response: Response;
  if (req.method === 'OPTIONS') response = new Response(null, { status: 204 });
  else {
    try { response = await handle(req); }
    catch (error) {
      response = error instanceof CheckoutError
        ? json({ error: error.message }, error.statusCode)
        : json({ error: 'The request could not be processed. Please retry later.' }, 500);
    }
  }
  for (const [key, value] of Object.entries(cors)) response.headers.set(key, value);
  return response;
});