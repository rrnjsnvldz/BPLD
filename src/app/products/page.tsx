import { ProductCard } from '@/components/product';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data';
import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'All Furniture | Furnishara',
  description: 'Browse our complete collection of premium, handcrafted furniture. Sofas, beds, dining tables, desks, and more.',
};

import { createClient } from '@/lib/supabase/server';
import { getProducts } from '@/lib/supabase/queries';

export default async function ProductsPage() {
  const supabase = await createClient();
  let products = MOCK_PRODUCTS; // Fallback
  
  try {
    const { products: dbProducts } = await getProducts(supabase, { limit: 50 });
    if (dbProducts && dbProducts.length > 0) {
      products = dbProducts as any;
    }
  } catch (error) {
    console.error('Failed to fetch from Supabase:', error);
  }

  return (
    <div className="section">
      <div className="container-wide">
        {/* Page Header */}
        <div className="mb-10">
          <div className="flex items-center gap-2 text-sm text-surface-500 mb-4">
            <Link href="/" className="hover:text-brand-400 transition-colors">Home</Link>
            <span>/</span>
            <span className="text-surface-200">All Furniture</span>
          </div>
          <h1 className="text-4xl font-display font-bold text-surface-50">
            All Furniture
          </h1>
          <p className="text-surface-400 mt-2">{products.length} pieces in our collection</p>
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar Filters */}
          <aside className="w-full lg:w-64 flex-shrink-0" id="product-filters">
            <div className="glass rounded-xl p-5 space-y-6 lg:sticky lg:top-24">
              <div>
                <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider mb-3">
                  Categories
                </h3>
                <div className="space-y-1">
                  <Link
                    href="/products"
                    className="block px-3 py-2 text-sm rounded-lg bg-brand-500/10 text-brand-400 font-medium"
                  >
                    All Furniture
                  </Link>
                  {MOCK_CATEGORIES.map((cat) => (
                    <Link
                      key={cat.id}
                      href={`/categories/${cat.slug}`}
                      className="block px-3 py-2 text-sm rounded-lg text-surface-400 hover:text-surface-200 hover:bg-surface-800 transition-colors"
                    >
                      {cat.name}
                      <span className="text-surface-600 ml-1">({cat.product_count})</span>
                    </Link>
                  ))}
                </div>
              </div>

              <div className="divider" />

              <div>
                <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider mb-3">
                  Price Range
                </h3>
                <div className="space-y-2">
                  {['Under $500', '$500 – $1,000', '$1,000 – $2,000', '$2,000 – $5,000', 'Over $5,000'].map((range) => (
                    <label key={range} className="flex items-center gap-2 text-sm text-surface-400 cursor-pointer hover:text-surface-200">
                      <input type="checkbox" className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500" />
                      {range}
                    </label>
                  ))}
                </div>
              </div>

              <div className="divider" />

              <div>
                <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider mb-3">
                  Material
                </h3>
                <div className="space-y-2">
                  {['Wood', 'Leather', 'Fabric', 'Metal', 'Marble'].map((mat) => (
                    <label key={mat} className="flex items-center gap-2 text-sm text-surface-400 cursor-pointer hover:text-surface-200">
                      <input type="checkbox" className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500" />
                      {mat}
                    </label>
                  ))}
                </div>
              </div>

              <div className="divider" />

              <div>
                <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider mb-3">
                  Features
                </h3>
                <div className="space-y-2">
                  {[
                    { label: 'AR Preview Available', icon: '📐' },
                    { label: 'New Arrivals', icon: '✨' },
                    { label: 'On Sale', icon: '🏷️' },
                    { label: 'Bestsellers', icon: '⭐' },
                  ].map((feat) => (
                    <label key={feat.label} className="flex items-center gap-2 text-sm text-surface-400 cursor-pointer hover:text-surface-200">
                      <input type="checkbox" className="w-4 h-4 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500" />
                      <span>{feat.icon}</span>
                      {feat.label}
                    </label>
                  ))}
                </div>
              </div>
            </div>
          </aside>

          {/* Product Grid */}
          <div className="flex-1">
            {/* Sort Bar */}
            <div className="flex items-center justify-between mb-6">
              <p className="text-sm text-surface-400">
                Showing <strong className="text-surface-200">{products.length}</strong> results
              </p>
              <select
                className="input w-auto text-sm py-2"
                id="sort-select"
                aria-label="Sort products"
              >
                <option value="newest">Newest First</option>
                <option value="price_asc">Price: Low → High</option>
                <option value="price_desc">Price: High → Low</option>
                <option value="name">Name: A → Z</option>
              </select>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
