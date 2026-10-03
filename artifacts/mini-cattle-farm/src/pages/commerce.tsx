import { useState } from 'react';
import { Link } from 'wouter';
import { Trash2 } from 'lucide-react';
import { Layout, PageBanner, Price } from '@/components/shop';
import { asset, fmt, paragraphs, products, useStore } from '@/lib/store';

const byId = (id: number) => products.find((p) => p.id === id)!;

export function Cart() {
  const { cart, priceOf, setQty, removeFromCart, cartTotal } = useStore();
  return (
    <Layout>
      <PageBanner title="Cart" />
      <section className="mc-container mc-sec">
        {cart.length === 0 ? (
          <div className="mc-center mc-empty" data-testid="text-cart-empty">
            <p>Your cart is currently empty.</p>
            <Link href="/shop" className="mc-btn">Return to shop</Link>
          </div>
        ) : (
          <div className="mc-cart">
            <div className="mc-table-wrap">
              <table className="mc-table">
                <thead><tr><th /><th>Product</th><th>Price</th><th>Quantity</th><th>Subtotal</th></tr></thead>
                <tbody>
                  {cart.map((l) => {
                    const p = byId(l.id);
                    return (
                      <tr key={l.id} data-testid={`row-cart-${l.id}`}>
                        <td className="mc-t-img"><Link href={`/product/${p.slug}`}><img src={asset(p.images[0])} alt={p.name} /></Link></td>
                        <td><Link href={`/product/${p.slug}`}>{p.name}</Link></td>
                        <td>{fmt(priceOf(p))}</td>
                        <td>
                          <div className="mc-qty">
                            <button type="button" aria-label="Decrease" onClick={() => setQty(l.id, l.qty - 1)}>-</button>
                            <span data-testid={`text-qty-${l.id}`}>{l.qty}</span>
                            <button type="button" aria-label="Increase" onClick={() => setQty(l.id, l.qty + 1)}>+</button>
                          </div>
                        </td>
                        <td>
                          {fmt(priceOf(p) * l.qty)}{' '}
                          <button type="button" className="mc-remove" aria-label={`Remove ${p.name}`} onClick={() => removeFromCart(l.id)} data-testid={`button-remove-${l.id}`}><Trash2 size={16} /></button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
            <aside className="mc-totals">
              <h3>Cart totals</h3>
              <div className="mc-total-row"><span>Total</span><strong data-testid="text-cart-total">{fmt(cartTotal)}</strong></div>
              <Link href="/checkout" className="mc-btn" data-testid="link-checkout">Proceed to checkout</Link>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
}

export function Checkout() {
  const { cart, priceOf, cartTotal } = useStore();
  const [method, setMethod] = useState('bacs');
  return (
    <Layout>
      <PageBanner title="Checkout" />
      <section className="mc-container mc-sec">
        {cart.length === 0 ? (
          <div className="mc-center mc-empty">
            <p>Your cart is currently empty, so there is nothing to check out.</p>
            <Link href="/shop" className="mc-btn">Return to shop</Link>
          </div>
        ) : (
          <div className="mc-cart">
            <div>
              <div className="mc-alert" role="note" data-testid="status-checkout-disconnected">
                <strong>Checkout is not connected.</strong> Orders cannot be placed and no payment can be taken on this site yet. Nothing on this page is submitted anywhere, and no payment details are collected.
              </div>
              <h3>Payment method</h3>
              <div className="mc-pay">
                <label className={method === 'bacs' ? 'on' : ''}>
                  <input type="radio" name="pay" checked={method === 'bacs'} onChange={() => setMethod('bacs')} data-testid="radio-bacs" />
                  <span>
                    <strong>Direct bank transfer</strong>
                    <small>Bank account details have not been supplied for this site yet. They will appear here once confirmed. Do not send money based on this page.</small>
                  </span>
                </label>
                <label className="disabled">
                  <input type="radio" name="pay" disabled data-testid="radio-crypto" />
                  <span>
                    <strong>Cryptocurrency <em>Not connected</em></strong>
                    <small>Planned as an additional option. Unavailable until a merchant configuration is supplied.</small>
                  </span>
                </label>
              </div>
              <button type="button" className="mc-btn" disabled data-testid="button-place-order">Place order (unavailable)</button>
            </div>
            <aside className="mc-totals">
              <h3>Your order</h3>
              {cart.map((l) => {
                const p = byId(l.id);
                return <div className="mc-total-row" key={l.id}><span>{p.name} x {l.qty}</span><span>{fmt(priceOf(p) * l.qty)}</span></div>;
              })}
              <div className="mc-total-row"><span>Total</span><strong data-testid="text-checkout-total">{fmt(cartTotal)}</strong></div>
              <Link href="/cart" className="mc-btn mc-btn-outline">Edit cart</Link>
            </aside>
          </div>
        )}
      </section>
    </Layout>
  );
}

export function Wishlist() {
  const { wishlist, toggleWish, addToCart, inStock } = useStore();
  const items = wishlist.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;
  return (
    <Layout>
      <PageBanner title="Wishlist" />
      <section className="mc-container mc-sec">
        {items.length === 0 ? (
          <div className="mc-center mc-empty" data-testid="text-wishlist-empty">
            <p>This wishlist is empty. Add products to your wishlist while browsing the shop.</p>
            <Link href="/shop" className="mc-btn">Return to shop</Link>
          </div>
        ) : (
          <div className="mc-table-wrap">
            <table className="mc-table">
              <thead><tr><th /><th>Product</th><th>Price</th><th>Stock</th><th /></tr></thead>
              <tbody>
                {items.map((p) => (
                  <tr key={p.id}>
                    <td className="mc-t-img"><Link href={`/product/${p.slug}`}><img src={asset(p.images[0])} alt={p.name} /></Link></td>
                    <td><Link href={`/product/${p.slug}`}>{p.name}</Link></td>
                    <td><Price p={p} /></td>
                    <td>{inStock(p) ? 'In stock' : 'Out of stock'}</td>
                    <td>
                      <button type="button" className="mc-btn mc-btn-sm" disabled={!inStock(p)} onClick={() => addToCart(p.id)}>Add to cart</button>{' '}
                      <button type="button" className="mc-remove" aria-label={`Remove ${p.name}`} onClick={() => toggleWish(p.id)}><Trash2 size={16} /></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Layout>
  );
}

export function Compare() {
  const { compare, toggleCompare, addToCart, inStock } = useStore();
  const items = compare.map((id) => products.find((p) => p.id === id)).filter(Boolean) as typeof products;
  return (
    <Layout>
      <PageBanner title="Compare" />
      <section className="mc-container mc-sec">
        {items.length === 0 ? (
          <div className="mc-center mc-empty" data-testid="text-compare-empty">
            <p>Compare list is empty. Add up to 4 products to compare while browsing.</p>
            <Link href="/shop" className="mc-btn">Return to shop</Link>
          </div>
        ) : (
          <div className="mc-table-wrap">
            <table className="mc-table mc-compare">
              <tbody>
                <tr><th /> {items.map((p) => <td key={p.id}><Link href={`/product/${p.slug}`}><img src={asset(p.images[0])} alt={p.name} /></Link></td>)}</tr>
                <tr><th>Name</th>{items.map((p) => <td key={p.id}><Link href={`/product/${p.slug}`}>{p.name}</Link></td>)}</tr>
                <tr><th>Price</th>{items.map((p) => <td key={p.id}><Price p={p} /></td>)}</tr>
                <tr><th>Category</th>{items.map((p) => <td key={p.id}>{p.categories.map((c) => c.name).join(', ') || 'Uncategorized'}</td>)}</tr>
                <tr><th>Availability</th>{items.map((p) => <td key={p.id}>{inStock(p) ? 'In stock' : 'Out of stock'}</td>)}</tr>
                <tr><th>Description</th>{items.map((p) => { const t = paragraphs(p.shortDescription || p.description)[0] ?? ''; return <td key={p.id}>{t.length > 160 ? t.slice(0, 160) + '...' : t}</td>; })}</tr>
                <tr><th /> {items.map((p) => (
                  <td key={p.id}>
                    <button type="button" className="mc-btn mc-btn-sm" disabled={!inStock(p)} onClick={() => addToCart(p.id)}>Add to cart</button>{' '}
                    <button type="button" className="mc-remove" aria-label={`Remove ${p.name}`} onClick={() => toggleCompare(p.id)}><Trash2 size={16} /></button>
                  </td>
                ))}</tr>
              </tbody>
            </table>
          </div>
        )}
      </section>
    </Layout>
  );
}

export function AdminPreview() {
  const { drafts, setDraft, clearDrafts } = useStore();
  const [q, setQ] = useState('');
  const [local, setLocal] = useState<Record<number, { price?: string; stock?: string }>>({});
  const list = products.filter((p) => p.name.toLowerCase().includes(q.toLowerCase()));
  const val = (id: number, k: 'price' | 'stock', fallback: string) => local[id]?.[k] ?? fallback;
  const save = (id: number) => {
    const l = local[id] ?? {};
    const d: { price?: number; stock?: number } = {};
    if (l.price !== undefined) {
      const n = parseFloat(l.price);
      d.price = l.price.trim() === '' || !Number.isFinite(n) || n < 0 ? undefined : Math.round(n * 100) / 100;
    }
    if (l.stock !== undefined) {
      const n = parseInt(l.stock, 10);
      d.stock = l.stock.trim() === '' || Number.isNaN(n) || n < 0 ? undefined : n;
    }
    setDraft(id, d);
    setLocal((x) => { const n = { ...x }; delete n[id]; return n; });
  };
  return (
    <Layout>
      <PageBanner title="Admin preview" />
      <section className="mc-container mc-sec">
        <div className="mc-alert" role="note" data-testid="status-admin-preview">
          <strong>Browser-only draft preview. This is not a secure admin.</strong> Changes apply only in this browser, are saved to local storage, and are not shared with other visitors or devices. Authentication and a shared database are not connected. Each product has one final selling price, which is exactly what the public storefront displays here.
        </div>
        <div className="mc-toolbar">
          <input className="mc-search" placeholder="Filter products" value={q} onChange={(e) => setQ(e.target.value)} aria-label="Filter products" data-testid="input-admin-filter" />
          <button type="button" className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => { if (window.confirm('Remove all draft price and stock edits in this browser?')) { clearDrafts(); setLocal({}); } }} data-testid="button-reset-all">Reset all drafts</button>
        </div>
        <div className="mc-table-wrap">
          <table className="mc-table mc-admin">
            <thead><tr><th /><th>Product</th><th>Final selling price (USD)</th><th>Stock units</th><th /></tr></thead>
            <tbody>
              {list.map((p) => {
                const d = drafts[p.id];
                return (
                  <tr key={p.id} data-testid={`row-admin-${p.id}`}>
                    <td className="mc-t-img"><img src={asset(p.images[0])} alt="" /></td>
                    <td>{p.name}<small>Catalog price {fmt(p.price)}{d ? ' - draft edited' : ''}</small></td>
                    <td><input type="number" min="0" step="0.01" inputMode="decimal" value={val(p.id, 'price', d?.price !== undefined ? String(d.price) : '')} placeholder={String(p.price)} onChange={(e) => setLocal((x) => ({ ...x, [p.id]: { ...x[p.id], price: e.target.value } }))} data-testid={`input-price-${p.id}`} /></td>
                    <td><input type="number" min="0" step="1" value={val(p.id, 'stock', d?.stock !== undefined ? String(d.stock) : '')} placeholder={p.inStock ? 'in stock' : 'out'} onChange={(e) => setLocal((x) => ({ ...x, [p.id]: { ...x[p.id], stock: e.target.value } }))} data-testid={`input-stock-${p.id}`} /></td>
                    <td>
                      <button type="button" className="mc-btn mc-btn-sm" onClick={() => save(p.id)} data-testid={`button-save-${p.id}`}>Save</button>{' '}
                      <button type="button" className="mc-btn mc-btn-outline mc-btn-sm" onClick={() => { setDraft(p.id, { price: undefined, stock: undefined }); setLocal((x) => { const n = { ...x }; delete n[p.id]; return n; }); }} disabled={!d && !local[p.id]}>Reset</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <p className="mc-note">Leave a field empty and save to use the catalog value. Stock of 0 marks the item out of stock; a number limits the cart quantity.</p>
      </section>
    </Layout>
  );
}
