-- ============================================================================
-- Module A: Customers & Vehicles — Database Schema
-- ============================================================================

-- Customers master table
CREATE TABLE IF NOT EXISTS a_customers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  auth_user_id uuid REFERENCES auth.users(id) NULL,
  full_name text NOT NULL,
  email text,
  phone text NOT NULL,
  phone_alt text,
  address text,
  customer_type text NOT NULL DEFAULT 'regular',
  classification_notes text,
  credit_limit_centavos bigint DEFAULT 0,
  credit_terms_days integer DEFAULT 0,
  consent_marketing boolean DEFAULT false,
  consent_sms boolean DEFAULT false,
  consent_email boolean DEFAULT false,
  consent_recorded_at timestamptz,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  CONSTRAINT valid_customer_type CHECK (customer_type IN ('individual', 'fleet', 'vip', 'credit', 'blacklisted'))
);

CREATE INDEX idx_a_customers_phone ON a_customers(phone) WHERE NOT is_archived;
CREATE INDEX idx_a_customers_email ON a_customers(email) WHERE NOT is_archived;
CREATE INDEX idx_a_customers_type ON a_customers(customer_type);
CREATE INDEX idx_a_customers_name ON a_customers(full_name);

-- Vehicles master table
CREATE TABLE IF NOT EXISTS a_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES a_customers(id) NOT NULL,
  plate_number text UNIQUE NOT NULL,
  vin text,
  make text NOT NULL,
  model text NOT NULL,
  year integer,
  color text,
  body_type text,
  fuel_type text,
  engine_displacement_cc integer,
  transmission text,
  odometer_km integer,
  odometer_recorded_at timestamptz,
  insurance_expiry date,
  registration_expiry date,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

CREATE INDEX idx_a_vehicles_customer_id ON a_vehicles(customer_id);
CREATE INDEX idx_a_vehicles_plate ON a_vehicles(plate_number) WHERE NOT is_archived;
CREATE INDEX idx_a_vehicles_vin ON a_vehicles(vin) WHERE vin IS NOT NULL;

-- Customer notes
CREATE TABLE IF NOT EXISTS a_customer_notes (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES a_customers(id) ON DELETE CASCADE,
  note_text text NOT NULL,
  note_type text DEFAULT 'general',
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_note_type CHECK (note_type IN ('general', 'vip', 'credit', 'warning'))
);

CREATE INDEX idx_a_customer_notes_customer_id ON a_customer_notes(customer_id);

-- Attachments
CREATE TABLE IF NOT EXISTS a_attachments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  entity_type text NOT NULL,
  entity_id uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL,
  file_size_bytes bigint,
  mime_type text,
  attachment_type text,
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_entity_type CHECK (entity_type IN ('customer', 'vehicle')),
  CONSTRAINT valid_attachment_type CHECK (attachment_type IN ('or_cr', 'insurance', 'photo', 'other'))
);

CREATE INDEX idx_a_attachments_entity ON a_attachments(entity_type, entity_id);

-- Fleet accounts
CREATE TABLE IF NOT EXISTS a_fleet_accounts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  company_name text NOT NULL,
  contact_person text,
  contact_phone text,
  contact_email text,
  address text,
  credit_limit_centavos bigint DEFAULT 0,
  payment_terms_days integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Fleet vehicle assignments
CREATE TABLE IF NOT EXISTS a_fleet_vehicles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  fleet_account_id uuid REFERENCES a_fleet_accounts(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES a_vehicles(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES auth.users(id),
  UNIQUE(fleet_account_id, vehicle_id)
);

CREATE INDEX idx_a_fleet_vehicles_fleet ON a_fleet_vehicles(fleet_account_id);
CREATE INDEX idx_a_fleet_vehicles_vehicle ON a_fleet_vehicles(vehicle_id);

-- RLS Policies
ALTER TABLE a_customers ENABLE ROW LEVEL SECURITY;
ALTER TABLE a_vehicles ENABLE ROW LEVEL SECURITY;
ALTER TABLE a_customer_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE a_attachments ENABLE ROW LEVEL SECURITY;
ALTER TABLE a_fleet_accounts ENABLE ROW LEVEL SECURITY;
ALTER TABLE a_fleet_vehicles ENABLE ROW LEVEL SECURITY;

-- Staff can see all customers
CREATE POLICY "staff_read_all_customers" ON a_customers FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid())
);

-- Customers (portal) see only own record
CREATE POLICY "customers_read_own" ON a_customers FOR SELECT USING (
  auth_user_id = auth.uid()
);

-- Service role can write
CREATE POLICY "service_manage_customers" ON a_customers FOR ALL USING (auth.role() = 'service_role');

-- Similar policies for other tables...
CREATE POLICY "staff_read_all_vehicles" ON a_vehicles FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "service_manage_vehicles" ON a_vehicles FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_notes" ON a_customer_notes FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "service_manage_notes" ON a_customer_notes FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_attachments" ON a_attachments FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "service_manage_attachments" ON a_attachments FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_fleet" ON a_fleet_accounts FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "service_manage_fleet" ON a_fleet_accounts FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_fleet_vehicles" ON a_fleet_vehicles FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "service_manage_fleet_vehicles" ON a_fleet_vehicles FOR ALL USING (auth.role() = 'service_role');
