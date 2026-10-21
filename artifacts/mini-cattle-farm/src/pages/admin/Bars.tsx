export function Bars({ data, label, format }: { data: { key: string; value: number; sub?: string }[]; label: string; format?: (n: number) => string }) {
  const max = Math.max(1, ...data.map(d => d.value));
  const f = format ?? ((n: number) => String(n));
  return (
    <div className="ad-bars" role="img" aria-label={`${label}: ${data.map(d => `${d.key} ${f(d.value)}`).join(', ')}`}>
      {data.map(d => (
        <div className="ad-bar-col" key={d.key} title={`${d.key}: ${f(d.value)}`}>
          <span className="ad-bar-val">{d.value > 0 ? f(d.value) : ''}</span>
          <div className="ad-bar-track"><div className="ad-bar-fill" style={{ height: `${(d.value / max) * 100}%` }} /></div>
          <span className="ad-bar-key">{d.sub ?? d.key}</span>
        </div>
      ))}
    </div>
  );
}
export function Share({ items, total }: { items: { label: string; count: number }[]; total: number }) {
  if (items.length === 0) return <p className="ad-note">No data recorded yet.</p>;
  return (
    <ul className="ad-share">
      {items.map(i => (
        <li key={i.label}><span className="l">{i.label || 'Unknown'}</span>
          <span className="t"><i style={{ width: `${total ? (i.count / total) * 100 : 0}%` }} /></span>
          <span className="c">{i.count}</span></li>
      ))}
    </ul>
  );
}
