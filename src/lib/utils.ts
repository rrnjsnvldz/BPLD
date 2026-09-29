import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { VOLUMETRIC_DIVISOR } from './constants';

/** Merge Tailwind classes with conflict resolution */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/** Format a number as currency */
export function formatPrice(
  amount: number,
  currency = 'PHP',
  locale = 'en-PH',
): string {
  return new Intl.NumberFormat(locale, {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
  }).format(amount);
}

/** Format a date string to a human-readable format */
export function formatDate(
  dateString: string,
  options?: Intl.DateTimeFormatOptions,
): string {
  const defaults: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...options,
  };
  return new Date(dateString).toLocaleDateString('en-US', defaults);
}

/** Convert centimetres to inches */
export function cmToInches(cm: number): number {
  return Math.round((cm / 2.54) * 10) / 10;
}

/** Format dimension: "120 cm (47.2 in)" */
export function formatDimension(cm: number): string {
  return `${cm} cm (${cmToInches(cm)} in)`;
}

/**
 * Calculate volumetric weight for freight shipping.
 * volumetric_weight_kg = (L × W × H in cm) / DIVISOR
 */
export function calculateVolumetricWeight(
  widthCm: number,
  depthCm: number,
  heightCm: number,
): number {
  return (widthCm * depthCm * heightCm) / VOLUMETRIC_DIVISOR;
}

/** Calculate cubic metres */
export function calculateCubicMetres(
  widthCm: number,
  depthCm: number,
  heightCm: number,
): number {
  return (widthCm * depthCm * heightCm) / 1_000_000;
}

/** Generate a URL-friendly slug */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .trim();
}

/** Truncate text with ellipsis */
export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + '…';
}

/** Generate a human-readable order number */
export function generateOrderNumber(): string {
  const date = new Date();
  const dateStr = date.toISOString().slice(0, 10).replace(/-/g, '');
  const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `FRN-${dateStr}-${rand}`;
}

/** Get the chargeable weight (max of actual vs volumetric) */
export function getChargeableWeight(
  actualKg: number,
  widthCm: number,
  depthCm: number,
  heightCm: number,
): number {
  const volumetric = calculateVolumetricWeight(widthCm, depthCm, heightCm);
  return Math.max(actualKg, volumetric);
}

/** Calculate star rating percentage for a given star count */
export function ratingPercentage(count: number, total: number): number {
  if (total === 0) return 0;
  return Math.round((count / total) * 100);
}
