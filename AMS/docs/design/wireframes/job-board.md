# Wireframe: Job Board (Module C)

**Screen ID:** C-S01  
**Device Profile:** Desktop (primary), Tablet (secondary)  
**User Roles:** Service Advisor, Shop Supervisor, Owner/GM  
**Purpose:** Real-time view of all active service orders by status

---

## Layout Structure

```
+------------------------------------------------------------------+
| [App Header: Logo | Navigation | User Menu]                      |
+------------------------------------------------------------------+
| Job Board                                      [+ New Job] [⚙️]  |
+------------------------------------------------------------------+
| [🔍 Search: plate, customer, VIN]  [Filter ▼]  [View: Kanban ▼] |
+------------------------------------------------------------------+
|                                                                   |
| CHECKED IN     | AWAITING EST. | AWAITING APPR | AWAITING PARTS |
| (3)            | (2)           | (5)           | (1)            |
+----------------+---------------+---------------+----------------+
| [Card]         | [Card]        | [Card]        | [Card]         |
| Plate: ABC123  | XYZ789        | DEF456        | GHI789         |
| Customer: Juan | Maria Santos  | Pedro Cruz    | Ana Reyes      |
| Bay: 1         | Est: ₱5,200   | Est: ₱12,000  | Parts pending  |
| Time: 1.5h     | Sent: 30m ago | ⚠️ 2 days    | Bay: 3         |
| Advisor: JD    |               | Advisor: MS   | Tech: TC       |
| [View]         | [View]        | [View]        | [View]         |
+----------------+---------------+---------------+----------------+
|                                                                  |
| IN PROGRESS    | QC CHECK      | READY         | RELEASED       |
| (8)            | (2)           | (3)           | (12 today)     |
+----------------+---------------+---------------+----------------+
| [Card]         | [Card]        | [Card]        | [Collapsed]    |
| MNO321         | PQR654        | STU987        | [Expand ▼]     |
| Jose Lim       | Tech: AR      | Completed     |                |
| Bay: 2         | QC: pending   | Awaiting      |                |
| Tech: AR       | ⏱️ 15m       | pickup        |                |
| Time: 3.2h/4h  |               | Customer      |                |
| Progress: 80%  |               | notified      |                |
| [View]         | [View]        | [View]        |                |
+----------------+---------------+---------------+----------------+
|                                                                  |
| ON HOLD (4)                    CANCELLED (2 today)              |
+--------------------------------+---------------------------------+
| [List view - collapsed by default, expandable]                  |
+------------------------------------------------------------------+
```

---

## Card Details (Hover/Click)

```
+----------------------------------------+
| JOB-2024-11-001        [Edit] [×]      |
+----------------------------------------+
| Plate: ABC 123                         |
| Customer: Juan dela Cruz               |
| Vehicle: 2020 Toyota Vios 1.3 E        |
| Status: 🟡 Awaiting Approval           |
| Bay: Bay 1 (Reserved)                  |
| Technician: Juan Reyes (JR)            |
| Service Advisor: Jane Doe (JD)         |
+----------------------------------------+
| Complaint: Engine noise, overheating   |
| Estimate: ₱12,450.00                   |
| Sent: 2024-11-10 14:30                 |
| Promised: 2024-11-11 16:00             |
| Elapsed: 1d 3h (⚠️ Behind schedule)    |
+----------------------------------------+
| [View Full Details] [Send Reminder]    |
+----------------------------------------+
```

---

## States to Handle

1. **Loading:** Skeleton cards in each column
2. **Empty:** "No jobs in this status" with illustration
3. **Error:** "Failed to load jobs. [Retry]"
4. **Search active:** Highlight matching cards, dim others
5. **Filter active:** Show active filters as tags above columns
6. **Overdue jobs:** Red border, warning icon
7. **Parts-blocked:** Yellow indicator, "Parts pending" label
8. **No permission:** Whole screen shows "Access denied"

---

## Interactions

- **Drag and drop:** Cards can be dragged between adjacent statuses (business rules enforce valid transitions)
- **Click card:** Opens service order detail (C-S02)
- **[+ New Job]:** Opens service order creation form
- **[⚙️] Settings:** Configure view (show/hide columns, card details density)
- **Filter dropdown:** By advisor, technician, bay, date range, overdue only
- **View dropdown:** Switch between Kanban (default), List, Calendar

---

## Responsive Behavior

**Tablet (768px-1023px):**
- 2 columns at a time, horizontal scroll
- Larger touch targets (48x48px min)
- Simplified card details (fewer fields)

**Mobile (< 768px):**
- List view only (Kanban not practical)
- One card per row
- Swipe actions (left: view, right: call customer)

---

## Real-Time Updates

- **WebSocket or polling:** New jobs appear automatically
- **Status changes:** Cards animate to new column
- **Notifications:** Toast for "New job assigned to you"

---

## Performance

- **Initial load:** All active jobs (target < 2s for 50 jobs)
- **Lazy load:** Released/Cancelled expand on demand
- **Virtual scrolling:** If columns exceed viewport height

---

## Accessibility

- Semantic HTML: `<main>`, `<section>`, `<article>` for cards
- Keyboard navigation: Tab through cards, Enter to open, arrow keys to move between columns
- Screen reader: Announce column name, card count, job details
- Focus indicator: Visible outline on active card

---

**Notes:**
- Status colors use semantic tokens (success, warning, danger, info)
- All times in shop timezone (Asia/Manila)
- Elapsed time auto-updates every minute
- Overdue threshold: Promised time + 1 hour grace period
