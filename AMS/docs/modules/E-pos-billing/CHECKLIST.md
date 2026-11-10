# Module E: POS and Billing Management — Checklist

**Module Owner:** `PENDING(Q-21)` | **Phase:** 3 | **Status:** Not Started

## Core Functions (§5.E)
- [ ] E-F01: Invoice generation from service order · **Must**
- [ ] E-F02: Over-the-counter sales (no job order) · **Must** · `PENDING(Q-14)`
- [ ] E-F03: Discounts, promos, coupons, loyalty points, statutory discounts · **Must**
- [ ] E-F04: Tax handling (inclusive/exclusive, tax-exempt) · **Must** · `PENDING(A-09)`
- [ ] E-F05: Multiple payment methods and split payments · **Must**
- [ ] E-F06: Down payments, deposits, partial payments, balance tracking · **Must**
- [ ] E-F07: Credit accounts with credit limits and terms · **Must**
- [ ] E-F08: Official receipts, invoices, delivery receipts (templates, numbering) · **Must**
- [ ] E-F09: Void, refund, return with manager approval · **Must**
- [ ] E-F10: End-of-day (Z) report and cash session · **Must**
- [ ] E-F11: Accounts receivable (statements, aging, follow-up) · **Must**
- [ ] E-F12: Insurance billing (claim ref, adjuster approval, split) · **Should**
- [ ] E-F13: Warranty and goodwill jobs (zero or internal billing) · **Should**

## Screens: POS screen, invoice preview, open invoices list, cashier shift screen, refund approval queue, customer statement, daily sales dashboard

## Key Records: Invoice, Invoice Line, Payment, Receipt, Shift/Cash Session, Credit Memo, Refund, Customer Account Ledger, Insurance Claim

## Outputs: Daily sales, collections, AR aging, sales by item/service/advisor, discount/void report, tax summary, cash over/short

## Business Rules
- [ ] E-N01: Invoice numbers sequential per series, no gaps except voids · **Must**
- [ ] E-N02: Voided invoice keeps number, marked void, cannot be reused · **Must**
- [ ] E-N03: Money stored as integer centavos, never float · **Must**
- [ ] E-N04: Tax rounding per settings · **Must**
- [ ] E-N05: Split payments sum exactly to invoice total · **Must**
- [ ] E-N06: Partial payment creates balance, tracked in AR · **Must**
- [ ] E-N07: Refund requires original invoice reference · **Must**
- [ ] E-N08: Cash session balanced (opening + sales - refunds = closing) · **Must**
- [ ] E-N09: Offline POS or fast recovery mode · **Must** · `PENDING(Q-10)`

## Integration
**Provides:** Invoice/payment data to G (accounting), payment confirmation to C (job closed), sales data to J  
**Consumes:** C (service order → invoice), D (item prices), K (settings: tax, numbering, templates)  
**Deferred:** Wire C integration (Phase 2 stub → Phase 3 live)

## Security
- [ ] E-SEC01: Cashier cannot see cost/margin · **Must**
- [ ] E-SEC02: Void/refund approval workflow enforced · **Must**
- [ ] E-SEC03: Cash session belongs to one user, cannot be edited by others · **Must**
- [ ] E-SEC04: Payment idempotency (retried payment doesn't double-post) · **Must**
- [ ] E-SEC05: Second reviewer for discount/void approval workflow · **Must**
- [ ] E-SEC06: Permission tests per RBAC · **Must**

## Acceptance Criteria
**E-AC01:** Generate invoice from service order, take payment (cash), print receipt, verify numbering  
**E-AC02:** OTC sale, scan item, apply discount, split payment (cash + card), balance invoice  
**E-AC03:** Partial payment, verify AR balance, apply second payment, clear balance  
**E-AC04:** Void invoice, verify kept number, attempt reuse rejected  
**E-AC05:** End-of-day cash count, reconcile against sales, generate Z report, cash over/short flagged  

## DoD: All Must, money arithmetic tests green (edge cases: rounding, split, refund), security.md, second reviewer sign-off on money logic, wire C integration, user guide for cashier, demo

## Gate: **M1:** — | **M2:** — | **Tag:** `module-E-v1.0`
