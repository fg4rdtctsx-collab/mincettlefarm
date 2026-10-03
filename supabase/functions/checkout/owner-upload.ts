import { CheckoutError } from './core.generated.js';

export async function uploadLivestockImage(req: Request, bytes: Uint8Array, owner: string) {
  const contentType = req.headers.get('content-type') || '';
  if (!contentType.startsWith('multipart/form-data;')) throw new CheckoutError(400, 'Upload a photo as multipart form data.');
  let form: FormData;
  try { form = await new Response(bytes, { headers: { 'Content-Type': contentType } }).formData(); }
  catch { throw new CheckoutError(400, 'The photo upload could not be read.'); }
  const file = form.get('file');
  // The edge's multipart parser can return a File from another Web API realm.
  // FormData entries are string | File; size, MIME and magic bytes remain checked.
  if (!file || typeof file === 'string' || !file.size || file.size > 5 * 1024 * 1024) throw new CheckoutError(400, 'Choose a JPEG, PNG or WebP photo smaller than 5 MB.');
  const data = new Uint8Array(await file.arrayBuffer());
  const png = data.length > 8 && [137,80,78,71,13,10,26,10].every((v,i) => data[i] === v);
  const jpeg = data.length > 3 && data[0] === 255 && data[1] === 216 && data[2] === 255;
  const webp = data.length > 12 && String.fromCharCode(...data.slice(0,4)) === 'RIFF' && String.fromCharCode(...data.slice(8,12)) === 'WEBP';
  const extension = png && file.type === 'image/png' ? 'png' : jpeg && file.type === 'image/jpeg' ? 'jpg' : webp && file.type === 'image/webp' ? 'webp' : null;
  if (!extension) throw new CheckoutError(400, 'Only actual JPEG, PNG or WebP photos are accepted.');
  const project = Deno.env.get('SUPABASE_URL');
  const key = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY');
  if (!project || !key) throw new CheckoutError(503, 'Photo storage is not configured.');
  const path = `${owner}/${crypto.randomUUID()}.${extension}`;
  const response = await fetch(`${project}/storage/v1/object/livestock-photos/${path}`, {
    method: 'POST', headers: { apikey: key, Authorization: `Bearer ${key}`, 'Content-Type': file.type, 'x-upsert': 'false' },
    body: data, redirect: 'error', signal: AbortSignal.timeout(30000),
  });
  if (!response.ok) throw new CheckoutError(503, 'Photo could not be saved to Supabase storage. Please retry.');
  return { url: `${project}/storage/v1/object/public/livestock-photos/${path}` };
}