-- Module C: Service Orders — Database Schema

CREATE TABLE IF NOT EXISTS c_service_orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES b_appointments(id),
  customer_id uuid REFERENCES a_customers(id) NOT NULL,
  vehicle_id uuid REFERENCES a_vehicles(id) NOT NULL,
  order_number text UNIQUE NOT NULL,
  status text NOT NULL DEFAULT 'checked_in',
  intake_odometer_km integer,
  promised_at timestamptz,
  bay_id uuid REFERENCES b_bays(id),
  primary_technician_id uuid REFERENCES auth.users(id),
  complaint_description text,
  diagnosis_notes text,
  internal_notes text,
  is_warranty boolean DEFAULT false,
  warranty_reference text,
  is_comeback boolean DEFAULT false,
  original_order_id uuid REFERENCES c_service_orders(id),
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT valid_status CHECK (status IN (
    'checked_in', 'awaiting_estimate', 'awaiting_approval', 'awaiting_parts',
    'in_progress', 'quality_check', 'ready_for_release', 'released',
    'closed', 'on_hold', 'cancelled'
  ))
);

CREATE INDEX idx_c_service_orders_customer ON c_service_orders(customer_id);
CREATE INDEX idx_c_service_orders_vehicle ON c_service_orders(vehicle_id);
CREATE INDEX idx_c_service_orders_status ON c_service_orders(status);
CREATE INDEX idx_c_service_orders_created_at ON c_service_orders(created_at DESC);

CREATE TABLE IF NOT EXISTS c_job_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid REFERENCES c_service_orders(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  description text NOT NULL,
  quantity numeric NOT NULL DEFAULT 1,
  unit_price_centavos bigint NOT NULL,
  discount_centavos bigint DEFAULT 0,
  tax_rate numeric DEFAULT 0.12,
  line_total_centavos bigint NOT NULL,
  part_id uuid,
  technician_id uuid REFERENCES auth.users(id),
  sort_order integer DEFAULT 0,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_item_type CHECK (item_type IN ('labor', 'part', 'sublet', 'fee'))
);

CREATE INDEX idx_c_job_items_service_order ON c_job_items(service_order_id);

CREATE TABLE IF NOT EXISTS c_estimates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid REFERENCES c_service_orders(id) ON DELETE CASCADE,
  version integer NOT NULL DEFAULT 1,
  subtotal_centavos bigint NOT NULL,
  discount_centavos bigint DEFAULT 0,
  tax_centavos bigint NOT NULL,
  total_centavos bigint NOT NULL,
  notes text,
  status text NOT NULL DEFAULT 'draft',
  approved_at timestamptz,
  approval_method text,
  approved_by_name text,
  approval_notes text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  CONSTRAINT valid_estimate_status CHECK (status IN ('draft', 'sent', 'approved', 'rejected')),
  CONSTRAINT valid_approval_method CHECK (approval_method IN ('digital', 'sms', 'verbal'))
);

CREATE INDEX idx_c_estimates_service_order ON c_estimates(service_order_id);

CREATE TABLE IF NOT EXISTS c_work_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid REFERENCES c_service_orders(id) ON DELETE CASCADE,
  technician_id uuid REFERENCES auth.users(id) NOT NULL,
  clock_in_at timestamptz NOT NULL,
  clock_out_at timestamptz,
  duration_minutes integer,
  notes text,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_c_work_logs_service_order ON c_work_logs(service_order_id);
CREATE INDEX idx_c_work_logs_technician ON c_work_logs(technician_id);

CREATE TABLE IF NOT EXISTS c_inspection_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid REFERENCES c_service_orders(id) ON DELETE CASCADE,
  category text NOT NULL,
  item_name text NOT NULL,
  result text NOT NULL,
  technician_notes text,
  photo_path text,
  sort_order integer DEFAULT 0,
  CONSTRAINT valid_result CHECK (result IN ('pass', 'attention', 'fail'))
);

CREATE INDEX idx_c_inspection_items_service_order ON c_inspection_items(service_order_id);

CREATE TABLE IF NOT EXISTS c_parts_requests (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid REFERENCES c_service_orders(id) ON DELETE CASCADE,
  item_id uuid,
  part_description text NOT NULL,
  quantity_requested numeric NOT NULL,
  quantity_issued numeric DEFAULT 0,
  status text NOT NULL DEFAULT 'pending',
  requested_by uuid REFERENCES auth.users(id),
  issued_by uuid REFERENCES auth.users(id),
  requested_at timestamptz DEFAULT now(),
  issued_at timestamptz,
  CONSTRAINT valid_parts_request_status CHECK (status IN ('pending', 'issued', 'cancelled'))
);

CREATE INDEX idx_c_parts_requests_service_order ON c_parts_requests(service_order_id);
CREATE INDEX idx_c_parts_requests_status ON c_parts_requests(status);

CREATE TABLE IF NOT EXISTS c_approval_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid REFERENCES c_service_orders(id) ON DELETE CASCADE,
  approval_type text NOT NULL,
  approved_by_user_id uuid REFERENCES auth.users(id) NOT NULL,
  approved_at timestamptz DEFAULT now(),
  notes text,
  is_immutable boolean DEFAULT true,
  CONSTRAINT valid_approval_type CHECK (approval_type IN ('estimate', 'additional_work', 'release'))
);

CREATE INDEX idx_c_approval_logs_service_order ON c_approval_logs(service_order_id);

CREATE TABLE IF NOT EXISTS c_qc_checklists (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_order_id uuid REFERENCES c_service_orders(id) ON DELETE CASCADE,
  inspector_id uuid REFERENCES auth.users(id) NOT NULL,
  items jsonb NOT NULL DEFAULT '[]'::jsonb,
  result text NOT NULL,
  rework_reason text,
  inspected_at timestamptz DEFAULT now(),
  CONSTRAINT valid_qc_result CHECK (result IN ('pass', 'fail'))
);

CREATE INDEX idx_c_qc_checklists_service_order ON c_qc_checklists(service_order_id);

-- RLS Policies
ALTER TABLE c_service_orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE c_job_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE c_estimates ENABLE ROW LEVEL SECURITY;
ALTER TABLE c_work_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE c_inspection_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE c_parts_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE c_approval_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE c_qc_checklists ENABLE ROW LEVEL SECURITY;

-- Staff can see all service orders
CREATE POLICY "staff_read_service_orders" ON c_service_orders FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid())
);

-- Service role can manage
CREATE POLICY "service_manage_service_orders" ON c_service_orders FOR ALL USING (auth.role() = 'service_role');

-- Similar policies for related tables...
CREATE POLICY "staff_read_job_items" ON c_job_items FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_job_items" ON c_job_items FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_estimates" ON c_estimates FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_estimates" ON c_estimates FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_work_logs" ON c_work_logs FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_work_logs" ON c_work_logs FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_inspection" ON c_inspection_items FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_inspection" ON c_inspection_items FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_parts_requests" ON c_parts_requests FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_parts_requests" ON c_parts_requests FOR ALL USING (auth.role() = 'service_role');

-- Approval logs are immutable (no UPDATE or DELETE policies)
CREATE POLICY "service_insert_approval_logs" ON c_approval_logs FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "staff_read_approval_logs" ON c_approval_logs FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));

CREATE POLICY "staff_read_qc" ON c_qc_checklists FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_qc" ON c_qc_checklists FOR ALL USING (auth.role() = 'service_role');
