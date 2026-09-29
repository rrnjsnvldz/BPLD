import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Shopping Cart | Furnishara',
  description: 'Review your selected furniture items and proceed to checkout.',
};

// Mock cart data
const MOCK_CART_ITEMS = [
  {
    id: 'ci-1',
    product: {
      slug: 'elysian-modular-sofa',
      name: 'Elysian Modular Sofa',
      image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=300&h=300&fit=crop',
    },
    material_name: 'Linen – Cloud White',
    quantity: 1,
    unit_price: 3299,
  },
  {
    id: 'ci-2',
    product: {
      slug: 'meridian-floor-lamp',
      name: 'Meridian Floor Lamp',
      image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=300&h=300&fit=crop',
    },
    material_name: 'Brushed Brass',
    quantity: 2,
    unit_price: 549,
  },
];

export default function CartPage() {
  const items = MOCK_CART_ITEMS;
  const subtotal = items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0);
  const tax = Math.round(subtotal * 0.08 * 100) / 100;

  return (
    <div className="section">
      <div className="container-narrow">
        {/* Breadcrumb */}
        <div className="flex flex-wrap items-center gap-2 text-sm text-surface-500 mb-4">
          <Link href="/" className="hover:text-brand-400 transition-colors">Home</Link>
          <span>/</span>
          <span className="text-surface-200">Cart</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-display font-bold text-surface-50 mb-8">
          Shopping Cart
          <span className="text-surface-500 text-base sm:text-lg font-sans font-normal ml-3">
            ({items.length} {items.length === 1 ? 'item' : 'items'})
          </span>
        </h1>

        {items.length === 0 ? (
          <div className="text-center py-20">
            <div className="text-6xl mb-4">🛋️</div>
            <h2 className="text-xl font-semibold text-surface-200 mb-2">Your cart is empty</h2>
            <p className="text-surface-400 mb-6">Discover our curated collection of premium furniture.</p>
            <Link href="/products" className="btn btn-primary">
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8 items-start">
            {/* Cart Items */}
            <div className="lg:col-span-2 space-y-4">
              {items.map((item) => (
                <div
                  key={item.id}
                  className="glass rounded-xl p-4 sm:p-5 animate-fade-in"
                  id={`cart-item-${item.id}`}
                >
                  {/* Responsive flex: stacks on mobile, row on sm+ */}
                  <div className="flex flex-col sm:flex-row gap-4">
                    {/* Image — consistent square aspect ratio with fixed dimensions */}
                    <Link
                      href={`/products/${item.product.slug}`}
                      className="relative w-full sm:w-24 aspect-square sm:aspect-auto sm:h-24 rounded-lg overflow-hidden flex-shrink-0 bg-surface-800"
                    >
                      <Image
                        src={item.product.image_url}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="(max-width: 640px) 100vw, 96px"
                      />
                    </Link>

                    {/* Details */}
                    <div className="flex-1 min-w-0 flex flex-col justify-between gap-3">
                      {/* Top row — name + price */}
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0 flex-1">
                          <Link
                            href={`/products/${item.product.slug}`}
                            className="text-sm font-semibold text-surface-100 hover:text-brand-400 transition-colors block truncate"
                          >
                            {item.product.name}
                          </Link>
                          {item.material_name && (
                            <p className="text-xs text-surface-500 mt-0.5 truncate">{item.material_name}</p>
                          )}
                        </div>
                        <p className="text-base font-bold text-surface-50 flex-shrink-0 whitespace-nowrap">
                          {formatPrice(item.unit_price * item.quantity)}
                        </p>
                      </div>

                      {/* Bottom row — quantity + remove */}
                      <div className="flex items-center justify-between">
                        {/* Quantity Control */}
                        <div className="flex items-center gap-1 bg-surface-800 rounded-lg border border-surface-700">
                          <button
                            className="w-8 h-8 flex items-center justify-center text-surface-400 hover:text-surface-200 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 12h-15" />
                            </svg>
                          </button>
                          <span className="w-8 text-center text-sm font-medium text-surface-100">
                            {item.quantity}
                          </span>
                          <button
                            className="w-8 h-8 flex items-center justify-center text-surface-400 hover:text-surface-200 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                            </svg>
                          </button>
                        </div>

                        <button
                          className="text-xs text-surface-500 hover:text-error transition-colors flex-shrink-0"
                          aria-label={`Remove ${item.product.name} from cart`}
                        >
                          Remove
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              ))}

              {/* Continue Shopping */}
              <Link
                href="/products"
                className="inline-flex items-center gap-2 text-sm text-surface-400 hover:text-brand-400 transition-colors mt-4"
              >
                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
                </svg>
                Continue Shopping
              </Link>
            </div>

            {/* Order Summary — no fixed heights, natural expansion with proper padding */}
            <div className="lg:col-span-1">
              <div className="glass rounded-xl p-6 sm:p-8 lg:sticky lg:top-24" id="order-summary">
                <h2 className="text-lg font-semibold text-surface-100 mb-5">Order Summary</h2>

                <div className="flex flex-col gap-3">
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Subtotal</span>
                    <span className="text-surface-200 font-medium">{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Shipping</span>
                    <span className="text-surface-400 text-xs">Calculated at checkout</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-surface-400">Estimated Tax</span>
                    <span className="text-surface-200 font-medium">{formatPrice(tax)}</span>
                  </div>
                </div>

                <div className="h-px bg-surface-700 my-5" />

                <div className="flex justify-between items-baseline">
                  <span className="text-base font-semibold text-surface-100">Total</span>
                  <span className="text-xl font-bold text-surface-50">{formatPrice(subtotal + tax)}</span>
                </div>

                <Link
                  href="/checkout"
                  className="btn btn-primary btn-lg w-full mt-6"
                  id="proceed-to-checkout"
                >
                  Proceed to Checkout
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                  </svg>
                </Link>

                {/* Payment Methods */}
                <div className="text-center mt-6">
                  <p className="text-xs text-surface-500 mb-2">We accept</p>
                  <div className="flex flex-wrap items-center justify-center gap-2 text-surface-500">
                    <span className="text-xs font-medium px-2 py-1 bg-surface-800 rounded">💳 Cards</span>
                    <span className="text-xs font-medium px-2 py-1 bg-surface-800 rounded">📱 Wallets</span>
                    <span className="text-xs font-medium px-2 py-1 bg-surface-800 rounded">📅 BNPL</span>
                  </div>
                </div>

                {/* Trust Signals */}
                <div className="flex flex-col gap-2 mt-5 pt-5 border-t border-surface-800">
                  {[
                    '🔒 Secure SSL Checkout',
                    '🚚 White-Glove Delivery Available',
                    '↩️ 30-Day Return Policy',
                  ].map((signal) => (
                    <div key={signal} className="flex items-center gap-2 text-xs text-surface-500">
                      <span>{signal}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
