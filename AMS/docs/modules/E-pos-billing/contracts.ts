/**
 * Module E: POS and Billing — TypeScript Type Contracts (Abbreviated)
 */

export type Invoice = {
  id: string
  invoice_number: string
  customer_id: string
  service_order_id: string | null
  invoice_type: 'service' | 'otc' | 'warranty' | 'goodwill'
  status: 'draft' | 'issued' | 'partially_paid' | 'paid' | 'overdue' | 'voided'
  subtotal_centavos: number
  discount_centavos: number
  tax_centavos: number
  total_centavos: number
  amount_paid_centavos: number
  balance_centavos: number
  is_tax_inclusive: boolean
  tax_rate: number
  notes: string | null
  voided_at: string | null
  void_reason: string | null
  voided_by: string | null
  issued_at: string | null
  due_date: string | null
  created_at: string
  created_by: string | null
}

export type Payment = {
  id: string
  invoice_id: string
  payment_method: 'cash' | 'card' | 'gcash' | 'maya' | 'bank_transfer' | 'check' | 'credit'
  amount_centavos: number
  reference_number: string | null
  payment_date: string
  received_by: string | null
  status: 'pending' | 'cleared' | 'refunded'
  notes: string | null
  created_at: string
}

export type CashSession = {
  id: string
  cashier_id: string
  opened_at: string
  closed_at: string | null
  opening_balance_centavos: number
  expected_closing_centavos: number | null
  actual_closing_centavos: number | null
  variance_centavos: number | null
  status: 'open' | 'closed' | 'reconciled'
  notes: string | null
}

export type ApiResponse<T> = { data: T | null; error: string | null; message?: string }

export declare function createInvoiceFromServiceOrder(serviceOrderId: string): Promise<ApiResponse<Invoice>>
export declare function createOtcInvoice(data: any): Promise<ApiResponse<Invoice>>
export declare function getInvoices(filter?: any): Promise<ApiResponse<Invoice[]>>
export declare function getInvoiceById(id: string): Promise<ApiResponse<any>>
export declare function voidInvoice(id: string, reason: string): Promise<ApiResponse<void>>
export declare function addPayment(invoiceId: string, payment: any): Promise<ApiResponse<Payment>>
export declare function openCashSession(openingBalance: number): Promise<ApiResponse<CashSession>>
export declare function closeCashSession(sessionId: string, actualClosing: number): Promise<ApiResponse<CashSession>>
// ... other actions
