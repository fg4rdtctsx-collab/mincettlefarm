// Explicit, project-scoped activation. No secret values or buyer data are logged.
import { readFile } from 'node:fs/promises';
import { randomBytes, X509Certificate } from 'node:crypto';

const ref = 'zklnjcflrbgzzntxgdrk';
const project = `https://${ref}.supabase.co`;
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token || !process.env.OXAPAY_MERCHANT_API_KEY || !process.env.SESSION_SECRET) {
  throw new Error('Required saved server credentials are missing.');
}
if (process.argv[2] !== '--approved-live') throw new Error('Explicit live-checkout approval is required.');
const site = JSON.parse(await readFile('/tmp/mcf-live-site.json', 'utf8'));
const publicUrl = new URL(site.url);
if (publicUrl.protocol !== 'https:' || publicUrl.hostname !== 'minicattlefarm.com') {
  throw new Error('The verified production URL does not match the approved storefront.');
}
async function api(path, body, method = body ? 'POST' : 'GET') {
  const multipart = body instanceof FormData;
  const response = await fetch(`https://api.supabase.com/v1/projects/${ref}${path}`, {
    method, headers: { Authorization: `Bearer ${token}`, ...(!multipart ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? (multipart ? body : JSON.stringify(body)) : undefined,
    signal: AbortSignal.timeout(120000),
  });
  if (!response.ok) throw new Error(`Project-scoped operation failed: ${method} ${path.split('?')[0]} (${response.status}).`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}
const query = (sql, parameters = [], read_only = false) => api('/database/query', { query: sql, parameters, read_only });
const tables = await query("select tablename from pg_tables where schemaname='public' and tablename like 'live_checkout_%'", [], true);
if (tables.length && tables.length !== 3) throw new Error('Incomplete live schema; review before modifying it.');
await query(await readFile('supabase/migrations/202610030002_live_checkout.sql', 'utf8'));
const catalog = JSON.parse(await readFile('artifacts/mini-cattle-farm/src/data/catalog.json', 'utf8'));
for (const p of catalog.products) {
  if (!Number.isSafeInteger(p.id) || !Number.isFinite(p.price) || p.price <= 0 || !Number.isSafeInteger(Math.round(p.price * 100))) {
    throw new Error('Invalid listing price; refusing to activate real payments.');
  }
}
// The managing owner approved listed prices and one animal per in-stock listing.
// Never overwrite sold stock or existing reservations on a subsequent release.
const parameters = [];
const values = catalog.products.map(p => {
  const start = parameters.length;
  parameters.push(p.id, p.name, Math.round(p.price * 100), p.inStock ? 1 : 0);
  return `($${start + 1}::integer,$${start + 2}::text,$${start + 3}::integer,$${start + 4}::integer)`;
});
await query(`insert into public.live_checkout_inventory (id,name,price_cents,available) values ${values.join(',')} on conflict (id) do nothing`, parameters);

// Keep the scheduler's credential independent from private receipt credentials.
// Supabase's read-only API role cannot invoke Vault decryption. This remains a
// SELECT but uses the authorized management role; nothing is exposed to logs.
const vault = await query("select decrypted_secret from vault.decrypted_secrets where name='mcf_reconcile_secret' limit 1");
const reconcileSecret = vault[0]?.decrypted_secret || randomBytes(32).toString('hex');
await api('/secrets', [
  { name: 'OXAPAY_MERCHANT_API_KEY', value: process.env.OXAPAY_MERCHANT_API_KEY },
  { name: 'SESSION_SECRET', value: process.env.SESSION_SECRET },
  { name: 'CHECKOUT_LIVE_ENABLED', value: 'true' },
  { name: 'CHECKOUT_SANDBOX_ENABLED', value: 'false' },
  { name: 'MCF_SANDBOX_PUBLIC_URL', value: publicUrl.href.replace(/\/$/, '') },
  { name: 'MCF_SANDBOX_CALLBACK_URL', value: `${project}/functions/v1/checkout/api/payments/oxapay/callback` },
  { name: 'MCF_RECONCILE_SECRET', value: reconcileSecret },
]);
for (const [name, value] of [
  ['mcf_checkout_function_url', `${project}/functions/v1/checkout`],
  ['mcf_reconcile_secret', reconcileSecret],
]) {
  const existing = await query('select id from vault.secrets where name=$1 limit 1', [name], true);
  if (existing.length) await query('select vault.update_secret($1::uuid,$2::text)', [existing[0].id, value]);
  else await query('select vault.create_secret($1::text,$2::text)', [value, name]);
}
const form = new FormData();
form.append('metadata', JSON.stringify({ entrypoint_path: 'checkout/index.ts', import_map_path: 'checkout/deno.json', verify_jwt: false, name: 'checkout' }));
for (const file of ['checkout/index.ts', 'checkout/core.generated.js', 'checkout/deno.json', '_shared/db.ts', '_shared/root-ca.ts']) {
  const bytes = await readFile(`supabase/functions/${file}`);
  form.append('file', new Blob([bytes], { type: 'application/octet-stream' }), file);
}
// Validate the publicly distributed root certificate before uploading the bundle.
const rootSource = await readFile('supabase/functions/_shared/root-ca.ts', 'utf8');
new X509Certificate(rootSource.match(/`([\s\S]*)`/)?.[1] || '');
const deployment = await api('/functions/deploy?slug=checkout', form);
await query(await readFile('supabase/setup-reconciliation.sql', 'utf8'));
const protectedTables = await query("select relname,relrowsecurity from pg_class where relname in ('live_checkout_inventory','live_checkout_orders','live_checkout_rate_limits')", [], true);
if (protectedTables.length !== 3 || protectedTables.some(t => !t.relrowsecurity)) throw new Error('Live table protection verification failed.');
console.log(JSON.stringify({ functionStatus: deployment.status, listings: catalog.products.length, mode: 'live', protectedTables: protectedTables.length, reconciliationScheduled: true }));