import { useEffect, useState } from 'react';
import { useGetOwnerAnalytics } from '@workspace/api-client-react';
import { POLL, usd, when, errText, isAuthFailure } from './util';

export function Dashboard({ onAuthFail }: { onAuthFail: (s: number) => void }) {
  const now = new Date();
  const [period, setPeriod] = useState<'daily' | 'monthly'>('daily');
  const [month, setMonth] = useState(`${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`);
  const [year, setYear] = useState(now.getFullYear());
  const params = period === 'daily' ? { period, month } : { period, year };
  const q = useGetOwnerAnalytics(params, { query: { queryKey: ['/api/owner/analytics', params], refetchInterval: POLL } });
  const qErr = q.error;
  useEffect(() => { if (qErr && isAuthFailure(qErr)) onAuthFail((qErr as { status: number }).status); }, [qErr, onAuthFail]);
  const d = q.data;
  return (
    <section className="ad-panel" aria-labelledby="ad-dash-h">
      <header className="ad-head"><h2 id="ad-dash-h">Sales and visitors</h2>
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
      {q.isLoading && <div className="ad-skel" role="status">Loading figures…</div>}
      {q.isError && !isAuthFailure(q.error) && <div className="ad-err" role="alert">{errText(q.error)} <button onClick={() => q.refetch()}>Retry</button></div>}
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
        <h3>Top pages</h3>
        <div className="ad-scroll"><table className="ad-table"><thead><tr><th>Path</th><th className="n">Views</th></tr></thead>
          <tbody>{d.topPages.map(p => <tr key={p.path}><td>{p.path}</td><td className="n">{p.views}</td></tr>)}
            {d.topPages.length === 0 && <tr><td colSpan={2} className="ad-empty">No page views yet.</td></tr>}</tbody></table></div>
      </>}
    </section>
  );
}
