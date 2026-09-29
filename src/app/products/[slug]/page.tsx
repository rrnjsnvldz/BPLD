import Link from 'next/link';
import { ProductGallery, SwatchSelector, DimensionDiagram } from '@/components/product';
import { MOCK_PRODUCT_DETAIL, MOCK_REVIEWS, MOCK_REVIEW_STATS } from '@/lib/mock-data';
import { formatPrice } from '@/lib/utils';
import type { Metadata } from 'next';

export async function generateMetadata(): Promise<Metadata> {
  const product = MOCK_PRODUCT_DETAIL;
  return {
    title: `${product.name} | Furnishara`,
    description: product.meta_description || product.tagline || product.description?.slice(0, 160),
  };
}

import { createClient } from '@/lib/supabase/server';
import { getProductBySlug, getProductReviews, getReviewStats } from '@/lib/supabase/queries';

export default async function ProductDetailPage({ params }: { params: { slug: string } }) {
  const supabase = await createClient();
  let product = MOCK_PRODUCT_DETAIL as any;
  let reviews = MOCK_REVIEWS;
  let reviewStats = MOCK_REVIEW_STATS;

  try {
    const dbProduct = await getProductBySlug(supabase, params.slug);
    if (dbProduct) {
      product = dbProduct;
      
      const [reviewsData, statsData] = await Promise.all([
        getProductReviews(supabase, dbProduct.id),
        getReviewStats(supabase, dbProduct.id)
      ]);
      
      if (reviewsData && reviewsData.reviews.length > 0) reviews = reviewsData.reviews as any;
      if (statsData) reviewStats = statsData;
    }
  } catch (e) {
    console.error("Failed to fetch product from Supabase", e);
  }

  const hasDiscount = product.compare_at_price && product.compare_at_price > product.base_price;

  return (
    <div className="section-sm">
      <div className="container-wide">
        {/* Breadcrumbs */}
        <div className="flex items-center gap-2 text-sm text-surface-500 mb-8">
          <Link href="/" className="hover:text-brand-400 transition-colors">Home</Link>
          <span>/</span>
          <Link href="/products" className="hover:text-brand-400 transition-colors">Furniture</Link>
          <span>/</span>
          {product.category && (
            <>
              <Link href={`/categories/${product.category.slug}`} className="hover:text-brand-400 transition-colors">
                {product.category.name}
              </Link>
              <span>/</span>
            </>
          )}
          <span className="text-surface-200">{product.name}</span>
        </div>

        {/* Main Product Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 lg:gap-16">
          {/* Gallery */}
          <div className="animate-fade-in">
            {product.media && <ProductGallery media={product.media} productName={product.name} />}
          </div>

          {/* Product Info */}
          <div className="animate-fade-in delay-200 space-y-6">
            {/* Badges */}
            <div className="flex items-center gap-2">
              {product.is_new_arrival && <span className="badge badge-new">New Arrival</span>}
              {product.is_bestseller && <span className="badge badge-brand">Bestseller</span>}
              {product.available_for_ar && (
                <span className="badge bg-surface-800 text-surface-200">
                  📐 AR Available
                </span>
              )}
            </div>

            {/* Title */}
            <div>
              <h1 className="text-3xl lg:text-4xl font-display font-bold text-surface-50">
                {product.name}
              </h1>
              {product.tagline && (
                <p className="text-lg text-surface-400 mt-1 font-display italic">
                  {product.tagline}
                </p>
              )}
            </div>

            {/* Rating */}
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <svg
                    key={star}
                    className={`w-5 h-5 ${star <= Math.round(reviewStats.average_rating) ? 'star-filled' : 'star-empty'}`}
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                  </svg>
                ))}
              </div>
              <span className="text-sm font-medium text-surface-200">
                {reviewStats.average_rating}
              </span>
              <span className="text-sm text-surface-500">
                ({reviewStats.total_reviews} reviews)
              </span>
              <span className="text-sm text-surface-500">•</span>
              <span className="text-sm text-surface-500">
                {reviewStats.photo_count} customer photos
              </span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3">
              <span className="text-3xl font-bold text-surface-50">
                {formatPrice(product.base_price)}
              </span>
              {hasDiscount && (
                <>
                  <span className="text-lg text-surface-500 line-through">
                    {formatPrice(product.compare_at_price!)}
                  </span>
                  <span className="badge bg-error/15 text-error">
                    Save {formatPrice(product.compare_at_price! - product.base_price)}
                  </span>
                </>
              )}
            </div>

            <div className="divider" />

            {/* Material Selector */}
            {product.materials && product.materials.length > 0 && (
              <SwatchSelector materials={product.materials} basePrice={product.base_price} />
            )}

            <div className="divider" />

            {/* Add to Cart */}
            <div className="flex flex-col sm:flex-row gap-3">
              <button className="btn btn-primary btn-lg flex-1" id="add-to-cart">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
                </svg>
                Add to Cart
              </button>
              <button className="btn btn-secondary btn-lg" id="add-to-wishlist" aria-label="Add to wishlist">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                </svg>
              </button>
            </div>

            {/* Delivery Info */}
            <div className="glass rounded-xl p-4 space-y-3">
              <div className="flex items-center gap-3">
                <span className="text-lg">🚚</span>
                <div>
                  <p className="text-sm font-medium text-surface-200">White-Glove Delivery Available</p>
                  <p className="text-xs text-surface-500">Estimated 3–7 business days</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🔧</span>
                <div>
                  <p className="text-sm font-medium text-surface-200">
                    {product.assembly_required ? 'Assembly Service Available' : 'No Assembly Required'}
                  </p>
                  <p className="text-xs text-surface-500">
                    {product.assembly_required
                      ? `Estimated ${product.estimated_assembly_time_min} minutes`
                      : 'Arrives ready to use'}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="text-lg">🛡️</span>
                <div>
                  <p className="text-sm font-medium text-surface-200">5-Year Structural Warranty</p>
                  <p className="text-xs text-surface-500">Register online after delivery</p>
                </div>
              </div>
            </div>

            <p className="text-xs text-surface-500">SKU: {product.sku}</p>
          </div>
        </div>

        {/* ─── Tabs Section ──────────────────────────────────────────── */}
        <div className="mt-16 space-y-16">
          {/* Description */}
          <div id="product-description">
            <h2 className="text-2xl font-display font-bold text-surface-50 mb-6">About This Piece</h2>
            <div className="prose prose-invert max-w-3xl text-surface-300 leading-relaxed whitespace-pre-line">
              {product.description}
            </div>
          </div>

          {/* Dimensions */}
          {product.dimensions && product.dimensions.length > 0 && (
            <div id="product-dimensions">
              <DimensionDiagram product={product} dimensions={product.dimensions} />
            </div>
          )}

          {/* Care Guides */}
          {product.care_guides && product.care_guides.length > 0 && (
            <div id="care-guides">
              <h2 className="text-2xl font-display font-bold text-surface-50 mb-6">Care & Maintenance</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {product.care_guides.map((guide) => (
                  <div key={guide.id} className="glass rounded-xl p-5">
                    <h3 className="text-sm font-semibold text-surface-200 mb-2">{guide.title}</h3>
                    <p className="text-sm text-surface-400 leading-relaxed">{guide.content}</p>
                    {guide.pdf_url && (
                      <a
                        href={guide.pdf_url}
                        className="inline-flex items-center gap-1 text-xs text-brand-400 mt-3 hover:text-brand-300"
                        download
                      >
                        <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5M16.5 12L12 16.5m0 0L7.5 12m4.5 4.5V3" />
                        </svg>
                        Download PDF Guide
                      </a>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews */}
          <div id="product-reviews">
            <div className="flex items-end justify-between mb-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-surface-50">Customer Reviews</h2>
                <p className="text-surface-400 mt-1">{reviewStats.total_reviews} reviews • {reviewStats.photo_count} photos</p>
              </div>
              <button className="btn btn-secondary btn-sm" id="write-review-btn">
                Write a Review
              </button>
            </div>

            {/* Rating Summary */}
            <div className="glass rounded-xl p-6 mb-8">
              <div className="flex flex-col md:flex-row gap-8 items-center">
                <div className="text-center">
                  <p className="text-5xl font-bold text-surface-50">{reviewStats.average_rating}</p>
                  <div className="flex items-center gap-1 mt-2 justify-center">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <svg
                        key={star}
                        className={`w-4 h-4 ${star <= Math.round(reviewStats.average_rating) ? 'star-filled' : 'star-empty'}`}
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="text-xs text-surface-500 mt-1">{reviewStats.total_reviews} reviews</p>
                </div>

                <div className="flex-1 space-y-2 w-full max-w-md">
                  {[5, 4, 3, 2, 1].map((star) => {
                    const count = reviewStats.rating_distribution[star as 1 | 2 | 3 | 4 | 5];
                    const pct = reviewStats.total_reviews > 0 ? (count / reviewStats.total_reviews) * 100 : 0;
                    return (
                      <div key={star} className="flex items-center gap-3">
                        <span className="text-xs text-surface-400 w-3">{star}</span>
                        <svg className="w-3.5 h-3.5 star-filled flex-shrink-0" viewBox="0 0 20 20" fill="currentColor">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                        <div className="flex-1 h-2 bg-surface-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-accent-400 rounded-full transition-all duration-500"
                            style={{ width: `${pct}%` }}
                          />
                        </div>
                        <span className="text-xs text-surface-500 w-8 text-right">{count}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Reviews List */}
            <div className="space-y-6">
              {reviews.map((review) => (
                <div key={review.id} className="glass rounded-xl p-6" id={`review-${review.id}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-brand-500/20 flex items-center justify-center text-brand-400 font-bold text-sm">
                        {review.profile?.full_name?.[0] || '?'}
                      </div>
                      <div>
                        <p className="text-sm font-medium text-surface-200">{review.profile?.full_name}</p>
                        <div className="flex items-center gap-2">
                          <div className="flex items-center gap-0.5">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <svg
                                key={star}
                                className={`w-3 h-3 ${star <= review.rating ? 'star-filled' : 'star-empty'}`}
                                viewBox="0 0 20 20"
                                fill="currentColor"
                              >
                                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                              </svg>
                            ))}
                          </div>
                          {review.is_verified_purchase && (
                            <span className="badge badge-success text-[10px]">Verified Purchase</span>
                          )}
                        </div>
                      </div>
                    </div>
                    <span className="text-xs text-surface-500">
                      {new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                    </span>
                  </div>

                  {review.title && (
                    <h4 className="text-sm font-semibold text-surface-200 mt-3">{review.title}</h4>
                  )}
                  {review.body && (
                    <p className="text-sm text-surface-400 mt-2 leading-relaxed">{review.body}</p>
                  )}

                  {/* Review Photos */}
                  {review.photos && review.photos.length > 0 && (
                    <div className="flex gap-2 mt-4">
                      {review.photos.map((photo) => (
                        <div
                          key={photo.id}
                          className="relative w-20 h-20 rounded-lg overflow-hidden border border-surface-700"
                        >
                          <img
                            src={photo.url}
                            alt={photo.caption || 'Customer photo'}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
