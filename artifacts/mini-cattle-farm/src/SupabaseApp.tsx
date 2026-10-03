import { useEffect, useRef, useState } from 'react';
import { type Session } from '@supabase/supabase-js';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Redirect, Route, Switch, Router, useLocation } from 'wouter';
import { StoreProvider } from '@/lib/store';
import { supabase, configureSupabaseApi } from '@/lib/supabase';
import { About, Category, Contact, Faq, Home, NotFound, ProductPage, Services, Shop } from '@/pages/storefront';
import { Cart, Compare, Wishlist } from '@/pages/commerce';
import { Checkout, OrderPage } from '@/pages/payment';
import { AdminPage } from '@/pages/admin';
import { VisitorTracker } from '@/components/visitor-tracker';

const queryClient = new QueryClient();
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function SupabaseRoutes() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(!supabase);
  const [authError, setAuthError] = useState('');
  const priorUserId = useRef<string | null | undefined>(undefined);
  const [, navigate] = useLocation();
  useEffect(() => {
    configureSupabaseApi();
    if (!supabase) return;
    let mounted = true;
    let changed = false;
    const apply = (next: Session | null) => {
      if (!mounted) return;
      const id = next?.user.id ?? null;
      if (priorUserId.current !== undefined && priorUserId.current !== id) queryClient.clear();
      priorUserId.current = id;
      setSession(next); setReady(true);
    };
    const { data: listener } = supabase.auth.onAuthStateChange((_event, next) => { changed = true; apply(next); });
    void supabase.auth.getSession().then(({ data, error }) => {
      if (error) throw error;
      if (!changed) apply(data.session);
    }).catch(() => {
      if (mounted) { setAuthError('Your sign-in session could not be loaded. Please sign in again.'); setReady(true); }
    });
    return () => { mounted = false; listener.subscription.unsubscribe(); };
  }, []);

  const logout = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) throw error;
    queryClient.clear(); navigate('/');
  };
  const owner = !ready ? <p className="mc-container" role="status">Loading sign-in…</p>
    : session ? <AdminPage userId={session.user.id} email={session.user.email ?? ''} onSignOut={logout} />
    : <Redirect to="/sign-in" />;
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/sign-in/*?">{session ? <Redirect to="/admin" /> : <OwnerSignIn initialError={authError} />}</Route>
      <Route path="/sign-up/*?"><Redirect to="/sign-in" /></Route>
      <Route path="/shop" component={Shop} />
      <Route path="/product/:slug">{p => <ProductPage key={p.slug} slug={p.slug} />}</Route>
      <Route path="/product-category/:slug">{p => <Category slug={p.slug} />}</Route>
      <Route path="/about" component={About} />
      <Route path="/contact" component={Contact} />
      <Route path="/faq" component={Faq} />
      <Route path="/services" component={Services} />
      <Route path="/cart" component={Cart} />
      <Route path="/checkout" component={Checkout} />
      <Route path="/order/:id">{p => <OrderPage key={p.id} id={p.id} />}</Route>
      <Route path="/admin">{owner}</Route>
      <Route path="/owner/orders"><Redirect to="/admin" /></Route>
      <Route path="/wishlist" component={Wishlist} />
      <Route path="/compare" component={Compare} />
      <Route path="/admin-preview"><Redirect to="/admin" /></Route>
      <Route component={NotFound} />
    </Switch>
  );
}

function OwnerSignIn({ initialError }: { initialError: string }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState(initialError);
  const [, navigate] = useLocation();
  return (
    <div className="mc-auth">
      <form className="mc-form" style={{ maxWidth: 440, padding: 28, border: '1px solid #ebe6df' }} onSubmit={async e => {
        e.preventDefault();
        if (!supabase || busy) return;
        setBusy(true); setError('');
        try {
          const { error: failure } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
          if (failure) throw failure;
          setPassword(''); navigate('/admin');
        } catch { setError('Sign-in failed. Check your email and password, and confirm the account is verified.'); }
        finally { setBusy(false); }
      }}>
        <h2>Owner sign in</h2>
        <p>Mini Cattle Farm order review. Only explicitly approved accounts can view orders.</p>
        {!supabase && <div className="mc-alert mc-alert-err" role="alert">Owner sign-in is not configured yet. The Supabase project URL and browser publishable key must be added before deployment.</div>}
        <label>Email<input type="email" autoComplete="username" required value={email} onChange={e => setEmail(e.target.value)} data-testid="input-owner-email" /></label>
        <label>Password<input type="password" autoComplete="current-password" required value={password} onChange={e => setPassword(e.target.value)} data-testid="input-owner-password" /></label>
        {error && <div className="mc-alert mc-alert-err" role="alert">{error}</div>}
        <button className="mc-btn" type="submit" disabled={busy || !supabase} data-testid="button-owner-sign-in">{busy ? 'Signing in…' : 'Sign in'}</button>
        <p className="mc-note">Ask the site administrator to create or recover your account. There is no public owner signup.</p>
      </form>
    </div>
  );
}

export default function SupabaseApp() {
  configureSupabaseApi();
  return <Router base={basePath}><QueryClientProvider client={queryClient}><StoreProvider><VisitorTracker /><SupabaseRoutes /></StoreProvider></QueryClientProvider></Router>;
}