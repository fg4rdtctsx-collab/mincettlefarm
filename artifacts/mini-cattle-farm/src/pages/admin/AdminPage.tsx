import { Component, useCallback, useState, type ReactNode } from 'react';
import './admin.css';
import { Beef, ClipboardList, LayoutDashboard, LogOut, Users, type LucideIcon } from 'lucide-react';
import { Dashboard } from './Dashboard';
import { Visitors } from './Visitors';
import { Livestock } from './Livestock';
import { Orders } from './Orders';

class Guard extends Component<{ children: ReactNode; onSignOut: () => void }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() { return { failed: true }; }
  componentDidCatch() { /* intentionally log nothing: errors may contain business data */ }
  render() {
    if (!this.state.failed) return this.props.children;
    return <div className="ad-deny" role="alert" data-testid="status-admin-crash"><h2>Something went wrong</h2><p>The admin screen stopped and all data on it was cleared. Sign out and sign in again.</p><button className="ad-btn" onClick={this.props.onSignOut}>Sign out</button></div>;
  }
}

type Tab = 'dashboard' | 'visitors' | 'livestock' | 'orders';
const TABS: [Tab, string][] = [['dashboard', 'Overview'], ['visitors', 'Visitors'], ['livestock', 'Livestock'], ['orders', 'Orders']];

const ICONS: Record<Tab, LucideIcon> = { dashboard: LayoutDashboard, visitors: Users, livestock: Beef, orders: ClipboardList };

export function AdminPage({ userId, email, onSignOut }: { userId: string; email: string; onSignOut: () => Promise<void> }) {
  const [tab, setTab] = useState<Tab>('dashboard');
  const [authFail, setAuthFail] = useState<number | null>(null);
  const [signErr, setSignErr] = useState('');
  const [signing, setSigning] = useState(false);
  const out = async () => {
    setSigning(true); setSignErr('');
    try { await onSignOut(); } catch { setSignErr('Sign-out failed. Please try again.'); } finally { setSigning(false); }
  };
  const fail = useCallback((s: number) => setAuthFail(prev => prev ?? s), []);
  return (
    <div className="ad-root" data-user={userId}>
      <aside className="ad-side">
        <div className="ad-logo"><span className="ad-mark" aria-hidden="true"><Beef size={18} /></span><div><strong className="ad-brand">Mini Cattle Farm</strong><span className="ad-sub">Owner desk</span></div></div>
        {!authFail && <nav aria-label="Admin sections" className="ad-nav">{TABS.map(([k, l]) => { const Ic = ICONS[k]; return <button key={k} className={tab === k ? 'on' : ''} aria-current={tab === k ? 'page' : undefined} onClick={() => setTab(k)} data-testid={`tab-${k}`}><Ic size={18} aria-hidden="true" /><span>{l}</span></button>; })}</nav>}
        <div className="ad-who"><span title={email}>{email}</span><button className="ad-btn ghost sm" onClick={out} disabled={signing} data-testid="button-sign-out"><LogOut size={14} aria-hidden="true" /> {signing ? 'Signing out...' : 'Sign out'}</button></div>
      </aside>
      <main className="ad-main"><Guard onSignOut={() => void out()}>
        {signErr && <div className="ad-err" role="alert">{signErr}</div>}
        {authFail ? (
          <div className="ad-deny" role="alert" data-testid="status-auth-failure">
            <h2>{authFail === 401 ? 'Your session has expired' : 'This account is not approved'}</h2>
            <p>{authFail === 401 ? 'Please sign out and sign in again.' : 'This account is not authorized as an owner of this shop. No business data is shown.'}</p>
            <button className="ad-btn" onClick={out} disabled={signing}>Sign out</button>
          </div>
        ) : tab === 'dashboard' ? <Dashboard onAuthFail={fail} /> : tab === 'visitors' ? <Visitors onAuthFail={fail} /> : tab === 'livestock' ? <Livestock onAuthFail={fail} /> : <Orders onAuthFail={fail} />}
      </Guard></main>
    </div>
  );
}
export default AdminPage;
