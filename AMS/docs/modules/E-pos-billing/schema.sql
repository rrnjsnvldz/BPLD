-- Module E: POS and Billing — Database Schema

CREATE TABLE IF NOT EXISTS e_invoices (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_number text UNIQUE NOT NULL,
  customer_id uuid REFERENCES a_customers(id) NOT NULL,
  service_order_id uuid REFERENCES c_service_orders(id),
  invoice_type text NOT NULL DEFAULT 'service',
  status text NOT NULL DEFAULT 'draft',
  subtotal_centavos bigint NOT NULL,
  discount_centavos bigint DEFAULT 0,
  tax_centavos bigint NOT NULL,
  total_centavos bigint NOT NULL,
  amount_paid_centavos bigint DEFAULT 0,
  balance_centavos bigint GENERATED ALWAYS AS (total_centavos - amount_paid_centavos) STORED,
  is_tax_inclusive boolean DEFAULT true,
  tax_rate numeric DEFAULT 0.12,
  notes text,
  voided_at timestamptz,
  void_reason text,
  voided_by uuid REFERENCES auth.users(id),
  issued_at timestamptz,
  due_date date,
  created_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id),
  CONSTRAINT valid_invoice_type CHECK (invoice_type IN ('service', 'otc', 'warranty', 'goodwill')),
  CONSTRAINT valid_invoice_status CHECK (status IN ('draft', 'issued', 'partially_paid', 'paid', 'overdue', 'voided'))
);

CREATE INDEX idx_e_invoices_customer ON e_invoices(customer_id);
CREATE INDEX idx_e_invoices_service_order ON e_invoices(service_order_id);
CREATE INDEX idx_e_invoices_status ON e_invoices(status);
CREATE INDEX idx_e_invoices_created_at ON e_invoices(created_at DESC);

CREATE TABLE IF NOT EXISTS e_invoice_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES e_invoices(id) ON DELETE CASCADE,
  item_type text NOT NULL,
  description text NOT NULL,
  quantity numeric NOT NULL,
  unit_price_centavos bigint NOT NULL,
  discount_centavos bigint DEFAULT 0,
  tax_rate numeric DEFAULT 0.12,
  line_total_centavos bigint NOT NULL,
  sort_order integer DEFAULT 0,
  CONSTRAINT valid_invoice_item_type CHECK (item_type IN ('labor', 'part', 'sublet', 'fee', 'discount'))
);

CREATE INDEX idx_e_invoice_items_invoice ON e_invoice_items(invoice_id);

CREATE TABLE IF NOT EXISTS e_payments (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES e_invoices(id) NOT NULL,
  payment_method text NOT NULL,
  amount_centavos bigint NOT NULL,
  reference_number text,
  payment_date date NOT NULL DEFAULT current_date,
  received_by uuid REFERENCES auth.users(id),
  status text NOT NULL DEFAULT 'cleared',
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_payment_method CHECK (payment_method IN ('cash', 'card', 'gcash', 'maya', 'bank_transfer', 'check', 'credit')),
  CONSTRAINT valid_payment_status CHECK (status IN ('pending', 'cleared', 'refunded'))
);

CREATE INDEX idx_e_payments_invoice ON e_payments(invoice_id);
CREATE INDEX idx_e_payments_date ON e_payments(payment_date);

CREATE TABLE IF NOT EXISTS e_cash_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  cashier_id uuid REFERENCES auth.users(id) NOT NULL,
  opened_at timestamptz DEFAULT now(),
  closed_at timestamptz,
  opening_balance_centavos bigint NOT NULL,
  expected_closing_centavos bigint,
  actual_closing_centavos bigint,
  variance_centavos bigint GENERATED ALWAYS AS (actual_closing_centavos - expected_closing_centavos) STORED,
  status text NOT NULL DEFAULT 'open',
  notes text,
  CONSTRAINT valid_cash_session_status CHECK (status IN ('open', 'closed', 'reconciled'))
);

CREATE INDEX idx_e_cash_sessions_cashier ON e_cash_sessions(cashier_id);
CREATE INDEX idx_e_cash_sessions_opened_at ON e_cash_sessions(opened_at DESC);

CREATE TABLE IF NOT EXISTS e_receipts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES e_invoices(id) NOT NULL,
  receipt_number text UNIQUE NOT NULL,
  receipt_data jsonb,
  printed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

CREATE INDEX idx_e_receipts_invoice ON e_receipts(invoice_id);

CREATE TABLE IF NOT EXISTS e_credit_memos (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  invoice_id uuid REFERENCES e_invoices(id),
  customer_id uuid REFERENCES a_customers(id) NOT NULL,
  amount_centavos bigint NOT NULL,
  reason text,
  status text NOT NULL DEFAULT 'open',
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_credit_memo_status CHECK (status IN ('open', 'applied', 'expired'))
);

CREATE INDEX idx_e_credit_memos_customer ON e_credit_memos(customer_id);
CREATE INDEX idx_e_credit_memos_status ON e_credit_memos(status);

CREATE TABLE IF NOT EXISTS e_customer_ledger (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  customer_id uuid REFERENCES a_customers(id) NOT NULL,
  transaction_type text NOT NULL,
  reference_id text,
  reference_type text,
  amount_centavos bigint NOT NULL,
  balance_after_centavos bigint,
  transaction_date date NOT NULL DEFAULT current_date,
  notes text,
  created_at timestamptz DEFAULT now(),
  CONSTRAINT valid_ledger_transaction_type CHECK (transaction_type IN ('invoice', 'payment', 'credit_memo', 'adjustment'))
);

CREATE INDEX idx_e_customer_ledger_customer ON e_customer_ledger(customer_id);
CREATE INDEX idx_e_customer_ledger_date ON e_customer_ledger(transaction_date DESC);

-- RLS Policies
ALTER TABLE e_invoices ENABLE ROW LEVEL SECURITY;
ALTER TABLE e_invoice_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE e_payments ENABLE ROW LEVEL SECURITY;
ALTER TABLE e_cash_sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE e_receipts ENABLE ROW LEVEL SECURITY;
ALTER TABLE e_credit_memos ENABLE ROW LEVEL SECURITY;
ALTER TABLE e_customer_ledger ENABLE ROW LEVEL SECURITY;

-- Staff can read all invoices
CREATE POLICY "staff_read_invoices" ON e_invoices FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_invoices" ON e_invoices FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_invoice_items" ON e_invoice_items FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_invoice_items" ON e_invoice_items FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_payments" ON e_payments FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_payments" ON e_payments FOR ALL USING (auth.role() = 'service_role');

-- Cashiers see only their own sessions
CREATE POLICY "cashiers_read_own_sessions" ON e_cash_sessions FOR SELECT USING (cashier_id = auth.uid());
CREATE POLICY "managers_read_all_sessions" ON e_cash_sessions FOR SELECT USING (
  EXISTS (SELECT 1 FROM user_roles ur JOIN roles r ON r.id = ur.role_id WHERE ur.user_id = auth.uid() AND r.name IN ('admin', 'owner', 'manager'))
);
CREATE POLICY "service_manage_sessions" ON e_cash_sessions FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_receipts" ON e_receipts FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_receipts" ON e_receipts FOR ALL USING (auth.role() = 'service_role');

CREATE POLICY "staff_read_credit_memos" ON e_credit_memos FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
CREATE POLICY "service_manage_credit_memos" ON e_credit_memos FOR ALL USING (auth.role() = 'service_role');

-- Customer ledger is append-only (no UPDATE or DELETE)
CREATE POLICY "service_insert_ledger" ON e_customer_ledger FOR INSERT WITH CHECK (auth.role() = 'service_role');
CREATE POLICY "staff_read_ledger" ON e_customer_ledger FOR SELECT USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid()));
