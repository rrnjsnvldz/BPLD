-- Module B: Scheduling — Database Schema

CREATE TABLE IF NOT EXISTS b_appointments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES a_customers(id) NOT NULL,
  vehicle_id uuid REFERENCES a_vehicles(id) NOT NULL,
  appointment_date date NOT NULL,
  appointment_time time NOT NULL,
  duration_minutes integer NOT NULL DEFAULT 60,
  service_type text,
  notes text,
  status text NOT NULL DEFAULT 'scheduled',
  booking_source text NOT NULL DEFAULT 'desk',
  confirmation_sent_at timestamptz,
  reminder_sent_at timestamptz,
  cancelled_at timestamptz,
  cancellation_reason text,
  converted_to_service_order_id uuid,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  CONSTRAINT valid_status CHECK (status IN ('scheduled', 'confirmed', 'arrived', 'no_show', 'cancelled', 'converted')),
  CONSTRAINT valid_booking_source CHECK (booking_source IN ('desk', 'phone', 'portal', 'walk_in'))
);

CREATE INDEX idx_b_appointments_customer ON b_appointments(customer_id);
CREATE INDEX idx_b_appointments_vehicle ON b_appointments(vehicle_id);
CREATE INDEX idx_b_appointments_date ON b_appointments(appointment_date, appointment_time);
CREATE INDEX idx_b_appointments_status ON b_appointments(status);

CREATE TABLE IF NOT EXISTS b_bays (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  bay_number text UNIQUE NOT NULL,
  bay_name text,
  bay_type text NOT NULL DEFAULT 'general',
  specialty_tags text[],
  is_active boolean DEFAULT true,
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_bay_type CHECK (bay_type IN ('general', 'lift', 'alignment', 'wash'))
);

CREATE TABLE IF NOT EXISTS b_bay_assignments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  appointment_id uuid REFERENCES b_appointments(id) ON DELETE CASCADE,
  bay_id uuid REFERENCES b_bays(id),
  technician_user_id uuid REFERENCES auth.users(id),
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES auth.users(id)
);

CREATE INDEX idx_b_bay_assignments_appointment ON b_bay_assignments(appointment_id);
CREATE INDEX idx_b_bay_assignments_bay ON b_bay_assignments(bay_id);

CREATE TABLE IF NOT EXISTS b_waitlist_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES a_customers(id) NOT NULL,
  vehicle_id uuid REFERENCES a_vehicles(id),
  service_requested text,
  preferred_date date,
  notes text,
  status text NOT NULL DEFAULT 'waiting',
  notified_at timestamptz,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_waitlist_status CHECK (status IN ('waiting', 'notified', 'booked', 'expired'))
);

CREATE INDEX idx_b_waitlist_customer ON b_waitlist_entries(customer_id);
CREATE INDEX idx_b_waitlist_status ON b_waitlist_entries(status);

CREATE TABLE IF NOT EXISTS b_availability_overrides (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  override_date date UNIQUE NOT NULL,
  override_type text NOT NULL,
  max_appointments integer,
  notes text,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  CONSTRAINT valid_override_type CHECK (override_type IN ('closed', 'reduced', 'extended'))
);

-- RLS Policies
ALTER TABLE b_appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE b_bays ENABLE ROW LEVEL SECURITY;
ALTER TABLE b_bay_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE b_waitlist_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE b_availability_overrides ENABLE ROW LEVEL SECURITY;

CREATE POLICY "staff_read_appointments" ON b_appointments FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "service_manage_appointments" ON b_appointments FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_bays" ON b_bays FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "service_manage_bays" ON b_bays FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_bay_assignments" ON b_bay_assignments FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "service_manage_bay_assignments" ON b_bay_assignments FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_waitlist" ON b_waitlist_entries FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "service_manage_waitlist" ON b_waitlist_entries FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_availability" ON b_availability_overrides FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid())
);
CREATE POLICY "service_manage_availability" ON b_availability_overrides FOR ALL USING (auth.role() = 'service_role');
