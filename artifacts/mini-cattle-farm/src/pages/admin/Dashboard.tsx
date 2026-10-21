import { useEffect, useState } from 'react';
import { useGetOwnerAnalytics, useGetOwnerInventory, useGetOwnerOrders } from '@workspace/api-client-react';
import { POLL, STATUS_POLL, usd, when, errText, isAuthFailure, statusLabel } from './util';
import { Bars } from './Bars';

export function Dashboard({ onAuthFail }: { onAuthFail: (s: number) => void }) {
  const now = new Date();
  const lagos = new Intl.DateTimeFormat('en-CA', { timeZone: 'Africa/Lagos', year: 'numeric', month: '2-digit' }).formatToParts(now);
  const currentYear = Number(lagos.find(p => p.type === 'year')!.value);
  const currentMonth = `${currentYear}-${lagos.find(p => p.type === 'month')!.value}`;
  const [period, setPeriod] = useState<'daily' | 'monthly'>('daily');
  const [month, setMonth] = useState(currentMonth);
  const [year, setYear] = useState(currentYear);
  const params = period === 'daily' ? { period, month } : { period, year };
  const q = useGetOwnerAnalytics(params, { query: { queryKey: ['/api/owner/analytics', params], refetchInterval: POLL } });
  const ord = useGetOwnerOrders({ query: { queryKey: ['/api/owner/orders'], refetchInterval: STATUS_POLL } });
  const inv = useGetOwnerInventory({ query: { queryKey: ['/api/owner/inventory'], refetchInterval: POLL } });
  const qErr = q.error; const oErr = ord.error; const iErr = inv.error;
  useEffect(() => { for (const e of [qErr, oErr, iErr]) if (e && isAuthFailure(e)) { onAuthFail((e as { status: number }).status); break; } }, [qErr, oErr, iErr, onAuthFail]);
  const orders = ord.data ?? []; const items = (inv.data ?? []).filter(i => i.active);
  const count = (f: (o: (typeof orders)[number]) => boolean) => orders.filter(f).length;
  const cryptoWait = count(o => o.order.paymentMethod !== 'bank' && ['pending', 'paying'].includes(o.order.status));
  const bankWait = count(o => o.order.paymentMethod === 'bank' && o.order.status === 'pending');
  const review = count(o => o.order.status === 'review');
  const toShip = count(o => o.order.status === 'paid' && !o.order.fulfilledAt);
  const recent = orders.slice(0, 5);
  const d = q.data;
  return (
    <section className="ad-panel" aria-labelledby="ad-dash-h">
      <header className="ad-head"><h2 id="ad-dash-h">Overview</h2>
        <div className="ad-row">
          <div className="ad-seg" role="group" aria-label="Period">
            <button className={period === 'daily' ? 'on' : ''} onClick={() => setPeriod('daily')} data-testid="button-period-daily">Daily</button>
            <button className={period === 'monthly' ? 'on' : ''} onClick={() => setPeriod('monthly')} data-testid="button-period-monthly">Monthly</button>
          </div>
          {period === 'daily'
            ? <label className="ad-inline">Month<input type="month" value={month} onChange={e => e.target.value && setMonth(e.target.value)} data-testid="input-month" /></label>
            : <label className="ad-inline">Year<input type="number" min={2020} max={2100} value={year} onChange={e => { const v = Number(e.target.value); if (v >= 2020 && v <= 2100) setYear(v); }} data-testid="input-year" /></label>}
        </div>
      </header>
      {q.isLoading && <div className="ad-skel" role="status">Loading figures...</div>}
      {q.isError && !isAuthFailure(q.error) && <div className="ad-err" role="alert">{errText(q.error)} <button onClick={() => q.refetch()}>Retry</button></div>}
      {(ord.isError || inv.isError) && <div className="ad-err" role="alert">Some overview figures could not refresh. {errText(ord.error || inv.error)} <button onClick={() => { void ord.refetch(); void inv.refetch(); }}>Retry</button></div>}
      <p className="ad-note">Order activity below covers the newest 200 orders. Confirmed sales reports cover the full selected period.</p>
      <div className="ad-kpis" aria-label="Orders and catalog">
        <div className="ad-kpi k1"><span>Crypto in progress</span><strong data-testid="text-crypto-wait">{ord.data ? cryptoWait : '-'}</strong><em>verified automatically by the processor</em></div>
        <div className="ad-kpi k2"><span>Bank awaiting you</span><strong>{ord.data ? bankWait : '-'}</strong><em>confirm after funds arrive</em></div>
        <div className="ad-kpi k3"><span>Needs review</span><strong>{ord.data ? review : '-'}</strong><em>{ord.data ? `${toShip} paid, to fulfil` : ''}</em></div>
        <div className="ad-kpi k4"><span>Listed animals</span><strong>{inv.data ? items.length : '-'}</strong><em>{inv.data ? `${items.reduce((s, i) => s + i.available, 0)} units available` : ''}</em></div>
      </div>
      {ord.data && <div className="ad-card"><h3>Latest orders</h3>
        {recent.length === 0 ? <p className="ad-note">No orders yet.</p> : <ul className="ad-share plain">{recent.map(({ order: o, buyer: b }) => <li key={o.id}><span className="l">{b.name} - {usd(o.total)}</span><span className={`ad-pill s-${o.status}`}>{statusLabel(o.status, o.paymentMethod)}</span></li>)}</ul>}</div>}
      {d && <>
        <div className="ad-stats">
          <div className="ad-stat big"><span>CONFIRMED SALES REVENUE USD</span><strong data-testid="text-revenue">{usd(d.totals.revenue)}</strong><em>Bank-confirmed and crypto-paid orders only. Not net profit, commission or processor settlement; costs are not tracked.</em></div>
          <div className="ad-stat"><span>Paid orders</span><strong>{d.totals.paidOrders}</strong></div>
          <div className="ad-stat"><span>Approx. visitors</span><strong>{d.totals.visitors}</strong></div>
          <div className="ad-stat"><span>Page views</span><strong>{d.totals.pageViews}</strong></div>
        </div>
        <p className="ad-note">Visitors are approximate anonymous browser sessions, not named individuals. Tracking began {when(d.trackingStartedAt)}; nothing earlier is recorded. Times are {d.timezone}.</p>
        <div className="ad-scroll"><table className="ad-table">
          <thead><tr><th>{period === 'daily' ? 'Day' : 'Month'}</th><th className="n">Revenue</th><th className="n">Paid orders</th><th className="n">Visitors</th><th className="n">Page views</th></tr></thead>
          <tbody>{d.buckets.map(b => <tr key={b.bucket}><td>{b.bucket}</td><td className="n">{usd(b.revenue)}</td><td className="n">{b.paidOrders}</td><td className="n">{b.visitors}</td><td className="n">{b.pageViews}</td></tr>)}
            {d.buckets.length === 0 && <tr><td colSpan={5} className="ad-empty">No data for this selection.</td></tr>}</tbody>
        </table></div>
        <h3>{period === 'daily' ? 'Daily' : 'Monthly'} visitors</h3>
        <Bars label="Visitors" data={d.buckets.map(b => ({ key: b.bucket, value: b.visitors, sub: b.bucket.slice(period === 'daily' ? 8 : 5) }))} />
        <h3>Top pages</h3>
        <div className="ad-scroll"><table className="ad-table"><thead><tr><th>Path</th><th className="n">Views</th></tr></thead>
          <tbody>{d.topPages.map(p => <tr key={p.path}><td>{p.path}</td><td className="n">{p.views}</td></tr>)}
            {d.topPages.length === 0 && <tr><td colSpan={2} className="ad-empty">No page views yet.</td></tr>}</tbody></table></div>
      </>}
    </section>
  );
}
