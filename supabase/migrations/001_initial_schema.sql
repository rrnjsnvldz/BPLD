-- =============================================================================
-- Furnishara – Furniture E-Commerce Platform
-- Supabase / PostgreSQL Migration 001: Initial Schema
-- =============================================================================
-- Covers:
--   • Products, Categories, Materials/Finishes, Dimensions
--   • AR/3D Models & Media
--   • User Accounts, Wishlists/Idea Boards
--   • Cart, Orders, Line Items
--   • White-Glove Delivery & Assembly Scheduling
--   • Volumetric Shipping Calculator inputs
--   • Delivery Obstacle Questionnaire
--   • "Shop the Look" Curated Rooms with Hotspots
--   • Real-World Review Gallery (customer photo uploads)
--   • Material Care & Maintenance Guides (PDF/content)
--   • Digital Warranty Registration
--   • B2B / Custom Inquiry Portal
--   • Flexible Payments (metadata for gateways + BNPL)
-- =============================================================================

-- ─── Extensions ──────────────────────────────────────────────────────────────
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- ─── Enums ───────────────────────────────────────────────────────────────────

CREATE TYPE product_status AS ENUM ('draft', 'active', 'archived', 'out_of_stock');
CREATE TYPE order_status AS ENUM (
  'pending', 'confirmed', 'processing', 'shipped', 'in_transit',
  'out_for_delivery', 'delivered', 'cancelled', 'refunded'
);
CREATE TYPE delivery_type AS ENUM ('standard_freight', 'white_glove', 'white_glove_assembly');
CREATE TYPE payment_method AS ENUM ('card', 'bank_transfer', 'digital_wallet', 'bnpl');
CREATE TYPE payment_status AS ENUM ('pending', 'authorized', 'captured', 'failed', 'refunded');
CREATE TYPE inquiry_status AS ENUM ('new', 'in_review', 'quoted', 'accepted', 'declined', 'closed');
CREATE TYPE warranty_status AS ENUM ('active', 'expired', 'claimed', 'void');
CREATE TYPE material_type AS ENUM ('fabric', 'leather', 'wood', 'metal', 'stone', 'glass', 'other');

-- ─── 1. Categories ──────────────────────────────────────────────────────────

CREATE TABLE categories (
  id            UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug          TEXT UNIQUE NOT NULL,
  name          TEXT NOT NULL,
  description   TEXT,
  parent_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url     TEXT,
  sort_order    INT DEFAULT 0,
  created_at    TIMESTAMPTZ DEFAULT now(),
  updated_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_categories_parent ON categories(parent_id);
CREATE INDEX idx_categories_slug ON categories(slug);

-- ─── 2. Products ─────────────────────────────────────────────────────────────

CREATE TABLE products (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  sku             TEXT UNIQUE NOT NULL,
  slug            TEXT UNIQUE NOT NULL,
  name            TEXT NOT NULL,
  tagline         TEXT,              -- short marketing tagline
  description     TEXT,              -- rich-text / markdown body
  category_id     UUID REFERENCES categories(id) ON DELETE SET NULL,
  base_price      DECIMAL(12,2) NOT NULL DEFAULT 0,
  compare_at_price DECIMAL(12,2),    -- strikethrough "was" price
  currency        TEXT DEFAULT 'USD',
  status          product_status DEFAULT 'draft',

  -- Physical dimensions (base product, in cm & kg)
  width_cm        DECIMAL(8,2),
  depth_cm        DECIMAL(8,2),
  height_cm       DECIMAL(8,2),
  seat_height_cm  DECIMAL(8,2),
  weight_kg       DECIMAL(8,2),

  -- Volumetric / shipping dimensions (packaged, in cm & kg)
  package_width_cm   DECIMAL(8,2),
  package_depth_cm   DECIMAL(8,2),
  package_height_cm  DECIMAL(8,2),
  package_weight_kg  DECIMAL(8,2),

  -- Clearance warnings
  min_doorway_clearance_cm DECIMAL(8,2),
  assembly_required        BOOLEAN DEFAULT false,
  estimated_assembly_time_min INT,

  -- SEO
  meta_title       TEXT,
  meta_description TEXT,

  -- Flags
  is_featured      BOOLEAN DEFAULT false,
  is_new_arrival   BOOLEAN DEFAULT false,
  is_bestseller    BOOLEAN DEFAULT false,
  available_for_ar BOOLEAN DEFAULT false,

  created_at       TIMESTAMPTZ DEFAULT now(),
  updated_at       TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_products_status ON products(status);
CREATE INDEX idx_products_featured ON products(is_featured) WHERE is_featured = true;

-- ─── 3. Product Media (images, videos, dimensional diagrams) ─────────────────

CREATE TABLE product_media (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,          -- Supabase Storage URL
  alt_text    TEXT,
  media_type  TEXT DEFAULT 'image',   -- 'image' | 'video' | 'diagram' | 'lifestyle'
  sort_order  INT DEFAULT 0,
  is_primary  BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_product_media_product ON product_media(product_id);

-- ─── 4. AR / 3D Models ──────────────────────────────────────────────────────

CREATE TABLE product_3d_models (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  format      TEXT NOT NULL,          -- 'glb' | 'usdz' | 'gltf'
  file_url    TEXT NOT NULL,          -- Supabase Storage URL
  file_size_bytes BIGINT,
  ios_ar_url  TEXT,                   -- USDZ Quick Look link
  poster_url  TEXT,                   -- static poster image for <model-viewer>
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_3d_models_product ON product_3d_models(product_id);

-- ─── 5. Materials & Finishes ─────────────────────────────────────────────────

CREATE TABLE materials (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug           TEXT UNIQUE NOT NULL,
  name           TEXT NOT NULL,
  material_type  material_type NOT NULL,
  description    TEXT,
  swatch_url     TEXT,                 -- swatch thumbnail image
  texture_url    TEXT,                 -- tileable texture for 3D model swap
  hex_color      TEXT,                 -- fallback colour code
  price_modifier DECIMAL(12,2) DEFAULT 0,  -- added/subtracted from base_price
  is_active      BOOLEAN DEFAULT true,
  created_at     TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_materials_type ON materials(material_type);

-- Junction: which materials are available for which products
CREATE TABLE product_materials (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  material_id UUID NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
  is_default  BOOLEAN DEFAULT false,
  image_url   TEXT,                    -- product image showing this material applied
  sort_order  INT DEFAULT 0,
  UNIQUE(product_id, material_id)
);

CREATE INDEX idx_product_materials_product ON product_materials(product_id);

-- ─── 6. Dimensional Diagrams ─────────────────────────────────────────────────

CREATE TABLE product_dimensions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label       TEXT NOT NULL,          -- e.g. 'Overall Width', 'Arm Height'
  value_cm    DECIMAL(8,2) NOT NULL,
  value_in    DECIMAL(8,2),           -- imperial equivalent
  diagram_url TEXT,                   -- SVG or image overlay
  sort_order  INT DEFAULT 0
);

CREATE INDEX idx_product_dimensions_product ON product_dimensions(product_id);

-- ─── 7. Care & Maintenance Guides ───────────────────────────────────────────

CREATE TABLE care_guides (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID REFERENCES products(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE CASCADE,
  title       TEXT NOT NULL,
  content     TEXT,                    -- markdown / rich-text body
  pdf_url     TEXT,                    -- downloadable PDF from Supabase Storage
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_care_guides_product ON care_guides(product_id);
CREATE INDEX idx_care_guides_material ON care_guides(material_id);

-- ─── 8. User Profiles (extends Supabase Auth) ──────────────────────────────

CREATE TABLE profiles (
  id              UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  email           TEXT,
  full_name       TEXT,
  phone           TEXT,
  avatar_url      TEXT,
  default_address JSONB,               -- { line1, line2, city, state, postcode, country }
  is_b2b          BOOLEAN DEFAULT false,
  company_name    TEXT,
  company_role    TEXT,
  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

-- ─── 9. Addresses ────────────────────────────────────────────────────────────

CREATE TABLE addresses (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  label       TEXT DEFAULT 'Home',     -- 'Home', 'Office', etc.
  line1       TEXT NOT NULL,
  line2       TEXT,
  city        TEXT NOT NULL,
  state       TEXT,
  postcode    TEXT NOT NULL,
  country     TEXT NOT NULL DEFAULT 'US',
  is_default  BOOLEAN DEFAULT false,
  latitude    DECIMAL(10,7),
  longitude   DECIMAL(10,7),
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_addresses_user ON addresses(user_id);

-- ─── 10. Wishlists / Idea Boards ────────────────────────────────────────────

CREATE TABLE wishlists (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  name        TEXT NOT NULL DEFAULT 'My Wishlist',  -- e.g. "New Apartment Living Room"
  description TEXT,
  is_public   BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_wishlists_user ON wishlists(user_id);

CREATE TABLE wishlist_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  wishlist_id UUID NOT NULL REFERENCES wishlists(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
  notes       TEXT,
  added_at    TIMESTAMPTZ DEFAULT now(),
  UNIQUE(wishlist_id, product_id, material_id)
);

CREATE INDEX idx_wishlist_items_wishlist ON wishlist_items(wishlist_id);

-- ─── 11. Shopping Cart ──────────────────────────────────────────────────────

CREATE TABLE carts (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id     UUID REFERENCES profiles(id) ON DELETE CASCADE,
  session_id  TEXT,                    -- for guest carts
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_carts_user ON carts(user_id);
CREATE INDEX idx_carts_session ON carts(session_id);

CREATE TABLE cart_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  cart_id     UUID NOT NULL REFERENCES carts(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
  quantity    INT NOT NULL DEFAULT 1 CHECK (quantity > 0),
  unit_price  DECIMAL(12,2) NOT NULL,
  added_at    TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_cart_items_cart ON cart_items(cart_id);

-- ─── 12. Orders ─────────────────────────────────────────────────────────────

CREATE TABLE orders (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_number      TEXT UNIQUE NOT NULL,    -- human-readable e.g. FRN-20260929-XXXX
  user_id           UUID REFERENCES profiles(id) ON DELETE SET NULL,
  email             TEXT NOT NULL,

  -- Totals
  subtotal          DECIMAL(12,2) NOT NULL DEFAULT 0,
  shipping_cost     DECIMAL(12,2) NOT NULL DEFAULT 0,
  assembly_cost     DECIMAL(12,2) NOT NULL DEFAULT 0,
  tax_amount        DECIMAL(12,2) NOT NULL DEFAULT 0,
  discount_amount   DECIMAL(12,2) NOT NULL DEFAULT 0,
  total             DECIMAL(12,2) NOT NULL DEFAULT 0,

  currency          TEXT DEFAULT 'USD',
  status            order_status DEFAULT 'pending',

  -- Shipping address snapshot
  shipping_address  JSONB NOT NULL,
  billing_address   JSONB,

  -- Delivery preferences
  delivery_type     delivery_type DEFAULT 'standard_freight',
  preferred_delivery_date DATE,
  preferred_time_slot TEXT,           -- e.g. '9am-12pm'
  assembly_requested BOOLEAN DEFAULT false,

  -- Obstacle questionnaire answers (JSONB for flexibility)
  delivery_obstacles JSONB,
  -- e.g. { "floor_level": 3, "has_elevator": false, "walk_up": true,
  --        "narrow_hallways": true, "stairs_count": 2,
  --        "special_instructions": "Ring buzzer 4B" }

  -- Payment
  payment_method    payment_method,
  payment_status    payment_status DEFAULT 'pending',
  payment_intent_id TEXT,             -- Stripe / gateway reference
  bnpl_provider     TEXT,             -- 'afterpay' | 'klarna' | 'affirm' etc.

  notes             TEXT,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
CREATE INDEX idx_orders_number ON orders(order_number);

CREATE TABLE order_items (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  material_id UUID REFERENCES materials(id) ON DELETE SET NULL,
  quantity    INT NOT NULL DEFAULT 1,
  unit_price  DECIMAL(12,2) NOT NULL,
  line_total  DECIMAL(12,2) NOT NULL,
  product_snapshot JSONB,             -- denormalized product data at time of order
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_order_items_order ON order_items(order_id);

-- ─── 13. Delivery Scheduling (Calendar Slots) ──────────────────────────────

CREATE TABLE delivery_slots (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  date            DATE NOT NULL,
  time_slot       TEXT NOT NULL,      -- '9am-12pm', '12pm-3pm', '3pm-6pm'
  region_code     TEXT NOT NULL,      -- postcode prefix or zone
  capacity        INT NOT NULL DEFAULT 5,
  booked_count    INT NOT NULL DEFAULT 0,
  is_available    BOOLEAN GENERATED ALWAYS AS (booked_count < capacity) STORED,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_delivery_slots_date_region ON delivery_slots(date, region_code);

-- ─── 14. Shipping Zones & Volumetric Rates ──────────────────────────────────

CREATE TABLE shipping_zones (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name            TEXT NOT NULL,
  postcode_pattern TEXT NOT NULL,      -- regex or prefix match
  base_rate       DECIMAL(12,2) NOT NULL DEFAULT 0,
  per_kg_rate     DECIMAL(8,4) DEFAULT 0,
  per_cbm_rate    DECIMAL(8,4) DEFAULT 0,    -- per cubic metre
  white_glove_surcharge DECIMAL(12,2) DEFAULT 0,
  assembly_rate   DECIMAL(12,2) DEFAULT 0,
  estimated_days_min INT DEFAULT 3,
  estimated_days_max INT DEFAULT 7,
  is_active       BOOLEAN DEFAULT true,
  created_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_shipping_zones_postcode ON shipping_zones(postcode_pattern);

-- ─── 15. "Shop the Look" Curated Rooms ─────────────────────────────────────

CREATE TABLE curated_rooms (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  slug        TEXT UNIQUE NOT NULL,
  title       TEXT NOT NULL,
  description TEXT,
  room_type   TEXT,                    -- 'living_room', 'bedroom', 'dining', 'office'
  image_url   TEXT NOT NULL,           -- hero lifestyle photo
  total_price DECIMAL(12,2),          -- bundle price
  is_active   BOOLEAN DEFAULT true,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE TABLE curated_room_hotspots (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  room_id        UUID NOT NULL REFERENCES curated_rooms(id) ON DELETE CASCADE,
  product_id     UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  label          TEXT,
  -- Hotspot position (percentage-based for responsive)
  position_x_pct DECIMAL(5,2) NOT NULL,   -- 0.00 to 100.00
  position_y_pct DECIMAL(5,2) NOT NULL,
  sort_order     INT DEFAULT 0
);

CREATE INDEX idx_curated_hotspots_room ON curated_room_hotspots(room_id);

-- ─── 16. Reviews & Real-World Photo Gallery ─────────────────────────────────

CREATE TABLE reviews (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id  UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  user_id     UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  rating      INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
  title       TEXT,
  body        TEXT,
  is_verified_purchase BOOLEAN DEFAULT false,
  is_approved BOOLEAN DEFAULT false,
  created_at  TIMESTAMPTZ DEFAULT now(),
  updated_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_reviews_product ON reviews(product_id);
CREATE INDEX idx_reviews_user ON reviews(user_id);

CREATE TABLE review_photos (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  review_id   UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
  url         TEXT NOT NULL,           -- Supabase Storage URL
  caption     TEXT,
  sort_order  INT DEFAULT 0,
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_review_photos_review ON review_photos(review_id);

-- ─── 17. Digital Warranty Registration ──────────────────────────────────────

CREATE TABLE warranties (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id           UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  order_id          UUID REFERENCES orders(id) ON DELETE SET NULL,
  order_item_id     UUID REFERENCES order_items(id) ON DELETE SET NULL,
  product_id        UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
  serial_number     TEXT,
  registration_date DATE NOT NULL DEFAULT CURRENT_DATE,
  expiry_date       DATE NOT NULL,
  warranty_years    INT NOT NULL DEFAULT 5,
  status            warranty_status DEFAULT 'active',
  coverage_details  JSONB,            -- structural, hardware, fabric, etc.
  claim_history     JSONB DEFAULT '[]'::jsonb,
  created_at        TIMESTAMPTZ DEFAULT now(),
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_warranties_user ON warranties(user_id);
CREATE INDEX idx_warranties_product ON warranties(product_id);
CREATE INDEX idx_warranties_order ON warranties(order_id);

-- ─── 18. B2B / Custom Inquiry Portal ────────────────────────────────────────

CREATE TABLE b2b_inquiries (
  id              UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id         UUID REFERENCES profiles(id) ON DELETE SET NULL,

  -- Contact info (may be guest)
  contact_name    TEXT NOT NULL,
  company_name    TEXT,
  email           TEXT NOT NULL,
  phone           TEXT,

  -- Inquiry details
  inquiry_type    TEXT DEFAULT 'quote', -- 'quote' | 'custom_order' | 'bulk' | 'commercial'
  project_name    TEXT,
  description     TEXT NOT NULL,
  budget_range    TEXT,                 -- e.g. '$5,000 - $10,000'
  quantity        INT,
  preferred_materials TEXT,
  custom_dimensions   JSONB,           -- { width, depth, height }
  attachments     JSONB DEFAULT '[]'::jsonb,  -- array of { url, filename }
  reference_products  UUID[],          -- array of product IDs

  status          inquiry_status DEFAULT 'new',
  assigned_to     TEXT,                -- internal staff email
  internal_notes  TEXT,
  quoted_amount   DECIMAL(12,2),
  quote_valid_until DATE,

  created_at      TIMESTAMPTZ DEFAULT now(),
  updated_at      TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_b2b_inquiries_status ON b2b_inquiries(status);
CREATE INDEX idx_b2b_inquiries_user ON b2b_inquiries(user_id);

-- ─── 19. Inventory Tracking ─────────────────────────────────────────────────

CREATE TABLE inventory (
  id                UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  product_id        UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  material_id       UUID REFERENCES materials(id) ON DELETE SET NULL,
  quantity_on_hand  INT NOT NULL DEFAULT 0,
  quantity_reserved INT NOT NULL DEFAULT 0,
  quantity_available INT GENERATED ALWAYS AS (quantity_on_hand - quantity_reserved) STORED,
  reorder_point     INT DEFAULT 5,
  lead_time_days    INT DEFAULT 14,
  warehouse_location TEXT,
  updated_at        TIMESTAMPTZ DEFAULT now()
);

CREATE UNIQUE INDEX idx_inventory_product_material ON inventory(product_id, material_id);

-- ─── 20. Order status history (audit trail) ─────────────────────────────────

CREATE TABLE order_status_history (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  order_id    UUID NOT NULL REFERENCES orders(id) ON DELETE CASCADE,
  status      order_status NOT NULL,
  notes       TEXT,
  changed_by  UUID,                   -- user or admin who made the change
  created_at  TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_order_status_history_order ON order_status_history(order_id);

-- ─── Helper Functions ───────────────────────────────────────────────────────

-- Auto-update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply updated_at triggers
CREATE TRIGGER trg_products_updated_at
  BEFORE UPDATE ON products FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_categories_updated_at
  BEFORE UPDATE ON categories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_profiles_updated_at
  BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_orders_updated_at
  BEFORE UPDATE ON orders FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_wishlists_updated_at
  BEFORE UPDATE ON wishlists FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_curated_rooms_updated_at
  BEFORE UPDATE ON curated_rooms FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_warranties_updated_at
  BEFORE UPDATE ON warranties FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_b2b_inquiries_updated_at
  BEFORE UPDATE ON b2b_inquiries FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER trg_reviews_updated_at
  BEFORE UPDATE ON reviews FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Generate human-readable order numbers
CREATE OR REPLACE FUNCTION generate_order_number()
RETURNS TRIGGER AS $$
BEGIN
  NEW.order_number = 'FRN-' || TO_CHAR(now(), 'YYYYMMDD') || '-' || UPPER(SUBSTRING(gen_random_uuid()::text FROM 1 FOR 4));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trg_orders_order_number
  BEFORE INSERT ON orders FOR EACH ROW
  WHEN (NEW.order_number IS NULL OR NEW.order_number = '')
  EXECUTE FUNCTION generate_order_number();

-- Auto-create profile on Supabase Auth user creation
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, email, full_name)
  VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data ->> 'full_name', '')
  );
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users FOR EACH ROW EXECUTE FUNCTION handle_new_user();

-- ─── Row Level Security (RLS) ───────────────────────────────────────────────

-- Enable RLS on user-facing tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlists ENABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE carts ENABLE ROW LEVEL SECURITY;
ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_photos ENABLE ROW LEVEL SECURITY;
ALTER TABLE warranties ENABLE ROW LEVEL SECURITY;
ALTER TABLE b2b_inquiries ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Addresses: users manage their own addresses
CREATE POLICY "Users can manage own addresses"
  ON addresses FOR ALL USING (auth.uid() = user_id);

-- Wishlists: users manage their own wishlists
CREATE POLICY "Users can manage own wishlists"
  ON wishlists FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can view public wishlists"
  ON wishlists FOR SELECT USING (is_public = true);

-- Wishlist items: access through parent wishlist ownership
CREATE POLICY "Users can manage own wishlist items"
  ON wishlist_items FOR ALL
  USING (EXISTS (SELECT 1 FROM wishlists WHERE wishlists.id = wishlist_items.wishlist_id AND wishlists.user_id = auth.uid()));

-- Carts: user owns their cart
CREATE POLICY "Users can manage own cart"
  ON carts FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Users can manage own cart items"
  ON cart_items FOR ALL
  USING (EXISTS (SELECT 1 FROM carts WHERE carts.id = cart_items.cart_id AND carts.user_id = auth.uid()));

-- Orders: users view/create their own orders
CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can create orders"
  ON orders FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  USING (EXISTS (SELECT 1 FROM orders WHERE orders.id = order_items.order_id AND orders.user_id = auth.uid()));

-- Reviews: anyone can read approved reviews; users manage their own
CREATE POLICY "Anyone can read approved reviews"
  ON reviews FOR SELECT USING (is_approved = true);
CREATE POLICY "Users can manage own reviews"
  ON reviews FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Anyone can view review photos"
  ON review_photos FOR SELECT
  USING (EXISTS (SELECT 1 FROM reviews WHERE reviews.id = review_photos.review_id AND reviews.is_approved = true));
CREATE POLICY "Users can manage own review photos"
  ON review_photos FOR ALL
  USING (EXISTS (SELECT 1 FROM reviews WHERE reviews.id = review_photos.review_id AND reviews.user_id = auth.uid()));

-- Warranties: users manage their own warranties
CREATE POLICY "Users can manage own warranties"
  ON warranties FOR ALL USING (auth.uid() = user_id);

-- B2B inquiries: users can view/create their own
CREATE POLICY "Users can manage own inquiries"
  ON b2b_inquiries FOR ALL USING (auth.uid() = user_id);
CREATE POLICY "Guests can create inquiries"
  ON b2b_inquiries FOR INSERT WITH CHECK (user_id IS NULL);

-- Public read access for catalog tables
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active products" ON products FOR SELECT USING (status = 'active');

ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read categories" ON categories FOR SELECT USING (true);

ALTER TABLE materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active materials" ON materials FOR SELECT USING (is_active = true);

ALTER TABLE product_media ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read product media" ON product_media FOR SELECT USING (true);

ALTER TABLE product_3d_models ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read 3d models" ON product_3d_models FOR SELECT USING (true);

ALTER TABLE product_materials ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read product materials" ON product_materials FOR SELECT USING (true);

ALTER TABLE product_dimensions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read product dimensions" ON product_dimensions FOR SELECT USING (true);

ALTER TABLE care_guides ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read care guides" ON care_guides FOR SELECT USING (true);

ALTER TABLE curated_rooms ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active curated rooms" ON curated_rooms FOR SELECT USING (is_active = true);

ALTER TABLE curated_room_hotspots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read curated room hotspots" ON curated_room_hotspots FOR SELECT USING (true);

ALTER TABLE delivery_slots ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read available delivery slots" ON delivery_slots FOR SELECT USING (is_available = true);

ALTER TABLE shipping_zones ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read active shipping zones" ON shipping_zones FOR SELECT USING (is_active = true);

ALTER TABLE inventory ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public can read inventory availability" ON inventory FOR SELECT USING (true);
