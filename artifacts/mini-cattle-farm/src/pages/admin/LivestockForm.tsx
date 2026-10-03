import { useRef, useState } from 'react';
import { useCreateOwnerLivestock, useUpdateOwnerLivestock, useUploadOwnerImage, type OwnerLivestock } from '@workspace/api-client-react';
import { categories } from '@/lib/store';
import { errText, isAuthFailure, useRefreshOwner } from './util';

const TYPES = ['image/jpeg', 'image/png', 'image/webp'];

export function LivestockForm({ item, onDone, onAuthFail }: { item?: OwnerLivestock; onDone: () => void; onAuthFail: (s: number) => void }) {
  const create = useCreateOwnerLivestock();
  const update = useUpdateOwnerLivestock();
  const upload = useUploadOwnerImage();
  const refresh = useRefreshOwner();
  const fileRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState(item?.name ?? '');
  const [active, setActive] = useState(item?.active ?? true);
  const [price, setPrice] = useState(item ? String(item.price) : '');
  const [stock, setStock] = useState(item ? String(item.stock) : '1');
  const [category, setCategory] = useState(item?.category ?? categories[0]?.slug ?? '');
  const [description, setDescription] = useState(item?.description ?? '');
  const [images, setImages] = useState<string[]>(item?.images ?? []);
  const [err, setErr] = useState('');
  const [uploading, setUploading] = useState(false);
  const busy = create.isPending || update.isPending || uploading;
  const reserved = item?.reserved ?? 0;
  const opts = categories;

  const pick = async (files: FileList | null) => {
    if (!files) return;
    setErr('');
    const list = Array.from(files);
    if (images.length + list.length > 8) { setErr('A listing can have at most 8 photos.'); return; }
    for (const f of list) {
      if (!TYPES.includes(f.type)) { setErr(`${f.name}: only JPG, PNG or WebP photos are accepted.`); return; }
      if (f.size > 5 * 1024 * 1024) { setErr(`${f.name} is larger than 5 MB.`); return; }
    }
    setUploading(true);
    try {
      const urls: string[] = [];
      for (const f of list) urls.push((await upload.mutateAsync({ data: { file: f } })).url);
      setImages(p => [...p, ...urls]);
      await refresh();
    } catch (e) { if (isAuthFailure(e)) onAuthFail((e as { status: number }).status); else setErr(errText(e)); }
    finally { setUploading(false); if (fileRef.current) fileRef.current.value = ''; }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setErr('');
    const p = Number(price), s = Number(stock);
    if (!name.trim()) return setErr('Name is required.');
    if (!(p >= 0.01 && p <= 1000000)) return setErr('Price must be between 0.01 and 1,000,000 USD.');
    if (!Number.isInteger(s) || s < 0 || s > 1000) return setErr('Stock must be a whole number from 0 to 1000.');
    if (s < reserved) return setErr(`Stock cannot go below ${reserved}, the units already reserved by open orders.`);
    if (!category.trim()) return setErr('Choose a category.');
    const data = { name: name.trim(), price: Math.round(p * 100) / 100, stock: s, category: category.trim(), description: description.trim(), images, active };
    try {
      if (item) await update.mutateAsync({ id: item.id, data: { ...data, version: item.version, expectedStock: item.stock } });
      else await create.mutateAsync({ data });
      await refresh(); onDone();
    } catch (x) { if (isAuthFailure(x)) onAuthFail((x as { status: number }).status); else setErr(errText(x)); }
  };

  return (
    <form className="ad-form" onSubmit={submit} data-testid="form-livestock">
      <h3>{item ? `Edit ${item.name}` : 'Add an animal'}</h3>
      <label>Name<input value={name} maxLength={100} onChange={e => setName(e.target.value)} required data-testid="input-name" /></label>
      <div className="ad-two">
        <label>Final price (USD)<input type="number" step="0.01" min="0.01" value={price} onChange={e => setPrice(e.target.value)} required data-testid="input-price" /></label>
        <label>Unsold units in stock<input type="number" step="1" min={reserved} max="1000" value={stock} onChange={e => setStock(e.target.value)} required data-testid="input-stock" /></label>
      </div>
      <p className="ad-note">Stock counts every unsold physical animal, including {reserved} currently reserved by open orders.</p>
      <label>Category<select value={category} onChange={e => setCategory(e.target.value)} data-testid="select-category">{opts.map(c => <option key={c.slug} value={c.slug}>{c.name}</option>)}</select></label>
      <label>Description<textarea rows={5} maxLength={10000} value={description} onChange={e => setDescription(e.target.value)} data-testid="input-description" /></label>
      <label><input type="checkbox" checked={active} onChange={e => setActive(e.target.checked)} data-testid="input-published" /> Show this animal in the shop</label>
      <div>
        <span className="ad-label">Photos ({images.length}/8)</span>
        <div className="ad-thumbs">{images.map((u, i) => <div key={u + i} className="ad-thumb"><img src={u} alt={`Photo ${i + 1}`} /><button type="button" onClick={() => setImages(images.filter((_, j) => j !== i))} aria-label={`Remove photo ${i + 1}`}>Remove</button></div>)}</div>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" multiple disabled={busy || images.length >= 8} onChange={e => pick(e.target.files)} data-testid="input-photos" />
        {uploading && <p className="ad-note" role="status">Uploading…</p>}
      </div>
      {err && <div className="ad-err" role="alert">{err}</div>}
      <div className="ad-row"><button className="ad-btn" type="submit" disabled={busy} data-testid="button-save-livestock">{busy ? 'Saving…' : item ? 'Save changes' : 'Add animal'}</button>
        <button className="ad-btn ghost" type="button" onClick={onDone} disabled={busy}>Cancel</button></div>
    </form>
  );
}
