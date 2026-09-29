'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { formatPrice } from '@/lib/utils';
import { DELIVERY_TYPES, DELIVERY_TIME_SLOTS, OBSTACLE_QUESTIONS, PAYMENT_METHODS, BNPL_PROVIDERS } from '@/lib/constants';

type CheckoutStep = 'shipping' | 'delivery' | 'payment' | 'review';

const STEPS: { key: CheckoutStep; label: string; icon: string }[] = [
  { key: 'shipping', label: 'Shipping', icon: '📍' },
  { key: 'delivery', label: 'Delivery', icon: '🚚' },
  { key: 'payment', label: 'Payment', icon: '💳' },
  { key: 'review', label: 'Review', icon: '✅' },
];

// Mock cart summary
const ORDER_SUMMARY = {
  items: [
    { name: 'Elysian Modular Sofa', material: 'Linen – Cloud White', qty: 1, price: 3299, image: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=100&h=80&fit=crop' },
    { name: 'Meridian Floor Lamp', material: 'Brushed Brass', qty: 2, price: 549, image: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=100&h=80&fit=crop' },
  ],
  subtotal: 4397,
  shipping: 248,
  assembly: 149,
  tax: 351.76,
  total: 5145.76,
};

export default function CheckoutPage() {
  const [currentStep, setCurrentStep] = useState<CheckoutStep>('shipping');
  const [deliveryType, setDeliveryType] = useState('white_glove');
  const [paymentMethod, setPaymentMethod] = useState('card');

  const currentStepIndex = STEPS.findIndex((s) => s.key === currentStep);

  const goNext = () => {
    const nextIndex = currentStepIndex + 1;
    if (nextIndex < STEPS.length) {
      setCurrentStep(STEPS[nextIndex].key);
    }
  };

  const goBack = () => {
    const prevIndex = currentStepIndex - 1;
    if (prevIndex >= 0) {
      setCurrentStep(STEPS[prevIndex].key);
    }
  };

  return (
    <div className="section-sm relative overflow-hidden min-h-screen">
      {/* Decorative Background Orbs */}
      <div className="gradient-orb gradient-orb-brand w-[600px] h-[600px] top-0 left-0 -translate-x-1/2 -translate-y-1/2 opacity-30 fixed" />
      <div className="gradient-orb gradient-orb-accent w-[500px] h-[500px] bottom-0 right-0 translate-x-1/4 translate-y-1/4 opacity-20 fixed" />

      <div className="container-narrow relative z-10">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Link href="/cart" className="flex items-center gap-2 text-sm text-surface-400 hover:text-brand-400 transition-colors">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
            </svg>
            Back to Cart
          </Link>
          <h1 className="text-2xl font-display font-bold text-surface-50">Checkout</h1>
          <div className="w-20" /> {/* Spacer */}
        </div>

        {/* Progress Steps */}
        <div className="flex items-center justify-center gap-2 mb-10" role="navigation" aria-label="Checkout progress">
          {STEPS.map((step, i) => (
            <div key={step.key} className="flex items-center">
              <button
                onClick={() => i <= currentStepIndex && setCurrentStep(step.key)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all ${
                  step.key === currentStep
                    ? 'bg-brand-500 text-white shadow-glow'
                    : i < currentStepIndex
                    ? 'bg-brand-500/20 text-brand-400 cursor-pointer'
                    : 'bg-surface-800 text-surface-500 cursor-default'
                }`}
                disabled={i > currentStepIndex}
                id={`step-${step.key}`}
              >
                <span>{step.icon}</span>
                <span className="hidden sm:inline">{step.label}</span>
              </button>
              {i < STEPS.length - 1 && (
                <div className={`w-8 h-px mx-1 ${i < currentStepIndex ? 'bg-brand-500' : 'bg-surface-700'}`} />
              )}
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Step Content */}
          <div className="lg:col-span-2">
            {/* Step 1: Shipping */}
            {currentStep === 'shipping' && (
              <div className="glass rounded-2xl p-6 animate-fade-in" id="checkout-shipping">
                <h2 className="text-lg font-semibold text-surface-100 mb-6">Shipping Address</h2>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="ship-first" className="block text-sm font-medium text-surface-300 mb-1.5">First Name</label>
                      <input id="ship-first" type="text" className="input" defaultValue="Jane" />
                    </div>
                    <div>
                      <label htmlFor="ship-last" className="block text-sm font-medium text-surface-300 mb-1.5">Last Name</label>
                      <input id="ship-last" type="text" className="input" defaultValue="Doe" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ship-line1" className="block text-sm font-medium text-surface-300 mb-1.5">Street Address</label>
                    <input id="ship-line1" type="text" className="input" placeholder="123 Main Street" />
                  </div>
                  <div>
                    <label htmlFor="ship-line2" className="block text-sm font-medium text-surface-300 mb-1.5">Apt / Suite / Unit</label>
                    <input id="ship-line2" type="text" className="input" placeholder="Apt 4B" />
                  </div>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                    <div>
                      <label htmlFor="ship-city" className="block text-sm font-medium text-surface-300 mb-1.5">City</label>
                      <input id="ship-city" type="text" className="input" placeholder="New York" />
                    </div>
                    <div>
                      <label htmlFor="ship-state" className="block text-sm font-medium text-surface-300 mb-1.5">State</label>
                      <input id="ship-state" type="text" className="input" placeholder="NY" />
                    </div>
                    <div>
                      <label htmlFor="ship-zip" className="block text-sm font-medium text-surface-300 mb-1.5">ZIP Code</label>
                      <input id="ship-zip" type="text" className="input" placeholder="10001" />
                    </div>
                  </div>
                  <div>
                    <label htmlFor="ship-phone" className="block text-sm font-medium text-surface-300 mb-1.5">Phone (for delivery coordination)</label>
                    <input id="ship-phone" type="tel" className="input" placeholder="+1 (555) 000-0000" />
                  </div>
                </div>
                <div className="flex justify-end mt-6">
                  <button onClick={goNext} className="btn btn-primary btn-lg" id="shipping-continue">
                    Continue to Delivery →
                  </button>
                </div>
              </div>
            )}

            {/* Step 2: Delivery Options */}
            {currentStep === 'delivery' && (
              <div className="space-y-6 animate-fade-in" id="checkout-delivery">
                {/* Delivery Type */}
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-surface-100 mb-4">Delivery Method</h2>
                  <div className="space-y-3">
                    {DELIVERY_TYPES.map((dt) => (
                      <label
                        key={dt.value}
                        className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                          deliveryType === dt.value
                            ? 'border-brand-500 bg-brand-500/10'
                            : 'border-surface-700 hover:border-surface-500'
                        }`}
                      >
                        <input
                          type="radio"
                          name="delivery-type"
                          value={dt.value}
                          checked={deliveryType === dt.value}
                          onChange={(e) => setDeliveryType(e.target.value)}
                          className="text-brand-500"
                        />
                        <span className="text-2xl">{dt.icon}</span>
                        <div className="flex-1">
                          <p className="text-sm font-semibold text-surface-200">{dt.label}</p>
                          <p className="text-xs text-surface-500">{dt.description}</p>
                        </div>
                      </label>
                    ))}
                  </div>
                </div>

                {/* Delivery Date/Time */}
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-surface-100 mb-4">
                    📅 Preferred Delivery Date & Time
                  </h2>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="delivery-date" className="block text-sm font-medium text-surface-300 mb-1.5">Date</label>
                      <input id="delivery-date" type="date" className="input" />
                    </div>
                    <div>
                      <label htmlFor="delivery-time" className="block text-sm font-medium text-surface-300 mb-1.5">Time Slot</label>
                      <select id="delivery-time" className="input">
                        <option value="">Select a time slot…</option>
                        {DELIVERY_TIME_SLOTS.map((slot) => (
                          <option key={slot.value} value={slot.value}>{slot.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <p className="text-xs text-surface-500 mt-2">
                    Subject to availability in your delivery zone. We&apos;ll confirm within 24 hours.
                  </p>
                </div>

                {/* Obstacle Questionnaire */}
                <div className="glass rounded-2xl p-6">
                  <h2 className="text-lg font-semibold text-surface-100 mb-2">
                    🏠 Delivery Access Details
                  </h2>
                  <p className="text-xs text-surface-400 mb-4">
                    Help our delivery team prepare by answering a few quick questions about your space.
                  </p>
                  <div className="space-y-4">
                    {OBSTACLE_QUESTIONS.map((q) => (
                      <div key={q.key}>
                        <label htmlFor={`obstacle-${q.key}`} className="block text-sm font-medium text-surface-300 mb-1.5">
                          {q.label}
                        </label>
                        {q.type === 'boolean' ? (
                          <div className="flex gap-3">
                            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-700 cursor-pointer hover:border-surface-500 text-sm text-surface-300">
                              <input type="radio" name={q.key} value="yes" className="text-brand-500" /> Yes
                            </label>
                            <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-surface-700 cursor-pointer hover:border-surface-500 text-sm text-surface-300">
                              <input type="radio" name={q.key} value="no" className="text-brand-500" /> No
                            </label>
                          </div>
                        ) : q.type === 'textarea' ? (
                          <textarea
                            id={`obstacle-${q.key}`}
                            className="input min-h-[80px] resize-y"
                            placeholder={'placeholder' in q ? q.placeholder : ''}
                          />
                        ) : (
                          <input
                            id={`obstacle-${q.key}`}
                            type="number"
                            className="input w-32"
                            placeholder={'placeholder' in q ? q.placeholder : ''}
                            min="0"
                          />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <div className="flex justify-between">
                  <button onClick={goBack} className="btn btn-ghost text-surface-400">
                    ← Back
                  </button>
                  <button onClick={goNext} className="btn btn-primary btn-lg" id="delivery-continue">
                    Continue to Payment →
                  </button>
                </div>
              </div>
            )}

            {/* Step 3: Payment */}
            {currentStep === 'payment' && (
              <div className="glass rounded-2xl p-6 animate-fade-in" id="checkout-payment">
                <h2 className="text-lg font-semibold text-surface-100 mb-4">Payment Method</h2>
                <div className="space-y-3 mb-6">
                  {PAYMENT_METHODS.map((pm) => (
                    <label
                      key={pm.value}
                      className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${
                        paymentMethod === pm.value
                          ? 'border-brand-500 bg-brand-500/10'
                          : 'border-surface-700 hover:border-surface-500'
                      }`}
                    >
                      <input
                        type="radio"
                        name="payment-method"
                        value={pm.value}
                        checked={paymentMethod === pm.value}
                        onChange={(e) => setPaymentMethod(e.target.value)}
                        className="text-brand-500"
                      />
                      <span className="text-xl">{pm.icon}</span>
                      <span className="text-sm font-medium text-surface-200">{pm.label}</span>
                    </label>
                  ))}
                </div>

                {/* Card Form (shown when card selected) */}
                {paymentMethod === 'card' && (
                  <div className="space-y-4 p-4 rounded-xl bg-surface-800/50 border border-surface-700">
                    <div>
                      <label htmlFor="card-number" className="block text-sm font-medium text-surface-300 mb-1.5">Card Number</label>
                      <input id="card-number" type="text" className="input" placeholder="4242 4242 4242 4242" />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label htmlFor="card-expiry" className="block text-sm font-medium text-surface-300 mb-1.5">Expiry</label>
                        <input id="card-expiry" type="text" className="input" placeholder="MM / YY" />
                      </div>
                      <div>
                        <label htmlFor="card-cvc" className="block text-sm font-medium text-surface-300 mb-1.5">CVC</label>
                        <input id="card-cvc" type="text" className="input" placeholder="123" />
                      </div>
                    </div>
                  </div>
                )}

                {/* BNPL Options */}
                {paymentMethod === 'bnpl' && (
                  <div className="space-y-3 p-4 rounded-xl bg-surface-800/50 border border-surface-700">
                    <p className="text-sm text-surface-300 mb-2">Choose your provider:</p>
                    {BNPL_PROVIDERS.map((provider) => (
                      <label key={provider.value} className="flex items-center gap-3 p-3 rounded-lg border border-surface-700 cursor-pointer hover:border-surface-500">
                        <input type="radio" name="bnpl-provider" value={provider.value} className="text-brand-500" />
                        <span className="text-sm font-medium text-surface-200">{provider.label}</span>
                      </label>
                    ))}
                    <p className="text-xs text-surface-500 mt-2">
                      Pay in 4 interest-free installments. Subject to approval.
                    </p>
                  </div>
                )}

                <div className="flex justify-between mt-6">
                  <button onClick={goBack} className="btn btn-ghost text-surface-400">
                    ← Back
                  </button>
                  <button onClick={goNext} className="btn btn-primary btn-lg" id="payment-continue">
                    Review Order →
                  </button>
                </div>
              </div>
            )}

            {/* Step 4: Review */}
            {currentStep === 'review' && (
              <div className="glass rounded-2xl p-6 animate-fade-in" id="checkout-review">
                <h2 className="text-lg font-semibold text-surface-100 mb-6">Review Your Order</h2>

                <div className="space-y-4">
                  {/* Items */}
                  <div className="space-y-3">
                    {ORDER_SUMMARY.items.map((item, i) => (
                      <div key={i} className="flex gap-3 p-3 rounded-lg bg-surface-800/50">
                        <div className="relative w-16 h-12 rounded-lg overflow-hidden flex-shrink-0">
                          <Image src={item.image} alt={item.name} fill className="object-cover" sizes="64px" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-surface-200 truncate">{item.name}</p>
                          <p className="text-xs text-surface-500">{item.material} × {item.qty}</p>
                        </div>
                        <p className="text-sm font-bold text-surface-50">{formatPrice(item.price * item.qty)}</p>
                      </div>
                    ))}
                  </div>

                  <div className="divider" />

                  {/* Delivery Info */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="p-3 rounded-lg bg-surface-800/50">
                      <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Shipping To</p>
                      <p className="text-sm text-surface-200">Jane Doe</p>
                      <p className="text-xs text-surface-400">123 Main Street, Apt 4B</p>
                      <p className="text-xs text-surface-400">New York, NY 10001</p>
                    </div>
                    <div className="p-3 rounded-lg bg-surface-800/50">
                      <p className="text-xs text-surface-500 uppercase tracking-wider mb-1">Delivery Method</p>
                      <p className="text-sm text-surface-200">
                        {DELIVERY_TYPES.find((d) => d.value === deliveryType)?.label}
                      </p>
                      <p className="text-xs text-surface-400">
                        {DELIVERY_TYPES.find((d) => d.value === deliveryType)?.description}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="flex justify-between mt-6">
                  <button onClick={goBack} className="btn btn-ghost text-surface-400">
                    ← Back
                  </button>
                  <button className="btn btn-primary btn-lg animate-pulse-glow" id="place-order">
                    🔒 Place Order — {formatPrice(ORDER_SUMMARY.total)}
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="lg:col-span-1">
            <div className="glass rounded-xl p-5 lg:sticky lg:top-24 space-y-4" id="checkout-summary">
              <h3 className="text-sm font-semibold text-surface-200 uppercase tracking-wider">Order Summary</h3>

              <div className="space-y-2">
                {ORDER_SUMMARY.items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-sm">
                    <span className="text-surface-400 truncate mr-2">{item.name} ×{item.qty}</span>
                    <span className="text-surface-200 font-medium flex-shrink-0">{formatPrice(item.price * item.qty)}</span>
                  </div>
                ))}
              </div>

              <div className="divider" />

              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-surface-400">Subtotal</span>
                  <span className="text-surface-200">{formatPrice(ORDER_SUMMARY.subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-400">Shipping</span>
                  <span className="text-surface-200">{formatPrice(ORDER_SUMMARY.shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-400">Assembly</span>
                  <span className="text-surface-200">{formatPrice(ORDER_SUMMARY.assembly)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-surface-400">Tax</span>
                  <span className="text-surface-200">{formatPrice(ORDER_SUMMARY.tax)}</span>
                </div>
              </div>

              <div className="divider" />

              <div className="flex justify-between">
                <span className="text-base font-semibold text-surface-100">Total</span>
                <span className="text-xl font-bold text-surface-50">{formatPrice(ORDER_SUMMARY.total)}</span>
              </div>

              {/* Promo Code */}
              <div className="flex gap-2">
                <input type="text" className="input text-sm flex-1" placeholder="Promo code" id="promo-code" />
                <button className="btn btn-secondary btn-sm">Apply</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
