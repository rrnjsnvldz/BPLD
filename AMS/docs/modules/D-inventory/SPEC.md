# Module D: Inventory and Stock Management — Technical Specification

**Version:** 1.0  
**Status:** Phase 3 Module — Not Started  
**Last Updated:** 2026-11-10

---

## Overview

Module D manages all parts and materials. **No module dependencies** — it can be built in parallel with A, B, and C. Uses **Weighted Average Cost (WAC)** for inventory costing.

---

## Costing Method

**Weighted Average Cost (WAC) Formula:**
```
new_avg_cost = (existing_qty * old_avg_cost + received_qty * receipt_cost) / (existing_qty + received_qty)
```

---

## Database Tables (12)

```sql
d_categories, d_suppliers, d_inventory_items, d_stock_locations,
d_stock_balances, d_stock_movements, d_purchase_orders,
d_purchase_order_items, d_goods_receipts, d_goods_receipt_items,
d_stock_counts, d_stock_count_items
```

---

## API Contracts

```typescript
// Item management
createItem, getItems, getItemById, getItemBySku, getItemByBarcode, updateItem

// Stock operations
getStockBalance, getLowStockItems, issueToJob, returnFromJob, adjustStock, getMovementHistory

// Purchase Orders
createPurchaseOrder, getPurchaseOrders, receiveGoods

// Stock counts
startStockCount, submitCountEntry, approveVariance
```

---

## Concurrency Note

Stock issuance must use Postgres-level locking (`SELECT ... FOR UPDATE`) to prevent two simultaneous issuances driving stock negative.

---

## Integration Points

**Consumes from K:** Settings (WAC vs FIFO)  
**Provides to C:** Parts issuance, availability  
**Provides to E:** Part pricing for invoices

---

**Module D ensures parts are available when needed.**
