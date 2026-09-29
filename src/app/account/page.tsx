import Link from 'next/link';
import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'My Account | Furnishara',
  description: 'Manage your orders, wishlists, warranties, and account settings.',
};

// Mock data
const MOCK_ORDERS = [
  {
    id: 'ord-1',
    order_number: 'FRN-20260915-A3X2',
    status: 'delivered',
    total: 3848,
    items_count: 2,
    created_at: '2026-09-15T10:30:00Z',
  },
  {
    id: 'ord-2',
    order_number: 'FRN-20260928-B7K1',
    status: 'in_transit',
    total: 1899,
    items_count: 1,
    created_at: '2026-09-28T14:00:00Z',
  },
];

const MOCK_WISHLISTS = [
  { id: 'wl-1', name: 'New Apartment Living Room', item_count: 4, updated_at: '2026-09-20T00:00:00Z' },
  { id: 'wl-2', name: 'Master Bedroom Refresh', item_count: 2, updated_at: '2026-09-25T00:00:00Z' },
];

const STATUS_STYLES: Record<string, { label: string; class: string }> = {
  pending: { label: 'Pending', class: 'bg-surface-700 text-surface-300' },
  confirmed: { label: 'Confirmed', class: 'bg-info/15 text-info' },
  processing: { label: 'Processing', class: 'bg-info/15 text-info' },
  shipped: { label: 'Shipped', class: 'bg-brand-500/15 text-brand-400' },
  in_transit: { label: 'In Transit', class: 'bg-brand-500/15 text-brand-400' },
  delivered: { label: 'Delivered', class: 'bg-success/15 text-success' },
  cancelled: { label: 'Cancelled', class: 'bg-error/15 text-error' },
};

function formatPrice(amount: number) {
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
}

export default function AccountPage() {
  return (
    <div className="section">
      <div className="container-narrow">
        {/* Profile Header */}
        <div className="flex items-center gap-5 mb-10 animate-fade-in">
          <div className="w-16 h-16 rounded-full bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-2xl font-bold text-white font-display">
            J
          </div>
          <div>
            <h1 className="text-2xl font-display font-bold text-surface-50">
              Welcome back, Jane
            </h1>
            <p className="text-surface-400 text-sm">jane@example.com</p>
          </div>
          <button className="btn btn-ghost btn-sm ml-auto text-surface-400">
            Edit Profile
          </button>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10 animate-fade-in delay-100">
          {[
            { label: 'Orders', value: '2', icon: '📦' },
            { label: 'Wishlists', value: '2', icon: '💝' },
            { label: 'Reviews', value: '3', icon: '⭐' },
            { label: 'Warranties', value: '1', icon: '🛡️' },
          ].map((stat) => (
            <div key={stat.label} className="glass rounded-xl p-4 text-center">
              <span className="text-2xl">{stat.icon}</span>
              <p className="text-2xl font-bold text-surface-50 mt-1">{stat.value}</p>
              <p className="text-xs text-surface-500">{stat.label}</p>
            </div>
          ))}
        </div>

        {/* Navigation Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Recent Orders */}
            <section className="animate-fade-in delay-200" id="recent-orders">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-surface-100">Recent Orders</h2>
                <Link href="/account/orders" className="text-sm text-brand-400 hover:text-brand-300">
                  View All →
                </Link>
              </div>

              <div className="space-y-3">
                {MOCK_ORDERS.map((order) => {
                  const statusInfo = STATUS_STYLES[order.status] || STATUS_STYLES.pending;
                  return (
                    <div key={order.id} className="glass rounded-xl p-4" id={`order-${order.order_number}`}>
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="text-sm font-medium text-surface-200">{order.order_number}</p>
                          <p className="text-xs text-surface-500 mt-0.5">
                            {new Date(order.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' })}
                            {' · '}{order.items_count} {order.items_count === 1 ? 'item' : 'items'}
                          </p>
                        </div>
                        <div className="text-right">
                          <span className={`badge ${statusInfo.class}`}>{statusInfo.label}</span>
                          <p className="text-sm font-bold text-surface-50 mt-1">{formatPrice(order.total)}</p>
                        </div>
                      </div>
                      {order.status === 'delivered' && (
                        <div className="flex items-center gap-2 mt-3 pt-3 border-t border-surface-800">
                          <Link href="#" className="text-xs text-brand-400 hover:text-brand-300">
                            Write a Review
                          </Link>
                          <span className="text-surface-700">·</span>
                          <Link href="#" className="text-xs text-surface-400 hover:text-surface-200">
                            Register Warranty
                          </Link>
                          <span className="text-surface-700">·</span>
                          <Link href="#" className="text-xs text-surface-400 hover:text-surface-200">
                            Reorder
                          </Link>
                        </div>
                      )}
                      {order.status === 'in_transit' && (
                        <div className="mt-3 pt-3 border-t border-surface-800">
                          <div className="flex items-center gap-2">
                            <div className="flex-1 h-1.5 bg-surface-800 rounded-full overflow-hidden">
                              <div className="h-full bg-brand-500 rounded-full w-3/4 transition-all" />
                            </div>
                            <span className="text-[10px] text-surface-500">75%</span>
                          </div>
                          <p className="text-xs text-surface-500 mt-1">Estimated delivery: Oct 2, 2026</p>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </section>

            {/* Wishlists */}
            <section className="animate-fade-in delay-300" id="wishlists">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-surface-100">My Wishlists</h2>
                <button className="text-sm text-brand-400 hover:text-brand-300">
                  + New Wishlist
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {MOCK_WISHLISTS.map((wl) => (
                  <Link
                    key={wl.id}
                    href={`/account/wishlists/${wl.id}`}
                    className="glass rounded-xl p-4 hover:bg-surface-700/50 transition-colors group"
                    id={`wishlist-${wl.id}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-brand-500/10 flex items-center justify-center text-brand-400">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
                        </svg>
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-surface-200 group-hover:text-brand-400 transition-colors truncate">
                          {wl.name}
                        </p>
                        <p className="text-xs text-surface-500">{wl.item_count} items</p>
                      </div>
                      <svg className="w-4 h-4 text-surface-600 group-hover:text-surface-400 transition-colors" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                      </svg>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 animate-fade-in delay-400">
            {/* Quick Links */}
            <div className="glass rounded-xl overflow-hidden">
              <h3 className="text-sm font-semibold text-surface-300 uppercase tracking-wider px-5 pt-4 pb-2">
                Account
              </h3>
              {[
                { href: '/account', label: 'Dashboard', icon: '📊', active: true },
                { href: '/account/orders', label: 'Order History', icon: '📦' },
                { href: '/account/wishlists', label: 'Wishlists & Idea Boards', icon: '💝' },
                { href: '/account/warranties', label: 'Warranty Registration', icon: '🛡️' },
                { href: '/account/addresses', label: 'Saved Addresses', icon: '📍' },
                { href: '/account/settings', label: 'Account Settings', icon: '⚙️' },
              ].map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-5 py-3 text-sm transition-colors ${
                    item.active
                      ? 'bg-brand-500/10 text-brand-400 font-medium'
                      : 'text-surface-400 hover:text-surface-200 hover:bg-surface-800/50'
                  }`}
                >
                  <span>{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>

            {/* Warranty CTA */}
            <div className="glass rounded-xl p-5">
              <div className="flex items-center gap-3 mb-3">
                <span className="text-2xl">🛡️</span>
                <h3 className="text-sm font-semibold text-surface-200">Warranty Registration</h3>
              </div>
              <p className="text-xs text-surface-400 leading-relaxed">
                Have a recent delivery? Register your furniture warranty online for structural guarantee and hardware defect coverage.
              </p>
              <Link href="/account/warranties" className="btn btn-primary btn-sm w-full mt-3">
                Register Warranty
              </Link>
            </div>

            {/* Need Help? */}
            <div className="glass rounded-xl p-5 border border-surface-700/50">
              <h3 className="text-sm font-semibold text-surface-200 mb-2">💬 Need Help?</h3>
              <p className="text-xs text-surface-400 leading-relaxed">
                Have a question about your order, warranty, or delivery? Our support team is here for you.
              </p>
              <Link href="#" className="btn btn-ghost btn-sm text-brand-400 mt-2 p-0 hover:bg-transparent">
                Contact Support →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
