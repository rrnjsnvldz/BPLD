// =============================================================================
// Furnishara – Volumetric Freight Shipping Calculator
// =============================================================================

import type { ShippingZone, ShippingQuote, ShippingCalculatorInput, DeliveryType } from '@/types';
import { calculateCubicMetres, getChargeableWeight } from './utils';

/**
 * Calculate shipping cost for a set of items to a given postcode.
 *
 * Algorithm:
 * 1. Match postcode → shipping zone
 * 2. For each item, compute:
 *    - Actual weight (kg)
 *    - Volumetric weight = (L × W × H cm) / 5000
 *    - Chargeable weight = max(actual, volumetric)
 *    - Cubic metres = (L × W × H cm) / 1,000,000
 * 3. Total cost = zone.base_rate
 *                + Σ (chargeable_weight × zone.per_kg_rate)
 *                + Σ (cubic_metres × zone.per_cbm_rate)
 *                + white_glove surcharge (if applicable)
 *                + assembly rate (if applicable)
 */
export function calculateShipping(
  input: ShippingCalculatorInput,
  zones: ShippingZone[],
): ShippingQuote | null {
  // 1. Find matching zone
  const zone = findShippingZone(input.postcode, zones);
  if (!zone) return null;

  // 2. Aggregate weight and volume across items
  let totalWeightCost = 0;
  let totalVolumeCost = 0;

  for (const item of input.items) {
    const chargeableWeight = getChargeableWeight(
      item.package_weight_kg,
      item.package_width_cm,
      item.package_depth_cm,
      item.package_height_cm,
    );
    const cubicMetres = calculateCubicMetres(
      item.package_width_cm,
      item.package_depth_cm,
      item.package_height_cm,
    );

    totalWeightCost += chargeableWeight * zone.per_kg_rate * item.quantity;
    totalVolumeCost += cubicMetres * zone.per_cbm_rate * item.quantity;
  }

  // 3. Apply surcharges
  const whiteGloveCost = isWhiteGlove(input.delivery_type)
    ? zone.white_glove_surcharge
    : 0;
  const assemblyCost = input.delivery_type === 'white_glove_assembly'
    ? zone.assembly_rate
    : 0;

  const totalShipping =
    zone.base_rate + totalWeightCost + totalVolumeCost + whiteGloveCost + assemblyCost;

  // 4. Estimated delivery dates
  const today = new Date();
  const earliestDate = new Date(today);
  earliestDate.setDate(today.getDate() + zone.estimated_days_min);
  const latestDate = new Date(today);
  latestDate.setDate(today.getDate() + zone.estimated_days_max);

  return {
    zone,
    base_cost: zone.base_rate,
    weight_cost: Math.round(totalWeightCost * 100) / 100,
    volume_cost: Math.round(totalVolumeCost * 100) / 100,
    white_glove_cost: whiteGloveCost,
    assembly_cost: assemblyCost,
    total_shipping: Math.round(totalShipping * 100) / 100,
    estimated_delivery: {
      min_days: zone.estimated_days_min,
      max_days: zone.estimated_days_max,
      earliest_date: earliestDate.toISOString().slice(0, 10),
      latest_date: latestDate.toISOString().slice(0, 10),
    },
  };
}

/** Match a postcode to the first applicable shipping zone */
function findShippingZone(
  postcode: string,
  zones: ShippingZone[],
): ShippingZone | null {
  const normalized = postcode.trim().toUpperCase();
  for (const zone of zones) {
    try {
      const regex = new RegExp(zone.postcode_pattern, 'i');
      if (regex.test(normalized)) {
        return zone;
      }
    } catch {
      // Simple prefix match fallback
      if (normalized.startsWith(zone.postcode_pattern.toUpperCase())) {
        return zone;
      }
    }
  }
  return null;
}

function isWhiteGlove(type: DeliveryType): boolean {
  return type === 'white_glove' || type === 'white_glove_assembly';
}

// =============================================================================
// UI-facing shipping calculator (self-contained with mock rates)
// =============================================================================

export interface ShippingInput {
  weight_kg: number;
  width_cm: number;
  depth_cm: number;
  height_cm: number;
  quantity: number;
  zone: number;            // 1-4
  delivery_type: 'standard' | 'white_glove' | 'room_of_choice';
}

export interface ShippingResult {
  base_cost: number;
  surcharges: { label: string; amount: number }[];
  total: number;
  estimated_days_min: number;
  estimated_days_max: number;
  free_shipping_threshold: number | null;
}

const ZONE_RATES = [
  { zone: 1, base: 49,  perKg: 0.8,  wgSurcharge: 99,  daysMin: 3, daysMax: 5 },
  { zone: 2, base: 79,  perKg: 1.2,  wgSurcharge: 149, daysMin: 5, daysMax: 7 },
  { zone: 3, base: 129, perKg: 1.8,  wgSurcharge: 199, daysMin: 7, daysMax: 10 },
  { zone: 4, base: 199, perKg: 2.5,  wgSurcharge: 299, daysMin: 10, daysMax: 14 },
];

export function calculateShippingRate(input: ShippingInput): ShippingResult {
  const rate = ZONE_RATES.find((r) => r.zone === input.zone) || ZONE_RATES[3];

  const volumetricWeight = (input.width_cm * input.depth_cm * input.height_cm) / 5000;
  const chargeableWeight = Math.max(input.weight_kg, volumetricWeight);
  const totalWeight = chargeableWeight * input.quantity;

  const baseCost = rate.base;
  const weightCost = Math.round(totalWeight * rate.perKg * 100) / 100;

  const surcharges: { label: string; amount: number }[] = [
    { label: 'Freight weight charge', amount: weightCost },
  ];

  if (input.delivery_type === 'white_glove') {
    surcharges.push({ label: 'White-glove service', amount: rate.wgSurcharge });
  } else if (input.delivery_type === 'room_of_choice') {
    surcharges.push({ label: 'Room-of-choice delivery', amount: Math.round(rate.wgSurcharge * 0.6) });
  }

  if (input.quantity > 1) {
    const multiDiscount = Math.round(baseCost * 0.15 * (input.quantity - 1));
    surcharges.push({ label: `Multi-item discount (×${input.quantity})`, amount: -multiDiscount });
  }

  const total = Math.max(0, baseCost + surcharges.reduce((s, c) => s + c.amount, 0));

  return {
    base_cost: baseCost,
    surcharges,
    total: Math.round(total * 100) / 100,
    estimated_days_min: rate.daysMin,
    estimated_days_max: rate.daysMax,
    free_shipping_threshold: total > 0 ? 2500 : null,
  };
}

