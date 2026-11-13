-- ============================================================================
-- Module K: Administration — Database Schema
-- ============================================================================
-- Description: Core authentication, authorization, settings, and audit infrastructure
-- Dependencies: Supabase Auth (auth.users)
-- Run AFTER existing user_profiles, roles, user_roles migrations
-- ============================================================================

-- ============================================================================
-- 1. System Settings Key-Value Store
-- ============================================================================
CREATE TABLE IF NOT EXISTS k_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '""'::jsonb,
  description text,
  category text NOT NULL DEFAULT 'general',
  is_sensitive boolean NOT NULL DEFAULT false,
  updated_at timestamptz NOT NULL DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
);

COMMENT ON TABLE k_settings IS 'System-wide configuration key-value store';
COMMENT ON COLUMN k_settings.key IS 'Unique setting key (e.g., shop.hours, tax.rate)';
COMMENT ON COLUMN k_settings.value IS 'Setting value stored as JSON (string, number, object, array)';
COMMENT ON COLUMN k_settings.is_sensitive IS 'If true, masked in UI unless user has view_sensitive permission';

-- ============================================================================
-- 2. Audit Log (Immutable)
-- ============================================================================
CREATE TABLE IF NOT EXISTS k_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  module text NOT NULL,
  table_name text,
  record_id text,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE k_audit_logs IS 'Immutable audit trail of all state-changing operations';
COMMENT ON COLUMN k_audit_logs.action IS 'Action performed (create, update, delete, approve, void, etc.)';
COMMENT ON COLUMN k_audit_logs.module IS 'Module code (K, A, B, C, D, E, etc.)';
COMMENT ON COLUMN k_audit_logs.old_data IS 'Record state before change (for updates)';
COMMENT ON COLUMN k_audit_logs.new_data IS 'Record state after change';

-- ============================================================================
-- 3. Document Number Sequences (Atomic)
-- ============================================================================
CREATE TABLE IF NOT EXISTS k_document_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_code text UNIQUE NOT NULL,
  prefix text NOT NULL,
  last_number integer NOT NULL DEFAULT 0,
  padding integer NOT NULL DEFAULT 6,
  fiscal_year integer,
  reset_annually boolean NOT NULL DEFAULT false,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE k_document_sequences IS 'Atomic document number generation for invoices, service orders, etc.';
COMMENT ON COLUMN k_document_sequences.series_code IS 'Unique series identifier (SO, INV, REC, PO)';
COMMENT ON COLUMN k_document_sequences.prefix IS 'Document number prefix (e.g., SO-, INV-2024-)';
COMMENT ON COLUMN k_document_sequences.last_number IS 'Last issued number (next = last_number + 1)';
COMMENT ON COLUMN k_document_sequences.padding IS 'Zero-pad number to this width (e.g., 6 → 000001)';
COMMENT ON COLUMN k_document_sequences.reset_annually IS 'If true, reset to 0 at start of fiscal_year';

-- ============================================================================
-- 4. Approval Workflow Rules
-- ============================================================================
CREATE TABLE IF NOT EXISTS k_approval_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module text NOT NULL,
  action_type text NOT NULL,
  threshold_value numeric,
  approver_role_id uuid REFERENCES roles(id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE k_approval_rules IS 'Configurable approval workflow rules (e.g., discounts > 10% require manager approval)';
COMMENT ON COLUMN k_approval_rules.module IS 'Module code (E for billing, C for service orders, etc.)';
COMMENT ON COLUMN k_approval_rules.action_type IS 'Action requiring approval (discount, void, adjustment, etc.)';
COMMENT ON COLUMN k_approval_rules.threshold_value IS 'Numeric threshold (e.g., 1000000 centavos = ₱10,000)';
COMMENT ON COLUMN k_approval_rules.approver_role_id IS 'Role that can approve this action';

-- ============================================================================
-- 5. Notification Templates
-- ============================================================================
CREATE TABLE IF NOT EXISTS k_notification_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code text UNIQUE NOT NULL,
  channel text NOT NULL,
  subject text,
  body_template text NOT NULL,
  variables jsonb NOT NULL DEFAULT '[]'::jsonb,
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now(),
  CONSTRAINT valid_channel CHECK (channel IN ('sms', 'email', 'push'))
);

COMMENT ON TABLE k_notification_templates IS 'Notification message templates with variable placeholders';
COMMENT ON COLUMN k_notification_templates.template_code IS 'Unique template identifier (e.g., appointment_reminder, estimate_ready)';
COMMENT ON COLUMN k_notification_templates.channel IS 'Notification channel (sms, email, push)';
COMMENT ON COLUMN k_notification_templates.body_template IS 'Message body with {{variable}} placeholders';
COMMENT ON COLUMN k_notification_templates.variables IS 'Array of variable names used in template';

-- ============================================================================
-- 6. Active Sessions (for session management UI)
-- ============================================================================
CREATE TABLE IF NOT EXISTS k_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  ip_address inet,
  user_agent text,
  last_activity_at timestamptz NOT NULL DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE k_sessions IS 'Active user sessions for monitoring and forcible logout';
COMMENT ON COLUMN k_sessions.session_token IS 'Hashed session token (never store plaintext)';
COMMENT ON COLUMN k_sessions.last_activity_at IS 'Last request timestamp';

-- ============================================================================
-- Indexes for Performance
-- ============================================================================

-- Audit log indexes
CREATE INDEX IF NOT EXISTS idx_k_audit_logs_user_id ON k_audit_logs(user_id);
CREATE INDEX IF NOT EXISTS idx_k_audit_logs_created_at ON k_audit_logs(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_k_audit_logs_module ON k_audit_logs(module);
CREATE INDEX IF NOT EXISTS idx_k_audit_logs_table_record ON k_audit_logs(table_name, record_id);

-- Settings indexes
CREATE INDEX IF NOT EXISTS idx_k_settings_category ON k_settings(category);
CREATE INDEX IF NOT EXISTS idx_k_settings_key ON k_settings(key); -- Already unique, but explicit index

-- Approval rules indexes
CREATE INDEX IF NOT EXISTS idx_k_approval_rules_module ON k_approval_rules(module, is_active);

-- Session indexes
CREATE INDEX IF NOT EXISTS idx_k_sessions_user_id ON k_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_k_sessions_expires_at ON k_sessions(expires_at);

-- ============================================================================
-- Row Level Security (RLS) Policies
-- ============================================================================

-- Enable RLS on all K tables
ALTER TABLE k_settings ENABLE ROW LEVEL SECURITY;
ALTER TABLE k_audit_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE k_document_sequences ENABLE ROW LEVEL SECURITY;
ALTER TABLE k_approval_rules ENABLE ROW LEVEL SECURITY;
ALTER TABLE k_notification_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE k_sessions ENABLE ROW LEVEL SECURITY;

-- ----------------------------------------------------------------------------
-- Settings Policies
-- ----------------------------------------------------------------------------

-- Only admins can read settings
CREATE POLICY "admins_read_settings" ON k_settings
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'owner', 'system_administrator')
    )
  );

-- Only service role (server actions) can write settings
CREATE POLICY "service_write_settings" ON k_settings
  FOR ALL USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- Audit Log Policies
-- ----------------------------------------------------------------------------

-- Service role can insert audit logs (called from server actions only)
CREATE POLICY "service_insert_audit" ON k_audit_logs
  FOR INSERT WITH CHECK (auth.role() = 'service_role');

-- Admins can read audit logs
CREATE POLICY "admins_read_audit" ON k_audit_logs
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'owner', 'system_administrator')
    )
  );

-- NO UPDATE or DELETE on audit log (immutable by design)

-- ----------------------------------------------------------------------------
-- Document Sequences Policies
-- ----------------------------------------------------------------------------

-- Only service role can manage sequences (called from server actions atomically)
CREATE POLICY "service_manage_sequences" ON k_document_sequences
  FOR ALL USING (auth.role() = 'service_role');

-- ----------------------------------------------------------------------------
-- Approval Rules Policies
-- ----------------------------------------------------------------------------

-- Admins can read and write approval rules
CREATE POLICY "admins_manage_approval_rules" ON k_approval_rules
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'owner', 'system_administrator')
    )
  );

-- ----------------------------------------------------------------------------
-- Notification Templates Policies
-- ----------------------------------------------------------------------------

-- Admins can manage notification templates
CREATE POLICY "admins_manage_templates" ON k_notification_templates
  FOR ALL USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'owner', 'system_administrator')
    )
  );

-- ----------------------------------------------------------------------------
-- Sessions Policies
-- ----------------------------------------------------------------------------

-- Users can see their own sessions
CREATE POLICY "users_read_own_sessions" ON k_sessions
  FOR SELECT USING (user_id = auth.uid());

-- Admins can see all sessions
CREATE POLICY "admins_read_all_sessions" ON k_sessions
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_roles ur
      JOIN roles r ON r.id = ur.role_id
      WHERE ur.user_id = auth.uid()
      AND r.name IN ('admin', 'owner', 'system_administrator')
    )
  );

-- Service role can insert/update/delete sessions
CREATE POLICY "service_manage_sessions" ON k_sessions
  FOR ALL USING (auth.role() = 'service_role');

-- ============================================================================
-- Atomic Document Number Generation Function
-- ============================================================================

CREATE OR REPLACE FUNCTION next_document_number(p_series_code text)
RETURNS text
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  v_seq k_document_sequences%ROWTYPE;
  v_number integer;
  v_result text;
BEGIN
  -- Lock row for this series
  SELECT * INTO v_seq
  FROM k_document_sequences
  WHERE series_code = p_series_code
  FOR UPDATE;
  
  IF NOT FOUND THEN
    RAISE EXCEPTION 'Document sequence not found: %', p_series_code;
  END IF;
  
  -- Check if annual reset is needed
  IF v_seq.reset_annually AND v_seq.fiscal_year IS NOT NULL THEN
    IF EXTRACT(YEAR FROM now()) > v_seq.fiscal_year THEN
      v_number := 1;
      UPDATE k_document_sequences
      SET last_number = v_number,
          fiscal_year = EXTRACT(YEAR FROM now())
      WHERE series_code = p_series_code;
    ELSE
      v_number := v_seq.last_number + 1;
      UPDATE k_document_sequences
      SET last_number = v_number
      WHERE series_code = p_series_code;
    END IF;
  ELSE
    v_number := v_seq.last_number + 1;
    UPDATE k_document_sequences
    SET last_number = v_number
    WHERE series_code = p_series_code;
  END IF;
  
  -- Format result: prefix + zero-padded number
  v_result := v_seq.prefix || LPAD(v_number::text, v_seq.padding, '0');
  
  RETURN v_result;
END;
$$;

COMMENT ON FUNCTION next_document_number IS 'Atomically generate next document number for a series (thread-safe)';

-- ============================================================================
-- Seed Data (Initial Setup)
-- ============================================================================

-- Default document sequences
INSERT INTO k_document_sequences (series_code, prefix, last_number, padding, reset_annually, fiscal_year)
VALUES
  ('SO', 'SO-', 0, 6, false, NULL),
  ('INV', 'INV-', 0, 6, true, EXTRACT(YEAR FROM now())),
  ('REC', 'REC-', 0, 6, true, EXTRACT(YEAR FROM now())),
  ('PO', 'PO-', 0, 6, false, NULL)
ON CONFLICT (series_code) DO NOTHING;

-- Default settings (examples)
INSERT INTO k_settings (key, value, description, category, is_sensitive)
VALUES
  ('shop.name', '"JRS Bongabon"', 'Shop name displayed in UI and documents', 'company', false),
  ('shop.address', '""', 'Shop physical address', 'company', false),
  ('shop.phone', '""', 'Shop contact phone number', 'company', false),
  ('shop.email', '""', 'Shop contact email', 'company', false),
  ('shop.hours', '{"monday": "08:00-17:00", "tuesday": "08:00-17:00", "wednesday": "08:00-17:00", "thursday": "08:00-17:00", "friday": "08:00-17:00", "saturday": "08:00-12:00", "sunday": "closed"}', 'Shop operating hours per day', 'scheduling', false),
  ('shop.holidays', '[]', 'Array of holiday dates (ISO format)', 'scheduling', false),
  ('tax.rate', '0.12', 'Default VAT/tax rate (0.12 = 12%)', 'billing', false),
  ('tax.inclusive', 'true', 'If true, prices include tax; if false, tax added on top', 'billing', false),
  ('currency.code', '"PHP"', 'Currency code (ISO 4217)', 'billing', false),
  ('currency.symbol', '"₱"', 'Currency symbol', 'billing', false),
  ('session.timeout_minutes', '120', 'Session timeout after inactivity (minutes)', 'security', false),
  ('password.min_length', '8', 'Minimum password length', 'security', false),
  ('login.max_attempts', '5', 'Max failed login attempts before lockout', 'security', false),
  ('login.lockout_minutes', '15', 'Lockout duration after max failed attempts', 'security', false),
  ('sms.provider', '""', 'SMS provider name (semaphore, twilio, etc.)', 'integrations', false),
  ('sms.api_key', '""', 'SMS provider API key', 'integrations', true),
  ('email.provider', '""', 'Email provider (resend, sendgrid, etc.)', 'integrations', false),
  ('email.api_key', '""', 'Email provider API key', 'integrations', true)
ON CONFLICT (key) DO NOTHING;

-- Default notification templates
INSERT INTO k_notification_templates (template_code, channel, subject, body_template, variables)
VALUES
  ('appointment_reminder', 'sms', NULL, 'Hi {{customerName}}, this is a reminder for your appointment at {{appointmentTime}} on {{appointmentDate}}. See you soon! - JRS Bongabon', '["customerName", "appointmentTime", "appointmentDate"]'),
  ('estimate_ready', 'sms', NULL, 'Hi {{customerName}}, your vehicle estimate is ready. Total: {{estimateTotal}}. Please reply to approve or call us. - JRS Bongabon', '["customerName", "estimateTotal"]'),
  ('vehicle_ready', 'sms', NULL, 'Hi {{customerName}}, your {{vehicleDescription}} is ready for pickup! Total: {{invoiceTotal}}. - JRS Bongabon', '["customerName", "vehicleDescription", "invoiceTotal"]')
ON CONFLICT (template_code) DO NOTHING;

-- ============================================================================
-- End of Module K Schema
-- ============================================================================
