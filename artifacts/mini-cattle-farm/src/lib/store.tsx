import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import raw from '@/data/catalog.json';

export type Category = { id: number; name: string; slug: string };
export type Product = {
  id: number;
  slug: string;
  name: string;
  description: string;
  shortDescription: string;
  price: number;
  regularPrice: number;
  currency: string;
  inStock: boolean;
  categories: Category[];
  images: string[];
};
type Raw = { products: Product[]; homeIds: number[]; secondaryIds: number[]; logo: string; hero: string };
const catalog = raw as unknown as Raw;

export const products: Product[] = catalog.products;
export const logoPath = catalog.logo;
export const heroPath = catalog.hero;
export const homeProducts = catalog.homeIds.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];
export const secondaryProducts = catalog.secondaryIds.map(id => products.find(p => p.id === id)).filter(Boolean) as Product[];

export const asset = (p: string) => `${import.meta.env.BASE_URL}${p.replace(/^\//, '')}`;

export const categories: Category[] = (() => {
  const m = new Map<string, Category>();
  products.forEach((p) => p.categories.forEach((c) => m.set(c.slug, c)));
  return [...m.values()];
})();

export const fmt = (n: number) => '$' + n.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const paragraphs = (t: string) =>
  t
    .replace(/\p{Extended_Pictographic}\uFE0F?/gu, '')
    .split(/\n\s*\n/)
    .map((s) => s.trim())
    .filter(Boolean);

type Draft = { price?: number; stock?: number };
type CartLine = { id: number; qty: number };

function usePersisted<T>(key: string, init: T) {
  const [v, setV] = useState<T>(() => {
    try {
      const s = localStorage.getItem(key);
      return s ? (JSON.parse(s) as T) : init;
    } catch {
      return init;
    }
  });
  useEffect(() => {
    try {
      localStorage.setItem(key, JSON.stringify(v));
    } catch {
      /* storage unavailable */
    }
  }, [key, v]);
  return [v, setV] as const;
}

type Ctx = {
  cart: CartLine[];
  wishlist: number[];
  compare: number[];
  drafts: Record<number, Draft>;
  priceOf: (p: Product) => number;
  textOf: (p: Product, short?: boolean) => string;
  isOnSale: (p: Product) => boolean;
  stockOf: (p: Product) => number | undefined;
  inStock: (p: Product) => boolean;
  addToCart: (id: number) => void;
  setQty: (id: number, qty: number) => void;
  removeFromCart: (id: number) => void;
  inCart: (id: number) => boolean;
  cartCount: number;
  cartTotal: number;
  toggleWish: (id: number) => void;
  toggleCompare: (id: number) => void;
  setDraft: (id: number, d: Draft) => void;
  clearDrafts: () => void;
  notice: string;
};

const StoreCtx = createContext<Ctx | null>(null);

export function StoreProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = usePersisted<CartLine[]>('mcf.cart', []);
  const [wishlist, setWishlist] = usePersisted<number[]>('mcf.wishlist', []);
  const [compare, setCompare] = usePersisted<number[]>('mcf.compare', []);
  const [drafts, setDrafts] = usePersisted<Record<number, Draft>>('mcf.adminDrafts', {});
  const [notice, setNotice] = useState('');

  const flash = useCallback((m: string) => {
    setNotice(m);
    window.setTimeout(() => setNotice(''), 2600);
  }, []);

  const priceOf = useCallback((p: Product) => drafts[p.id]?.price ?? p.price, [drafts]);
  const isOnSale = useCallback((p: Product) => drafts[p.id]?.price === undefined && p.regularPrice > p.price, [drafts]);
  const stockOf = useCallback((p: Product) => drafts[p.id]?.stock, [drafts]);
  const inStock = useCallback(
    (p: Product) => {
      const s = drafts[p.id]?.stock;
      return s !== undefined ? s > 0 : p.inStock;
    },
    [drafts],
  );

  const value = useMemo<Ctx>(() => {
    const byId = (id: number) => products.find((p) => p.id === id);
    const valid = cart
      .filter(l => byId(l.id) && inStock(byId(l.id)!) && Number.isFinite(l.qty) && l.qty > 0)
      .map(l => ({ ...l, qty: Math.min(Math.floor(l.qty), stockOf(byId(l.id)!) ?? Infinity) }));
    return {
      cart: valid,
      wishlist,
      compare,
      drafts,
      priceOf,
      textOf: (p, short = false) => {
        const text = short ? p.shortDescription : p.description;
        return drafts[p.id]?.price === undefined ? text : text.replace(/(\bPrice\s*:\s*)\$[\d,.]+/gi, (_, label) => `${label}${fmt(priceOf(p))}`);
      },
      isOnSale,
      stockOf,
      inStock,
      notice,
      addToCart: (id) => {
        const p = byId(id);
        if (!p || !inStock(p)) return;
        const max = stockOf(p) ?? Infinity;
        setCart((c) => {
          const l = c.find((x) => x.id === id);
          if (l) return c.map((x) => (x.id === id ? { ...x, qty: Math.min(max, x.qty + 1) } : x));
          return [...c, { id, qty: 1 }];
        });
        flash(`${p.name} added to cart`);
      },
      setQty: (id, qty) => {
        if (!Number.isFinite(qty)) return;
        const p = byId(id);
        if (!p || !inStock(p)) return;
        const max = p ? stockOf(p) ?? Infinity : Infinity;
        setCart((c) => c.map((x) => (x.id === id ? { ...x, qty: Math.max(1, Math.min(max, Math.floor(qty))) } : x)));
      },
      removeFromCart: (id) => setCart((c) => c.filter((x) => x.id !== id)),
      inCart: (id) => valid.some((l) => l.id === id),
      cartCount: valid.reduce((n, l) => n + l.qty, 0),
      cartTotal: valid.reduce((n, l) => n + l.qty * priceOf(byId(l.id)!), 0),
      toggleWish: (id) => setWishlist((w) => (w.includes(id) ? w.filter((x) => x !== id) : [...w, id])),
      toggleCompare: (id) =>
        setCompare((w) => {
          if (w.includes(id)) return w.filter((x) => x !== id);
          if (w.length >= 4) {
            flash('You can compare up to 4 items');
            return w;
          }
          return [...w, id];
        }),
      setDraft: (id, d) =>
        setDrafts((x) => {
          const n = { ...x, [id]: { ...x[id], ...d } };
          (Object.keys(n[id]) as (keyof Draft)[]).forEach((k) => n[id][k] === undefined && delete n[id][k]);
          if (!Object.keys(n[id]).length) delete n[id];
          return n;
        }),
      clearDrafts: () => setDrafts({}),
    };
  }, [cart, wishlist, compare, drafts, notice, priceOf, isOnSale, stockOf, inStock, setCart, setWishlist, setCompare, setDrafts, flash]);

  return <StoreCtx.Provider value={value}>{children}</StoreCtx.Provider>;
}

export function useStore() {
  const c = useContext(StoreCtx);
  if (!c) throw new Error('StoreProvider missing');
  return c;
}
