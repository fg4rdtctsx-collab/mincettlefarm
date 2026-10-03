// Public widget ID supplied by the owner, not an API credential.
const APP_ID = '69edff62c9d873834aeb5332';
const SCRIPT_URL = 'https://app.chaport.com/javascripts/insert.js';

type Chaport = {
  _q: unknown[][];
  _l: Record<string, (() => void)[]>;
  q: (method: string, args?: unknown[]) => void;
  on: (event: string, listener: () => void) => void;
};
type ChatWindow = Window & { chaport?: Chaport; chaportConfig?: Record<string, unknown> };

export function isChaportPage(path: string, base = '/') {
  const prefix = base.replace(/\/$/, '');
  if (prefix && path !== prefix && !path.startsWith(`${prefix}/`)) return false;
  const page = path.slice(prefix.length).replace(/\/$/, '') || '/';
  return ['/', '/shop', '/about', '/contact', '/faq', '/services', '/cart', '/checkout', '/wishlist', '/compare'].includes(page)
    || /^\/(product|product-category)\/[^/]+$/.test(page);
}

export function createChaportController(win: Window, doc: Document, base: string) {
  const w = win as ChatWindow;
  let loaded = false;
  const allowed = () => isChaportPage(w.location.pathname, base)
    && !/[?&#](access|token|access_token|refresh_token|code)=/i.test(w.location.search + w.location.hash);

  const sync = () => {
    if (!allowed()) {
      // This account's free plan cannot hide/stop chat through the JS API.
      // A fresh document removes the SDK entirely on private-route entry,
      // including a transition while its asynchronous script is still loading.
      if (loaded) w.location.replace(w.location.href);
      return;
    }
    if (!loaded && !w.chaport) {
      w.chaportConfig = { appId: APP_ID };
      const api: Chaport = {
        _q: [], _l: {},
        q(method, args) { api._q.push(args ? [method, args] : [method]); },
        on(event, listener) { (api._l[event] ??= []).push(listener); },
      };
      w.chaport = api;
      loaded = true;
      const script = doc.createElement('script');
      script.id = 'mcf-chaport';
      script.async = true;
      script.src = SCRIPT_URL;
      script.referrerPolicy = 'strict-origin-when-cross-origin';
      script.onerror = () => {
        console.error('Chaport chat could not load. The Contact page remains available for support.');
        script.remove();
        delete w.chaport;
        delete w.chaportConfig;
        loaded = false;
      };
      doc.body.appendChild(script);
    }
  };
  return { sync };
}