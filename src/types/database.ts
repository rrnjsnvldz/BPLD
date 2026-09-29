// =============================================================================
// Furnishara – Core TypeScript Types
// Maps 1:1 to the Supabase PostgreSQL schema
// =============================================================================

// ─── Enums ───────────────────────────────────────────────────────────────────

export type ProductStatus = 'draft' | 'active' | 'archived' | 'out_of_stock';

export type OrderStatus =
  | 'pending'
  | 'confirmed'
  | 'processing'
  | 'shipped'
  | 'in_transit'
  | 'out_for_delivery'
  | 'delivered'
  | 'cancelled'
  | 'refunded';

export type DeliveryType =
  | 'standard_freight'
  | 'white_glove'
  | 'white_glove_assembly';

export type PaymentMethod = 'card' | 'bank_transfer' | 'digital_wallet' | 'bnpl';

export type PaymentStatus = 'pending' | 'authorized' | 'captured' | 'failed' | 'refunded';

export type InquiryStatus = 'new' | 'in_review' | 'quoted' | 'accepted' | 'declined' | 'closed';

export type WarrantyStatus = 'active' | 'expired' | 'claimed' | 'void';

export type MaterialType = 'fabric' | 'leather' | 'wood' | 'metal' | 'stone' | 'glass' | 'other';

export type MediaType = 'image' | 'video' | 'diagram' | 'lifestyle';

export type ModelFormat = 'glb' | 'usdz' | 'gltf';

export type InquiryType = 'quote' | 'custom_order' | 'bulk' | 'commercial';

// ─── Shared / Utility Types ─────────────────────────────────────────────────

export interface Address {
  line1: string;
  line2?: string;
  city: string;
  state?: string;
  postcode: string;
  country: string;
}

export interface DeliveryObstacles {
  floor_level: number;
  has_elevator: boolean;
  walk_up: boolean;
  narrow_hallways: boolean;
  stairs_count: number;
  special_instructions?: string;
}

export interface WarrantyCoverage {
  structural_years: number;
  hardware_years: number;
  fabric_years: number;
  details?: string;
}

export interface WarrantyClaim {
  date: string;
  description: string;
  status: 'pending' | 'approved' | 'denied';
  resolution?: string;
}

export interface Attachment {
  url: string;
  filename: string;
}

export interface CustomDimensions {
  width?: number;
  depth?: number;
  height?: number;
  unit?: 'cm' | 'in';
}

// ─── 1. Categories ──────────────────────────────────────────────────────────

export interface Category {
  id: string;
  slug: string;
  name: string;
  description: string | null;
  parent_id: string | null;
  image_url: string | null;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Computed / joined
  children?: Category[];
  product_count?: number;
}

// ─── 2. Products ─────────────────────────────────────────────────────────────

export interface Product {
  id: string;
  sku: string;
  slug: string;
  name: string;
  tagline: string | null;
  description: string | null;
  category_id: string | null;
  base_price: number;
  compare_at_price: number | null;
  currency: string;
  status: ProductStatus;

  // Physical dimensions
  width_cm: number | null;
  depth_cm: number | null;
  height_cm: number | null;
  seat_height_cm: number | null;
  weight_kg: number | null;

  // Package / shipping dimensions
  package_width_cm: number | null;
  package_depth_cm: number | null;
  package_height_cm: number | null;
  package_weight_kg: number | null;

  // Clearance / assembly
  min_doorway_clearance_cm: number | null;
  assembly_required: boolean;
  estimated_assembly_time_min: number | null;

  // SEO
  meta_title: string | null;
  meta_description: string | null;

  // Flags
  is_featured: boolean;
  is_new_arrival: boolean;
  is_bestseller: boolean;
  available_for_ar: boolean;

  created_at: string;
  updated_at: string;

  // Joined relations (optional, hydrated by queries)
  category?: Category;
  media?: ProductMedia[];
  models_3d?: Product3DModel[];
  materials?: ProductMaterialJoin[];
  dimensions?: ProductDimension[];
  care_guides?: CareGuide[];
  reviews?: Review[];
  inventory?: InventoryRecord[];
}

/** Lightweight product card variant for listings */
export interface ProductCard {
  id: string;
  slug: string;
  name: string;
  tagline: string | null;
  base_price: number;
  compare_at_price: number | null;
  currency: string;
  is_new_arrival: boolean;
  is_bestseller: boolean;
  available_for_ar: boolean;
  primary_image_url: string | null;
  category_name: string | null;
  category_slug: string | null;
  average_rating: number | null;
  review_count: number;
}

// ─── 3. Product Media ────────────────────────────────────────────────────────

export interface ProductMedia {
  id: string;
  product_id: string;
  url: string;
  alt_text: string | null;
  media_type: MediaType;
  sort_order: number;
  is_primary: boolean;
  created_at: string;
}

// ─── 4. AR / 3D Models ──────────────────────────────────────────────────────

export interface Product3DModel {
  id: string;
  product_id: string;
  format: ModelFormat;
  file_url: string;
  file_size_bytes: number | null;
  ios_ar_url: string | null;
  poster_url: string | null;
  created_at: string;
}

// ─── 5. Materials & Finishes ─────────────────────────────────────────────────

export interface Material {
  id: string;
  slug: string;
  name: string;
  material_type: MaterialType;
  description: string | null;
  swatch_url: string | null;
  texture_url: string | null;
  hex_color: string | null;
  price_modifier: number;
  is_active: boolean;
  created_at: string;
}

export interface ProductMaterialJoin {
  id: string;
  product_id: string;
  material_id: string;
  is_default: boolean;
  image_url: string | null;
  sort_order: number;
  // Hydrated
  material?: Material;
}

// ─── 6. Dimensional Diagrams ─────────────────────────────────────────────────

export interface ProductDimension {
  id: string;
  product_id: string;
  label: string;
  value_cm: number;
  value_in: number | null;
  diagram_url: string | null;
  sort_order: number;
}

// ─── 7. Care & Maintenance Guides ───────────────────────────────────────────

export interface CareGuide {
  id: string;
  product_id: string | null;
  material_id: string | null;
  title: string;
  content: string | null;
  pdf_url: string | null;
  sort_order: number;
  created_at: string;
}

// ─── 8. User Profile ────────────────────────────────────────────────────────

export interface Profile {
  id: string;
  email: string | null;
  full_name: string | null;
  phone: string | null;
  avatar_url: string | null;
  default_address: Address | null;
  is_b2b: boolean;
  company_name: string | null;
  company_role: string | null;
  created_at: string;
  updated_at: string;
}

// ─── 9. Addresses ────────────────────────────────────────────────────────────

export interface UserAddress {
  id: string;
  user_id: string;
  label: string;
  line1: string;
  line2: string | null;
  city: string;
  state: string | null;
  postcode: string;
  country: string;
  is_default: boolean;
  latitude: number | null;
  longitude: number | null;
  created_at: string;
}

// ─── 10. Wishlists / Idea Boards ────────────────────────────────────────────

export interface Wishlist {
  id: string;
  user_id: string;
  name: string;
  description: string | null;
  is_public: boolean;
  created_at: string;
  updated_at: string;
  // Hydrated
  items?: WishlistItem[];
  item_count?: number;
}

export interface WishlistItem {
  id: string;
  wishlist_id: string;
  product_id: string;
  material_id: string | null;
  notes: string | null;
  added_at: string;
  // Hydrated
  product?: ProductCard;
  material?: Material;
}

// ─── 11. Shopping Cart ──────────────────────────────────────────────────────

export interface Cart {
  id: string;
  user_id: string | null;
  session_id: string | null;
  created_at: string;
  updated_at: string;
  // Hydrated
  items?: CartItem[];
  item_count?: number;
  subtotal?: number;
}

export interface CartItem {
  id: string;
  cart_id: string;
  product_id: string;
  material_id: string | null;
  quantity: number;
  unit_price: number;
  added_at: string;
  // Hydrated
  product?: Product;
  material?: Material;
  line_total?: number;
}

// ─── 12. Orders ─────────────────────────────────────────────────────────────

export interface Order {
  id: string;
  order_number: string;
  user_id: string | null;
  email: string;

  subtotal: number;
  shipping_cost: number;
  assembly_cost: number;
  tax_amount: number;
  discount_amount: number;
  total: number;
  currency: string;

  status: OrderStatus;
  shipping_address: Address;
  billing_address: Address | null;

  delivery_type: DeliveryType;
  preferred_delivery_date: string | null;
  preferred_time_slot: string | null;
  assembly_requested: boolean;

  delivery_obstacles: DeliveryObstacles | null;

  payment_method: PaymentMethod | null;
  payment_status: PaymentStatus;
  payment_intent_id: string | null;
  bnpl_provider: string | null;

  notes: string | null;
  created_at: string;
  updated_at: string;

  // Hydrated
  items?: OrderItem[];
  status_history?: OrderStatusHistory[];
}

export interface OrderItem {
  id: string;
  order_id: string;
  product_id: string;
  material_id: string | null;
  quantity: number;
  unit_price: number;
  line_total: number;
  product_snapshot: Partial<Product> | null;
  created_at: string;
  // Hydrated
  product?: Product;
  material?: Material;
}

export interface OrderStatusHistory {
  id: string;
  order_id: string;
  status: OrderStatus;
  notes: string | null;
  changed_by: string | null;
  created_at: string;
}

// ─── 13. Delivery Scheduling ────────────────────────────────────────────────

export interface DeliverySlot {
  id: string;
  date: string;
  time_slot: string;
  region_code: string;
  capacity: number;
  booked_count: number;
  is_available: boolean;
  created_at: string;
}

// ─── 14. Shipping Zones & Volumetric Rates ──────────────────────────────────

export interface ShippingZone {
  id: string;
  name: string;
  postcode_pattern: string;
  base_rate: number;
  per_kg_rate: number;
  per_cbm_rate: number;
  white_glove_surcharge: number;
  assembly_rate: number;
  estimated_days_min: number;
  estimated_days_max: number;
  is_active: boolean;
  created_at: string;
}

/** Result of the volumetric shipping calculation */
export interface ShippingQuote {
  zone: ShippingZone;
  base_cost: number;
  weight_cost: number;
  volume_cost: number;
  white_glove_cost: number;
  assembly_cost: number;
  total_shipping: number;
  estimated_delivery: {
    min_days: number;
    max_days: number;
    earliest_date: string;
    latest_date: string;
  };
}

// ─── 15. "Shop the Look" Curated Rooms ─────────────────────────────────────

export interface CuratedRoom {
  id: string;
  slug: string;
  title: string;
  description: string | null;
  room_type: string | null;
  image_url: string;
  total_price: number | null;
  is_active: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
  // Hydrated
  hotspots?: CuratedRoomHotspot[];
}

export interface CuratedRoomHotspot {
  id: string;
  room_id: string;
  product_id: string;
  label: string | null;
  position_x_pct: number;
  position_y_pct: number;
  sort_order: number;
  // Hydrated
  product?: ProductCard;
}

// ─── 16. Reviews & Photo Gallery ────────────────────────────────────────────

export interface Review {
  id: string;
  product_id: string;
  user_id: string;
  rating: number;
  title: string | null;
  body: string | null;
  is_verified_purchase: boolean;
  is_approved: boolean;
  created_at: string;
  updated_at: string;
  // Hydrated
  photos?: ReviewPhoto[];
  profile?: Pick<Profile, 'full_name' | 'avatar_url'>;
}

export interface ReviewPhoto {
  id: string;
  review_id: string;
  url: string;
  caption: string | null;
  sort_order: number;
  created_at: string;
}

/** Aggregated review stats for a product */
export interface ReviewStats {
  product_id: string;
  average_rating: number;
  total_reviews: number;
  rating_distribution: Record<1 | 2 | 3 | 4 | 5, number>;
  photo_count: number;
}

// ─── 17. Digital Warranty Registration ──────────────────────────────────────

export interface Warranty {
  id: string;
  user_id: string;
  order_id: string | null;
  order_item_id: string | null;
  product_id: string;
  serial_number: string | null;
  registration_date: string;
  expiry_date: string;
  warranty_years: number;
  status: WarrantyStatus;
  coverage_details: WarrantyCoverage | null;
  claim_history: WarrantyClaim[];
  created_at: string;
  updated_at: string;
  // Hydrated
  product?: Product;
}

// ─── 18. B2B / Custom Inquiry Portal ────────────────────────────────────────

export interface B2BInquiry {
  id: string;
  user_id: string | null;
  contact_name: string;
  company_name: string | null;
  email: string;
  phone: string | null;
  inquiry_type: InquiryType;
  project_name: string | null;
  description: string;
  budget_range: string | null;
  quantity: number | null;
  preferred_materials: string | null;
  custom_dimensions: CustomDimensions | null;
  attachments: Attachment[];
  reference_products: string[];
  status: InquiryStatus;
  assigned_to: string | null;
  internal_notes: string | null;
  quoted_amount: number | null;
  quote_valid_until: string | null;
  created_at: string;
  updated_at: string;
}

// ─── 19. Inventory ──────────────────────────────────────────────────────────

export interface InventoryRecord {
  id: string;
  product_id: string;
  material_id: string | null;
  quantity_on_hand: number;
  quantity_reserved: number;
  quantity_available: number;
  reorder_point: number;
  lead_time_days: number;
  warehouse_location: string | null;
  updated_at: string;
}

// ─── Form / Input Types ─────────────────────────────────────────────────────

export interface CreateReviewInput {
  product_id: string;
  rating: number;
  title?: string;
  body?: string;
  photos?: File[];
}

export interface CreateB2BInquiryInput {
  contact_name: string;
  company_name?: string;
  email: string;
  phone?: string;
  inquiry_type: InquiryType;
  project_name?: string;
  description: string;
  budget_range?: string;
  quantity?: number;
  preferred_materials?: string;
  custom_dimensions?: CustomDimensions;
  attachments?: File[];
  reference_products?: string[];
}

export interface RegisterWarrantyInput {
  order_id: string;
  order_item_id: string;
  product_id: string;
  serial_number?: string;
}

export interface ShippingCalculatorInput {
  postcode: string;
  items: Array<{
    product_id: string;
    quantity: number;
    package_width_cm: number;
    package_depth_cm: number;
    package_height_cm: number;
    package_weight_kg: number;
  }>;
  delivery_type: DeliveryType;
}

export interface DeliveryObstacleFormInput {
  floor_level: number;
  has_elevator: boolean;
  walk_up: boolean;
  narrow_hallways: boolean;
  stairs_count: number;
  special_instructions?: string;
}

export interface CheckoutInput {
  shipping_address: Address;
  billing_address?: Address;
  delivery_type: DeliveryType;
  preferred_delivery_date?: string;
  preferred_time_slot?: string;
  assembly_requested: boolean;
  delivery_obstacles?: DeliveryObstacleFormInput;
  payment_method: PaymentMethod;
  bnpl_provider?: string;
  notes?: string;
}
