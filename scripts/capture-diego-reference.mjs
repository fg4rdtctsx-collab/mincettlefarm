import fs from 'node:fs/promises';
import path from 'node:path';

const referenceDir = 'docs/diego-reference';
const assetDir = 'artifacts/mini-cattle-farm/public/family-assets';
await fs.mkdir(referenceDir, { recursive: true });
await fs.mkdir(assetDir, { recursive: true });
await fs.mkdir('artifacts/mini-cattle-farm/src/data', { recursive: true });
const home = await fs.readFile('/tmp/diego-reference.html', 'utf8');
const sourceProducts = [
  ...JSON.parse(await fs.readFile('/tmp/diego-products.json', 'utf8')),
  ...JSON.parse(await fs.readFile('/tmp/diego-products-page2.json', 'utf8')),
];
const clean = (value = '') => value.replace(/<script\b[^>]*>[\s\S]*?<\/script>/gi, '').replace(/<style\b[^>]*>[\s\S]*?<\/style>/gi, '');
const plain = (value = '') => value.replace(/<\/(?:p|li|h\d)>/gi, '\n\n').replace(/<br\s*\/?>/gi, '\n').replace(/<[^>]*>/g, '').replace(/&amp;/g, '&').replace(/&#8217;|&rsquo;/g, '’').replace(/&#8211;/g, '–').replace(/&#8212;/g, '—').replace(/&nbsp;/g, ' ').replace(/&#0?36;/g, '$').replace(/&quot;/g, '"').replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n))).trim();
await fs.writeFile(`${referenceDir}/home.html`, clean(home));
const urls = new Map();
const assetPath = (url) => {
  if (!url) return '';
  const basename = path.basename(new URL(url).pathname);
  const filename = path.extname(basename) ? basename : `${basename}.jpg`;
  urls.set(url, `${assetDir}/${filename}`);
  return `/family-assets/${filename}`;
};
const homeImages = [...home.matchAll(/<img\b[^>]*src=["']([^"']+)["']/g)].map(m => m[1]);
const logo = assetPath(homeImages[0]);
const hero = assetPath(homeImages[2]);
homeImages.forEach(assetPath);
const pageImages = {};
for (const slug of ['about', 'contact', 'faq', 'services']) {
  const html = await fs.readFile(`${referenceDir}/${slug}.html`, 'utf8');
  pageImages[slug] = [...html.matchAll(/<img\b[^>]*src=["']([^"']+)["']/g)]
    .map(m => m[1].replace(/&amp;/g, '&'))
    .filter(url => url.includes('images.unsplash.com'))
    .map(assetPath);
}
await fs.writeFile('artifacts/mini-cattle-farm/src/data/page-images.json', JSON.stringify(pageImages, null, 2));
const products = sourceProducts.map(p => ({
  id: p.id, slug: p.slug, name: plain(p.name),
  description: plain(p.description), shortDescription: plain(p.short_description),
  price: Number(p.prices.price) / (10 ** p.prices.currency_minor_unit),
  regularPrice: Number(p.prices.regular_price) / (10 ** p.prices.currency_minor_unit),
  currency: p.prices.currency_code, inStock: p.is_in_stock, soldIndividually: p.sold_individually,
  categories: p.categories.map(c => ({ id: c.id, name: plain(c.name), slug: c.slug })),
  images: p.images.map(img => assetPath(img.src)),
}));
const orderedIds = [...new Set([...home.matchAll(/data-product_id=["'](\d+)/g)].map(m => Number(m[1])))];
const secondaryIds = [...new Set([...home.slice(home.indexOf('Adorable, Compact')).matchAll(/data-product_id=["'](\d+)/g)].map(m => Number(m[1])))];
const catalog = { products, homeIds: orderedIds.slice(0, 12), secondaryIds, logo, hero };
await fs.writeFile('artifacts/mini-cattle-farm/src/data/catalog.json', JSON.stringify(catalog, null, 2));
await fs.writeFile(`${referenceDir}/catalog-summary.json`, JSON.stringify({ ...catalog, products: products.slice(0, 12) }, null, 2));
const cssUrls = [...home.matchAll(/href=['"]([^'"]+\.css[^'"]*)['"]/g)].map(m => m[1]).filter(u => u.includes('/elementor/css/post-'));
const tasks = [...urls.entries()].map(([url, target]) => ({ url, target }));
for (const url of cssUrls) tasks.push({ url, target: `${referenceDir}/${path.basename(new URL(url).pathname)}` });
for (const slug of ['about', 'contact', 'faq', 'services']) tasks.push({ url: `https://diegofarm.com/${slug}/`, target: `${referenceDir}/${slug}.html`, html: true });
let i = 0;
let failed = 0;
await Promise.all(Array.from({ length: 10 }, async () => {
  while (i < tasks.length) {
    const t = tasks[i++];
    try {
      if (!t.html && (await fs.stat(t.target).catch(() => null))?.size > 100) continue;
      const response = await fetch(t.url, { signal: AbortSignal.timeout(20000) });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      if (t.html) await fs.writeFile(t.target, clean(await response.text()));
      else await fs.writeFile(t.target, Buffer.from(await response.arrayBuffer()));
    } catch (error) {
      failed++;
      console.error(`Failed asset ${t.url}: ${error.message}`);
    }
  }
}));
console.log(`Captured ${products.length} products and ${tasks.length - failed}/${tasks.length} reference assets/pages.`);