'use client';

import Link from 'next/link';

export function SignupForm() {
  return (
    <div className="min-h-[calc(100vh-72px)] flex items-center justify-center px-4 py-16">
      <div className="gradient-orb gradient-orb-brand w-[400px] h-[400px] top-20 -left-40 fixed" />
      <div className="gradient-orb gradient-orb-accent w-[300px] h-[300px] bottom-20 -right-20 fixed" />

      <div className="w-full max-w-md animate-fade-in">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 group">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-brand-500 to-brand-700 flex items-center justify-center text-white font-bold text-2xl font-display transition-transform group-hover:scale-105">
              F
            </div>
          </Link>
          <h1 className="text-2xl font-display font-bold text-surface-50 mt-6">
            Create your account
          </h1>
          <p className="text-surface-400 mt-1 text-sm">
            Save wishlists, track orders, and register warranties
          </p>
        </div>

        <div className="glass rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col gap-6">
            <form className="flex flex-col gap-5" onSubmit={(e) => e.preventDefault()}>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label htmlFor="signup-first-name" className="block text-sm font-medium text-surface-300 mb-1.5">
                    First Name
                  </label>
                  <input id="signup-first-name" type="text" className="input w-full" placeholder="Jane" autoComplete="given-name" />
                </div>
                <div>
                  <label htmlFor="signup-last-name" className="block text-sm font-medium text-surface-300 mb-1.5">
                    Last Name
                  </label>
                  <input id="signup-last-name" type="text" className="input w-full" placeholder="Doe" autoComplete="family-name" />
                </div>
              </div>

              <div>
                <label htmlFor="signup-email" className="block text-sm font-medium text-surface-300 mb-1.5">
                  Email Address
                </label>
                <input id="signup-email" type="email" className="input w-full" placeholder="you@example.com" autoComplete="email" />
              </div>

              <div>
                <label htmlFor="signup-password" className="block text-sm font-medium text-surface-300 mb-1.5">
                  Password
                </label>
                <input id="signup-password" type="password" className="input w-full" placeholder="At least 8 characters" autoComplete="new-password" />
                <p className="text-xs text-surface-500 mt-1">
                  Must be at least 8 characters with one number and one special character.
                </p>
              </div>

              <div className="flex items-start gap-2">
                <input type="checkbox" id="signup-terms" className="w-4 h-4 mt-0.5 rounded border-surface-600 bg-surface-800 text-brand-500 focus:ring-brand-500" />
                <label htmlFor="signup-terms" className="text-xs text-surface-400">
                  I agree to the <Link href="#" className="text-brand-400 hover:text-brand-300">Terms of Service</Link>
                  {' '}and <Link href="#" className="text-brand-400 hover:text-brand-300">Privacy Policy</Link>
                </label>
              </div>

              <button type="submit" className="btn btn-primary btn-lg w-full" id="signup-submit">Create Account</button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-3">
              <div className="flex-1 h-px bg-surface-700" />
              <span className="text-xs text-surface-500 whitespace-nowrap">or continue with</span>
              <div className="flex-1 h-px bg-surface-700" />
            </div>

            {/* Social Login */}
            <div className="grid grid-cols-2 gap-3">
              <button className="btn btn-secondary w-full" id="signup-google">
                <svg className="w-4 h-4" viewBox="0 0 24 24">
                  <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"/>
                  <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                  <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                  <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
                </svg>
                Google
              </button>
              <button className="btn btn-secondary w-full" id="signup-apple">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
                </svg>
                Apple
              </button>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-surface-400 mt-6">
          Already have an account?{' '}
          <Link href="/login" className="text-brand-400 hover:text-brand-300 font-medium">Sign in</Link>
        </p>
      </div>
    </div>
  );
}
