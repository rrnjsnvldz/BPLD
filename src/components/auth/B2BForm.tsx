'use client';

import Link from 'next/link';
import Image from 'next/image';

export function B2BForm() {
  return (
    <div className="section">
      <div className="container-narrow">
        {/* Header */}
        <div className="text-center mb-12">
          <span className="badge badge-brand text-xs mb-4">Bespoke Service</span>
          <h1 className="text-4xl lg:text-5xl font-display font-bold text-surface-50">
            Custom &<br />Bulk Orders
          </h1>
          <p className="text-lg text-surface-400 mt-4 max-w-2xl mx-auto">
            Need something made to measure, a specific finish, or a large quantity? We design and build furniture to your exact specifications — from a single statement piece to entire room collections.
          </p>
        </div>

        {/* Benefits */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-16">
          {[
            { icon: '📏', title: 'Custom Sizing', desc: 'Bespoke dimensions for any space requirement' },
            { icon: '🎨', title: 'Finish Selection', desc: 'Choose from our full materials & finishes library' },
            { icon: '🛠️', title: 'Built In-House', desc: 'Crafted by our own workshop artisans' },
            { icon: '🚚', title: 'Priority Delivery', desc: 'Expedited shipping with scheduled coordination' },
          ].map((benefit) => (
            <div key={benefit.title} className="glass rounded-xl p-5 text-center">
              <span className="text-2xl">{benefit.icon}</span>
              <h3 className="text-sm font-semibold text-surface-200 mt-3">{benefit.title}</h3>
              <p className="text-xs text-surface-400 mt-1">{benefit.desc}</p>
            </div>
          ))}
        </div>

        {/* Inquiry Form */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-10">
          <div className="lg:col-span-3">
            <div className="glass rounded-2xl p-6 sm:p-8">
              <h2 className="text-xl font-display font-semibold text-surface-50 mb-6">Request a Quote</h2>
              <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="b2b-name" className="block text-sm font-medium text-surface-300 mb-1.5">Full Name *</label>
                    <input id="b2b-name" type="text" className="input w-full" placeholder="Jane Doe" required />
                  </div>
                  <div>
                    <label htmlFor="b2b-email" className="block text-sm font-medium text-surface-300 mb-1.5">Email *</label>
                    <input id="b2b-email" type="email" className="input w-full" placeholder="jane@example.com" required />
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="b2b-phone" className="block text-sm font-medium text-surface-300 mb-1.5">Phone</label>
                    <input id="b2b-phone" type="tel" className="input w-full" placeholder="+1 (555) 000-0000" />
                  </div>
                  <div>
                    <label htmlFor="b2b-type" className="block text-sm font-medium text-surface-300 mb-1.5">Inquiry Type *</label>
                    <select id="b2b-type" className="input w-full" required>
                      <option value="">Select type…</option>
                      <option value="custom_order">Custom / Bespoke Piece</option>
                      <option value="bulk">Bulk Order (5+ pieces)</option>
                      <option value="modification">Modification of Existing Design</option>
                      <option value="quote">General Quote Request</option>
                    </select>
                  </div>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label htmlFor="b2b-project" className="block text-sm font-medium text-surface-300 mb-1.5">Project Name</label>
                    <input id="b2b-project" type="text" className="input w-full" placeholder="e.g. Living Room Renovation" />
                  </div>
                  <div>
                    <label htmlFor="b2b-budget" className="block text-sm font-medium text-surface-300 mb-1.5">Budget Range</label>
                    <select id="b2b-budget" className="input w-full">
                      <option value="">Select range…</option>
                      <option value="$1,000 - $5,000">$1,000 – $5,000</option>
                      <option value="$5,000 - $10,000">$5,000 – $10,000</option>
                      <option value="$10,000 - $25,000">$10,000 – $25,000</option>
                      <option value="$25,000 - $50,000">$25,000 – $50,000</option>
                      <option value="$50,000+">$50,000+</option>
                    </select>
                  </div>
                </div>
                <div>
                  <label htmlFor="b2b-quantity" className="block text-sm font-medium text-surface-300 mb-1.5">Estimated Quantity</label>
                  <input id="b2b-quantity" type="number" className="input w-full sm:w-40" placeholder="e.g. 10" min="1" />
                </div>
                <div>
                  <label htmlFor="b2b-materials" className="block text-sm font-medium text-surface-300 mb-1.5">Preferred Materials / Finishes</label>
                  <input id="b2b-materials" type="text" className="input w-full" placeholder="e.g. Walnut, Italian Leather Tan" />
                </div>
                <div>
                  <label htmlFor="b2b-description" className="block text-sm font-medium text-surface-300 mb-1.5">Project Details *</label>
                  <textarea id="b2b-description" className="input w-full min-h-[120px] resize-y" placeholder="Describe your project, specific requirements, custom dimensions, reference pieces from our catalog, timeline, and any other details…" required />
                </div>
                <div>
                  <label className="block text-sm font-medium text-surface-300 mb-1.5">Attachments</label>
                  <div className="border-2 border-dashed border-surface-700 rounded-lg p-6 text-center hover:border-surface-500 transition-colors cursor-pointer">
                    <svg className="w-8 h-8 mx-auto text-surface-500 mb-2" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 16.5V9.75m0 0l3 3m-3-3l-3 3M6.75 19.5a4.5 4.5 0 01-1.41-8.775 5.25 5.25 0 0110.233-2.33 3 3 0 013.758 3.848A3.752 3.752 0 0118 19.5H6.75z" />
                    </svg>
                    <p className="text-xs text-surface-400">Drop sketches, reference images, or floor plans here</p>
                    <p className="text-[10px] text-surface-500 mt-1">PDF, PNG, JPG up to 10MB each</p>
                  </div>
                </div>
                <button type="submit" className="btn btn-primary btn-lg w-full" id="b2b-submit">
                  Submit Inquiry
                  <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 12L3.269 3.126A59.768 59.768 0 0121.485 12 59.77 59.77 0 013.27 20.876L5.999 12zm0 0h7.5" />
                  </svg>
                </button>
              </form>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-2 space-y-6">
            <div className="relative aspect-[4/3] rounded-xl overflow-hidden">
              <Image src="https://images.unsplash.com/photo-1497366216548-37526070297c?w=600&h=450&fit=crop" alt="Artisan furniture workshop" fill className="object-cover" sizes="(max-width: 1024px) 100vw, 40vw" />
            </div>
            <div className="glass rounded-xl p-6">
              <svg className="w-6 h-6 text-brand-500/50 mb-3" fill="currentColor" viewBox="0 0 24 24">
                <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
              </svg>
              <p className="text-sm text-surface-300 italic leading-relaxed">
                &ldquo;We ordered a custom dining table with specific dimensions for our kitchen. The Furnishara team was incredibly responsive and the result exceeded our expectations. Beautiful craftsmanship and perfect fit.&rdquo;
              </p>
              <div className="mt-4">
                <p className="text-sm font-medium text-surface-200">Sarah M.</p>
                <p className="text-xs text-surface-500">Custom dining set, Sep 2026</p>
              </div>
            </div>
            <div className="glass rounded-xl p-6 space-y-3">
              <h3 className="text-sm font-semibold text-surface-200">Prefer to talk?</h3>
              <div className="space-y-2">
                <a href="mailto:hello@furnishara.com" className="flex items-center gap-2 text-sm text-brand-400 hover:text-brand-300">
                  <span>✉️</span> hello@furnishara.com
                </a>
                <a href="tel:+18005551234" className="flex items-center gap-2 text-sm text-surface-400 hover:text-surface-200">
                  <span>📞</span> +1 (800) 555-1234
                </a>
              </div>
              <p className="text-xs text-surface-500">Mon–Fri 9am–6pm EST</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
