'use client';

import Link from 'next/link';

const FOOTER_LINKS = {
  Shop: [
    { href: '/products', label: 'All Furniture' },
    { href: '/categories/sofas', label: 'Sofas & Sectionals' },
    { href: '/categories/beds', label: 'Beds & Headboards' },
    { href: '/categories/dining', label: 'Dining & Kitchen' },
    { href: '/categories/office', label: 'Home Office' },
    { href: '/shop-the-look', label: 'Shop the Look' },
  ],
  Services: [
    { href: '#', label: 'White-Glove Delivery' },
    { href: '#', label: 'Assembly Services' },
    { href: '#', label: 'Interior Design Consultation' },
    { href: '#', label: 'Custom Orders' },
  ],
  Support: [
    { href: '#', label: 'Contact Us' },
    { href: '#', label: 'Shipping & Returns' },
    { href: '#', label: 'Warranty Registration' },
    { href: '#', label: 'Care Guides' },
    { href: '#', label: 'FAQ' },
  ],
  Company: [
    { href: '#', label: 'Our Story' },
    { href: '#', label: 'Sustainability' },
    { href: '#', label: 'Careers' },
    { href: '#', label: 'Press' },
  ],
};

export function Footer() {
  return (
    <footer className="bg-surface-900 border-t border-surface-800" role="contentinfo">
      {/* Newsletter */}
      <div className="border-b border-surface-800">
        <div className="container-wide section-sm">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="text-center md:text-left">
              <h3 className="text-xl font-display font-semibold text-surface-50">
                Design inspiration, delivered.
              </h3>
              <p className="text-sm text-surface-400 mt-1">
                Early access to new collections, exclusive offers, and curated interior tips.
              </p>
            </div>
            <form className="flex gap-2 w-full md:w-auto" onSubmit={(e) => e.preventDefault()}>
              <input
                type="email"
                placeholder="Enter your email"
                className="input w-full md:w-72"
                id="newsletter-email"
                aria-label="Newsletter email"
              />
              <button type="submit" className="btn btn-primary whitespace-nowrap flex-shrink-0" id="newsletter-submit">
                Subscribe
              </button>
            </form>
          </div>
        </div>
      </div>

      {/* Links */}
      <div className="container-wide section-sm">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {Object.entries(FOOTER_LINKS).map(([category, links]) => (
            <div key={category}>
              <h4 className="text-sm font-semibold text-surface-200 uppercase tracking-wider mb-4">
                {category}
              </h4>
              <ul className="space-y-2.5">
                {links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-surface-400 hover:text-brand-400 transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-surface-800">
        <div className="container-wide py-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-sm font-display">
                F
              </div>
              <span className="text-sm text-surface-500">
                © {new Date().getFullYear()} Furnishara. All rights reserved.
              </span>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 sm:gap-6">
              <Link href="#" className="text-xs text-surface-500 hover:text-surface-300 transition-colors">
                Privacy Policy
              </Link>
              <Link href="#" className="text-xs text-surface-500 hover:text-surface-300 transition-colors">
                Terms of Service
              </Link>
              <div className="flex items-center gap-3">
                {/* Social Icons */}
                {['Instagram', 'Pinterest', 'Twitter'].map((social) => (
                  <a
                    key={social}
                    href="#"
                    className="w-8 h-8 rounded-full bg-surface-800 hover:bg-surface-700 flex items-center justify-center text-surface-400 hover:text-surface-200 transition-all"
                    aria-label={social}
                  >
                    <span className="text-xs font-bold">{social[0]}</span>
                  </a>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
