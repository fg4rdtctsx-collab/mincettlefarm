import { useEffect, useState } from 'react';
import { useActOnOwnerOrder, useGetOwnerOrders, type OwnerOrder } from '@workspace/api-client-react';
import { POLL, usd, when, errText, isAuthFailure, useRefreshOwner } from './util';

const safeUrl = (u?: string | null) => (u && /^mailto:salesminicattlefarm@gmail\.com(\?.*)?$/i.test(u) ? u : null);

export function Orders({ onAuthFail }: { onAuthFail: (s: number) => void }) {
  const q = useGetOwnerOrders({ query: { queryKey: ['/api/owner/orders'], refetchInterval: POLL } });
  const act = useActOnOwnerOrder();
  const refresh = useRefreshOwner();
  const [confirming, setConfirming] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [msg, setMsg] = useState('');
  const [err, setErr] = useState('');
  const [busyId, setBusyId] = useState<string | null>(null);
  const qErr = q.error;
  useEffect(() => { if (qErr && isAuthFailure(qErr)) onAuthFail((qErr as { status: number }).status); }, [qErr, onAuthFail]);

  const run = async (id: string, action: 'confirm_bank' | 'cancel_bank' | 'fulfill') => {
    setErr(''); setMsg(''); setBusyId(id);
    try {
      await act.mutateAsync({ id, data: { action } });
      setMsg(action === 'confirm_bank' ? 'Bank payment confirmed.' : action === 'cancel_bank' ? 'Bank order cancelled.' : 'Order marked fulfilled.');
      setConfirming(null); setVerified(false);
      await refresh();
    } catch (e) {
      if (isAuthFailure(e)) onAuthFail((e as { status: number }).status); else setErr(errText(e));
    } finally { setBusyId(null); }
  };
  const rows: OwnerOrder[] = q.data ?? [];
  return (
    <section className="ad-panel" aria-labelledby="ad-ord-h">
      <header className="ad-head"><h2 id="ad-ord-h">Orders</h2><button className="ad-btn ghost" onClick={() => q.refetch()} disabled={q.isFetching} data-testid="button-refresh-orders">{q.isFetching ? 'Refreshing…' : 'Refresh'}</button></header>
      {msg && <div className="ad-ok" role="status">{msg}</div>}
      {err && <div className="ad-err" role="alert">{err}</div>}
      {q.isLoading && <div className="ad-skel" role="status">Loading orders…</div>}
      {q.isError && !isAuthFailure(q.error) && <div className="ad-err" role="alert">{errText(q.error)} <button onClick={() => q.refetch()}>Retry</button></div>}
      {q.data && rows.length === 0 && <div className="ad-empty-card"><strong>No orders yet</strong><span>New orders appear here automatically.</span></div>}
      <div className="ad-orders">
        {rows.map(({ order: o, buyer: b }) => {
          const bank = o.paymentMethod === 'bank';
          const link = safeUrl(o.bankEmailUrl);
          const busy = busyId === o.id;
          return (
            <article key={o.id} className="ad-order" data-testid={`card-order-${o.id}`}>
              <div className="ad-order-top"><code>{o.id}</code><span className={`ad-pill s-${o.status}`}>{o.status}</span></div>
              <div className="ad-order-grid">
                <div><h4>Buyer</h4><p>{b.name}<br /><a href={`mailto:${b.email}`}>{b.email}</a><br /><a href={`tel:${b.phone}`}>{b.phone}</a></p></div>
                <div><h4>Payment</h4><p>{bank ? 'Bank transfer' : 'Crypto'}<br />Placed {when(o.createdAt)}{o.paidAt && <><br />Paid {when(o.paidAt)}</>}{o.fulfilledAt && <><br />Fulfilled {when(o.fulfilledAt)}</>}{link && <><br /><a href={link} target="_blank" rel="noopener noreferrer">Bank email</a></>}</p></div>
              </div>
              <table className="ad-table small"><thead><tr><th>Animal</th><th className="n">Qty</th><th className="n">Unit</th><th className="n">Line</th></tr></thead>
                <tbody>{o.lines.map((l, i) => <tr key={i}><td>{l.name}</td><td className="n">{l.qty}</td><td className="n">{usd(l.unitPrice)}</td><td className="n">{usd(l.qty * l.unitPrice)}</td></tr>)}</tbody>
                <tfoot><tr><td colSpan={3}>Total {o.currency}{o.sandbox ? ' (test order)' : ''}</td><td className="n">{usd(o.total)}</td></tr></tfoot></table>
              <div className="ad-actions">
                {bank && o.status === 'pending' && confirming !== o.id && <>
                  <button className="ad-btn" onClick={() => { setConfirming(o.id); setVerified(false); }} disabled={busy} data-testid={`button-confirm-bank-${o.id}`}>Confirm bank payment</button>
                  <button className="ad-btn danger" onClick={() => run(o.id, 'cancel_bank')} disabled={busy} data-testid={`button-cancel-bank-${o.id}`}>{busy ? 'Working…' : 'Cancel bank order'}</button></>}
                {confirming === o.id && <div className="ad-confirm">
                  <label><input type="checkbox" checked={verified} onChange={e => setVerified(e.target.checked)} data-testid={`check-funds-${o.id}`} /> I verified that {usd(o.total)} actually arrived in the bank account.</label>
                  <div className="ad-row"><button className="ad-btn" disabled={!verified || busy} onClick={() => run(o.id, 'confirm_bank')} data-testid={`button-confirm-yes-${o.id}`}>{busy ? 'Confirming…' : 'Funds verified, confirm'}</button>
                    <button className="ad-btn ghost" onClick={() => setConfirming(null)} disabled={busy}>Not yet</button></div></div>}
                {o.status === 'paid' && !o.fulfilledAt && <button className="ad-btn" onClick={() => run(o.id, 'fulfill')} disabled={busy} data-testid={`button-fulfill-${o.id}`}>{busy ? 'Working…' : 'Mark fulfilled'}</button>}
                {!bank && o.status !== 'paid' && <span className="ad-note">Crypto orders are marked paid only by the payment processor.</span>}
              </div>
            </article>);
        })}
      </div>
    </section>
  );
}
