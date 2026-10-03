import { useEffect, useState, type ReactNode } from 'react';
import { Link, useLocation } from 'wouter';
import { Eye, Heart, Menu, Shuffle, ShoppingBag, X } from 'lucide-react';
import { asset, fmt, logoPath, paragraphs, products, useStore, type Product } from '@/lib/store';

const menu = [
  { label: 'Highlander Cattles', href: '/' },
  { label: 'Highland Cows', href: '/product-category/highland-cows' },
  { label: 'Nigeria Dwarf Goat', href: '/product-category/nigeria-dwarf-goat' },
  { label: 'Contact', href: '/contact' },
  { label: 'About', href: '/about' },
  { label: 'FAQ', href: '/faq' },
  { label: 'Services', href: '/services' },
];

export function Layout({ children }: { children: ReactNode }) {
  const [loc] = useLocation();
  const [open, setOpen] = useState(false);
  const { cartCount, wishlist, compare, notice } = useStore();
  useEffect(() => {
    window.scrollTo(0, 0);
    setOpen(false);
    const product = products.find(p => `/product/${p.slug}` === loc);
    const routeTitles: Record<string, string> = {
      '/shop': 'Shop', '/cart': 'Cart', '/checkout': 'Checkout',
      '/wishlist': 'Wishlist', '/compare': 'Compare', '/admin-preview': 'Admin preview',
    };
    const label = product?.name ?? menu.find(item => item.href === loc)?.label ?? routeTitles[loc] ?? 'Page not found';
    const title = `${label} | Mini Cattle Farm`;
    const description = product
      ? paragraphs(product.shortDescription || product.description).join(' ').slice(0, 155)
      : `${label} — Mini Cattle Farm's family storefront for Highland cows, miniature cattle and Nigeria dwarf goats.`;
    document.title = title;
    const setMeta = (name: string, content: string, property = false) => {
      const attribute = property ? 'property' : 'name';
      let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${name}"]`);
      if (!element) {
        element = document.createElement('meta');
        element.setAttribute(attribute, name);
        document.head.appendChild(element);
      }
      element.content = content;
    };
    setMeta('description', description);
    setMeta('og:title', title, true);
    setMeta('og:description', description, true);
    setMeta('og:type', 'website', true);
    setMeta('robots', loc === '/admin-preview' ? 'noindex,nofollow' : 'index,follow');
  }, [loc]);
  return (
    <div className="mc-site">
      <header className="mc-header">
        <div className="mc-header-in">
          <Link href="/" className="mc-logo" data-testid="link-logo">
            <img src={asset(logoPath)} alt="Mini Cattle Farm" />
          </Link>
          <nav className="mc-nav" aria-label="Main">
            {menu.map((m) => (
              <Link key={m.href} href={m.href} className={loc === m.href ? 'active' : ''} data-testid={`link-nav-${m.label.toLowerCase().replace(/\s+/g, '-')}`}>
                {m.label}
              </Link>
            ))}
          </nav>
          <div className="mc-header-right">
            <a className="mc-contact-ref" href="mailto:salesminicattlefarm@gmail.com" aria-label="Email Mini Cattle Farm">
              salesminicattlefarm@gmail.com
            </a>
            <Link href="/wishlist" className="mc-icon-link" aria-label="Wishlist" data-testid="link-wishlist">
              <Heart size={19} />
              {wishlist.length > 0 && <b>{wishlist.length}</b>}
            </Link>
            <Link href="/compare" className="mc-icon-link" aria-label="Compare" data-testid="link-compare">
              <Shuffle size={19} />
              {compare.length > 0 && <b>{compare.length}</b>}
            </Link>
            <Link href="/cart" className="mc-icon-link" aria-label="Cart" data-testid="link-cart">
              <ShoppingBag size={19} />
              <b>{cartCount}</b>
            </Link>
            <button className="mc-burger" type="button" aria-label="Open menu" onClick={() => setOpen(true)} data-testid="button-menu">
              <Menu size={24} />
            </button>
          </div>
        </div>
      </header>

      {open && (
        <div className="mc-drawer-wrap" onClick={() => setOpen(false)}>
          <aside className="mc-drawer" onClick={(e) => e.stopPropagation()} aria-label="Mobile menu">
            <button type="button" className="mc-drawer-close" onClick={() => setOpen(false)} aria-label="Close menu">
              <X size={18} /> Close
            </button>
            <div className="mc-drawer-title">Menu</div>
            {menu.map((m) => (
              <Link key={m.href} href={m.href}>{m.label}</Link>
            ))}
            <Link href="/shop">Shop</Link>
            <Link href="/wishlist">Wishlist</Link>
            <Link href="/compare">Compare</Link>
            <Link href="/cart">Cart ({cartCount})</Link>
          </aside>
        </div>
      )}

      <main>{children}</main>

      <footer className="mc-footer">
        <div>Copyright &copy; 2025 Mini Cattle Farm</div>
        <div className="mc-footer-small">
          <Link href="/shop">Shop</Link>
          <Link href="/cart">Cart</Link>
          <Link href="/wishlist">Wishlist</Link>
          <Link href="/compare">Compare</Link>
          <Link href="/admin-preview" data-testid="link-preview-access">Preview access</Link>
          <Link href="/owner/orders" data-testid="link-owner-orders">Owner orders</Link>
        </div>
      </footer>
      {notice && <div className="mc-toast" role="status">{notice}</div>}
    </div>
  );
}

export function PageBanner({ title, image }: { title: string; image?: string }) {
  return (
    <section className="mc-banner" style={image ? { backgroundImage: `linear-gradient(rgba(20,20,20,.5),rgba(20,20,20,.5)), url(${asset(image)})` } : undefined}>
      <h1>{title}</h1>
    </section>
  );
}

export function Price({ p }: { p: Product }) {
  const { priceOf, isOnSale } = useStore();
  return (
    <span className="mc-price" data-testid={`text-price-${p.id}`}>
      {isOnSale(p) && <del>{fmt(p.regularPrice)}</del>}
      <ins>{fmt(priceOf(p))}</ins>
    </span>
  );
}

export function SaleBadge({ p }: { p: Product }) {
  const { isOnSale } = useStore();
  if (!isOnSale(p)) return null;
  return <span className="mc-onsale">-{Math.round((1 - p.price / p.regularPrice) * 100)}%</span>;
}

export function ProductCard({ p, onQuick }: { p: Product; onQuick: (p: Product) => void }) {
  const { addToCart, inStock, wishlist, compare, toggleWish, toggleCompare } = useStore();
  const ok = inStock(p);
  const second = p.images[1] ?? p.images[0];
  const cat = p.categories[0];
  return (
    <article className="mc-card" data-testid={`card-product-${p.id}`}>
      <div className="mc-card-img">
        <SaleBadge p={p} />
        <Link href={`/product/${p.slug}`}>
          <img src={asset(p.images[0])} alt={p.name} loading="lazy" />
          <img className="alt" src={asset(second)} alt="" loading="lazy" />
        </Link>
        <div className="mc-card-tools">
          <button type="button" className={wishlist.includes(p.id) ? 'on' : ''} aria-label="Add to wishlist" onClick={() => toggleWish(p.id)} data-testid={`button-wish-${p.id}`}><Heart size={16} /></button>
          <button type="button" className={compare.includes(p.id) ? 'on' : ''} aria-label="Add to compare" onClick={() => toggleCompare(p.id)} data-testid={`button-compare-${p.id}`}><Shuffle size={16} /></button>
          <button type="button" aria-label="Quick view" onClick={() => onQuick(p)} data-testid={`button-quick-${p.id}`}><Eye size={16} /></button>
        </div>
      </div>
      <div className="mc-card-body">
        {cat && <Link href={`/product-category/${cat.slug}`} className="mc-cat">{cat.name}</Link>}
        <h3><Link href={`/product/${p.slug}`}>{p.name}</Link></h3>
        <Price p={p} />
        <button type="button" className="mc-btn mc-btn-sm" disabled={!ok} onClick={() => addToCart(p.id)} data-testid={`button-add-${p.id}`}>
          {ok ? 'Add to cart' : 'Out of stock'}
        </button>
      </div>
    </article>
  );
}

export function QuickView({ p, onClose }: { p: Product | null; onClose: () => void }) {
  const { addToCart, inStock, textOf } = useStore();
  useEffect(() => {
    if (!p) return;
    const k = (e: KeyboardEvent) => e.key === 'Escape' && onClose();
    document.addEventListener('keydown', k);
    return () => document.removeEventListener('keydown', k);
  }, [p, onClose]);
  if (!p) return null;
  const text = paragraphs(textOf(p, !!p.shortDescription))[0] ?? '';
  return (
    <div className="mc-modal-wrap" onClick={onClose}>
      <div className="mc-modal" role="dialog" aria-modal="true" aria-label={`Quick view ${p.name}`} onClick={(e) => e.stopPropagation()}>
        <button type="button" className="mc-modal-x" onClick={onClose} aria-label="Close"><X size={20} /></button>
        <img src={asset(p.images[0])} alt={p.name} />
        <div>
          <h3>{p.name}</h3>
          <Price p={p} />
          <p>{text.length > 360 ? text.slice(0, 360) + '...' : text}</p>
          <button type="button" className="mc-btn" disabled={!inStock(p)} onClick={() => addToCart(p.id)}>{inStock(p) ? 'Add to cart' : 'Out of stock'}</button>{' '}
          <Link href={`/product/${p.slug}`} className="mc-btn mc-btn-outline" onClick={onClose}>View details</Link>
        </div>
      </div>
    </div>
  );
}

export function Grid({ items }: { items: Product[] }) {
  const [q, setQ] = useState<Product | null>(null);
  return (
    <>
      <div className="mc-grid">{items.map((p) => <ProductCard key={p.id} p={p} onQuick={setQ} />)}</div>
      <QuickView p={q} onClose={() => setQ(null)} />
    </>
  );
}
