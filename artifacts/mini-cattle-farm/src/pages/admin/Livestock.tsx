import { useEffect, useState } from 'react';
import { useArchiveOwnerLivestock, useGetOwnerInventory, useUpdateOwnerLivestock, type OwnerLivestock } from '@workspace/api-client-react';
import { POLL, usd, errText, isAuthFailure, useRefreshOwner } from './util';
import { LivestockForm } from './LivestockForm';

export function Livestock({ onAuthFail }: { onAuthFail: (s: number) => void }) {
  const q = useGetOwnerInventory({ query: { queryKey: ['/api/owner/inventory'], refetchInterval: POLL } });
  const update = useUpdateOwnerLivestock();
  const archive = useArchiveOwnerLivestock();
  const refresh = useRefreshOwner();
  const [editing, setEditing] = useState<OwnerLivestock | 'new' | null>(null);
  const [archiving, setArchiving] = useState<number | null>(null);
  const [step, setStep] = useState('10');
  const [err, setErr] = useState('');
  const [msg, setMsg] = useState('');
  const qErr = q.error;
  useEffect(() => { if (qErr && isAuthFailure(qErr)) onAuthFail((qErr as { status: number }).status); }, [qErr, onAuthFail]);
  const fail = (e: unknown) => { if (isAuthFailure(e)) onAuthFail((e as { status: number }).status); else setErr(errText(e)); };

  const adjust = async (it: OwnerLivestock, dir: 1 | -1) => {
    setErr(''); setMsg('');
    const amt = Number(step);
    const next = Math.round((it.price + dir * amt) * 100) / 100;
    if (!(amt > 0)) return setErr('Enter an adjustment amount above zero.');
    if (next < 0.01) return setErr('The new price would be below 0.01 USD.');
    try {
      await update.mutateAsync({ id: it.id, data: { name: it.name, price: next, stock: it.stock, category: it.category, description: it.description, images: it.images, version: it.version, active: it.active, expectedStock: it.stock } });
      setMsg(`${it.name} is now ${usd(next)}.`); await refresh();
    } catch (e) { fail(e); }
  };
  const doArchive = async (it: OwnerLivestock) => {
    setErr(''); setMsg('');
    try { await archive.mutateAsync({ id: it.id, data: { version: it.version } }); setMsg(`${it.name} archived. Order history is kept.`); setArchiving(null); await refresh(); }
    catch (e) { fail(e); }
  };
  const items = q.data ?? [];
  const pending = update.isPending || archive.isPending;
  return (
    <section className="ad-panel" aria-labelledby="ad-live-h">
      <header className="ad-head"><h2 id="ad-live-h">Livestock</h2>
        <div className="ad-row">
          <label className="ad-inline">Price step USD<input type="number" min="0.01" step="0.01" value={step} onChange={e => setStep(e.target.value)} data-testid="input-price-step" /></label>
          <button className="ad-btn" onClick={() => { setEditing('new'); setMsg(''); }} data-testid="button-add-livestock">Add animal</button></div></header>
      {msg && <div className="ad-ok" role="status">{msg}</div>}
      {err && <div className="ad-err" role="alert">{err}</div>}
      {editing && <LivestockForm key={editing === 'new' ? 'new' : `${editing.id}-${editing.version}`} item={editing === 'new' ? undefined : editing} onAuthFail={onAuthFail} onDone={() => setEditing(null)} />}
      {q.isLoading && <div className="ad-skel" role="status">Loading stock…</div>}
      {q.isError && !isAuthFailure(q.error) && <div className="ad-err" role="alert">{errText(q.error)} <button onClick={() => q.refetch()}>Retry</button></div>}
      {q.data && items.length === 0 && <div className="ad-empty-card"><strong>No animals listed</strong><span>Add your first animal with photos, a price and the units you have.</span></div>}
      <div className="ad-scroll"><table className="ad-table">
        {items.length > 0 && <thead><tr><th>Animal</th><th>Category</th><th className="n">Price</th><th className="n">Stock</th><th className="n">Reserved</th><th className="n">Available</th><th>Status</th><th>Actions</th></tr></thead>}
        <tbody>{items.map(it => (
          <tr key={it.id} className={it.active ? '' : 'off'} data-testid={`row-livestock-${it.id}`}>
            <td><div className="ad-cell">{it.images[0] ? <img src={it.images[0]} alt="" /> : <span className="ad-noimg">No photo</span>}<span>{it.name}</span></div></td>
            <td>{it.category}</td><td className="n">{usd(it.price)}</td><td className="n">{it.stock}</td><td className="n">{it.reserved}</td><td className="n">{it.available}</td>
            <td>{it.active ? 'Listed' : 'Archived'}</td>
            <td>{archiving === it.id ? <div className="ad-confirm"><p>Archive {it.name}? It leaves the storefront. Past orders are untouched.</p>
                <div className="ad-row"><button className="ad-btn danger" disabled={pending} onClick={() => doArchive(it)} data-testid={`button-archive-yes-${it.id}`}>{archive.isPending ? 'Archiving…' : 'Yes, archive'}</button><button className="ad-btn ghost" onClick={() => setArchiving(null)}>Keep</button></div></div>
              : <div className="ad-row">
                <button className="ad-btn sm" disabled={pending} onClick={() => adjust(it, 1)} data-testid={`button-price-up-${it.id}`}>Price +</button>
                <button className="ad-btn sm" disabled={pending} onClick={() => adjust(it, -1)} data-testid={`button-price-down-${it.id}`}>Price -</button>
                <button className="ad-btn sm ghost" onClick={() => { setEditing(it); setMsg(''); window.scrollTo({ top: 0, behavior: 'smooth' }); }} data-testid={`button-edit-${it.id}`}>Edit</button>
                <button className="ad-btn sm danger" onClick={() => setArchiving(it.id)} data-testid={`button-archive-${it.id}`}>Archive</button></div>}</td>
          </tr>))}</tbody></table></div>
    </section>
  );
}
