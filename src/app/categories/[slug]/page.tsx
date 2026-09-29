import Link from 'next/link';
import Image from 'next/image';
import { ProductCard } from '@/components/product';
import { MOCK_PRODUCTS, MOCK_CATEGORIES } from '@/lib/mock-data';
import type { Metadata } from 'next';

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
  return {
    title: `${category?.name || 'Category'} | Furnishara`,
    description: category?.description || 'Browse our furniture collection.',
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const category = MOCK_CATEGORIES.find((c) => c.slug === slug);
  const products = MOCK_PRODUCTS.filter((p) => p.category_slug === slug);

  if (!category) {
    return (
      <div className="section text-center">
        <div className="container-narrow">
          <h1 className="text-3xl font-display font-bold text-surface-50 mb-4">Category Not Found</h1>
          <p className="text-surface-400 mb-6">The category you&apos;re looking for doesn&apos;t exist.</p>
          <Link href="/products" className="btn btn-primary">Browse All Furniture</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container-wide">
        {/* Hero Banner */}
        <div className="relative rounded-2xl overflow-hidden mb-10">
          <div className="relative aspect-[3/1] min-h-[200px]">
            {category.image_url && (
              <Image
                src={category.image_url}
                alt={category.name}
                fill
                className="object-cover"
                sizes="100vw"
                priority
              />
            )}
            <div className="absolute inset-0 bg-gradient-to-r from-surface-950/90 via-surface-950/60 to-transparent" />
          </div>
          <div className="absolute inset-0 flex items-center">
            <div className="container-wide">
              <div className="flex items-center gap-2 text-sm text-surface-400 mb-3">
                <Link href="/" className="hover:text-brand-400 transition-colors">Home</Link>
                <span>/</span>
                <Link href="/products" className="hover:text-brand-400 transition-colors">Furniture</Link>
                <span>/</span>
                <span className="text-surface-200">{category.name}</span>
              </div>
              <h1 className="text-4xl lg:text-5xl font-display font-bold text-white">
                {category.name}
              </h1>
              {category.description && (
                <p className="text-surface-300 mt-3 max-w-lg">{category.description}</p>
              )}
              <p className="text-sm text-surface-400 mt-3">{products.length} pieces</p>
            </div>
          </div>
        </div>

        {/* Products Grid */}
        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <ProductCard key={product.id} product={product} index={i} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <p className="text-xl text-surface-400 mb-4">No products in this category yet.</p>
            <Link href="/products" className="btn btn-primary">Browse All Furniture</Link>
          </div>
        )}
      </div>
    </div>
  );
}
