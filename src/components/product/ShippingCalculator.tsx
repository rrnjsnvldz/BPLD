'use client';

import { useState, useMemo } from 'react';
import { calculateShippingRate, type ShippingInput, type ShippingResult } from '@/lib/shipping';
import { formatPrice } from '@/lib/utils';
import { DELIVERY_TYPES } from '@/lib/constants';

interface ShippingCalculatorProps {
  product: {
    name: string;
    weight_kg: number;
    width_cm: number;
    depth_cm: number;
    height_cm: number;
  };
}

const ZONES = [
  { label: 'Local (0–50 mi)', zone: 1, zipExample: '10001' },
  { label: 'Regional (50–300 mi)', zone: 2, zipExample: '19104' },
  { label: 'National (300–1500 mi)', zone: 3, zipExample: '60601' },
  { label: 'Remote (1500+ mi)', zone: 4, zipExample: '90210' },
];

export function ShippingCalculator({ product }: ShippingCalculatorProps) {
  const [zipCode, setZipCode] = useState('');
  const [deliveryType, setDeliveryType] = useState<'standard' | 'white_glove' | 'room_of_choice'>('white_glove');
  const [quantity, setQuantity] = useState(1);
  const [showResult, setShowResult] = useState(false);

  // Calculate volumetric weight
  const volumetricWeight = useMemo(() => {
    return (product.width_cm * product.depth_cm * product.height_cm) / 5000;
  }, [product]);

  const chargeableWeight = Math.max(product.weight_kg, volumetricWeight);

  // Mock zone detection based on zip
  const detectedZone = useMemo(() => {
    if (!zipCode || zipCode.length < 5) return null;
    const prefix = parseInt(zipCode.slice(0, 3));
    if (prefix >= 100 && prefix <= 119) return 1; // NYC metro
    if (prefix >= 120 && prefix <= 299) return 2; // East coast
    if (prefix >= 300 && prefix <= 699) return 3; // Central
    return 4; // West coast / remote
  }, [zipCode]);

  const shippingResult: ShippingResult | null = useMemo(() => {
    if (!detectedZone) return null;

    const input: ShippingInput = {
      weight_kg: product.weight_kg,
      width_cm: product.width_cm,
      depth_cm: product.depth_cm,
      height_cm: product.height_cm,
      quantity,
      zone: detectedZone,
      delivery_type: deliveryType,
    };

    return calculateShippingRate(input);
  }, [product, quantity, detectedZone, deliveryType]);

  const handleCalculate = () => {
    if (zipCode.length >= 5) {
      setShowResult(true);
    }
  };

  return (
    <div className="space-y-6" id="shipping-calculator">
      <div className="flex items-center gap-3 mb-2">
        <div className="w-10 h-10 rounded-xl bg-brand-500/10 flex items-center justify-center">
          <svg className="w-5 h-5 text-brand-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 18.75a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h6m-9 0H3.375a1.125 1.125 0 01-1.125-1.125V14.25m17.25 4.5a1.5 1.5 0 01-3 0m3 0a1.5 1.5 0 00-3 0m3 0h1.125c.621 0 1.129-.504 1.09-1.124a17.902 17.902 0 00-3.213-9.193 2.056 2.056 0 00-1.58-.86H14.25M16.5 18.75h-2.25m0-11.177v-.958c0-.568-.422-1.048-.987-1.106a48.554 48.554 0 00-10.026 0 1.106 1.106 0 00-.987 1.106v7.635m12-6.677v6.677m0 4.5v-4.5m0 0h-12" />
          </svg>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-surface-100">Shipping Calculator</h3>
          <p className="text-xs text-surface-500">Estimate delivery cost based on your location</p>
        </div>
      </div>

      {/* Weight Breakdown */}
      <div className="glass rounded-xl p-4">
        <h4 className="text-xs font-semibold text-surface-400 uppercase tracking-wider mb-3">
          Weight Analysis
        </h4>
        <div className="grid grid-cols-3 gap-3">
          <div className="text-center p-2 rounded-lg bg-surface-800/50">
            <p className="text-lg font-bold text-surface-50">{product.weight_kg}<span className="text-xs font-normal text-surface-500 ml-1">kg</span></p>
            <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-0.5">Actual</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-surface-800/50">
            <p className="text-lg font-bold text-brand-400">{volumetricWeight.toFixed(1)}<span className="text-xs font-normal text-surface-500 ml-1">kg</span></p>
            <p className="text-[10px] text-surface-500 uppercase tracking-wider mt-0.5">Volumetric</p>
          </div>
          <div className="text-center p-2 rounded-lg bg-brand-500/10 border border-brand-500/20">
            <p className="text-lg font-bold text-brand-300">{chargeableWeight.toFixed(1)}<span className="text-xs font-normal text-surface-500 ml-1">kg</span></p>
            <p className="text-[10px] text-brand-400 uppercase tracking-wider mt-0.5">Chargeable</p>
          </div>
        </div>
        <p className="text-[10px] text-surface-500 mt-2 text-center">
          Volumetric: ({product.width_cm} × {product.depth_cm} × {product.height_cm}) ÷ 5,000 = {volumetricWeight.toFixed(1)} kg
        </p>
      </div>

      {/* ZIP Code Input */}
      <div>
        <label htmlFor="shipping-zip" className="block text-sm font-medium text-surface-300 mb-1.5">
          Delivery ZIP Code
        </label>
        <div className="flex gap-2">
          <input
            id="shipping-zip"
            type="text"
            className="input flex-1"
            placeholder="Enter your ZIP code"
            value={zipCode}
            onChange={(e) => {
              setZipCode(e.target.value.replace(/\D/g, '').slice(0, 5));
              setShowResult(false);
            }}
            maxLength={5}
          />
          <button
            onClick={handleCalculate}
            disabled={zipCode.length < 5}
            className="btn btn-primary"
            id="calculate-shipping"
          >
            Calculate
          </button>
        </div>
      </div>

      {/* Delivery Type */}
      <div>
        <label className="block text-sm font-medium text-surface-300 mb-2">Delivery Method</label>
        <div className="space-y-2">
          {DELIVERY_TYPES.map((dt) => (
            <label
              key={dt.value}
              className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                deliveryType === dt.value
                  ? 'border-brand-500 bg-brand-500/10'
                  : 'border-surface-700 hover:border-surface-500'
              }`}
            >
              <input
                type="radio"
                name="ship-delivery-type"
                value={dt.value}
                checked={deliveryType === dt.value}
                onChange={(e) => {
                  setDeliveryType(e.target.value as typeof deliveryType);
                  setShowResult(false);
                }}
                className="text-brand-500"
              />
              <span className="text-lg">{dt.icon}</span>
              <div className="flex-1">
                <p className="text-sm font-medium text-surface-200">{dt.label}</p>
                <p className="text-xs text-surface-500">{dt.description}</p>
              </div>
            </label>
          ))}
        </div>
      </div>

      {/* Quantity */}
      <div>
        <label htmlFor="shipping-qty" className="block text-sm font-medium text-surface-300 mb-1.5">
          Quantity
        </label>
        <div className="flex items-center gap-2 bg-surface-800 rounded-lg border border-surface-700 w-fit">
          <button
            className="w-10 h-10 flex items-center justify-center text-surface-400 hover:text-surface-200 transition-colors"
            onClick={() => { setQuantity(Math.max(1, quantity - 1)); setShowResult(false); }}
            aria-label="Decrease quantity"
          >
            −
          </button>
          <span className="w-8 text-center text-sm font-medium text-surface-100">{quantity}</span>
          <button
            className="w-10 h-10 flex items-center justify-center text-surface-400 hover:text-surface-200 transition-colors"
            onClick={() => { setQuantity(quantity + 1); setShowResult(false); }}
            aria-label="Increase quantity"
          >
            +
          </button>
        </div>
      </div>

      {/* Results */}
      {showResult && shippingResult && (
        <div className="glass rounded-xl p-5 animate-fade-in space-y-4" id="shipping-result">
          <div className="flex items-center justify-between">
            <h4 className="text-sm font-semibold text-surface-200">Estimated Shipping Cost</h4>
            <span className="badge bg-surface-700 text-surface-300 text-xs">
              Zone {detectedZone} · {ZONES.find(z => z.zone === detectedZone)?.label}
            </span>
          </div>

          {/* Cost Breakdown */}
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-surface-400">Base freight ({chargeableWeight.toFixed(1)} kg × {quantity})</span>
              <span className="text-surface-200">{formatPrice(shippingResult.base_cost)}</span>
            </div>
            {shippingResult.surcharges.map((s, i) => (
              <div key={i} className="flex justify-between text-sm">
                <span className="text-surface-400">{s.label}</span>
                <span className="text-surface-200">{formatPrice(s.amount)}</span>
              </div>
            ))}
            <div className="divider" />
            <div className="flex justify-between">
              <span className="text-base font-semibold text-surface-100">Total Shipping</span>
              <span className="text-xl font-bold text-brand-400">{formatPrice(shippingResult.total)}</span>
            </div>
          </div>

          {/* Delivery Estimate */}
          <div className="flex items-center gap-3 p-3 rounded-lg bg-surface-800/50">
            <span className="text-lg">📅</span>
            <div>
              <p className="text-sm font-medium text-surface-200">
                Estimated Delivery: {shippingResult.estimated_days_min}–{shippingResult.estimated_days_max} business days
              </p>
              <p className="text-xs text-surface-500">
                After order confirmation. White-glove delivery includes scheduling.
              </p>
            </div>
          </div>

          {/* Free Shipping Threshold */}
          {shippingResult.total > 0 && shippingResult.free_shipping_threshold && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-success/10 border border-success/20">
              <span className="text-sm">💡</span>
              <p className="text-xs text-success">
                Spend {formatPrice(shippingResult.free_shipping_threshold)} or more for <strong>free standard shipping</strong>.
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
