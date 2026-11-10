# Module D: Inventory and Stock Management — Checklist

**Module Owner:** `PENDING(Q-21)` | **Phase:** 3 | **Status:** Not Started

## Core Functions (§5.D)
- [ ] D-F01: Item master (parts, fluids, consumables, cross-reference) · **Must**
- [ ] D-F02: Unit of measure conversions · **Must**
- [ ] D-F03: Multiple locations (shelf, warehouse, bin) · **Should**
- [ ] D-F04: Supplier directory with price lists · **Must**
- [ ] D-F05: Purchase requisition → PO → goods receipt → invoice matching · **Must**
- [ ] D-F06: Stock issuance to job orders (with technician, job reference) · **Must**
- [ ] D-F07: Returns to stock · **Must**
- [ ] D-F08: Barcode/QR scanning · **Should**
- [ ] D-F09: Reorder points, low-stock alerts, suggested purchase list · **Must**
- [ ] D-F10: Costing method (weighted average or FIFO, configured) · **Must**
- [ ] D-F11: Selling price rules (markup, tiered by customer type) · **Must**
- [ ] D-F12: Cycle counts and full stock takes with variance approval · **Must**
- [ ] D-F13: Stock adjustments with reason codes and approval · **Must**
- [ ] D-F14: Batch/expiry tracking for fluids · **Should**
- [ ] D-F15: Special-order and back-order tracking linked to jobs · **Must**

## Screens: Item list, item detail, low-stock dashboard, PO screen, receiving, issue-to-job, stock count worksheet, supplier performance

## Key Records: Item, Category, Supplier, Purchase Order, Goods Receipt, Stock Movement, Stock Adjustment, Stock Count, Location, Return/RMA

## Outputs: Stock valuation, movement report, fast/slow movers, dead stock, reorder report, variance report, usage per job/technician, supplier price comparison

## Business Rules
- [ ] D-N01: Stock movement ledger immutable · **Must**
- [ ] D-N02: Concurrent issuance handled (atomic operations) · **Must**
- [ ] D-N03: Stock adjustment requires reason code and approval · **Must**
- [ ] D-N04: Negative stock disallowed (or flagged and blocked) · **Must**
- [ ] D-N05: Costing recalculated on every receipt per method · **Must**

## Integration
**Provides:** Parts availability/issuance to C, stock/cost data to E and G  
**Consumes:** C (parts requests), K (settings, audit)  
**Deferred:** Wire C integration (Phase 2 stub → Phase 3 live)

## Security
- [ ] D-SEC01: Cost price visible to authorized roles only · **Must**
- [ ] D-SEC02: Stock adjustments over threshold require second approval · **Must**
- [ ] D-SEC03: Permission tests per RBAC · **Must**

## Acceptance Criteria
**D-AC01:** Receive PO, update stock and cost, verify costing method applied  
**D-AC02:** Issue parts to job, stock decremented, movement logged  
**D-AC03:** Stock count with variance, approve adjustment, ledger updated  
**D-AC04:** Two users issue same item concurrently, no negative stock, both succeed or one blocks  

## DoD: All Must, tests green (especially concurrency and costing), security.md, wire C integration, user guide for parts clerk, demo

## Gate: **M1:** — | **M2:** — | **Tag:** `module-D-v1.0`
