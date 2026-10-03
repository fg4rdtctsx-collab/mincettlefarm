import { useMemo, useState } from 'react';
import { Link } from 'wouter';
import { Grid, Layout, PageBanner, Price, SaleBadge, ProductCard, QuickView } from '@/components/shop';
import { asset, categories, heroPath, homeProducts, secondaryProducts, paragraphs, products, useStore, type Product } from '@/lib/store';
import pageImages from '@/data/page-images.json';

function Wrap({ children }: { children: React.ReactNode }) {
  return <Layout>{children}</Layout>;
}

const homeHeroSlides = [
  { image: heroPath, alt: 'Mini Highland calves with a woman from the farm family' },
  { image: '/family-assets/hero-calves-pair.jpeg', alt: 'A white calf and a brown calf standing together outdoors' },
  { image: '/family-assets/hero-calf-barn.jpeg', alt: 'A brown-and-white calf standing inside a barn' },
  { image: '/family-assets/hero-curly-calf-pen.jpeg', alt: 'A curly white-and-brown calf standing in a pen' },
];

function HomeHeroCarousel() {
  const [activeSlide, setActiveSlide] = useState(0);
  const slide = homeHeroSlides[activeSlide];
  const move = (offset: number) => {
    setActiveSlide((current) => (current + offset + homeHeroSlides.length) % homeHeroSlides.length);
  };

  return (
    <div className="mc-home-carousel" role="group" aria-roledescription="carousel" aria-label="Mini cattle photos">
      <img
        id="mc-home-hero-image"
        className="mc-home-carousel-image"
        src={asset(slide.image)}
        alt={slide.alt}
        width={1200}
        height={800}
      />
      <span className="mc-sr-only" aria-live="polite">
        Photo {activeSlide + 1} of {homeHeroSlides.length}: {slide.alt}
      </span>
      <button
        type="button"
        className="mc-home-carousel-control mc-home-carousel-previous"
        aria-label="Previous farm photo"
        aria-controls="mc-home-hero-image"
        onClick={() => move(-1)}
      >
        ‹
      </button>
      <button
        type="button"
        className="mc-home-carousel-control mc-home-carousel-next"
        aria-label="Next farm photo"
        aria-controls="mc-home-hero-image"
        onClick={() => move(1)}
      >
        ›
      </button>
      <div className="mc-home-carousel-dots" role="group" aria-label="Choose a farm photo">
        {homeHeroSlides.map((item, index) => (
          <button
            key={item.image}
            type="button"
            className={`mc-home-carousel-dot${index === activeSlide ? ' active' : ''}`}
            aria-label={`Show photo ${index + 1}: ${item.alt}`}
            aria-pressed={index === activeSlide}
            aria-controls="mc-home-hero-image"
            onClick={() => setActiveSlide(index)}
          />
        ))}
      </div>
    </div>
  );
}

export function Home() {
  const { products: liveProducts } = useStore();
  const highland = secondaryProducts.map(p => liveProducts.find(x => x.id === p.id)).filter(p => p && p.active !== false) as Product[];
  return (
    <Wrap>
      <section className="mc-home-hero">
        <HomeHeroCarousel />
        <h1>Trusted Platform for Highland &amp; Miniature Cattle</h1>
        <p>Discover a curated marketplace connecting buyers with reputable breeders of Highland cows and miniature cattle, offering detailed listings, secure transactions, and expert resources to support your farming and homesteading goals.</p>
      </section>
      <section className="mc-container mc-center mc-sec">
        <h2>Mini Cows for Sale</h2>
        <p className="mc-lead">Are you in search of a unique addition to your farm or homestead? Look no further than Joe’s Mini Cow’s Ranch. Our Mini cows for sale are captivating creatures, offering all the charm and benefits of their larger counterparts in a compact package.</p>
      </section>
      <section className="mc-container mc-sec">
        <h3 className="mc-h3c">Trusted Miniature Cattle &amp; Highland Cows for Your Homestead</h3>
        <p className="mc-lead mc-center">Discover our curated collection of charming miniature cattle and Highland cows — perfect additions to your farm. Take advantage of exclusive deals tailored to support your homesteading lifestyle.</p>
        <Grid items={homeProducts.map(p => liveProducts.find(x => x.id === p.id)).filter(p => p && p.active !== false) as Product[]} />
      </section>
      <section className="mc-container mc-sec mc-why">
        <div>
          <h3>Why Choose Miniature Cows?</h3>
          <p>Miniature cows are a smart and charming alternative to traditional cattle. These pint-sized wonders offer a range of benefits—lower feed and maintenance costs, smaller space requirements, and gentle temperaments—making them perfect for small farms, homesteads, or families with limited land.</p>
          <p>Don’t let their size fool you—our mini cows still deliver! They provide rich, creamy milk and high-quality meat, making them a valuable and productive addition to any operation.</p>
          <p>Experience the difference at <strong>Joe’s Mini Cows Ranch</strong>, your trusted source for healthy, well-raised miniature cattle. Discover the joy and practicality of owning mini cows today!</p>
        </div>
        <img src={asset('/family-assets/mini-cow-800x800.png')} alt="Mini cow illustration" />
      </section>
      <section className="mc-container mc-center mc-sec">
        <h2>Mini Highland Cows for Sale</h2>
        <h5 className="mc-h5">Adorable, Compact, and Full of Personality</h5>
        <p className="mc-lead">Our Mini Highland cows for are also highly adaptable to various climates and environments. Whether you’re located in a hot, humid region or a cold, mountainous area, these hardy cattle thrive in diverse conditions. Their thick double coat provides insulation against harsh weather, allowing them to graze comfortably year-round.</p>
        <p className="mc-lead">Don’t miss out on the opportunity to own these adorable and versatile creatures. Contact Joe’s Mini Cows Ranch today to inquire about our available mini cows for sale and start your journey with these charming bovines!</p>
      </section>
      <section className="mc-container mc-sec">
        <div className="mc-tab">Highland Cows</div>
        <Grid items={highland} />
        <p className="mc-center"><Link href="/product-category/highland-cows" className="mc-btn mc-btn-outline">View all Highland Cows</Link></p>
      </section>
    </Wrap>
  );
}

type Sort = 'default' | 'price-asc' | 'price-desc' | 'name';

function Listing({ title, slug }: { title: string; slug?: string }) {
  const { priceOf, products } = useStore();
  const [cat, setCat] = useState(slug ?? 'all');
  const [sort, setSort] = useState<Sort>('default');
  const [shown, setShown] = useState(24);
  const [quick, setQuick] = useState<Product | null>(null);
  const list = useMemo(() => {
    let l = products.filter(p => p.active !== false && (cat === 'all' || p.categories.some(c => c.slug === cat)));
    if (sort === 'price-asc') l.sort((a, b) => priceOf(a) - priceOf(b));
    if (sort === 'price-desc') l.sort((a, b) => priceOf(b) - priceOf(a));
    if (sort === 'name') l.sort((a, b) => a.name.localeCompare(b.name));
    return l;
  }, [cat, sort, priceOf]);
  return (
    <Wrap>
      <PageBanner title={title} />
      <section className="mc-container mc-sec">
        <div className="mc-toolbar">
          <div className="mc-chips">
            {!slug && <button type="button" className={cat === 'all' ? 'on' : ''} onClick={() => { setCat('all'); setShown(24); }}>All</button>}
            {!slug && categories.map((c) => (
              <button type="button" key={c.slug} className={cat === c.slug ? 'on' : ''} onClick={() => { setCat(c.slug); setShown(24); }} data-testid={`filter-${c.slug}`}>{c.name}</button>
            ))}
            {slug && <span>Showing {list.length} {list.length === 1 ? 'result' : 'results'}</span>}
          </div>
          <label className="mc-sort">
            <span>Sort by</span>
            <select value={sort} onChange={(e) => setSort(e.target.value as Sort)} data-testid="select-sort">
              <option value="default">Default sorting</option>
              <option value="price-asc">Price: low to high</option>
              <option value="price-desc">Price: high to low</option>
              <option value="name">Name</option>
            </select>
          </label>
        </div>
        {list.length === 0 ? (
          <p className="mc-center mc-empty">No products were found in this category. <Link href="/shop">Return to shop</Link></p>
        ) : (
          <div className="mc-grid">{list.slice(0, shown).map((p) => <ProductCard key={p.id} p={p} onQuick={setQuick} />)}</div>
        )}
        {shown < list.length && (
          <p className="mc-center"><button type="button" className="mc-btn mc-btn-outline" onClick={() => setShown(shown + 24)} data-testid="button-load-more">Load more</button></p>
        )}
        <QuickView p={quick} onClose={() => setQuick(null)} />
      </section>
    </Wrap>
  );
}

export const Shop = () => <Listing title="Shop" />;
export function Category({ slug }: { slug: string }) {
  const c = categories.find((x) => x.slug === slug);
  if (!c) return <NotFound />;
  return <Listing key={slug} title={c.name} slug={slug} />;
}

export function ProductPage({ slug }: { slug: string }) {
  const { products } = useStore();
  const p = products.find((x) => x.slug === slug);
  const { addToCart, inStock, wishlist, compare, toggleWish, toggleCompare, inCart, textOf } = useStore();
  const [img, setImg] = useState(0);
  if (!p || p.active === false) return <NotFound />;
  const gallery = [...new Set(p.images)];
  const related = products.filter((x) => x.id !== p.id && x.categories[0]?.slug === p.categories[0]?.slug).slice(0, 4);
  const ok = inStock(p);
  return (
    <Wrap>
      <section className="mc-container mc-sec">
        <div className="mc-crumbs"><Link href="/">Home</Link> / <Link href="/shop">Shop</Link>{p.categories[0] && <> / <Link href={`/product-category/${p.categories[0].slug}`}>{p.categories[0].name}</Link></>} / {p.name}</div>
        <div className="mc-product">
          <div className="mc-gallery">
            <div className="mc-gallery-main"><SaleBadge p={p} /><img src={asset(gallery[img] ?? gallery[0])} alt={p.name} data-testid="img-product-main" /></div>
            <div className="mc-thumbs">
              {gallery.map((g, i) => (
                <button type="button" key={g} className={i === img ? 'on' : ''} onClick={() => setImg(i)} aria-label={`Image ${i + 1}`}><img src={asset(g)} alt="" /></button>
              ))}
            </div>
          </div>
          <div className="mc-summary">
            <h1 data-testid="text-product-name">{p.name}</h1>
            <Price p={p} />
            {p.shortDescription && <div className="mc-short">{paragraphs(textOf(p, true)).map((t, i) => <p key={i}>{t}</p>)}</div>}
            <p className={ok ? 'mc-stock' : 'mc-stock out'}>{ok ? 'In stock' : 'Out of stock'}</p>
            <div className="mc-actions">
              <button type="button" className="mc-btn" disabled={!ok} onClick={() => addToCart(p.id)} data-testid="button-add-to-cart">{inCart(p.id) ? 'Add another' : 'Add to cart'}</button>
              {inCart(p.id) && <Link href="/cart" className="mc-btn mc-btn-outline">View cart</Link>}
            </div>
            <div className="mc-meta-links">
              <button type="button" onClick={() => toggleWish(p.id)}>{wishlist.includes(p.id) ? 'Remove from wishlist' : 'Add to wishlist'}</button>
              <button type="button" onClick={() => toggleCompare(p.id)}>{compare.includes(p.id) ? 'Remove from compare' : 'Add to compare'}</button>
            </div>
            <div className="mc-meta">Category: {p.categories.length ? p.categories.map((c) => <Link key={c.slug} href={`/product-category/${c.slug}`}>{c.name}</Link>) : 'Uncategorized'}</div>
          </div>
        </div>
        <div className="mc-desc">
          <h3>Description</h3>
          {paragraphs(textOf(p)).map((t, i) => <p key={i}>{t}</p>)}
        </div>
        {related.length > 0 && (
          <>
            <h3 className="mc-h3c">Related products</h3>
            <Grid items={related} />
          </>
        )}
      </section>
    </Wrap>
  );
}

function Avatar({ name, image }: { name: string; image: string }) {
  return <img className="mc-avatar" src={asset(image)} alt={name} />;
}

export function About() {
  const team: [string, string][] = [['Emily Carter', 'Livestock Specialist'], ['Jordan Hayes', 'Customer Relations Manager'], ['Mia Thompson', 'Marketplace Coordinator'], ['Liam Foster', 'Educational Content Lead']];
  const quotes: [string, string, string][] = [
    ['Emma Reynolds', 'Homesteader and Cattle Enthusiast', 'The platform connected me with trusted breeders, making the purchase of my Highland cow smooth and rewarding.'],
    ['Liam Harrison', 'Sustainable Farmer and Breeder', 'Their attention to detail and dedication ensured I received healthy, beautiful miniature cattle for my farm.'],
    ['Sophia Clarke', 'Agricultural Educator', 'An excellent marketplace that offers secure transactions and valuable information for new cattle owners.'],
  ];
  return (
    <Wrap>
      <PageBanner title="About" image={pageImages.about[0]} />
      <section className="mc-container mc-sec mc-split">
        <img src={asset(pageImages.about[1])} alt="Highland cattle" />
        <div>
          <h2>Discover Quality Highland Cattle from Trusted Breeders</h2>
          <p>Our platform is dedicated to connecting buyers with reputable breeders of Highland cows and miniature cattle. We believe in fostering a community built on trust, transparency, and a shared passion for these hardy and beautiful animals. Our commitment to quality listings, secure transactions, and educational resources drives our mission to support sustainable farming and homesteading practices.</p>
        </div>
      </section>
      <section className="mc-container mc-sec mc-center">
        <h3>Discover the Charm of Highland and Miniature Cattle</h3>
        <p className="mc-lead">Meet the dedicated experts who ensure quality and care in every connection.</p>
        <div className="mc-team">{team.map(([n, r], i) => <div key={n}><img className="mc-team-image" src={asset(pageImages.about[i + 2])} alt={n} /><h4>{n}</h4><p>{r}</p></div>)}</div>
      </section>
      <section className="mc-container mc-sec mc-center">
        <h3>Discover Sturdy and Stunning Highland Cattle Now</h3>
        <p className="mc-lead">Hear from satisfied buyers about their seamless experience and quality cattle purchases on our platform.</p>
        <div className="mc-quotes">{quotes.map(([n, r, t], i) => <blockquote key={n}><p>{t}</p><Avatar name={n} image={pageImages.about[i + 6]} /><h4>{n}</h4><span>{r}</span></blockquote>)}</div>
      </section>
    </Wrap>
  );
}

export function Contact() {
  const [state, setState] = useState<'idle' | 'email'>('idle');
  const faqs: [string, string][] = [
    ['How do I verify the breeder’s reputation?', 'We provide detailed breeder profiles and reviews to help you choose reputable sellers.'],
    ['What should I consider when buying miniature cattle?', 'Consider health history, breed standards, and suitability for your farm or homestead needs.'],
    ['Are there resources for first-time buyers?', 'Yes, our educational section offers guides on care, breeding, and farm management.'],
    ['How is payment secured on the platform?', 'All transactions are protected with secure payment gateways for your peace of mind.'],
  ];
  return (
    <Wrap>
      <PageBanner title="Contact" image={pageImages.contact[0]} />
      <section className="mc-container mc-sec mc-narrow">
        <h2 className="mc-center">Discover Your Ideal Highland and Miniature Cattle Now</h2>
        <p className="mc-lead mc-center">Reach Out to Trusted Breeders Through Our Secure Platform<span className="mc-contact-email">Email us at <a href="mailto:salesminicattlefarm@gmail.com">salesminicattlefarm@gmail.com</a></span></p>
        <form className="mc-form" onSubmit={(e) => {
          e.preventDefault();
          const data = new FormData(e.currentTarget);
          const subject = String(data.get('subject') || '').trim() || 'Mini Cattle Farm inquiry';
          const body = `Name: ${String(data.get('name') || '').trim()}\nReply email: ${String(data.get('email') || '').trim()}\n\n${String(data.get('message') || '').trim()}`;
          window.location.href = `mailto:salesminicattlefarm@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
          setState('email');
        }} data-testid="form-contact">
          <label>Name <abbr>*</abbr><input required name="name" maxLength={100} autoComplete="name" data-testid="input-name" /></label>
          <label>Email <abbr>*</abbr><input required type="email" name="email" maxLength={200} autoComplete="email" data-testid="input-email" /></label>
          <label>Subject<input name="subject" maxLength={180} data-testid="input-subject" /></label>
          <label>Message <abbr>*</abbr><textarea required rows={6} name="message" maxLength={3000} data-testid="input-message" /></label>
          <button type="submit" className="mc-btn" data-testid="button-submit">Open email to send</button>
          <p className="mc-note">This opens your email app with your message filled in. Press Send there to deliver it.</p>
          {state === 'email' && (
            <div className="mc-alert" role="status" data-testid="status-email-draft">
              <strong>Finish sending in your email app.</strong> If it did not open, your message is still here. You can email <a href="mailto:salesminicattlefarm@gmail.com">salesminicattlefarm@gmail.com</a> directly.
            </div>
          )}
        </form>
      </section>
      <section className="mc-container mc-sec mc-split">
        <img src={asset(pageImages.contact[1])} alt="Highland cattle" />
        <div>
          <h3>Trusted Marketplace for Highland and Miniature Cattle</h3>
          <p>Find answers to common questions about purchasing and caring for Highland and miniature cattle to ensure a smooth experience.</p>
          {faqs.map(([q, a]) => <div key={q} className="mc-qa"><h4>{q}</h4><p>{a}</p></div>)}
        </div>
      </section>
      <section className="mc-container mc-sec mc-center">
        <h3>Discover Your Perfect Highland Cow or Miniature Cattle Now</h3>
        <p className="mc-lead">Engage Directly with Verified Breeders and Expand Your Livestock</p>
        <Link href="/contact" className="mc-btn mc-btn-outline">Explore Details</Link>
      </section>
    </Wrap>
  );
}

export function Faq() {
  const faqs: [string, string][] = [
    ['How do I ensure the cattle listings are from reputable breeders?', 'We verify all breeders through a thorough vetting process to maintain a trusted marketplace for you.'],
    ['What payment methods are accepted on the platform?', 'We support secure payments via credit card, PayPal, and bank transfers for your convenience.'],
    ['Can I arrange to visit breeders or farms before purchase?', 'Yes, our platform allows you to contact breeders to schedule visits and inspect the cattle in person.'],
    ['Are there resources to help me care for Highland and miniature cattle?', 'Absolutely, we provide educational materials and expert advice to support your cattle care journey.'],
  ];
  const stats: [string, string][] = [['120', 'Trusted Breeders'], ['3500+', 'Listings Available'], ['400', 'Satisfied Buyers'], ['250', 'Successful Sales']];
  return (
    <Wrap>
      <PageBanner title="FAQ" image={pageImages.faq[0]} />
      <section className="mc-container mc-sec mc-split">
        <div>
          <h2>Trusted Platform for Highland &amp; Miniature Cattle</h2>
          <p>Find quick and clear answers to your questions about buying and selling Highland and miniature cattle on our marketplace.</p>
          <img src={asset(pageImages.faq[1])} alt="Highland cattle" />
        </div>
        <div>{faqs.map(([q, a]) => <div key={q} className="mc-qa"><h4>{q}</h4><p>{a}</p></div>)}</div>
      </section>
      <section className="mc-container mc-sec mc-center">
        <h3>Guides and Tips for New Highland Cow Owners</h3>
        <p className="mc-lead">Discover vital data showcasing our marketplace’s growth, breeder success, and buyer satisfaction.</p>
        <div className="mc-stats">{stats.map(([n, l]) => <div key={l}><h3>{n}</h3><h3 className="mc-stat-l">{l}</h3></div>)}</div>
      </section>
      <section className="mc-container mc-sec mc-center">
        <img className="mc-info-image" src={asset(pageImages.faq[2])} alt="Highland cattle" />
        <h2>Discover Your Ideal Highland Cow Today</h2>
        <p className="mc-lead">Join our community to access trusted breeders, detailed cattle listings, and expert advice to help you find and care for your perfect livestock companion with confidence.</p>
        <Link href="/contact" className="mc-btn mc-btn-outline">Learn More</Link>
      </section>
    </Wrap>
  );
}

export function Services() {
  const items = ['Premium Livestock Marketplace', 'Secure Buyer-Seller Communication', 'Comprehensive Breeder Profiles', 'Educational Resources & Support'];
  const quotes: [string, string, string][] = [
    ['Emma Johnson', 'Homesteader & Livestock Enthusiast', 'Purchasing through this platform was seamless, with detailed listings and trustworthy breeders—highly recommended!'],
    ['Liam Thompson', 'Sustainable Farmer and Breeder', 'The professionalism and care shown by sellers here ensured I received healthy, well-raised cattle for my farm.'],
    ['Sophia Martinez', 'Agricultural Consultant', 'The service exceeded all expectations, making my experience buying Highland cows both secure and enjoyable.'],
  ];
  return (
    <Wrap>
      <PageBanner title="Services" image={pageImages.services[0]} />
      <section className="mc-container mc-sec mc-center">
        <h3>Verified Highland Cow and Miniature Cattle Listings</h3>
        <p className="mc-lead">Explore our diverse offerings designed to connect buyers with premium livestock and expert guidance.</p>
        <div className="mc-services">
          {items.map((t, i) => <div key={t}><img src={asset(pageImages.services[i + 1])} alt="" /><h3>{t}</h3></div>)}
        </div>
      </section>
      <section className="mc-container mc-sec mc-three">
        <div><h3>Premium Listings</h3><p>Showcasing top Highland and miniature cattle breeders.</p></div>
        <div><h3>Secure Transactions</h3><p>Ensuring safe and trusted buyer-seller communications.</p></div>
        <div><h3>Educational Resources</h3><p>Providing in-depth guides for cattle care and breeding.</p></div>
      </section>
      <section className="mc-container mc-sec mc-center">
        <img className="mc-info-image" src={asset(pageImages.services[5])} alt="Highland cattle" />
        <h3>Miniature Cattle: Charming Companions for Small Farms</h3>
        <p className="mc-lead">Hear from our satisfied buyers who found their perfect Highland and miniature cattle through our trusted marketplace.</p>
        <div className="mc-quotes">{quotes.map(([n, r, t], i) => <blockquote key={n}><p>{t}</p><Avatar name={n} image={pageImages.services[i + 6]} /><h4>{n}</h4><span>{r}</span></blockquote>)}</div>
      </section>
    </Wrap>
  );
}

export function NotFound() {
  return (
    <Wrap>
      <section className="mc-container mc-sec mc-center mc-404">
        <h1>404</h1>
        <h2>This page can’t be found</h2>
        <p className="mc-lead">The page you are looking for may have moved or never existed. Try one of these instead.</p>
        <p>
          <Link href="/" className="mc-btn">Back to home</Link>{' '}
          <Link href="/shop" className="mc-btn mc-btn-outline">Browse the shop</Link>{' '}
          <Link href="/contact" className="mc-btn mc-btn-outline">Contact</Link>
        </p>
        <div className="mc-chips mc-center-chips">
          {categories.map((c) => <Link key={c.slug} href={`/product-category/${c.slug}`}>{c.name}</Link>)}
        </div>
      </section>
    </Wrap>
  );
}
