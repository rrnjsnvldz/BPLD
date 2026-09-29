import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/product';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data';

export default function HomePage() {
  const featuredProducts = MOCK_PRODUCTS.filter((p) => p.is_bestseller || p.is_new_arrival).slice(0, 4);
  const newArrivals = MOCK_PRODUCTS.filter((p) => p.is_new_arrival);

  return (
    <>
      {/* ─── Hero Section ──────────────────────────────────────────── */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden" id="hero">
        {/* Background */}
        <div className="absolute inset-0">
          <Image
            src="https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?w=1920&h=1080&fit=crop"
            alt="Luxury living room"
            fill
            className="object-cover"
            priority
          />
          <div className="absolute inset-0 bg-gradient-to-r from-surface-950 via-surface-950/85 to-surface-950/40" />
        </div>

        {/* Decorative Orbs */}
        <div className="gradient-orb gradient-orb-brand w-[500px] h-[500px] -top-40 -left-40" />
        <div className="gradient-orb gradient-orb-accent w-[400px] h-[400px] bottom-0 right-20" />

        {/* Content */}
        <div className="container-wide relative z-10">
          <div className="max-w-2xl">
            <span className="badge badge-brand text-xs mb-6 animate-fade-in">
              ✦ New Collection 2026
            </span>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-display font-bold leading-[1.1] animate-fade-in delay-100">
              <span className="text-surface-50">Furniture</span>
              <br />
              <span className="gradient-text">Redefined.</span>
            </h1>
            <p className="text-lg text-surface-300 mt-6 leading-relaxed max-w-lg animate-fade-in delay-200">
              Handcrafted pieces designed for modern living. Visualize in AR, customize finishes, and enjoy white-glove delivery to your door.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8 animate-fade-in delay-300">
              <Link href="/products" className="btn btn-primary btn-lg" id="hero-cta-shop">
                Explore Collection
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
              <Link href="/shop-the-look" className="btn btn-ghost btn-lg text-surface-200" id="hero-cta-look">
                Shop the Look
              </Link>
            </div>

            {/* Trust Badges */}
            <div className="flex items-center gap-6 mt-12 animate-fade-in delay-400">
              {[
                { icon: '🚚', text: 'White-Glove Delivery' },
                { icon: '🔧', text: 'Assembly Included' },
                { icon: '📐', text: 'AR Room Preview' },
              ].map((badge) => (
                <div key={badge.text} className="flex items-center gap-2">
                  <span className="text-lg">{badge.icon}</span>
                  <span className="text-xs text-surface-400 font-medium">{badge.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 animate-float">
          <div className="w-6 h-10 rounded-full border-2 border-surface-500 flex items-start justify-center p-1.5">
            <div className="w-1.5 h-3 rounded-full bg-brand-500 animate-pulse" />
          </div>
        </div>
      </section>

      {/* ─── Categories Grid ───────────────────────────────────────── */}
      <section className="section" id="categories">
        <div className="container-wide">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-50">
              Shop by Room
            </h2>
            <p className="text-center w-full text-surface-400 mt-3 max-w-lg mx-auto">
              Curated collections for every space in your home
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-3 gap-4 lg:gap-6">
            {MOCK_CATEGORIES.map((cat, i) => (
              <Link
                key={cat.id}
                href={`/categories/${cat.slug}`}
                id={`category-${cat.slug}`}
                className="group relative aspect-[3/2] overflow-hidden animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {cat.image_url && (
                  <Image
                    src={cat.image_url}
                    alt={cat.name}
                    fill
                    className="object-cover transition-transform duration-700 group-hover:scale-110"
                    sizes="(max-width: 768px) 50vw, 33vw"
                  />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-surface-950/80 via-surface-950/20 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 flex flex-col items-center justify-end p-4 lg:p-6 pb-6 text-center">
                  <h3 className="text-lg lg:text-xl font-display font-semibold text-white group-hover:text-brand-300 transition-colors">
                    {cat.name}
                  </h3>
                  <p className="text-xs text-surface-300 mt-1">
                    {cat.product_count} pieces
                  </p>
                </div>
                <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                  <span className="btn btn-sm bg-white/10 backdrop-blur-md text-white border-white/20 text-xs">
                    Explore →
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ─── Featured Products ─────────────────────────────────────── */}
      <section className="section bg-surface-900/50" id="featured">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10">
            <div>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-50">
                Featured Pieces
              </h2>
              <p className="text-surface-400 mt-2">
                Our most beloved designs, chosen by thousands
              </p>
            </div>
            <Link
              href="/products"
              className="btn btn-ghost text-brand-400 hover:text-brand-300 hidden sm:flex"
              id="featured-view-all"
            >
              View All
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Value Proposition Banner ──────────────────────────────── */}
      <section className="section" id="value-props">
        <div className="container-wide">
          <div className="glass rounded-2xl p-8 lg:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-12">
              {[
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09zM18.259 8.715L18 9.75l-.259-1.035a3.375 3.375 0 00-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 002.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 002.455 2.456L21.75 6l-1.036.259a3.375 3.375 0 00-2.455 2.456zM16.894 20.567L16.5 21.75l-.394-1.183a2.25 2.25 0 00-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 001.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 001.423 1.423l1.183.394-1.183.394a2.25 2.25 0 00-1.423 1.423z" />
                    </svg>
                  ),
                  title: 'AR Room Visualization',
                  description: 'Project any piece into your space using your phone camera. Check scale, style, and fit before you buy.',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
                    </svg>
                  ),
                  title: 'White-Glove Delivery',
                  description: 'Professional delivery to your room of choice. Packaging removed, furniture placed, and everything spotless.',
                },
                {
                  icon: (
                    <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                    </svg>
                  ),
                  title: '5-Year Warranty',
                  description: 'Every piece backed by our comprehensive structural warranty. Register digitally and track claims online.',
                },
              ].map((prop, i) => (
                <div key={prop.title} className="text-center animate-fade-in" style={{ animationDelay: `${i * 150}ms` }}>
                  <div className="w-14 h-14 rounded-xl bg-brand-500/10 text-brand-400 flex items-center justify-center mx-auto mb-4">
                    {prop.icon}
                  </div>
                  <h3 className="text-lg font-semibold text-surface-50 mb-2">{prop.title}</h3>
                  <p className="text-sm text-surface-400 leading-relaxed">{prop.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ─── New Arrivals ──────────────────────────────────────────── */}
      <section className="section" id="new-arrivals">
        <div className="container-wide">
          <div className="flex items-end justify-between mb-10">
            <div>
              <span className="badge badge-new text-xs mb-3">Just Launched</span>
              <h2 className="text-3xl sm:text-4xl font-display font-bold text-surface-50">
                New Arrivals
              </h2>
            </div>
            <Link
              href="/products?sort=newest"
              className="btn btn-ghost text-brand-400 hover:text-brand-300 hidden sm:flex"
            >
              See All New →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {newArrivals.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        </div>
      </section>

      {/* ─── Craftsmanship Story ─────────────────────────────────────── */}
      <section className="section" id="craftsmanship-cta">
        <div className="container-wide">
          <div className="relative overflow-hidden">
            <Image
              src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=1400&h=500&fit=crop"
              alt="Artisan furniture workshop"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-surface-950/90 via-surface-950/70 to-surface-950/30" />

            <div className="relative z-10 p-8 lg:p-16 max-w-xl">
              <span className="badge badge-brand text-xs mb-4">Our Craft</span>
              <h2 className="text-3xl lg:text-4xl font-display font-bold text-surface-50 leading-tight">
                Handcrafted with<br />Intention
              </h2>
              <p className="text-surface-300 mt-4 leading-relaxed">
                Every Furnishara piece is designed in-house and built by master craftspeople using sustainably sourced materials. Discover the story behind our collections.
              </p>
              <Link href="/products" className="btn btn-primary btn-lg mt-6" id="craftsmanship-cta-link">
                Explore Our Collection
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                </svg>
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
