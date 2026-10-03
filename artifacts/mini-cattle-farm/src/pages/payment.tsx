import { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'wouter';
import { useClerk, useUser } from '@clerk/react';
import { useQueryClient } from '@tanstack/react-query';
import {
  getGetCheckoutConfigQueryKey, getGetOrderQueryKey, getGetOwnerOrdersQueryKey,
  useCreateOrder, useGetCheckoutConfig, useGetOrder, useGetOwnerOrders,
  type OrderReceipt,
} from '@workspace/api-client-react';
import { Layout, PageBanner } from '@/components/shop';
import { fmt, useStore } from '@/lib/store';

const tokenKey = (id: string) => `mcf-order-token-${id}`;
const errMsg = (e: unknown, fallback: string) => {
  const d = (e as { data?: { error?: string } })?.data;
  return d?.error || fallback;
};
const statusOf = (e: unknown) => (e as { status?: number })?.status;
const SANDBOX_WARN = 'SANDBOX ONLY. DO NOT SEND REAL FUNDS. Sandbox orders are test orders and will not be fulfilled.';

function Warn() {
  return <div className="mc-alert mc-alert-err" role="alert" data-testid="status-sandbox-warning"><strong>{SANDBOX_WARN}</strong></div>;
}

export function Checkout() {
  const { cart } = useStore();
  const qc = useQueryClient();
  const config = useGetCheckoutConfig({ query: { queryKey: getGetCheckoutConfigQueryKey() } });
  const create = useCreateOrder();
  const [buyer, setBuyer] = useState({ name: '', email: '', phone: '' });
  const [method, setMethod] = useState<'crypto' | 'bank'>('crypto');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const keyRef = useRef<{ sig: string; key: string } | null>(null);
  const lines = useMemo(() => cart.map((l) => ({ id: l.id, qty: l.qty })), [cart]);
  const sig = JSON.stringify({ buyer: { name: buyer.name.trim(), email: buyer.email.trim(), phone: buyer.phone.trim() }, lines });
  const catalog = config.data?.products ?? [];
  const rows = lines.map((l) => ({ ...l, p: catalog.find((c) => c.id === l.id) }));
  const total = rows.reduce((s, r) => s + (r.p ? r.p.price * r.qty : 0), 0);
  const problem = rows.find((r) => !r.p || r.p.available < r.qty);
  const valid = buyer.name.trim().length >= 2 && /^\S+@\S+\.\S+$/.test(buyer.email.trim()) && buyer.phone.trim().length >= 5;
  const canSubmit = !!config.data?.available && method === 'crypto' && valid && !problem && !submitting && lines.length > 0;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!canSubmit) return;
    setError('');
    setSubmitting(true);
    if (!keyRef.current || keyRef.current.sig !== sig) {
      let parsed: { sig: string; key: string } | null = null;
      try {
        const stored = sessionStorage.getItem('mcf-idem');
        parsed = stored ? (JSON.parse(stored) as { sig: string; key: string }) : null;
      } catch { /* Storage may be blocked; keep this request key in memory. */ }
      keyRef.current = parsed && parsed.sig === sig ? parsed : { sig, key: crypto.randomUUID() };
      try { sessionStorage.setItem('mcf-idem', JSON.stringify(keyRef.current)); }
      catch { /* The private fragment remains usable without browser storage. */ }
    }
    try {
      const s = await create.mutateAsync({ data: { buyer: { name: buyer.name.trim(), email: buyer.email.trim(), phone: buyer.phone.trim() }, lines, idempotencyKey: keyRef.current.key } });
      try { localStorage.setItem(tokenKey(s.order.id), s.accessToken); }
      catch { /* Navigation carries the private token even when storage is blocked. */ }
      qc.setQueryData(getGetOrderQueryKey(s.order.id, { token: s.accessToken }), s.order);
      window.location.assign(`${import.meta.env.BASE_URL.replace(/\/$/, '')}/order/${s.order.id}#access=${encodeURIComponent(s.accessToken)}`);
    } catch (err) {
      setError(errMsg(err, 'We could not create the invoice. Your key is kept, so retrying will not create a duplicate. Check the order status before trying again.'));
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <PageBanner title="Checkout" />
      <section className="mc-container mc-sec">
        {cart.length === 0 ? (
          <div className="mc-center mc-empty">
            <p>Your cart is currently empty, so there is nothing to check out.</p>
            <Link href="/shop" className="mc-btn">Return to shop</Link>
          </div>
        ) : config.isLoading ? (
          <div aria-busy="true" aria-label="Loading checkout"><div className="mc-skel" /><div className="mc-skel" /><div className="mc-skel" /></div>
        ) : config.isError || !config.data ? (
          <div className="mc-alert mc-alert-err" role="alert" data-testid="status-config-error">
            Checkout could not be loaded. <button type="button" className="mc-btn mc-btn-sm" onClick={() => config.refetch()}>Retry</button>
          </div>
        ) : (
          <form className="mc-cart" onSubmit={submit} noValidate>
            <div>
              <Warn />
              <div className="mc-alert" role="note" data-testid="status-checkout-config">{config.data.message}</div>
              <h3>Contact for fulfillment</h3>
              <div className="mc-form" style={{ marginTop: 0 }}>
                <label>Full name<input autoComplete="name" value={buyer.name} onChange={(e) => setBuyer({ ...buyer, name: e.target.value })} maxLength={100} data-testid="input-name" /></label>
                <label>Email<input type="email" autoComplete="email" value={buyer.email} onChange={(e) => setBuyer({ ...buyer, email: e.target.value })} maxLength={200} data-testid="input-email" /></label>
                <label>Phone<input type="tel" autoComplete="tel" value={buyer.phone} onChange={(e) => setBuyer({ ...buyer, phone: e.target.value })} maxLength={40} data-testid="input-phone" /></label>
              </div>
              <h3 style={{ marginTop: 24 }}>Payment method</h3>
              <div className="mc-pay">
                <label className={method === 'crypto' ? 'on' : ''}>
                  <input type="radio" name="pay" checked={method === 'crypto'} onChange={() => setMethod('crypto')} data-testid="radio-crypto" />
                  <span><strong>Cryptocurrency (sandbox) <em>Test mode</em></strong>
                    <small>An invoice is created on OxaPay's hosted payment page. Crypto can confirm faster than bank transfer. For real orders, confirmed crypto payments receive priority dispatch to help your order arrive sooner; delivery times vary. This sandbox invoice is only a test and will not be fulfilled. Processor or network fees may be added according to merchant settings, so check the displayed amount before proceeding. We never ask for wallet keys.</small></span>
                </label>
                <label className={method === 'bank' ? 'on disabled' : 'disabled'}>
                  <input type="radio" name="pay" disabled data-testid="radio-bacs" />
                  <span><strong>Direct bank transfer <em>Unavailable</em></strong>
                    <small>Bank transfers may take longer to confirm, especially during busy periods. Bank details have not been supplied for this site yet, so this option is unavailable. Do not send money based on this page.</small></span>
                </label>
              </div>
              {problem && <div className="mc-alert mc-alert-err" role="alert" data-testid="status-stock-problem">One or more calves in your cart are not available in the quantity requested. Edit your cart to continue.</div>}
              {error && <div className="mc-alert mc-alert-err" role="alert" data-testid="status-checkout-error">{error}</div>}
              <button type="submit" className="mc-btn" disabled={!canSubmit} aria-busy={submitting} data-testid="button-place-order">{submitting ? 'Creating invoice...' : 'Create sandbox invoice'}</button>
              {!valid && <p className="mc-note">Enter your name, a valid email and a phone number to continue.</p>}
            </div>
            <aside className="mc-totals">
              <h3>Your order</h3>
              {rows.map((r) => (
                <div className="mc-total-row" key={r.id}>
                  <span>{r.p?.name ?? `Item ${r.id}`} x {r.qty}{r.p && <small style={{ display: 'block', color: '#999' }}>Sandbox inventory: {r.p.available} (not real stock)</small>}</span>
                  <span>{r.p ? fmt(r.p.price * r.qty) : 'Unavailable'}</span>
                </div>
              ))}
              <div className="mc-total-row"><span>Total (USD)</span><strong data-testid="text-checkout-total">{fmt(total)}</strong></div>
              <p className="mc-note">Prices come from the server, not from browser drafts.</p>
              <Link href="/cart" className="mc-btn mc-btn-outline">Edit cart</Link>
            </aside>
          </form>
        )}
      </section>
    </Layout>
  );
}

const ACTIVE = ['creating', 'pending', 'paying'];

function useNoReferrer() {
  useEffect(() => {
    const m = document.createElement('meta');
    m.name = 'referrer'; m.content = 'no-referrer';
    document.head.appendChild(m);
    return () => { m.remove(); };
  }, []);
}

function Receipt({ o }: { o: OrderReceipt }) {
  return (
    <div className="mc-cart">
      <div>
        <p><span className={`mc-status ${o.status}`} data-testid="status-order">{o.status}</span></p>
        <p data-testid="text-order-message">{o.message}</p>
        {o.sandbox && <Warn />}
        {ACTIVE.includes(o.status) && (
          <p className="mc-note" role="status">
            {o.status === 'creating' ? 'Your invoice is still being created. Keep this page open; it refreshes automatically. Do not place the order again.' : 'Checking for payment every 10 seconds. Returning from the payment page does not mean you have paid.'}
          </p>
        )}
        {o.paymentUrl && ACTIVE.includes(o.status) && (
          <a href={o.paymentUrl} className="mc-btn" rel="noopener noreferrer" data-testid="link-payment">Open hosted payment page</a>
        )}
        <p className="mc-note">Expires {new Date(o.expiresAt).toLocaleString()}. Order {o.id}{o.trackId ? `, invoice ${o.trackId}` : ''}.</p>
        <div className="mc-alert" role="note">This receipt is private. Anyone with this link can view it, so do not share it.</div>
      </div>
      <aside className="mc-totals">
        <h3>Receipt</h3>
        {o.lines.map((l) => <div className="mc-total-row" key={l.id}><span>{l.name} x {l.qty}</span><span>{fmt(l.unitPrice * l.qty)}</span></div>)}
        <div className="mc-total-row"><span>Total ({o.currency})</span><strong data-testid="text-order-total">{fmt(o.total)}</strong></div>
      </aside>
    </div>
  );
}

export function OrderPage({ id }: { id: string }) {
  useNoReferrer();
  const [token, setToken] = useState('');
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const m = /access=([^&]+)/.exec(window.location.hash);
    let fromHash = '';
    try { fromHash = m ? decodeURIComponent(m[1]) : ''; } catch { /* Invalid private link. */ }
    let stored = '';
    try {
      if (fromHash) localStorage.setItem(tokenKey(id), fromHash);
      stored = localStorage.getItem(tokenKey(id)) || '';
    } catch { /* Use the full private link when browser storage is unavailable. */ }
    setToken(fromHash || stored);
    setReady(true);
  }, [id]);
  const q = useGetOrder(id, { token }, {
    query: {
      queryKey: getGetOrderQueryKey(id, { token }),
      enabled: ready && !!token,
      retry: false,
      refetchInterval: (query) => { const s = query.state.data?.status; return s && !ACTIVE.includes(s) ? false : 10000; },
    },
  });
  const status = statusOf(q.error);
  return (
    <Layout>
      <PageBanner title="Order status" />
      <section className="mc-container mc-sec">
        {!ready ? null : !token ? (
          <div className="mc-center mc-empty" data-testid="status-missing-token">
            <p>This order link is missing its access key. Open the full private link you were given at checkout.</p>
            <Link href="/shop" className="mc-btn">Return to shop</Link>
          </div>
        ) : q.isLoading ? (
          <div aria-busy="true" aria-label="Loading order"><div className="mc-skel" /><div className="mc-skel" /></div>
        ) : q.isError ? (
          <div className="mc-alert mc-alert-err" role="alert" data-testid="status-order-error">
            {status === 401 || status === 403 || status === 404 ? 'This order could not be opened. The access key is invalid or does not match this order.' : errMsg(q.error, 'The order status could not be loaded.')}{' '}
            {!(status === 401 || status === 403 || status === 404) && <button type="button" className="mc-btn mc-btn-sm" onClick={() => q.refetch()}>Retry</button>}
          </div>
        ) : q.data ? <Receipt o={q.data} /> : null}
      </section>
    </Layout>
  );
}

export function OwnerOrders() {
  const { user } = useUser();
  const { signOut } = useClerk();
  return <OwnerOrdersView userId={user?.id ?? ''} email={user?.primaryEmailAddress?.emailAddress ?? ''} onSignOut={() => signOut({ redirectUrl: import.meta.env.BASE_URL })} />;
}

export function OwnerOrdersView({ userId, email, onSignOut, provider = 'Clerk' }: {
  userId: string; email: string; onSignOut: () => Promise<unknown>; provider?: string;
}) {
  const q = useGetOwnerOrders({ query: { queryKey: getGetOwnerOrdersQueryKey(), retry: false, refetchInterval: 30000 } });
  const status = statusOf(q.error);
  const [logoutError, setLogoutError] = useState('');
  return (
    <Layout>
      <PageBanner title="Owner orders" />
      <section className="mc-container mc-sec">
        <div className="mc-toolbar">
          <span>{email}</span>
          <button type="button" className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => { void onSignOut().catch(() => setLogoutError('Sign-out could not be completed. Please retry.')); }} data-testid="button-logout">Log out</button>
        </div>
        {logoutError && <div role="alert" className="mc-alert mc-alert-err">{logoutError}</div>}
        {q.isLoading ? (
          <div aria-busy="true" aria-label="Loading orders"><div className="mc-skel" /><div className="mc-skel" /><div className="mc-skel" /></div>
        ) : q.isError ? (
          status === 401 || status === 403 ? (
            <div className="mc-alert mc-alert-err" role="alert" data-testid="status-not-authorized">
              <strong>This account is not authorized as owner.</strong> Owner confirmation is pending. Give this signed-in {provider} user ID to the site administrator: <span className="mc-mono" data-testid="text-user-id">{userId || 'unknown'}</span>
            </div>
          ) : (
            <div className="mc-alert mc-alert-err" role="alert" data-testid="status-owner-error">Orders could not be loaded. <button type="button" className="mc-btn mc-btn-sm" onClick={() => q.refetch()}>Retry</button></div>
          )
        ) : !q.data || q.data.length === 0 ? (
          <div className="mc-center mc-empty" data-testid="text-owner-empty"><p>No orders yet.</p></div>
        ) : (
          <div className="mc-table-wrap">
            <table className="mc-table">
              <thead><tr><th>Order ID</th><th>Status</th><th>Buyer</th><th>Contact</th><th>Items</th><th>Total</th><th>Invoice</th><th>Created</th></tr></thead>
              <tbody>
                {q.data.map(({ order: o, buyer: b }) => (
                  <tr key={o.id} data-testid={`row-owner-order-${o.id}`}>
                    <td className="mc-mono">{o.id}</td>
                    <td><span className={`mc-status ${o.status}`}>{o.status}</span>{o.sandbox && <small>sandbox</small>}</td>
                    <td>{b.name}</td>
                    <td>{b.email}<small>{b.phone}</small></td>
                    <td>{o.lines.map((l) => <div key={l.id}>{l.name} x {l.qty} @ {fmt(l.unitPrice)} <small>id {l.id}</small></div>)}</td>
                    <td>{fmt(o.total)} {o.currency}</td>
                    <td className="mc-mono">{o.trackId ?? 'none'}<small>{o.message}</small></td>
                    <td>{new Date(o.createdAt).toLocaleString()}<small>expires {new Date(o.expiresAt).toLocaleString()}</small></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Layout>
  );
}
