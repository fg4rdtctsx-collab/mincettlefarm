// Approved domain-only cutover. Never rotate credentials, redeploy code, or mutate data.
const ref = 'zklnjcflrbgzzntxgdrk';
const origin = 'https://thewestfarm.shop';
if (process.argv[2] !== `--approved-domain=${origin}`) {
  throw new Error('Supply the explicitly approved website origin.');
}
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) throw new Error('The saved Supabase management credential is missing.');

async function management(path, body, method = body ? 'POST' : 'GET') {
  const response = await fetch(`https://api.supabase.com/v1/projects/${ref}${path}`, {
    method,
    headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined,
    signal: AbortSignal.timeout(60000),
  });
  if (!response.ok) throw new Error(`Domain configuration failed (${method} ${path}, HTTP ${response.status}).`);
  const text = await response.text();
  return text ? JSON.parse(text) : null;
}

const current = await management('/config/auth');
// Preserve unrelated redirect entries, but retire redirects through the held domain.
const redirects = new Set((current.uri_allow_list || '').split(',').map(v => v.trim()).filter(Boolean));
for (const entry of redirects) {
  if (/^https?:\/\/(?:www\.)?minicattlefarm\.com(?:[/:]|$)/i.test(entry)) redirects.delete(entry);
}
redirects.add(`${origin}/**`);
await management('/config/auth', { site_url: origin, uri_allow_list: [...redirects].join(',') }, 'PATCH');
await management('/secrets', [{ name: 'MCF_SANDBOX_PUBLIC_URL', value: origin }]);
const confirmed = await management('/config/auth');
if (confirmed.site_url !== origin || !confirmed.uri_allow_list?.split(',').includes(`${origin}/**`)) {
  throw new Error('Auth domain readback did not match the approved origin.');
}
const response = await fetch(`https://${ref}.supabase.co/functions/v1/checkout/catalog`, {
  method: 'OPTIONS',
  headers: { Origin: origin, 'Access-Control-Request-Method': 'GET' },
  signal: AbortSignal.timeout(30000),
});
if (response.status !== 204 || response.headers.get('access-control-allow-origin') !== origin) {
  throw new Error(`Checkout origin verification failed (HTTP ${response.status}); recheck propagation without changing stock or credentials.`);
}
console.log(JSON.stringify({
  authSiteUrl: origin,
  checkoutOriginVerified: true,
  inventoryAndOrdersChanged: false,
  passwordsChanged: false,
}));
