import { useEffect, useMemo, useState } from 'react';
import { useGetOwnerVisitors, getGetOwnerVisitorsQueryKey } from '@workspace/api-client-react';
import { when, errText, isAuthFailure } from './util';
import { Bars, Share } from './Bars';
import { Country, countryName, countryFlag } from './Country';

const VPOLL = 15000;
export function Visitors({ onAuthFail }: { onAuthFail: (s: number) => void }) {
  const q = useGetOwnerVisitors({ query: { queryKey: getGetOwnerVisitorsQueryKey(), refetchInterval: VPOLL } });
  const qErr = q.error;
  useEffect(() => { if (qErr && isAuthFailure(qErr)) onAuthFail((qErr as { status: number }).status); }, [qErr, onAuthFail]);
  const [text, setText] = useState('');
  const [device, setDevice] = useState('all');
  const d = q.data;
  const rows = useMemo(() => {
    const t = text.trim().toLowerCase();
    return (d?.recent ?? []).filter(r => (device === 'all' || r.device === device) && (!t || [r.path, r.referrer, r.device, r.browser, countryName(r.country)].some(x => (x || '').toLowerCase().includes(t))));
  }, [d, text, device]);
  const devices = useMemo(() => Array.from(new Set((d?.recent ?? []).map(r => r.device))), [d]);
  const sum = (a: { count: number }[]) => a.reduce((s, x) => s + x.count, 0);
  return (
    <section className="ad-panel" aria-labelledby="ad-vis-h">
      <header className="ad-head">
        <div><h2 id="ad-vis-h">Visitors</h2><p className="ad-note">Totals and breakdowns cover all recorded history. The recent table shows the newest {d?.recentLimit ?? 100} sessions.</p></div>
        <button className="ad-btn ghost" onClick={() => q.refetch()} disabled={q.isFetching} data-testid="button-refresh-visitors">{q.isFetching ? 'Refreshing...' : 'Refresh'}</button>
      </header>
      {q.isLoading && <div className="ad-skel" role="status">Loading visitors...</div>}
      {q.isError && !isAuthFailure(q.error) && <div className="ad-err" role="alert">{errText(q.error)} <button onClick={() => q.refetch()}>Retry</button></div>}
      {d && <>
        <div className="ad-kpis">
          <div className="ad-kpi k1"><span>Live visitors</span><strong data-testid="text-live">{d.live}</strong><em>active in last 90 seconds</em></div>
          <div className="ad-kpi k2"><span>Visitors today</span><strong data-testid="text-today">{d.today}</strong><em>{d.pageViews} page views all time</em></div>
          <div className="ad-kpi k3"><span>All-time visitors</span><strong data-testid="text-alltime">{d.allTime}</strong><em>since {when(d.trackingStartedAt)}</em></div>
          <div className="ad-kpi k4"><span>Highest daily visitors</span><strong>{d.peakVisitors}</strong><em>{d.peakDay || 'No data yet'}</em></div>
        </div>
        <p className="ad-note">Visitors are approximate anonymous browser sessions. Times are {d.timezone}.</p>
        <div className="ad-card"><h3>Traffic, last 7 days</h3>
          <p className="ad-note">Daily anonymous sessions; returning sessions may appear on multiple days.</p>
          <Bars label="Visitors per day" data={d.days.map(x => ({ key: x.day, value: x.visitors, sub: x.day.slice(5) }))} /></div>
        <div className="ad-grid3">
          <div className="ad-card"><h3>Visitor locations</h3><Share items={d.countries.map(c => ({ ...c, label: `${countryFlag(c.label)} ${countryName(c.label)}`.trim() }))} total={sum(d.countries)} /><p className="ad-note">Approximate IP-based countries. VPNs can affect accuracy. Older visits without location data remain Unknown.</p></div>
          <div className="ad-card"><h3>Sources</h3><Share items={d.sources} total={sum(d.sources)} /></div>
          <div className="ad-card"><h3>Devices</h3><Share items={d.devices} total={sum(d.devices)} /></div>
          <div className="ad-card"><h3>Browsers</h3><Share items={d.browsers} total={sum(d.browsers)} /></div>
        </div>
        <div className="ad-card"><h3>Top pages</h3>
          <ul className="ad-share">{d.topPages.map(p => <li key={p.path}><span className="l">{p.path}</span><span className="t"><i style={{ width: `${(p.views / Math.max(1, d.topPages[0].views)) * 100}%` }} /></span><span className="c">{p.views}</span></li>)}</ul>
          {d.topPages.length === 0 && <p className="ad-note">No page views yet.</p>}</div>
        <div className="ad-card"><div className="ad-head"><h3>Recent visitors</h3>
          <div className="ad-row">
            <input type="search" aria-label="Filter recent visitors" placeholder="Search country, page, source or browser" value={text} onChange={e => setText(e.target.value)} data-testid="input-visitor-filter" />
            <select aria-label="Device" value={device} onChange={e => setDevice(e.target.value)} data-testid="select-visitor-device"><option value="all">All devices</option>{devices.map(x => <option key={x} value={x}>{x}</option>)}</select>
          </div></div>
          <div className="ad-scroll"><table className="ad-table"><thead><tr><th>Last seen</th><th>First seen</th><th>Location</th><th>Latest page</th><th>Source</th><th>Device</th><th>Browser</th><th className="n">Views</th></tr></thead>
            <tbody>{rows.map(r => <tr key={r.session}><td>{when(r.lastSeen)}</td><td>{when(r.firstSeen)}</td><td><Country code={r.country} /></td><td>{r.path}</td><td>{r.referrer || 'Direct'}</td><td>{r.device}</td><td>{r.browser}</td><td className="n">{r.pageViews}</td></tr>)}
              {rows.length === 0 && <tr><td colSpan={8} className="ad-empty">{d.recent.length === 0 ? 'No visitors recorded yet.' : 'No sessions match this filter.'}</td></tr>}</tbody></table></div>
          <p className="ad-note">Showing {rows.length} of {d.recent.length} recent sessions.</p></div>
      </>}
    </section>
  );
}
