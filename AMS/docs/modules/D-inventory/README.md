# Module D: Inventory and Stock Management

**Status:** Not Started (Phase 3)  
**Dependencies:** None (K only for auth)  
**Provides To:** Modules C (parts issuance), E (pricing)

---

## Purpose

Module D manages all parts and materials — inventory tracking, purchase orders, stock counts, and costing.

---

## Database Tables (12)

Categories, suppliers, items, locations, balances, movements, POs, receipts, stock counts

---

## Key Features

- Parts catalog with barcode support
- Purchase orders and goods receipt
- Stock issuance to jobs
- WAC (Weighted Average Cost) costing
- Low stock alerts
- Stock counts with variance approval
- Atomic issuance (no negative stock)
- Movement history

---

## Costing

**Default:** Weighted Average Cost (WAC)  
**Optional:** FIFO (configurable via K settings)

---

## Integration

**No dependencies:** Can build immediately  
**Provides to C:** Parts for service orders  
**Provides to E:** Part pricing for invoicing

---

**Module D ensures parts are always available.**
