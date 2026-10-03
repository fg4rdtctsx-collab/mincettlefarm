// Project-scoped setup. Never print credentials, auth responses or buyer records.
import { readFile } from 'node:fs/promises';
import { X509Certificate } from 'node:crypto';
const ref = 'zklnjcflrbgzzntxgdrk';
const project = `https://${ref}.supabase.co`;
const mode = process.argv[2];
if (!['--bootstrap-owner', '--approved-publish-backend'].includes(mode)) throw new Error('Choose an explicit approved operation.');
const token = process.env.SUPABASE_ACCESS_TOKEN;
if (!token) throw new Error('The saved Supabase management credential is missing.');

async function management(path, body, method = body ? 'POST' : 'GET') {
  const multipart = body instanceof FormData;
  const res = await fetch(`https://api.supabase.com/v1/projects/${ref}${path}`, {
    method, headers: { Authorization: `Bearer ${token}`, ...(!multipart ? { 'Content-Type': 'application/json' } : {}) },
    body: body ? multipart ? body : JSON.stringify(body) : undefined, signal: AbortSignal.timeout(120000),
  });
  if (!res.ok) throw new Error(`Project setup failed (${method} ${path.split('?')[0]}, HTTP ${res.status}).`);
  const text = await res.text();
  return text ? JSON.parse(text) : null;
}
const keys = await management('/api-keys');
const service = keys.find(k => k.name === 'service_role')?.api_key;
if (!service) throw new Error('The project service credential could not be obtained.');
async function projectRequest(path, body, method = body ? 'POST' : 'GET', acceptable = []) {
  const res = await fetch(`${project}${path}`, {
    method, headers: { apikey: service, Authorization: `Bearer ${service}`, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined, redirect: 'error', signal: AbortSignal.timeout(30000),
  });
  if (acceptable.includes(res.status)) return null;
  if (!res.ok) throw new Error(`Project operation failed (${path.split('?')[0]}, HTTP ${res.status}).`);
  return res.json();
}

if (mode === '--bootstrap-owner') {
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!password || password.length < 12) throw new Error('Set ADMIN_INITIAL_PASSWORD securely with at least 12 characters.');
  const email = 'salesminicattlefarm@gmail.com'; // Explicitly approved owner account.
  let owner;
  for (let page=1; page<=10; page++) {
    const data = await projectRequest(`/auth/v1/admin/users?page=${page}&per_page=1000`);
    owner = data.users?.find(u => u.email?.toLowerCase() === email);
    if (owner || data.users.length < 1000) break;
    if (page === 10) throw new Error('Owner lookup requires further review; no account or permissions were changed.');
  }
  let created = false;
  if (!owner) {
    // The project owner approves the account and supplies its password securely.
    owner = await projectRequest('/auth/v1/admin/users', { email, password, email_confirm: true });
    created = true;
  }
  if (!owner?.id || !owner.email_confirmed_at) throw new Error('An existing unverified account needs recovery; its password and verification were not changed.');
  await management('/secrets', [{ name: 'OWNER_SUPABASE_USER_IDS', value: owner.id }]);
  console.log(JSON.stringify({ ownerApproved: true, accountCreated: created, existingPasswordChanged: false }));
} else {
  const origin = process.argv.find(arg => arg.startsWith('--site-origin='))?.slice('--site-origin='.length);
  if (!origin || origin !== 'https://minicattlefarm.com') throw new Error('Supply the verified, explicitly approved farm origin with --site-origin=https://minicattlefarm.com.');
  await management('/database/query', { query: await readFile('supabase/migrations/202610030003_admin_bank.sql','utf8'), read_only: false });
  const buckets = await projectRequest('/storage/v1/bucket');
  const bucket = { id: 'livestock-photos', name: 'livestock-photos', public: true, file_size_limit: 5*1024*1024, allowed_mime_types: ['image/jpeg','image/png','image/webp'] };
  const existing = buckets.find(b => b.id === bucket.id);
  if (!existing) await projectRequest('/storage/v1/bucket', bucket);
  else await projectRequest(`/storage/v1/bucket/${bucket.id}`, bucket, 'PUT');
  const root = await readFile('supabase/functions/_shared/root-ca.ts','utf8');
  new X509Certificate(root.match(/`([\s\S]*)`/)?.[1] || '');
  const form = new FormData();
  form.append('metadata', JSON.stringify({ entrypoint_path: 'checkout/index.ts', import_map_path: 'checkout/deno.json', verify_jwt: false, name: 'checkout' }));
  for (const path of ['checkout/index.ts','checkout/owner-upload.ts','checkout/core.generated.js','checkout/deno.json','_shared/db.ts','_shared/root-ca.ts']) {
    form.append('file', new Blob([await readFile(`supabase/functions/${path}`)],{type:'application/octet-stream'}),path);
  }
  const deployed = await management('/functions/deploy?slug=checkout', form);
  console.log(JSON.stringify({ functionStatus: deployed.status, additiveSchema: true, photos: 'Supabase Storage', reseededStock: false }));
}