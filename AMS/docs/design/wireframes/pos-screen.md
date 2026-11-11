# Wireframe: POS Screen (Module E)

**Screen ID:** E-S01  
**Device Profile:** Desktop (primary, dedicated cashier terminal)  
**User Roles:** Cashier (primary), Service Advisor (secondary)  
**Purpose:** Fast billing and payment collection

---

## Layout Structure

```
+-------------------------------------------------------------------------+
| [App Header]                            Cashier: Maria | Shift: #042   |
+-------------------------------------------------------------------------+
| Point of Sale                            [End of Day] [Cash Count]     |
+-------------------------------------------------------------------------+
|                                                                         |
| +----LEFT PANEL (60%)--------------------------------------------+      |
| | CUSTOMER & JOB                              [Search 🔍] [×Clear] |    |
| +-----------------------------------------------------------------+     |
| | Customer: Juan dela Cruz (VIP ★★★★★)                           |     |
| | Phone: 0917-123-4567                                            |     |
| | Balance: ₱0.00 | Credit Limit: ₱50,000.00                       |     |
| +-----------------------------------------------------------------+     |
| | Job: JOB-2024-11-001 (Released 2024-11-10 15:30)               |     |
| | Vehicle: 2020 Toyota Vios (ABC 123)                             |     |
| | [Load from Job] OR [Over-the-Counter Sale]                      |     |
| +-----------------------------------------------------------------+     |
| |                                                                 |     |
| | LINE ITEMS                                                      |     |
| +-----------------------------------------------------------------+     |
| | # | Description           | Qty | Price    | Disc | Subtotal   |     |
| |---|----------------------|-----|----------|------|------------|     |
| | 1 | Radiator hose        |  1  | ₱850.00  |  0%  | ₱850.00    |     |
| | 2 | Coolant 1L           |  2  | ₱420.00  |  0%  | ₱840.00    |     |
| | 3 | Labor: Radiator rep. |  1  | ₱600.00  |  0%  | ₱600.00    |     |
| | 4 | Diagnostic fee       |  1  | ₱500.00  |  0%  | ₱500.00    |     |
| |---|----------------------|-----|----------|------|------------|     |
| |                                                                 |     |
| | [+ Add Item (F2)] [Scan Barcode] [Apply Discount] [Remove]     |     |
| +-----------------------------------------------------------------+     |
| |                                                                 |     |
| | NOTES:                                                          |     |
| | [Text area for invoice notes, customer requests]                |     |
| +-----------------------------------------------------------------+     |
+-----------------------------------------------------------------------+
|                                                                       |
| +----RIGHT PANEL (40%)--------------------------------------------+   |
| | TOTALS                                                           |  |
| +------------------------------------------------------------------+  |
| | Subtotal:                ₱2,790.00                               |  |
| | VAT (12%):               ₱334.80                                 |  |
| | ──────────────────────────────────────────                       |  |
| | TOTAL:                   ₱3,124.80                               |  |
| |                                                                  |  |
| | Discount:                ₱0.00  [Apply]                          |  |
| | Statutory Discounts:     [SC] [PWD] [None ✓]                    |  |
| |                                                                  |  |
| | Amount Due:              ₱3,124.80                               |  |
| +------------------------------------------------------------------+  |
| |                                                                  |  |
| | PAYMENT                                                          |  |
| +------------------------------------------------------------------+  |
| | Method: [Cash ▼]                                                 |  |
| |         [Cash] [Card] [GCash] [Bank Transfer] [Credit Account]  |  |
| |                                                                  |  |
| | Cash Tendered: ₱[______3,500.00______]   [+100][+500][+1000]    |  |
| |                                                                  |  |
| | Change:                  ₱375.20                                 |  |
| |                                                                  |  |
| | [PROCESS PAYMENT (F9)]                                           |  |
| +------------------------------------------------------------------+  |
| |                                                                  |  |
| | QUICK ACTIONS                                                    |  |
| +------------------------------------------------------------------+  |
| | [Partial Payment]  [Split Payment]  [Credit (30 days)]           |  |
| | [Void (Manager)]   [Print Estimate] [Hold Invoice]              |  |
| +------------------------------------------------------------------+  |
+-----------------------------------------------------------------------+
```

---

## Payment Flow - Split Payment Expanded

When [Split Payment] clicked:

```
+------------------------------------------------------------------+
| SPLIT PAYMENT                                        [×Close]     |
+------------------------------------------------------------------+
| Total Amount Due: ₱3,124.80                                      |
| Remaining:        ₱0.00                                          |
+------------------------------------------------------------------+
| # | Method         | Amount      | Reference      | [×Remove]     |
|---|----------------|-------------|----------------|--------------|
| 1 | Cash           | ₱1,500.00   | —              | [×]          |
| 2 | GCash          | ₱1,624.80   | Ref#12345678   | [×]          |
|---|----------------|-------------|----------------|--------------|
|                                                                  |
| [+ Add Payment Method]                                           |
|                                                                  |
| [Cancel] [PROCESS SPLIT PAYMENT]                                |
+------------------------------------------------------------------+
```

---

## Payment Flow - Partial Payment

```
+------------------------------------------------------------------+
| PARTIAL PAYMENT                                      [×Close]     |
+------------------------------------------------------------------+
| Total Invoice: ₱3,124.80                                         |
| Paying Now:    ₱[______1,500.00______]                          |
| Balance:       ₱1,624.80 (Due: [Date picker])                   |
|                                                                  |
| Payment Method: [Cash ▼]                                         |
| Reference: [Optional field]                                      |
|                                                                  |
| [Cancel] [PROCESS PARTIAL PAYMENT]                              |
+------------------------------------------------------------------+
```

---

## Over-the-Counter Sale Flow

When [Over-the-Counter Sale] selected:

```
Customer and Job section collapses, shows:

+-----------------------------------------------------------------+
| OTC SALE — No Job Order                                         |
| Customer (optional): [Search or leave blank for walk-in]        |
| [+ Add Customer]                                                 |
+-----------------------------------------------------------------+

(Rest of screen same: line items, totals, payment)
```

---

## After Payment Success

```
+------------------------------------------------------------------+
| ✅ PAYMENT SUCCESSFUL                                            |
+------------------------------------------------------------------+
| Invoice: INV-2024-11-001                                         |
| Receipt: OR-2024-11-0042                                         |
| Amount: ₱3,124.80                                                |
| Method: Cash                                                     |
| Change Given: ₱375.20                                            |
+------------------------------------------------------------------+
| [Print Receipt] [Email Receipt] [SMS Receipt] [New Transaction] |
+------------------------------------------------------------------+
```

Auto-print receipt (configurable), then return to empty POS screen after 3 seconds.

---

## States

1. **Empty/Ready:** No customer, no items, awaiting input
2. **Job Loaded:** Line items populated from service order, customer details shown
3. **OTC Sale:** No job reference, optional customer
4. **Partial Entry:** Some fields filled, validation errors shown
5. **Payment Pending:** [PROCESS PAYMENT] button highlighted
6. **Processing:** Button disabled, spinner shown
7. **Success:** Green confirmation, print options
8. **Error:** Red error message, [Retry] button
9. **Manager Approval Needed:** Modal for void/refund/discount, manager PIN required

---

## Keyboard Shortcuts

- **F2:** Add item
- **F3:** Search customer
- **F4:** Apply discount
- **F5:** Refresh
- **F9:** Process payment
- **Esc:** Cancel/Clear
- **Tab:** Navigate fields
- **Enter:** Confirm focused action

---

## Manager Approval Modal (Void/Refund/High Discount)

```
+------------------------------------------------------------------+
| MANAGER APPROVAL REQUIRED                            [×Close]     |
+------------------------------------------------------------------+
| Action: Void Invoice INV-2024-11-001                             |
| Amount: ₱3,124.80                                                |
| Reason: [Dropdown: Wrong customer / Duplicate / Other ▼]         |
| Notes: [Text area for explanation]                               |
|                                                                  |
| Manager PIN: [●●●●]                                              |
|                                                                  |
| [Cancel] [APPROVE]                                               |
+------------------------------------------------------------------+
```

---

## End of Day / Cash Count

```
+------------------------------------------------------------------+
| END OF DAY — Shift #042                  Date: 2024-11-10        |
+------------------------------------------------------------------+
| Cashier: Maria Santos                                            |
| Opened: 08:00 AM | Closing: 05:00 PM                             |
+------------------------------------------------------------------+
| EXPECTED                                                         |
+------------------------------------------------------------------+
| Opening Cash:       ₱5,000.00                                    |
| Cash Sales:         ₱45,320.00                                   |
| Cash Refunds:       (₱1,200.00)                                  |
| ────────────────────────────────                                 |
| Expected Cash:      ₱49,120.00                                   |
+------------------------------------------------------------------+
| ACTUAL COUNT                                                     |
+------------------------------------------------------------------+
| ₱1000 × [__10__] = ₱10,000.00                                    |
| ₱500  × [__50__] = ₱25,000.00                                    |
| ₱200  × [__30__] = ₱6,000.00                                     |
| ₱100  × [__50__] = ₱5,000.00                                     |
| ₱50   × [__40__] = ₱2,000.00                                     |
| ₱20   × [__50__] = ₱1,000.00                                     |
| ₱10   × [__20__] = ₱200.00                                       |
| Coins:              ₱120.00                                      |
| ────────────────────────────────                                 |
| Counted Cash:       ₱49,320.00                                   |
|                                                                  |
| VARIANCE:           ₱200.00 OVER ✅                              |
+------------------------------------------------------------------+
| OTHER PAYMENTS (Non-Cash)                                        |
+------------------------------------------------------------------+
| Card:               ₱12,500.00 (8 transactions)                  |
| GCash:              ₱8,750.00 (12 transactions)                  |
| Credit Account:     ₱3,200.00 (2 invoices)                       |
+------------------------------------------------------------------+
| TOTALS                                                           |
+------------------------------------------------------------------+
| Total Sales:        ₱69,770.00                                   |
| Total Collected:    ₱66,570.00 (excluding credit)                |
+------------------------------------------------------------------+
| [Print Z Report] [Submit EOD] [Cancel]                           |
+------------------------------------------------------------------+
```

---

## Accessibility

- Large touch targets (min 44x44px for buttons)
- Clear focus indicators
- Screen reader announces totals, change amount
- High contrast mode available
- Error messages announced immediately

---

## Performance

- Item search: < 300ms (predictive, local cache)
- Payment processing: < 2s to receipt generation
- Offline mode: Queue transactions, sync when online (if Q-10 = yes)

---

**Notes:**
- All money calculations use platform money utility (centavo-based)
- Invoice/receipt numbers from K (document numbering service)
- Voided invoice keeps its number, next invoice uses next sequential number
- Cash session belongs to one cashier, cannot be edited by others during shift
- Manager approval required for: void, refund, discount > threshold (configurable in K)
