// =============================================================================
// Furnishara – Mock Data for Development
// Realistic furniture catalog data for building the UI without Supabase
// =============================================================================

import type {
  Product,
  ProductCard,
  Category,
  Material,
  ProductDimension,
  CuratedRoom,
  CuratedRoomHotspot,
  Review,
  ReviewStats,
  CareGuide,
  ShippingZone,
  DeliverySlot,
} from '@/types';

// ─── Categories ──────────────────────────────────────────────────────────────

export const MOCK_CATEGORIES: Category[] = [
  {
    id: 'cat-1',
    slug: 'sofas',
    name: 'Sofas & Sectionals',
    description: 'Handcrafted sofas designed for lasting comfort and timeless style.',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=600&h=400&fit=crop',
    sort_order: 1,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    product_count: 24,
  },
  {
    id: 'cat-2',
    slug: 'beds',
    name: 'Beds & Headboards',
    description: 'Luxurious beds crafted for the perfect night\'s rest.',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=600&h=400&fit=crop',
    sort_order: 2,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    product_count: 18,
  },
  {
    id: 'cat-3',
    slug: 'dining',
    name: 'Dining & Kitchen',
    description: 'Tables, chairs, and storage for every dining occasion.',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=600&h=400&fit=crop',
    sort_order: 3,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    product_count: 32,
  },
  {
    id: 'cat-4',
    slug: 'office',
    name: 'Home Office',
    description: 'Ergonomic desks, chairs, and storage for productive workspaces.',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=600&h=400&fit=crop',
    sort_order: 4,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    product_count: 15,
  },
  {
    id: 'cat-5',
    slug: 'storage',
    name: 'Storage & Shelving',
    description: 'Bookshelves, cabinets, and sideboards in solid wood.',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=600&h=400&fit=crop',
    sort_order: 5,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    product_count: 20,
  },
  {
    id: 'cat-6',
    slug: 'lighting',
    name: 'Lighting',
    description: 'Floor lamps, pendants, and table lights to set the mood.',
    parent_id: null,
    image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=600&h=400&fit=crop',
    sort_order: 6,
    created_at: '2026-01-01T00:00:00Z',
    updated_at: '2026-01-01T00:00:00Z',
    product_count: 28,
  },
];

// ─── Materials ───────────────────────────────────────────────────────────────

export const MOCK_MATERIALS: Material[] = [
  {
    id: 'mat-1', slug: 'walnut', name: 'American Walnut', material_type: 'wood',
    description: 'Rich, dark-toned hardwood with beautiful grain patterns.',
    swatch_url: null, texture_url: null, hex_color: '#5C4033',
    price_modifier: 0, is_active: true, created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'mat-2', slug: 'natural-oak', name: 'Natural Oak', material_type: 'wood',
    description: 'Light, golden-toned wood with a clean, Scandinavian feel.',
    swatch_url: null, texture_url: null, hex_color: '#C4A35A',
    price_modifier: -100, is_active: true, created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'mat-3', slug: 'matte-black', name: 'Matte Black', material_type: 'metal',
    description: 'Powder-coated steel with a sophisticated matte finish.',
    swatch_url: null, texture_url: null, hex_color: '#1C1C1E',
    price_modifier: 50, is_active: true, created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'mat-4', slug: 'italian-leather-tan', name: 'Italian Leather – Tan', material_type: 'leather',
    description: 'Full-grain Italian leather that develops a beautiful patina.',
    swatch_url: null, texture_url: null, hex_color: '#C19A6B',
    price_modifier: 400, is_active: true, created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'mat-5', slug: 'velvet-emerald', name: 'Velvet – Emerald', material_type: 'fabric',
    description: 'Plush, jewel-toned velvet that catches the light beautifully.',
    swatch_url: null, texture_url: null, hex_color: '#2D6A4F',
    price_modifier: 200, is_active: true, created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'mat-6', slug: 'linen-cloud', name: 'Linen – Cloud White', material_type: 'fabric',
    description: 'Breathable, natural linen with a relaxed, lived-in texture.',
    swatch_url: null, texture_url: null, hex_color: '#F0EDE8',
    price_modifier: 100, is_active: true, created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'mat-7', slug: 'brushed-brass', name: 'Brushed Brass', material_type: 'metal',
    description: 'Warm, golden metal finish with subtle brushed texture.',
    swatch_url: null, texture_url: null, hex_color: '#C5A55A',
    price_modifier: 150, is_active: true, created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'mat-8', slug: 'marble-carrara', name: 'Carrara Marble', material_type: 'stone',
    description: 'Classic Italian marble with soft grey veining.',
    swatch_url: null, texture_url: null, hex_color: '#EAEAEA',
    price_modifier: 600, is_active: true, created_at: '2026-01-01T00:00:00Z',
  },
];

// ─── Products ────────────────────────────────────────────────────────────────

export const MOCK_PRODUCTS: ProductCard[] = [
  {
    id: 'prod-1', slug: 'elysian-modular-sofa',
    name: 'Elysian Modular Sofa', tagline: 'Endlessly configurable comfort',
    base_price: 3299, compare_at_price: 3899, currency: 'USD',
    is_new_arrival: true, is_bestseller: true, available_for_ar: true,
    primary_image_url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=800&h=600&fit=crop',
    category_name: 'Sofas & Sectionals', category_slug: 'sofas',
    average_rating: 4.8, review_count: 127,
  },
  {
    id: 'prod-2', slug: 'aurora-platform-bed',
    name: 'Aurora Platform Bed', tagline: 'Floating elegance for restful nights',
    base_price: 2199, compare_at_price: null, currency: 'USD',
    is_new_arrival: false, is_bestseller: true, available_for_ar: true,
    primary_image_url: 'https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?w=800&h=600&fit=crop',
    category_name: 'Beds & Headboards', category_slug: 'beds',
    average_rating: 4.9, review_count: 89,
  },
  {
    id: 'prod-3', slug: 'solstice-dining-table',
    name: 'Solstice Dining Table', tagline: 'Where conversations come alive',
    base_price: 1899, compare_at_price: 2299, currency: 'USD',
    is_new_arrival: true, is_bestseller: false, available_for_ar: true,
    primary_image_url: 'https://images.unsplash.com/photo-1617806118233-18e1de247200?w=800&h=600&fit=crop',
    category_name: 'Dining & Kitchen', category_slug: 'dining',
    average_rating: 4.7, review_count: 64,
  },
  {
    id: 'prod-4', slug: 'zenith-executive-desk',
    name: 'Zenith Executive Desk', tagline: 'Command your workspace',
    base_price: 1499, compare_at_price: null, currency: 'USD',
    is_new_arrival: false, is_bestseller: false, available_for_ar: true,
    primary_image_url: 'https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&h=600&fit=crop',
    category_name: 'Home Office', category_slug: 'office',
    average_rating: 4.6, review_count: 42,
  },
  {
    id: 'prod-5', slug: 'cascade-bookshelf',
    name: 'Cascade Bookshelf', tagline: 'Stories beautifully displayed',
    base_price: 899, compare_at_price: 1099, currency: 'USD',
    is_new_arrival: true, is_bestseller: false, available_for_ar: false,
    primary_image_url: 'https://images.unsplash.com/photo-1594620302200-9a762244a156?w=800&h=600&fit=crop',
    category_name: 'Storage & Shelving', category_slug: 'storage',
    average_rating: 4.5, review_count: 31,
  },
  {
    id: 'prod-6', slug: 'meridian-floor-lamp',
    name: 'Meridian Floor Lamp', tagline: 'Sculpted light, ambient warmth',
    base_price: 549, compare_at_price: null, currency: 'USD',
    is_new_arrival: false, is_bestseller: true, available_for_ar: false,
    primary_image_url: 'https://images.unsplash.com/photo-1507473885765-e6ed057ab6fe?w=800&h=600&fit=crop',
    category_name: 'Lighting', category_slug: 'lighting',
    average_rating: 4.8, review_count: 156,
  },
  {
    id: 'prod-7', slug: 'haven-accent-chair',
    name: 'Haven Accent Chair', tagline: 'The art of sitting well',
    base_price: 1199, compare_at_price: 1499, currency: 'USD',
    is_new_arrival: true, is_bestseller: false, available_for_ar: true,
    primary_image_url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=800&h=600&fit=crop',
    category_name: 'Sofas & Sectionals', category_slug: 'sofas',
    average_rating: 4.7, review_count: 73,
  },
  {
    id: 'prod-8', slug: 'terra-console-table',
    name: 'Terra Console Table', tagline: 'Grounded sophistication',
    base_price: 799, compare_at_price: null, currency: 'USD',
    is_new_arrival: false, is_bestseller: false, available_for_ar: true,
    primary_image_url: 'https://images.unsplash.com/photo-1532372320572-cda25653a26d?w=800&h=600&fit=crop',
    category_name: 'Storage & Shelving', category_slug: 'storage',
    average_rating: 4.4, review_count: 28,
  },
];

// ─── Product Detail (full object for product page) ───────────────────────────

export const MOCK_PRODUCT_DETAIL: Product = {
  id: 'prod-1',
  sku: 'ELY-MOD-001',
  slug: 'elysian-modular-sofa',
  name: 'Elysian Modular Sofa',
  tagline: 'Endlessly configurable comfort',
  description: `The Elysian Modular Sofa redefines living room luxury with its innovative modular design. Each section connects seamlessly using hidden magnetic brackets, allowing you to create L-shapes, U-shapes, or a classic straight configuration in minutes.

Built on a kiln-dried hardwood frame with eight-way hand-tied springs, this sofa delivers both cloud-like comfort and decades of durability. The deep seats (24" depth) and plush back cushions invite you to sink in, while the clean, low-profile silhouette keeps your space looking modern and uncluttered.

**Key Features:**
- Modular sections connect via hidden magnetic brackets
- Kiln-dried hardwood frame with reinforced corner blocks
- Eight-way hand-tied spring suspension
- High-resilience foam core wrapped in hypoallergenic down blend
- Removable, dry-cleanable covers
- Child & pet-friendly performance fabrics available`,
  category_id: 'cat-1',
  base_price: 3299,
  compare_at_price: 3899,
  currency: 'USD',
  status: 'active',
  width_cm: 280,
  depth_cm: 100,
  height_cm: 82,
  seat_height_cm: 45,
  weight_kg: 68,
  package_width_cm: 290,
  package_depth_cm: 110,
  package_height_cm: 90,
  package_weight_kg: 78,
  min_doorway_clearance_cm: 80,
  assembly_required: false,
  estimated_assembly_time_min: null,
  meta_title: 'Elysian Modular Sofa | Furnishara',
  meta_description: 'Handcrafted modular sofa with magnetic connections. Configure your perfect layout. Free white-glove delivery.',
  is_featured: true,
  is_new_arrival: true,
  is_bestseller: true,
  available_for_ar: true,
  created_at: '2026-01-15T00:00:00Z',
  updated_at: '2026-09-01T00:00:00Z',
  category: MOCK_CATEGORIES[0],
  media: [
    { id: 'm1', product_id: 'prod-1', url: 'https://images.unsplash.com/photo-1555041469-a586c61ea9bc?w=1200&h=800&fit=crop', alt_text: 'Elysian Modular Sofa in living room', media_type: 'image', sort_order: 0, is_primary: true, created_at: '2026-01-15T00:00:00Z' },
    { id: 'm2', product_id: 'prod-1', url: 'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200&h=800&fit=crop', alt_text: 'Side angle view', media_type: 'image', sort_order: 1, is_primary: false, created_at: '2026-01-15T00:00:00Z' },
    { id: 'm3', product_id: 'prod-1', url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=1200&h=800&fit=crop', alt_text: 'Detail of fabric texture', media_type: 'image', sort_order: 2, is_primary: false, created_at: '2026-01-15T00:00:00Z' },
    { id: 'm4', product_id: 'prod-1', url: 'https://images.unsplash.com/photo-1540574163026-643ea20ade25?w=1200&h=800&fit=crop', alt_text: 'Modular configuration options', media_type: 'lifestyle', sort_order: 3, is_primary: false, created_at: '2026-01-15T00:00:00Z' },
  ],
  dimensions: [
    { id: 'd1', product_id: 'prod-1', label: 'Overall Width', value_cm: 280, value_in: 110.2, diagram_url: null, sort_order: 0 },
    { id: 'd2', product_id: 'prod-1', label: 'Overall Depth', value_cm: 100, value_in: 39.4, diagram_url: null, sort_order: 1 },
    { id: 'd3', product_id: 'prod-1', label: 'Overall Height', value_cm: 82, value_in: 32.3, diagram_url: null, sort_order: 2 },
    { id: 'd4', product_id: 'prod-1', label: 'Seat Height', value_cm: 45, value_in: 17.7, diagram_url: null, sort_order: 3 },
    { id: 'd5', product_id: 'prod-1', label: 'Seat Depth', value_cm: 61, value_in: 24.0, diagram_url: null, sort_order: 4 },
    { id: 'd6', product_id: 'prod-1', label: 'Arm Height', value_cm: 58, value_in: 22.8, diagram_url: null, sort_order: 5 },
  ],
  materials: [
    { id: 'pm-1', product_id: 'prod-1', material_id: 'mat-6', is_default: true, image_url: null, sort_order: 0, material: MOCK_MATERIALS[5] },
    { id: 'pm-2', product_id: 'prod-1', material_id: 'mat-5', is_default: false, image_url: null, sort_order: 1, material: MOCK_MATERIALS[4] },
    { id: 'pm-3', product_id: 'prod-1', material_id: 'mat-4', is_default: false, image_url: null, sort_order: 2, material: MOCK_MATERIALS[3] },
  ],
  care_guides: [
    { id: 'cg-1', product_id: 'prod-1', material_id: null, title: 'Fabric Care Guide', content: 'Vacuum weekly with upholstery attachment. Blot spills immediately. Professional cleaning recommended annually.', pdf_url: null, sort_order: 0, created_at: '2026-01-15T00:00:00Z' },
    { id: 'cg-2', product_id: 'prod-1', material_id: 'mat-4', title: 'Leather Conditioning Guide', content: 'Apply leather conditioner every 6-12 months. Avoid direct sunlight. Clean with a damp cloth.', pdf_url: null, sort_order: 1, created_at: '2026-01-15T00:00:00Z' },
  ],
};

// ─── Reviews ─────────────────────────────────────────────────────────────────

export const MOCK_REVIEWS: Review[] = [
  {
    id: 'rev-1', product_id: 'prod-1', user_id: 'u1', rating: 5,
    title: 'Absolutely stunning in our living room',
    body: 'We spent months looking for the perfect modular sofa and the Elysian exceeded every expectation. The velvet emerald fabric is even more beautiful in person. Assembly was not needed — it arrived in perfect condition via white-glove delivery.',
    is_verified_purchase: true, is_approved: true,
    created_at: '2026-08-15T00:00:00Z', updated_at: '2026-08-15T00:00:00Z',
    profile: { full_name: 'Sarah M.', avatar_url: null },
    photos: [
      { id: 'rp-1', review_id: 'rev-1', url: 'https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?w=400&h=300&fit=crop', caption: 'In our living room', sort_order: 0, created_at: '2026-08-15T00:00:00Z' },
    ],
  },
  {
    id: 'rev-2', product_id: 'prod-1', user_id: 'u2', rating: 5,
    title: 'Perfect for our family with kids',
    body: 'The performance linen fabric is incredibly durable. Our two kids have already tested it thoroughly and everything wipes clean. The modular design means we can reconfigure for movie nights.',
    is_verified_purchase: true, is_approved: true,
    created_at: '2026-07-20T00:00:00Z', updated_at: '2026-07-20T00:00:00Z',
    profile: { full_name: 'James R.', avatar_url: null },
    photos: [],
  },
  {
    id: 'rev-3', product_id: 'prod-1', user_id: 'u3', rating: 4,
    title: 'Beautiful but deeper than expected',
    body: 'The sofa is gorgeous and incredibly comfortable. Just note that the 24-inch seat depth means shorter people might need back cushions. The doorway clearance warning was very helpful — just barely fit through our 32-inch doorway.',
    is_verified_purchase: true, is_approved: true,
    created_at: '2026-06-10T00:00:00Z', updated_at: '2026-06-10T00:00:00Z',
    profile: { full_name: 'Priya K.', avatar_url: null },
    photos: [],
  },
];

export const MOCK_REVIEW_STATS: ReviewStats = {
  product_id: 'prod-1',
  average_rating: 4.8,
  total_reviews: 127,
  rating_distribution: { 5: 89, 4: 28, 3: 7, 2: 2, 1: 1 },
  photo_count: 43,
};

// ─── Shipping Zones ──────────────────────────────────────────────────────────

export const MOCK_SHIPPING_ZONES: ShippingZone[] = [
  {
    id: 'sz-1', name: 'Metro (NYC, LA, CHI)', postcode_pattern: '^(1[0-4]|9[0-2]|6[0-2])',
    base_rate: 99, per_kg_rate: 0.50, per_cbm_rate: 150,
    white_glove_surcharge: 199, assembly_rate: 149,
    estimated_days_min: 3, estimated_days_max: 5, is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
  {
    id: 'sz-2', name: 'Regional', postcode_pattern: '^[0-9]{5}$',
    base_rate: 149, per_kg_rate: 0.75, per_cbm_rate: 200,
    white_glove_surcharge: 249, assembly_rate: 179,
    estimated_days_min: 5, estimated_days_max: 10, is_active: true,
    created_at: '2026-01-01T00:00:00Z',
  },
];
