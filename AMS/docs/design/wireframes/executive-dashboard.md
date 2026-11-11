# Wireframe: Executive Dashboard (Module J)

**Screen ID:** J-S01  
**Device Profile:** Desktop (primary), Tablet (secondary), Mobile (tertiary)  
**User Roles:** Owner/GM (primary), Service Advisor/Manager (limited)  
**Purpose:** Real-time business overview and KPIs

---

## Layout Structure

```
+-------------------------------------------------------------------------+
| [App Header: Logo | Navigation | [Date Range: Today ▼] | User Menu]    |
+-------------------------------------------------------------------------+
| Executive Dashboard                                    [Print] [Export] |
+-------------------------------------------------------------------------+
|                                                                         |
| +---KEY METRICS (4-Card Row)----------------------------------------+   |
| | +----------+  +----------+  +-----------+  +----------+          |   |
| | | REVENUE  |  | PROFIT   |  | JOBS      |  | CASH     |          |   |
| | +----------+  +----------+  +-----------+  +----------+          |   |
| | | TODAY    |  | TODAY    |  | IN SHOP   |  | POSITION |          |   |
| | |          |  |          |  |           |  |          |          |   |
| | | ₱45,320  |  | ₱18,450  |  |    14     |  | ₱89,200  |          |   |
| | |          |  |  (40.7%) |  |           |  |          |          |   |
| | | ▲ +12%   |  | ▲ +8%    |  | ▼ -2      |  | ▲ +5%    |          |   |
| | | vs yest. |  | vs yest. |  | vs yest.  |  | vs yest. |          |   |
| | +----------+  +----------+  +-----------+  +----------+          |   |
| +-------------------------------------------------------------------+   |
|                                                                         |
| +---REVENUE TREND (Line Chart)-------------------------------------+    |
| |                                                                  |    |
| |  ₱80k ┤                                                          |    |
| |       │                              ╭──╮                        |    |
| |  ₱60k ┤                         ╭────╯  ╰─╮                     |    |
| |       │                    ╭────╯         ╰╮                    |    |
| |  ₱40k ┤               ╭────╯               ╰──╮                 |    |
| |       │          ╭────╯                       ╰───╮             |    |
| |  ₱20k ┤     ╭────╯                                ╰─────────    |    |
| |       ├─────┴─────┴─────┴─────┴─────┴─────┴─────┴──────────    |    |
| |       Mon  Tue  Wed  Thu  Fri  Sat  Sun  Mon  Tue  Wed  Thu    |    |
| |                                                                  |    |
| |  Legend: ── Revenue (₱)  ·· Profit (₱)                          |    |
| +------------------------------------------------------------------+    |
|                                                                         |
| +---TWO-COLUMN SECTION--------------------------------------------+     |
| | +---LEFT: TOP SERVICES (50%)---+  +---RIGHT: AR/AP (50%)---+   |     |
| | |                               |  |                         |   |     |
| | | SERVICE MIX (This Month)      |  | ACCOUNTS RECEIVABLE     |   |     |
| | | ┌───────────────────────────┐ |  | ┌─────────────────────┐ |   |     |
| | | │ Oil Change       35% █████ │ |  | │ Current:    ₱25,000 │ |   |     |
| | | │ Brake Service    22% ███   │ |  | │ 1-30 days:  ₱12,000 │ |   |     |
| | | │ Tire Rotation    15% ██    │ |  | │ 31-60 days: ₱8,500  │ |   |     |
| | | │ Engine Repair    12% ██    │ |  | │ 60+ days:   ₱3,200  │ |   |     |
| | | │ AC Service       10% █     │ |  | │                     │ |   |     |
| | | │ Other             6% █     │ |  | │ Total AR:   ₱48,700 │ |   |     |
| | | └───────────────────────────┘ |  | └─────────────────────┘ |   |     |
| | |                               |  |                         |   |     |
| | | Revenue: ₱850,200 (MTD)       |  | ACCOUNTS PAYABLE        |   |     |
| | | Jobs: 142 completed           |  | ┌─────────────────────┐ |   |     |
| | |                               |  | │ Due today:  ₱15,000 │ |   |     |
| | | [View Detailed Report]        |  | │ This week:  ₱42,000 │ |   |     |
| | +-------------------------------+  | │ This month: ₱85,500 │ |   |     |
| |                                    | │                     │ |   |     |
| |                                    | │ Total AP:   ₱85,500 │ |   |     |
| |                                    | └─────────────────────┘ |   |     |
| |                                    |                         |   |     |
| |                                    | ⚠️ 3 overdue invoices   |   |     |
| |                                    | [View AP Aging]         |   |     |
| |                                    +-------------------------+   |     |
| +----------------------------------------------------------------+     |
|                                                                        |
| +---THREE-COLUMN SECTION--------------------------------------------+  |
| | +--OPERATIONS (33%)--+  +--CUSTOMER (33%)--+  +--INVENTORY--+   |  |
| | |                    |  |                   |  | (33%)       |   |  |
| | | JOBS BY STATUS     |  | SATISFACTION      |  |             |   |  |
| | | ┌────────────────┐ |  | ┌───────────────┐ |  | LOW STOCK   |   |  |
| | | │ Checked In:  3 │ |  | │ CSAT: 4.7/5.0 │ |  | ⚠️ 8 items  |   |  |
| | | │ In Progress: 8 │ |  | │ ★★★★★ (85%)   │ |  |             |   |  |
| | | │ QC Check:    2 │ |  | │ ★★★★☆ (12%)   │ |  | ┌─────────┐ |   |  |
| | | │ Ready:       3 │ |  | │ ★★★☆☆ (3%)    │ |  | │ Brake   │ |   |  |
| | | │ On Hold:     2 │ |  | │               │ |  | │ pads    │ |   |  |
| | | └────────────────┘ |  | │ NPS: 67       │ |  | │ Oil 5W  │ |   |  |
| | |                    |  | │ Responses: 42 │ |  | │ Filter  │ |   |  |
| | | AVG TURNAROUND     |  | │               │ |  | │ Coolant │ |   |  |
| | | 1.8 days           |  | │ 2 complaints  │ |  | │ ...     │ |   |  |
| | | (Target: 1.5 days) |  | │ open          │ |  | └─────────┘ |   |  |
| | |                    |  | └───────────────┘ |  |             |   |  |
| | | BAY UTILIZATION    |  |                   |  | STOCK VALUE |   |  |
| | | 78% (Target: 80%)  |  | TOP CUSTOMERS MTD |  | ₱245,800    |   |  |
| | |                    |  | 1. Fleet Corp ₱85k|  |             |   |  |
| | | [View Job Board]   |  | 2. Juan Cruz ₱22k |  | PENDING PO  |   |  |
| | +--------------------+  | 3. Maria San ₱18k |  | 5 orders    |   |  |
| |                        | [View Customers]  |  | ₱128,500    |   |  |
| |                        +-------------------+  +-------------+   |  |
| +----------------------------------------------------------------+  |
|                                                                     |
| +---ALERTS AND NOTIFICATIONS--------------------------------------+ |
| | ⚠️ 3 jobs behind schedule                     [View]           | |
| | ℹ️ Payroll run due Friday                     [Review]         | |
| | ⚠️ 8 low-stock items need reorder             [Order]          | |
| | ✅ Daily backup completed                                       | |
| +-------------------------------------------------------------------+
+-------------------------------------------------------------------------+
```

---

## Date Range Selector (Dropdown)

```
┌─────────────────────┐
│ ● Today             │
│ ○ Yesterday         │
│ ○ This Week         │
│ ○ This Month        │
│ ○ Last Month        │
│ ○ This Quarter      │
│ ○ This Year         │
│ ○ Custom Range...   │
└─────────────────────┘
```

---

## Mobile View (< 768px)

Stacked single column:
```
+---------------------------+
| [Date: Today ▼]           |
+---------------------------+
| REVENUE TODAY             |
| ₱45,320 (▲ +12%)          |
+---------------------------+
| PROFIT TODAY              |
| ₱18,450 (40.7%)           |
+---------------------------+
| JOBS IN SHOP              |
| 14 (▼ -2)                 |
+---------------------------+
| CASH POSITION             |
| ₱89,200 (▲ +5%)           |
+---------------------------+
| [Revenue Chart]           |
| (Simplified line)         |
+---------------------------+
| OPERATIONS                |
| [Collapsed by default]    |
| [Tap to expand]           |
+---------------------------+
| CUSTOMER                  |
| [Collapsed]               |
+---------------------------+
| INVENTORY                 |
| [Collapsed]               |
+---------------------------+
| ALERTS (2)                |
| [Badge shows count]       |
+---------------------------+
```

---

## Drill-Down Interactions

**Click any metric card:**
- Revenue → Sales detail report
- Profit → Profitability analysis
- Jobs in Shop → Job board
- Cash Position → Cash flow statement

**Click chart data point:**
- Shows tooltip with exact values for that day
- Click again to drill into that day's transactions

**Click service in Service Mix:**
- Opens service-specific revenue and job report

**Click AR/AP sections:**
- Opens aging report with customer/vendor details

**Click alert:**
- Navigates to relevant module or report

---

## States

1. **Loading:** Skeleton cards and charts
2. **Error:** "Failed to load dashboard data. [Retry]"
3. **No data:** "No transactions yet today" with friendly illustration
4. **Refreshing:** Small spinner in corner, data stays visible
5. **Stale data:** Warning banner "Data last updated 15 minutes ago. [Refresh Now]"

---

## Real-Time Updates

- **Auto-refresh:** Every 5 minutes (configurable)
- **Manual refresh:** [Refresh] button or pull-to-refresh on mobile
- **Live updates:** WebSocket for critical metrics (jobs in shop, cash position)

---

## Permission-Based Visibility

**Owner/GM:**
- All metrics visible
- Sees profit margins, cost data
- Can export all reports

**Service Advisor:**
- Sees: Revenue (not profit/margin), Jobs, Customer satisfaction
- Cannot see: Cash position, AR/AP details, inventory cost
- Limited exports

**Shop Manager:**
- Sees: Operations, Bay utilization, Jobs, Customer
- Cannot see: Financial details (revenue, profit, AR/AP)
- Can see inventory quantities but not values

---

## Export Options

[Export] dropdown:
```
┌────────────────────┐
│ PDF Report         │
│ Excel Spreadsheet  │
│ CSV Data           │
│ Email Report...    │
│ Schedule Report... │
└────────────────────┘
```

---

## Alerts Configuration

Thresholds set in Module K (Administration):
- Revenue below target (%)
- Jobs behind schedule (count)
- Low stock (item count)
- AR aging > 60 days (amount)
- AP overdue (count)
- CSAT below threshold
- No-show rate above threshold

---

## Performance

- **Initial load:** < 2s for dashboard render
- **Chart rendering:** < 500ms
- **Data refresh:** < 1s
- **Large date ranges:** Show loading indicator, paginate if needed

---

## Accessibility

- All charts have data tables alternative (screen reader accessible)
- High contrast mode for charts
- Color not sole indicator (patterns, labels, icons)
- Keyboard navigation: Tab through sections, Enter to drill down
- ARIA labels for metrics, trends (e.g., "Revenue up 12% compared to yesterday")

---

**Notes:**
- All monetary values formatted with platform money utility
- Percentages shown to 1 decimal place
- Trends use yesterday/last week/last month as comparison
- Dashboard adapts to user's role (permission-based filtering)
- "MTD" = Month to Date, "YTD" = Year to Date
