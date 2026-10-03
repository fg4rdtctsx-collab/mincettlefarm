import { useEffect, useRef } from 'react';
import { ClerkProvider, SignIn, SignUp, Show, useClerk } from '@clerk/react';
import { publishableKeyFromHost } from '@clerk/react/internal';
import { QueryClient, QueryClientProvider, useQueryClient } from '@tanstack/react-query';
import { Redirect, Route, Switch, Router as WouterRouter, useLocation } from 'wouter';
import { StoreProvider } from '@/lib/store';
import { About, Category, Contact, Faq, Home, NotFound, ProductPage, Services, Shop } from '@/pages/storefront';
import { AdminPreview, Cart, Compare, Wishlist } from '@/pages/commerce';
import { Checkout, OrderPage, OwnerOrders } from '@/pages/payment';
import SupabaseApp from '@/SupabaseApp';

const queryClient = new QueryClient();

const clerkPubKey = publishableKeyFromHost(
  window.location.hostname,
  import.meta.env.VITE_CLERK_PUBLISHABLE_KEY,
);
const clerkProxyUrl = import.meta.env.VITE_CLERK_PROXY_URL;
const basePath = import.meta.env.BASE_URL.replace(/\/$/, '');

function stripBase(path: string): string {
  return basePath && path.startsWith(basePath) ? path.slice(basePath.length) || '/' : path;
}

const supabaseMode = import.meta.env.VITE_AUTH_PROVIDER === 'supabase';
if (!clerkPubKey && !supabaseMode) {
  throw new Error('Missing VITE_CLERK_PUBLISHABLE_KEY in .env file');
}

const clerkAppearance = {
  options: {
    logoPlacement: 'inside' as const,
    logoLinkUrl: basePath || '/',
    logoImageUrl: `${window.location.origin}${basePath}/logo.svg`,
  },
  variables: {
    colorPrimary: '#f5b332',
    colorForeground: '#242424',
    colorMutedForeground: '#6b6b6b',
    colorDanger: '#b33333',
    colorBackground: '#ffffff',
    colorInput: '#ffffff',
    colorInputForeground: '#242424',
    colorNeutral: '#242424',
    fontFamily: "'Inter', sans-serif",
    borderRadius: '0px',
  },
  elements: {
    rootBox: { width: '100%', display: 'flex', justifyContent: 'center' },
    cardBox: { width: '440px', maxWidth: '100%', background: '#fff', border: '1px solid #ebe6df' },
    headerTitle: { fontFamily: "'Kumbh Sans', sans-serif", color: '#242424' },
    headerSubtitle: { color: '#6b6b6b' },
    formButtonPrimary: { color: '#242424', fontWeight: 700, textTransform: 'uppercase' as const },
    footerActionLink: { color: '#242424', textDecoration: 'underline' },
    footerActionText: { color: '#6b6b6b' },
    formFieldLabel: { color: '#242424' },
    dividerText: { color: '#6b6b6b' },
    socialButtonsBlockButtonText: { color: '#242424' },
    identityPreviewEditButton: { color: '#242424' },
    logoImage: { height: '64px' },
  },
};

function SignInPage() {
  return (
    <div className="mc-auth">
      <SignIn routing="path" path={`${basePath}/sign-in`} signUpUrl={`${basePath}/sign-up`} />
    </div>
  );
}
function SignUpPage() {
  return (
    <div className="mc-auth">
      <SignUp routing="path" path={`${basePath}/sign-up`} signInUrl={`${basePath}/sign-in`} />
    </div>
  );
}

function OwnerRoute() {
  return (
    <>
      <Show when="signed-in"><OwnerOrders /></Show>
      <Show when="signed-out"><Redirect to="/sign-in" /></Show>
    </>
  );
}

function HomeRoute() {
  return (
    <>
      <Show when="signed-in"><Redirect to="/owner/orders" /></Show>
      <Show when="signed-out"><Home /></Show>
    </>
  );
}

function ClerkQueryClientCacheInvalidator() {
  const { addListener } = useClerk();
  const qc = useQueryClient();
  const prevUserIdRef = useRef<string | null | undefined>(undefined);
  useEffect(() => {
    const unsubscribe = addListener(({ user }) => {
      const userId = user?.id ?? null;
      if (prevUserIdRef.current !== undefined && prevUserIdRef.current !== userId) qc.clear();
      prevUserIdRef.current = userId;
    });
    return unsubscribe;
  }, [addListener, qc]);
  return null;
}

function ClerkProviderWithRoutes() {
  const [, setLocation] = useLocation();
  return (
    <ClerkProvider
      publishableKey={clerkPubKey}
      proxyUrl={clerkProxyUrl}
      appearance={clerkAppearance}
      signInUrl={`${basePath}/sign-in`}
      signUpUrl={`${basePath}/sign-up`}
      localization={{
        signIn: { start: { title: 'Owner sign in', subtitle: 'Mini Cattle Farm order review' } },
        signUp: { start: { title: 'Create your account', subtitle: 'Accounts do not grant owner access' } },
      }}
      routerPush={(to) => setLocation(stripBase(to))}
      routerReplace={(to) => setLocation(stripBase(to), { replace: true })}
    >
      <QueryClientProvider client={queryClient}>
        <ClerkQueryClientCacheInvalidator />
        <StoreProvider>
          <Switch>
            <Route path="/" component={HomeRoute} />
            <Route path="/sign-in/*?" component={SignInPage} />
            <Route path="/sign-up/*?" component={SignUpPage} />
            <Route path="/shop" component={Shop} />
            <Route path="/product/:slug">{(p) => <ProductPage key={p.slug} slug={p.slug} />}</Route>
            <Route path="/product-category/:slug">{(p) => <Category slug={p.slug} />}</Route>
            <Route path="/about" component={About} />
            <Route path="/contact" component={Contact} />
            <Route path="/faq" component={Faq} />
            <Route path="/services" component={Services} />
            <Route path="/cart" component={Cart} />
            <Route path="/checkout" component={Checkout} />
            <Route path="/order/:id">{(p) => <OrderPage key={p.id} id={p.id} />}</Route>
            <Route path="/owner/orders" component={OwnerRoute} />
            <Route path="/wishlist" component={Wishlist} />
            <Route path="/compare" component={Compare} />
            <Route path="/admin-preview" component={AdminPreview} />
            <Route component={NotFound} />
          </Switch>
        </StoreProvider>
      </QueryClientProvider>
    </ClerkProvider>
  );
}

function App() {
  if (supabaseMode) return <SupabaseApp />;
  return (
    <WouterRouter base={basePath}>
      <ClerkProviderWithRoutes />
    </WouterRouter>
  );
}

export default App;
