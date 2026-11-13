-- Module D: Inventory — Database Schema

CREATE TABLE IF NOT EXISTS d_categories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  parent_id uuid REFERENCES d_categories(id),
  description text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS d_suppliers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_name text,
  contact_phone text,
  contact_email text,
  address text,
  payment_terms_days integer DEFAULT 0,
  notes text,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS d_inventory_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  category_id uuid REFERENCES d_categories(id),
  sku text UNIQUE NOT NULL,
  name text NOT NULL,
  description text,
  unit_of_measure text DEFAULT 'pc',
  barcode text,
  brand text,
  is_active boolean DEFAULT true,
  is_service_item boolean DEFAULT false,
  reorder_point numeric DEFAULT 0,
  reorder_quantity numeric DEFAULT 0,
  avg_cost_centavos bigint DEFAULT 0,
  selling_price_centavos bigint DEFAULT 0,
  selling_price_vip_centavos bigint,
  selling_price_fleet_centavos bigint,
  current_stock_quantity numeric DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_d_inventory_items_sku ON d_inventory_items(sku);
CREATE INDEX idx_d_inventory_items_barcode ON d_inventory_items(barcode) WHERE barcode IS NOT NULL;
CREATE INDEX idx_d_inventory_items_name ON d_inventory_items(name);

CREATE TABLE IF NOT EXISTS d_stock_locations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text,
  is_active boolean DEFAULT true
);

CREATE TABLE IF NOT EXISTS d_stock_balances (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES d_inventory_items(id) NOT NULL,
  location_id uuid REFERENCES d_stock_locations(id) NOT NULL,
  quantity numeric DEFAULT 0,
  avg_cost_centavos bigint DEFAULT 0,
  last_updated timestamptz DEFAULT now(),
  UNIQUE(item_id, location_id)
);

CREATE INDEX idx_d_stock_balances_item ON d_stock_balances(item_id);
CREATE INDEX idx_d_stock_balances_location ON d_stock_balances(location_id);

CREATE TABLE IF NOT EXISTS d_stock_movements (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  item_id uuid REFERENCES d_inventory_items(id) NOT NULL,
  movement_type text NOT NULL,
  quantity_change numeric NOT NULL,
  unit_cost_centavos bigint,
  reference_type text,
  reference_id text,
  location_id uuid REFERENCES d_stock_locations(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  CONSTRAINT valid_movement_type CHECK (movement_type IN ('receipt', 'issuance', 'adjustment', 'return', 'transfer', 'count_variance'))
);

CREATE INDEX idx_d_stock_movements_item ON d_stock_movements(item_id);
CREATE INDEX idx_d_stock_movements_created_at ON d_stock_movements(created_at DESC);

CREATE TABLE IF NOT EXISTS d_purchase_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  supplier_id uuid REFERENCES d_suppliers(id) NOT NULL,
  po_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  order_date date NOT NULL DEFAULT current_date,
  expected_delivery_date date,
  notes text,
  total_centavos bigint DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  CONSTRAINT valid_po_status CHECK (status IN ('draft', 'sent', 'partially_received', 'received', 'closed', 'cancelled'))
);

CREATE INDEX idx_d_purchase_orders_supplier ON d_purchase_orders(supplier_id);
CREATE INDEX idx_d_purchase_orders_status ON d_purchase_orders(status);

CREATE TABLE IF NOT EXISTS d_purchase_order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id uuid REFERENCES d_purchase_orders(id) ON DELETE CASCADE,
  item_id uuid REFERENCES d_inventory_items(id) NOT NULL,
  quantity_ordered numeric NOT NULL,
  quantity_received numeric DEFAULT 0,
  unit_cost_centavos bigint NOT NULL,
  line_total_centavos bigint NOT NULL
);

CREATE INDEX idx_d_purchase_order_items_po ON d_purchase_order_items(po_id);

CREATE TABLE IF NOT EXISTS d_goods_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  po_id uuid REFERENCES d_purchase_orders(id) NOT NULL,
  received_at timestamptz DEFAULT now(),
  received_by uuid REFERENCES auth.users(id),
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS d_goods_receipt_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  receipt_id uuid REFERENCES d_goods_receipts(id) ON DELETE CASCADE,
  po_item_id uuid REFERENCES d_purchase_order_items(id) NOT NULL,
  quantity_received numeric NOT NULL,
  unit_cost_centavos bigint NOT NULL,
  batch_number text,
  expiry_date date
);

CREATE TABLE IF NOT EXISTS d_stock_counts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  count_date date NOT NULL,
  status text NOT NULL DEFAULT 'draft',
  location_id uuid REFERENCES d_stock_locations(id),
  notes text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  CONSTRAINT valid_count_status CHECK (status IN ('draft', 'in_progress', 'completed', 'approved'))
);

CREATE TABLE IF NOT EXISTS d_stock_count_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  count_id uuid REFERENCES d_stock_counts(id) ON DELETE CASCADE,
  item_id uuid REFERENCES d_inventory_items(id) NOT NULL,
  system_quantity numeric NOT NULL,
  counted_quantity numeric,
  variance_quantity numeric GENERATED ALWAYS AS (counted_quantity - system_quantity) STORED,
  variance_approved_by uuid REFERENCES auth.users(id),
  variance_approved_at timestamptz
);

-- RLS Policies
ALTER TABLE d_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_suppliers ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_inventory_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_stock_locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_stock_balances ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_stock_movements ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_purchase_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_purchase_order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_goods_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_goods_receipt_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_stock_counts ENABLE ROW LEVEL SECURITY;
ALTER TABLE d_stock_count_items ENABLE ROW LEVEL SECURITY;

-- Staff can read all inventory
CREATE POLICY "staff_read_categories" ON d_categories FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_categories" ON d_categories FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_suppliers" ON d_suppliers FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_suppliers" ON d_suppliers FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_items" ON d_inventory_items FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_items" ON d_inventory_items FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_locations" ON d_stock_locations FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_locations" ON d_stock_locations FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_balances" ON d_stock_balances FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_balances" ON d_stock_balances FOR ALL USING (auth.role() = 'service_role');

-- Stock movements are immutable (no UPDATE/DELETE)
CREATE POLICY "service_insert_movements" ON d_stock_movements FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "staff_read_movements" ON d_stock_movements FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));

-- PO policies
CREATE POLICY "staff_read_pos" ON d_purchase_orders FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_pos" ON d_purchase_orders FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_po_items" ON d_purchase_order_items FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_po_items" ON d_purchase_order_items FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_receipts" ON d_goods_receipts FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_receipts" ON d_goods_receipts FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_receipt_items" ON d_goods_receipt_items FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_receipt_items" ON d_goods_receipt_items FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_counts" ON d_stock_counts FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_counts" ON d_stock_counts FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_count_items" ON d_stock_count_items FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_count_items" ON d_stock_count_items FOR ALL USING (auth.role() = 'service_role');
