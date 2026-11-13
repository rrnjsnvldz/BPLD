# Module E: POS and Billing — Technical Specification

**Version:** 1.0  
**Status:** Phase 4 Module — Not Started  
**Last Updated:** 2026-11-10

---

## Overview

Module E handles all money transactions: invoicing from service orders, over-the-counter sales, payment collection, receipts, and accounts receivable. **All monetary values stored as integer centavos** (never float).

---

## Money Rules

- **Store as integer centavos:** PHP 1.00 = 100 centavos
- **Tax calculation:** Round half-up per line item, not on total
- **Split payments:** Must sum exactly to invoice total
- **Partial payment:** Allowed, creates outstanding balance

---

## Database Tables (7)

```sql
e_invoices (
  id, invoice_number (from K sequence), customer_id FK,
  service_order_id FK (nullable), invoice_type (service|otc|warranty|goodwill),
  status (draft|issued|partially_paid|paid|overdue|voided),
  subtotal_centavos, discount_centavos, tax_centavos, total_centavos,
  amount_paid_centavos, balance_centavos, is_tax_inclusive, tax_rate,
  notes, voided_at, void_reason, voided_by, issued_at, due_date,
  created_at, created_by
)

e_invoice_items, e_payments, e_cash_sessions, e_receipts, e_credit_memos, e_customer_ledger
```

---

## API Contracts

```typescript
// Invoice CRUD
createInvoiceFromServiceOrder, createOtcInvoice, getInvoices, getInvoiceById, voidInvoice

// Payments
addPayment, getPaymentsByInvoice

// Cash session
openCashSession, closeCashSession, getActiveCashSession

// Receipts
generateReceipt, printReceipt

// AR
getCustomerLedger, getArAging
```

---

## UI Screens

- `/pos` — Cashier POS screen
- `/invoices` — Invoice list
- `/invoices/[id]` — Invoice detail
- `/cash-sessions` — Cash session management
- `/ar` — Accounts receivable aging

---

## Integration Points

**Consumes from C:** Service order data for invoice creation  
**Consumes from D:** Part pricing  
**Provides to G:** Sales, collections for accounting

---

**Module E handles all money. Get the math right.**
