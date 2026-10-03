import assert from "node:assert/strict";
import { createHmac, randomUUID } from "node:crypto";
import { test } from "node:test";
import { db, pool, checkoutInventory, checkoutOrders } from "@workspace/db";
import { eq, sql } from "drizzle-orm";
import { applyPayment, checkoutAvailable, createSandboxOrder, readPrivateOrder, validatePayment, seedSandboxInventory } from "./checkout";
import { verifySignature, type PaymentInfo } from "./oxapay";

test("HMAC requires exact raw bytes and rejects forged or malformed signatures", () => {
  const bytes = Buffer.from('{"status":"paid", "amount":850}');
  const fixtureKey = "unit-test-merchant-key";
  const signature = createHmac("sha512", fixtureKey).update(bytes).digest("hex");
  assert.equal(verifySignature(bytes, signature, fixtureKey), true);
  assert.equal(verifySignature(Buffer.from('{"status":"paid","amount":850}'), signature, fixtureKey), false);
  assert.equal(verifySignature(bytes, "0".repeat(128), fixtureKey), false);
  assert.equal(verifySignature(bytes, "garbage", fixtureKey), false);
});

test("persistent orders: trusted totals, concurrency, private access, transitions and reservation lifecycle", async () => {
  const originalFetch = globalThis.fetch;
  const savedEnv = Object.fromEntries(['CHECKOUT_LIVE_ENABLED', 'CHECKOUT_SANDBOX_ENABLED', 'MCF_SANDBOX_PUBLIC_URL', 'MCF_SANDBOX_CALLBACK_URL'].map(key => [key, process.env[key]]));
  const made: string[] = [];
  const trackByOrder = new Map<string, string>();
  let invoiceCalls = 0;
  const [stock] = await db.select().from(checkoutInventory).where(sql`${checkoutInventory.available} >= 4`).limit(1);
  assert.ok(stock, "sandbox catalog must be seeded");
  const input = () => ({
    buyer: { name: "Sandbox Test Buyer", email: "sandbox-test@example.invalid", phone: "0000000000" },
    lines: [{ id: stock.id, qty: 1 }], idempotencyKey: randomUUID(),
  });
  globalThis.fetch = async (_url, init) => {
    const body = JSON.parse(String(init?.body));
    assert.equal(body.sandbox, true, "all invoice requests must be sandbox");
    assert.equal(body.amount, stock.priceCents / 100, "price is server owned");
    assert.equal(body.currency, "USD");
    const track = String(900000000 + ++invoiceCalls);
    trackByOrder.set(body.order_id, track);
    return new Response(JSON.stringify({ status: 200, data: {
      track_id: track, payment_url: `https://pay.oxapay.com/sandbox/${track}`,
      expired_at: Math.floor(Date.now() / 1000) + 1800,
    } }), { status: 200 });
  };
  try {
    const request = input();
    const [first, duplicate] = await Promise.all([createSandboxOrder(request), createSandboxOrder(request)]);
    made.push(first.order.id);
    assert.equal(first.order.id, duplicate.order.id, "concurrent retries reuse order");
    assert.equal(invoiceCalls, 1, "invoice must be created once");
    const again = await createSandboxOrder(request);
    assert.equal(again.accessToken, first.accessToken);
    assert.equal(again.order.total, stock.priceCents / 100);
    await assert.rejects(createSandboxOrder({ ...request, buyer: { ...request.buyer, name: "Changed Buyer" } }));
    await assert.rejects(readPrivateOrder(first.order.id, "0".repeat(64)));
    const order = await readPrivateOrder(first.order.id, first.accessToken);
    const info: PaymentInfo = { track_id: trackByOrder.get(order.id)!, order_id: order.id, amount: order.totalCents / 100, currency: "USD", status: "paying", type: "invoice" };
    assert.throws(() => validatePayment(order, { ...info, amount: info.amount + 1 }));
    assert.throws(() => validatePayment(order, { ...info, currency: "EUR" }));
    assert.throws(() => validatePayment(order, { ...info, order_id: randomUUID() }));
    assert.throws(() => validatePayment(order, { ...info, track_id: "123" }));
    await applyPayment(order.id, info);
    assert.equal((await readPrivateOrder(order.id, first.accessToken)).status, "paying");
    await applyPayment(order.id, { ...info, status: "waiting" });
    assert.equal((await readPrivateOrder(order.id, first.accessToken)).status, "paying", "out-of-order waiting cannot regress paying");
    await applyPayment(order.id, { ...info, status: "Paid" });
    await applyPayment(order.id, { ...info, status: "paid" });
    await applyPayment(order.id, { ...info, status: "expired" });
    assert.equal((await readPrivateOrder(order.id, first.accessToken)).status, "paid", "paid never regresses or releases");
    for (const terminal of ["expired", "failed"] as const) {
      const session = await createSandboxOrder(input());
      made.push(session.order.id);
      await assert.rejects(readPrivateOrder(session.order.id, first.accessToken), "another order's valid token must not grant access");
      const terminalInfo = { ...info, order_id: session.order.id, track_id: trackByOrder.get(session.order.id)!, status: terminal };
      await applyPayment(session.order.id, terminalInfo);
      await applyPayment(session.order.id, terminalInfo);
      const done = await readPrivateOrder(session.order.id, session.accessToken);
      assert.equal(done.status, terminal);
      assert.equal(done.released, true);
      if (terminal === "expired") {
        await applyPayment(done.id, { ...terminalInfo, status: "paid" });
        assert.equal((await readPrivateOrder(done.id, session.accessToken)).status, "review", "late paid needs owner review, no automatic fulfillment");
      }
    }
    const [after] = await db.select().from(checkoutInventory).where(eq(checkoutInventory.id, stock.id));
    assert.equal(after.available, stock.available - 1, "only committed paid reservation remains deducted");
    const uncertainKey = input();
    globalThis.fetch = async () => { throw new Error("simulated timeout"); };
    const uncertain = await createSandboxOrder(uncertainKey);
    made.push(uncertain.order.id);
    assert.equal(uncertain.order.status, "review");
    assert.equal((await createSandboxOrder(uncertainKey)).order.id, uncertain.order.id);
    const [uncertainOrder] = await db.select().from(checkoutOrders).where(eq(checkoutOrders.id, uncertain.order.id));
    assert.equal(uncertainOrder.released, false, "ambiguous invoice must retain reservation");
    globalThis.fetch = async () => new Response(JSON.stringify({ status: 401 }), { status: 401 });
    const rejected = await createSandboxOrder(input());
    made.push(rejected.order.id);
    assert.equal(rejected.order.status, "failed");
    assert.equal((await readPrivateOrder(rejected.order.id, rejected.accessToken)).released, true);
    // Exercise real-invoice semantics only against mocked OxaPay and the
    // development test tables. Never create a real invoice during tests.
    process.env.CHECKOUT_LIVE_ENABLED = 'true';
    process.env.CHECKOUT_SANDBOX_ENABLED = 'false';
    process.env.MCF_SANDBOX_PUBLIC_URL = 'https://farm.example';
    process.env.MCF_SANDBOX_CALLBACK_URL = 'https://api.farm.example/api/payments/oxapay/callback';
    const [beforeLive] = await db.select().from(checkoutInventory).where(eq(checkoutInventory.id, stock.id));
    await seedSandboxInventory();
    const [afterSeed] = await db.select().from(checkoutInventory).where(eq(checkoutInventory.id, stock.id));
    assert.equal(beforeLive.available, afterSeed.available, 'live mode must not seed artificial stock');
    globalThis.fetch = async (_url, init) => {
      const body = JSON.parse(String(init?.body));
      assert.equal(body.sandbox, false, 'approved live checkout must request an actual invoice');
      assert.equal(body.amount, stock.priceCents / 100, 'live prices must be server owned');
      assert.ok(!body.description.includes('SANDBOX'));
      return new Response(JSON.stringify({ status: 200, data: {
        track_id: '910000001', payment_url: 'https://pay.oxapay.com/unit-fixture',
        expired_at: Math.floor(Date.now() / 1000) + 1800,
      } }), { status: 200 });
    };
    const live = await createSandboxOrder(input());
    made.push(live.order.id);
    assert.equal(live.order.sandbox, false);
    assert.equal(live.order.status, 'pending');
    assert.ok(!live.order.message.includes('Sandbox'));
    assert.equal((await readPrivateOrder(live.order.id, live.accessToken)).id, live.order.id);
    process.env.CHECKOUT_SANDBOX_ENABLED = 'true';
    assert.equal(checkoutAvailable(), false, 'mixed live and sandbox configuration must fail closed');
  } finally {
    globalThis.fetch = originalFetch;
    for (const [key, value] of Object.entries(savedEnv)) {
      if (value === undefined) delete process.env[key]; else process.env[key] = value;
    }
    for (const id of made) await db.transaction(async tx => {
      const [o] = await tx.select().from(checkoutOrders).where(eq(checkoutOrders.id, id)).for("update");
      if (!o) return;
      if (!o.released) for (const line of o.lines) {
        await tx.update(checkoutInventory).set({ available: sql`${checkoutInventory.available} + ${line.qty}` }).where(eq(checkoutInventory.id, line.id));
      }
      await tx.delete(checkoutOrders).where(eq(checkoutOrders.id, id));
    });
    await pool.end();
  }
});