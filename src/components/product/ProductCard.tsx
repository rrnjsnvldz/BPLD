import Link from 'next/link';
import Image from 'next/image';
import type { ProductCard as ProductCardType } from '@/types';
import { formatPrice } from '@/lib/utils';

interface ProductCardProps {
  product: ProductCardType;
  index?: number;
}

export function ProductCard({ product, index = 0 }: ProductCardProps) {
  const hasDiscount = product.compare_at_price && product.compare_at_price > product.base_price;
  const discountPct = hasDiscount
    ? Math.round((1 - product.base_price / product.compare_at_price!) * 100)
    : 0;

  return (
    <Link
      href={`/products/${product.slug}`}
      id={`product-card-${product.slug}`}
      className="product-card group block overflow-hidden bg-surface-900 border border-surface-800 hover:border-surface-700"
      style={{ animationDelay: `${index * 80}ms` }}
    >
      {/* Image Container */}
      <div className="relative aspect-[4/3] overflow-hidden bg-surface-800">
        {product.primary_image_url ? (
          <Image
            src={product.primary_image_url}
            alt={product.name}
            fill
            className="product-image object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
          />
        ) : (
          <div className="w-full h-full animate-shimmer" />
        )}

        {/* Badges */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
          {product.is_new_arrival && (
            <span className="badge badge-new">New</span>
          )}
          {product.is_bestseller && (
            <span className="badge badge-brand">Bestseller</span>
          )}
          {hasDiscount && (
            <span className="badge bg-error/15 text-error">-{discountPct}%</span>
          )}
        </div>

        {/* AR Badge */}
        {product.available_for_ar && (
          <div className="absolute top-3 right-3">
            <span className="badge bg-surface-900/80 text-surface-200 backdrop-blur-sm" title="View in AR">
              <svg className="w-3 h-3 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
                <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" />
                <path d="M12 22V12" />
                <path d="M22 7L12 12 2 7" />
              </svg>
              AR
            </span>
          </div>
        )}

        {/* Quick Actions Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-surface-950/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-4">
          <span className="btn btn-sm bg-white/90 text-surface-950 backdrop-blur-sm hover:bg-white font-medium text-xs">
            View Details →
          </span>
        </div>
      </div>

      {/* Content */}
      <div className="p-5">
        {/* Category */}
        {product.category_name && (
          <p className="text-[11px] uppercase tracking-wider text-surface-500 font-medium mb-1">
            {product.category_name}
          </p>
        )}

        {/* Name */}
        <h3 className="text-sm font-semibold text-surface-100 group-hover:text-brand-400 transition-colors line-clamp-1">
          {product.name}
        </h3>

        {/* Tagline */}
        {product.tagline && (
          <p className="text-xs text-surface-400 mt-0.5 line-clamp-1">
            {product.tagline}
          </p>
        )}

        {/* Price + Rating */}
        <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1 mt-3">
          <div className="flex flex-wrap items-baseline gap-2">
            <span className="text-base font-bold text-surface-50">
              {formatPrice(product.base_price)}
            </span>
            {hasDiscount && (
              <span className="text-xs text-surface-500 line-through">
                {formatPrice(product.compare_at_price!)}
              </span>
            )}
          </div>

          {product.average_rating && (
            <div className="flex items-center gap-1 shrink-0" aria-label={`${product.average_rating} out of 5 stars, ${product.review_count} reviews`}>
              <svg className="w-3.5 h-3.5 star-filled" viewBox="0 0 20 20" fill="currentColor">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-xs font-medium text-surface-300">{product.average_rating}</span>
              <span className="text-xs text-surface-500">({product.review_count})</span>
            </div>
          )}
        </div>
      </div>
    </Link>
  );
}
