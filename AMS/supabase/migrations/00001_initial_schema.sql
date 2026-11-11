-- AMS Platform Kernel — Initial Schema
-- Migration: 00001
-- Description: Core tables for authentication, roles, audit, and event outbox

-- ============================================================================
-- USER PROFILES
-- ============================================================================
-- Extends auth.users with additional profile information

CREATE TABLE IF NOT EXISTS public.user_profiles (
  id uuid REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  full_name text,
  avatar_url text,
  phone text,
  timezone text NOT NULL DEFAULT 'Asia/Manila',
  locale text NOT NULL DEFAULT 'en-PH',
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.user_profiles IS 'Extended user profile data complementing auth.users';
COMMENT ON COLUMN public.user_profiles.id IS 'References auth.users.id';
COMMENT ON COLUMN public.user_profiles.timezone IS 'User timezone for date/time display';
COMMENT ON COLUMN public.user_profiles.locale IS 'User locale for i18n (e.g., en-PH, fil-PH)';

-- ============================================================================
-- ROLES
-- ============================================================================
-- System roles for RBAC

CREATE TABLE IF NOT EXISTS public.roles (
  id smallint PRIMARY KEY,
  name text UNIQUE NOT NULL,
  description text
);

COMMENT ON TABLE public.roles IS 'System roles for role-based access control (RBAC)';
COMMENT ON COLUMN public.roles.id IS 'Role ID (1=Admin, 2=Manager, 3=Supervisor, 4=Mechanic, 5=Cashier, 6=Accounting, 7=Customer)';

-- Seed roles (idempotent — ON CONFLICT DO NOTHING)
INSERT INTO public.roles (id, name, description) VALUES
  (1, 'Admin', 'Full system access and configuration'),
  (2, 'Manager', 'Manage shop operations and staff'),
  (3, 'Supervisor', 'Supervise mechanics and service quality'),
  (4, 'Mechanic', 'Service technician — perform work'),
  (5, 'Cashier', 'POS and billing operations'),
  (6, 'Accounting', 'Finance and accounting functions'),
  (7, 'Customer', 'External customer portal access')
ON CONFLICT (id) DO NOTHING;

-- ============================================================================
-- USER ROLES (many-to-many)
-- ============================================================================
-- Assigns roles to users

CREATE TABLE IF NOT EXISTS public.user_roles (
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id smallint REFERENCES public.roles(id) ON DELETE CASCADE,
  granted_by uuid REFERENCES auth.users(id),
  granted_at timestamptz NOT NULL DEFAULT now(),
  PRIMARY KEY (user_id, role_id)
);

COMMENT ON TABLE public.user_roles IS 'User-to-role assignments for RBAC';
COMMENT ON COLUMN public.user_roles.granted_by IS 'Admin who granted this role';

CREATE INDEX IF NOT EXISTS idx_user_roles_user_id ON public.user_roles(user_id);
CREATE INDEX IF NOT EXISTS idx_user_roles_role_id ON public.user_roles(role_id);

-- ============================================================================
-- AUDIT LOG
-- ============================================================================
-- Immutable audit trail for compliance and security

CREATE TABLE IF NOT EXISTS public.audit_log (
  id bigserial PRIMARY KEY,
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL CHECK (action IN ('INSERT','UPDATE','DELETE','LOGIN','LOGOUT','EXPORT')),
  table_name text NOT NULL,
  record_id text,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.audit_log IS 'Immutable audit log for all sensitive operations';
COMMENT ON COLUMN public.audit_log.action IS 'Operation type: INSERT, UPDATE, DELETE, LOGIN, LOGOUT, EXPORT';
COMMENT ON COLUMN public.audit_log.table_name IS 'Table affected (e.g., c_service_orders, d_items)';
COMMENT ON COLUMN public.audit_log.record_id IS 'Primary key of affected record (stringified)';
COMMENT ON COLUMN public.audit_log.old_data IS 'Record state before change (for UPDATE/DELETE)';
COMMENT ON COLUMN public.audit_log.new_data IS 'Record state after change (for INSERT/UPDATE)';

CREATE INDEX IF NOT EXISTS idx_audit_log_created_at ON public.audit_log(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_audit_log_table_name ON public.audit_log(table_name);
CREATE INDEX IF NOT EXISTS idx_audit_log_user_id ON public.audit_log(user_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_record_id ON public.audit_log(record_id);
CREATE INDEX IF NOT EXISTS idx_audit_log_record ON public.audit_log(table_name, record_id);

-- ============================================================================
-- OUTBOX (Event-Driven Architecture)
-- ============================================================================
-- Domain events for cross-module communication (ADR-002)

CREATE TABLE IF NOT EXISTS public.outbox (
  id bigserial PRIMARY KEY,
  aggregate_type text NOT NULL,
  aggregate_id text NOT NULL,
  event_type text NOT NULL,
  payload jsonb NOT NULL DEFAULT '{}',
  published_at timestamptz,
  created_at timestamptz NOT NULL DEFAULT now()
);

COMMENT ON TABLE public.outbox IS 'Event outbox for cross-module domain events (ADR-002)';
COMMENT ON COLUMN public.outbox.aggregate_type IS 'Module and entity (e.g., "service-orders.ServiceOrder")';
COMMENT ON COLUMN public.outbox.aggregate_id IS 'Entity ID that triggered the event';
COMMENT ON COLUMN public.outbox.event_type IS 'Event name (e.g., "service_order.approved", "inventory.parts_reserved")';
COMMENT ON COLUMN public.outbox.payload IS 'Event data as JSON';
COMMENT ON COLUMN public.outbox.published_at IS 'When the event was published (NULL = pending)';

CREATE INDEX IF NOT EXISTS idx_outbox_published_at ON public.outbox(published_at) WHERE published_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_outbox_event_type ON public.outbox(event_type) WHERE published_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_outbox_aggregate ON public.outbox(aggregate_type, aggregate_id);
CREATE INDEX IF NOT EXISTS idx_outbox_created_at ON public.outbox(created_at DESC);

-- ============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ============================================================================
-- Enable RLS on all tables

ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.audit_log ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.outbox ENABLE ROW LEVEL SECURITY;

-- User Profiles: users can view, insert, and update their own profile
CREATE POLICY user_profiles_select_own ON public.user_profiles
  FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY user_profiles_insert_own ON public.user_profiles
  FOR INSERT
  WITH CHECK (auth.uid() = id);

CREATE POLICY user_profiles_update_own ON public.user_profiles
  FOR UPDATE
  USING (auth.uid() = id);

-- Roles: authenticated users can view all roles
CREATE POLICY roles_select_authenticated ON public.roles
  FOR SELECT
  TO authenticated
  USING (true);

-- User Roles: users can view their own roles
CREATE POLICY user_roles_select_own ON public.user_roles
  FOR SELECT
  USING (auth.uid() = user_id);

-- Audit Log: no direct access (service role only, reports via views/functions)
-- No policies = service role only

-- Outbox: no direct access (service role only, consumed by event processor)
-- No policies = service role only

-- ============================================================================
-- UPDATED_AT TRIGGER
-- ============================================================================
-- Automatically update updated_at timestamp on user_profiles

CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER set_updated_at
  BEFORE UPDATE ON public.user_profiles
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_updated_at();

COMMENT ON FUNCTION public.handle_updated_at IS 'Trigger function to set updated_at timestamp';
