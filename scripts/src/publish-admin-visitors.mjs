// Approved additive owner-dashboard release. Never reset stock, orders or auth.
import { readFile } from 'node:fs/promises';

if (process.argv[2] !== '--approved-dashboard-update') throw new Error('Explicit dashboard-update approval required.');
const ref = 'zklnjcflrbgzzntxgdrk';
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) throw new Error('Saved project management credential is unavailable.');
async function api(path, body) {
  const multipart = body instanceof FormData;
  const r = await fetch(`https://api.supabase.com/v1/projects/${ref}${path}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${token}`, ...(!multipart ? { 'Content-Type': 'application/json' } : {}) },
    body: multipart ? body : JSON.stringify(body), signal: AbortSignal.timeout(120000),
  });
  if (!r.ok) throw new Error(`Dashboard release failed (${path.split('?')[0]}, HTTP ${r.status}).`);
  return r.json();
}
const migration = await readFile('supabase/migrations/202610210001_visitor_presence.sql', 'utf8');
await api('/database/query', { query: migration, read_only: false });
const form = new FormData();
form.append('metadata', JSON.stringify({ entrypoint_path: 'checkout/index.ts', import_map_path: 'checkout/deno.json', verify_jwt: false, name: 'checkout' }));
for (const path of ['checkout/index.ts','checkout/owner-upload.ts','checkout/core.generated.js','checkout/deno.json','_shared/db.ts','_shared/root-ca.ts']) {
  form.append('file', new Blob([await readFile(`supabase/functions/${path}`)], { type: 'application/octet-stream' }), path);
}
const result = await api('/functions/deploy?slug=checkout', form);
console.log(JSON.stringify({ deployed: result.status === 'ACTIVE', functionStatus: result.status, additiveVisitorSchema: true, credentialsChanged: false, stockReseeded: false }));
