// =============================================================================
// Furnishara – Application Constants
// =============================================================================

export const SITE = {
  name: 'Furnishara',
  tagline: 'Luxury Furniture, Delivered.',
  description:
    'Premium furniture for modern living — explore curated collections with AR visualization, white-glove delivery, and bespoke customization.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000',
  currency: 'USD',
  locale: 'en-US',
} as const;

export const DELIVERY_TIME_SLOTS = [
  { value: '9am-12pm', label: '9:00 AM – 12:00 PM' },
  { value: '12pm-3pm', label: '12:00 PM – 3:00 PM' },
  { value: '3pm-6pm', label: '3:00 PM – 6:00 PM' },
] as const;

export const DELIVERY_TYPES = [
  {
    value: 'standard_freight' as const,
    label: 'Standard Freight',
    description: 'Curbside delivery to your address',
    icon: '🚚',
  },
  {
    value: 'white_glove' as const,
    label: 'White-Glove Delivery',
    description: 'Carried to your room of choice, packaging removed',
    icon: '🤝',
  },
  {
    value: 'white_glove_assembly' as const,
    label: 'White-Glove + Assembly',
    description: 'Full delivery, placement, and professional assembly',
    icon: '🔧',
  },
] as const;

export const OBSTACLE_QUESTIONS = [
  {
    key: 'floor_level' as const,
    label: 'What floor is the delivery to?',
    type: 'number',
    placeholder: 'e.g. 3',
  },
  {
    key: 'has_elevator' as const,
    label: 'Is a service elevator available?',
    type: 'boolean',
  },
  {
    key: 'walk_up' as const,
    label: 'Is this a walk-up apartment?',
    type: 'boolean',
  },
  {
    key: 'narrow_hallways' as const,
    label: 'Are there narrow hallways or tight turns?',
    type: 'boolean',
  },
  {
    key: 'stairs_count' as const,
    label: 'How many flights of stairs?',
    type: 'number',
    placeholder: 'e.g. 2',
  },
  {
    key: 'special_instructions' as const,
    label: 'Any special delivery instructions?',
    type: 'textarea',
    placeholder: 'e.g. Ring buzzer 4B, gate code is 1234…',
  },
] as const;

export const PAYMENT_METHODS = [
  { value: 'card' as const, label: 'Credit / Debit Card', icon: '💳' },
  { value: 'bank_transfer' as const, label: 'Bank Transfer', icon: '🏦' },
  { value: 'digital_wallet' as const, label: 'Digital Wallet', icon: '📱' },
  { value: 'bnpl' as const, label: 'Buy Now, Pay Later', icon: '📅' },
] as const;

export const BNPL_PROVIDERS = [
  { value: 'afterpay', label: 'Afterpay' },
  { value: 'klarna', label: 'Klarna' },
  { value: 'affirm', label: 'Affirm' },
] as const;

export const MATERIAL_TYPE_LABELS: Record<string, string> = {
  fabric: 'Fabric',
  leather: 'Leather',
  wood: 'Wood',
  metal: 'Metal',
  stone: 'Stone',
  glass: 'Glass',
  other: 'Other',
};

/** Volumetric weight divisor for freight shipping (cm → kg) */
export const VOLUMETRIC_DIVISOR = 5000;

/** Tax rate (configurable, default 8%) */
export const DEFAULT_TAX_RATE = 0.08;

/** Max items per cart */
export const MAX_CART_ITEMS = 50;

/** Default warranty duration in years */
export const DEFAULT_WARRANTY_YEARS = 5;

/** Pagination */
export const PRODUCTS_PER_PAGE = 12;
export const REVIEWS_PER_PAGE = 10;
