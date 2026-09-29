'use client';

import { useState } from 'react';
import Link from 'next/link';

const NAV_LINKS = [
  { href: '/products', label: 'Shop All' },
  { href: '/categories/sofas', label: 'Sofas' },
  { href: '/categories/beds', label: 'Beds' },
  { href: '/categories/dining', label: 'Dining' },
  { href: '/categories/office', label: 'Office' },
  { href: '/shop-the-look', label: 'Shop the Look' },
];

export function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [cartCount] = useState(2); // Mock cart count

  return (
    <header className="fixed top-0 left-0 right-0 z-50 glass" role="banner">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-[72px] relative">
          {/* Left: Logo */}
          <div className="flex-1 flex justify-start">
            <Link
              href="/"
              className="flex items-center gap-2 group flex-shrink-0"
              id="header-logo"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-lg font-display transition-transform duration-300 group-hover:scale-105 group-hover:shadow-glow">
                F
              </div>
              <span className="text-xl font-display font-semibold tracking-tight text-surface-50 hidden sm:block">
                Furnishara
              </span>
            </Link>
          </div>

          {/* Center: Desktop Nav */}
          <nav className="hidden lg:flex flex-1 justify-center items-center gap-x-8" role="navigation" aria-label="Main navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                id={`nav-${link.label.toLowerCase().replace(/\s+/g, '-')}`}
                className="text-sm font-medium text-surface-300 hover:text-white transition-colors whitespace-nowrap relative group"
              >
                {link.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-brand-400 transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </nav>

          {/* Right: Actions */}
          <div className="flex-1 flex items-center justify-end gap-2 sm:gap-3">
            {/* Search */}
            <button
              id="header-search"
              className="btn btn-ghost btn-icon rounded-full border border-transparent hover:border-surface-700 hover:bg-surface-800/50 transition-all hidden sm:flex"
              aria-label="Search products"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>

            {/* Wishlist */}
            <Link
              href="/account/wishlists"
              id="header-wishlist"
              className="btn btn-ghost btn-icon rounded-full border border-transparent hover:border-surface-700 hover:bg-surface-800/50 transition-all hidden sm:flex"
              aria-label="Wishlists"
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
              </svg>
            </Link>

            {/* Cart */}
            <Link
              href="/cart"
              id="header-cart"
              className="btn btn-ghost btn-icon rounded-full border border-transparent hover:border-surface-700 hover:bg-surface-800/50 transition-all relative"
              aria-label={`Shopping cart with ${cartCount} items`}
            >
              <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 10.5V6a3.75 3.75 0 10-7.5 0v4.5m11.356-1.993l1.263 12c.07.665-.45 1.243-1.119 1.243H4.25a1.125 1.125 0 01-1.12-1.243l1.264-12A1.125 1.125 0 015.513 7.5h12.974c.576 0 1.059.435 1.119 1.007zM8.625 10.5a.375.375 0 11-.75 0 .375.375 0 01.75 0zm7.5 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z" />
              </svg>
              {cartCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-brand-500 rounded-full text-[10px] font-bold flex items-center justify-center text-white shadow-glow">
                  {cartCount}
                </span>
              )}
            </Link>

            {/* Account (Sign In) */}
            <Link
              href="/login"
              id="header-account"
              className="btn btn-secondary btn-sm rounded-full hidden lg:flex border border-surface-700 hover:border-brand-500 hover:text-white transition-all ml-2"
            >
              <svg className="w-4 h-4 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
              Sign In
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              id="mobile-menu-toggle"
              className="btn btn-ghost btn-icon rounded-full border border-transparent hover:border-surface-700 hover:bg-surface-800/50 transition-all lg:hidden"
              onClick={() => setMobileOpen(!mobileOpen)}
              aria-label="Toggle mobile menu"
              aria-expanded={mobileOpen}
            >
              {mobileOpen ? (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                </svg>
              ) : (
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
                </svg>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-surface-800 animate-fade-in">
          <nav className="container-wide py-4 flex flex-col gap-1" role="navigation" aria-label="Mobile navigation">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="px-4 py-3 text-sm font-medium text-surface-200 hover:text-surface-50 rounded-lg hover:bg-surface-800/50 transition-colors"
              >
                {link.label}
              </Link>
            ))}
            <div className="divider my-2" />
            <Link
              href="/login"
              onClick={() => setMobileOpen(false)}
              className="btn btn-primary mt-2"
            >
              Sign In
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
}
