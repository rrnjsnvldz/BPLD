# Module E: POS and Billing

**Status:** Not Started (Phase 4)  
**Dependencies:** Modules C (service orders), D (part pricing)  
**Provides To:** Module G (accounting)

---

## Purpose

Module E handles **all money** — invoicing, payments, receipts, cash sessions, and accounts receivable.

---

## Database Tables (7)

Invoices, invoice items, payments, cash sessions, receipts, credit memos, customer ledger

---

## Key Features

- POS screen for cashier
- Invoice from service order
- Over-the-counter sales
- Split payments (cash + card + e-wallet)
- Partial payments
- Cash session (open/close/reconcile)
- Receipt generation
- Invoice voiding (audit trail)
- AR aging report

---

## Money Rules

**Critical:** All amounts in **integer centavos** (100 centavos = PHP 1.00)  
**Never float:** Prevents rounding errors  
**Tax:** Round half-up per line item

---

## Integration

**Consumes from C:** Service order data  
**Consumes from D:** Part pricing  
**Provides to G:** Sales and collections

---

**Module E handles money. Get the math right.**
