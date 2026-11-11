# Wireframe: Service Order Detail (Module C)

**Screen ID:** C-S02  
**Device Profile:** Desktop (primary), Tablet (secondary for technician view)  
**User Roles:** All roles (with different permissions)  
**Purpose:** Complete view of a service order from check-in to release

---

## Layout Structure

```
+------------------------------------------------------------------------------+
| [← Back to Job Board]                                    [Actions ▼] [Print] |
+------------------------------------------------------------------------------+
| 🔵 IN PROGRESS      JOB-2024-11-001                        [Edit] [Timeline] |
+------------------------------------------------------------------------------+
| CUSTOMER & VEHICLE                                                           |
+------------------------------------------------------------------------------+
| Juan dela Cruz (VIP) ★★★★★              [Contact] [History]                 |
| 📞 0917-123-4567  ✉️ juan@email.com                                          |
| 2020 Toyota Vios 1.3 E MT White                                              |
| Plate: ABC 123  |  Odo: 45,280 km  |  VIN: 1234567890ABCDEFGH               |
+------------------------------------------------------------------------------+
| INSPECTION (2024-11-10 09:15 by JD)                          [📷 Photos (8)] |
+------------------------------------------------------------------------------+
| Fuel: ¾ tank  |  Exterior: Minor scratches (door)  |  Personal items: None  |
|                                                                              |
| ✅ Tire condition       ⚠️ Brake pads (thin)      ❌ Oil leak (engine)       |
| ✅ Lights functional    ✅ Wipers OK              ⚠️ Battery (low voltage)    |
| ✅ Air filter clean     ❌ Coolant (low level)    ✅ Belts OK                |
|                                                                              |
| Customer Complaints:                                                         |
| "Engine overheating on highway. Strange noise from engine bay. Check engine |
| light is on."                                                                |
+------------------------------------------------------------------------------+
| DIAGNOSIS & RECOMMENDED WORK                                                 |
+------------------------------------------------------------------------------+
| By: Tech Juan Reyes (JR) | Date: 2024-11-10 10:30                           |
|                                                                              |
| 🔴 URGENT:  Radiator hose cracked, coolant leak. Replace immediately.       |
| 🟡 SOON:    Brake pads 20% remaining. Recommend replacement.                |
| 🟢 ADVISED: Battery 3 years old, voltage low. Monitor or replace.           |
|                                                                              |
| [+ Add Finding]                                                              |
+------------------------------------------------------------------------------+
| ESTIMATE v2 (Latest)                                    [View v1] [New Ver.] |
+------------------------------------------------------------------------------+
| Line | Description              | Qty | Unit Price | Subtotal  | Approved     |
|------|--------------------------|-----|------------|-----------|--------------|
| 1    | Radiator hose (upper)    | 1   | ₱850.00    | ₱850.00   | ✅ Customer  |
| 2    | Coolant (1L)             | 2   | ₱420.00    | ₱840.00   | ✅ Customer  |
| 3    | Labor: Radiator repair   | 1   | ₱600.00    | ₱600.00   | ✅ Customer  |
| 4    | Brake pads (front set)   | 1   | ₱1,800.00  | ₱1,800.00 | ❌ Declined  |
| 5    | Labor: Brake pad repl.   | 1   | ₱800.00    | ₱800.00   | ❌ Declined  |
| 6    | Diagnostic fee           | 1   | ₱500.00    | ₱500.00   | ✅ Customer  |
|                                                                              |
|                                              Subtotal:   ₱5,390.00           |
|                                              VAT (12%):  ₱646.80            |
|                                              TOTAL:      ₱6,036.80           |
|                                              Approved:   ₱2,790.00           |
+------------------------------------------------------------------------------+
| Approval: ✅ Customer approved via SMS 2024-11-10 11:15 (Signature on file) |
| [Request Additional Approval]  [Send Estimate]                              |
+------------------------------------------------------------------------------+
| PARTS REQUISITION                                                            |
+------------------------------------------------------------------------------+
| Status: ✅ All parts issued                                                  |
|                                                                              |
| Part                  | Req. | Issued | Issued By | Date/Time              |
|-----------------------|------|--------|-----------|------------------------|
| Radiator hose (upper) | 1    | 1      | PC (Jose) | 2024-11-10 11:30       |
| Coolant 1L            | 2    | 2      | PC (Jose) | 2024-11-10 11:30       |
+------------------------------------------------------------------------------+
| LABOR LOG                                                                    |
+------------------------------------------------------------------------------+
| Technician: Juan Reyes (JR)                        Bay: Bay 1                |
|                                                                              |
| Start          | End            | Duration | Activity              | Status |
|----------------|----------------|----------|-----------------------|--------|
| 10:00 AM       | 10:45 AM       | 0:45     | Diagnosis             | ✅     |
| 11:45 AM       | In Progress... | 1:15     | Radiator hose replace | 🔵     |
|                                                                              |
| Total logged: 2:00h  |  Estimated: 1.5h  |  Efficiency: 75% (over)          |
|                                                                              |
| [Start Timer] [Pause] [Add Entry]                                           |
+------------------------------------------------------------------------------+
| ADDITIONAL FINDINGS (Mid-Service)                                            |
+------------------------------------------------------------------------------+
| None yet. [+ Add Finding]                                                    |
+------------------------------------------------------------------------------+
| QUALITY CHECK                                         [QC Checklist]         |
+------------------------------------------------------------------------------+
| Status: Pending (Tech has not marked complete)                               |
|                                                                              |
| When tech marks complete, QC checklist will appear here for Supervisor sign-|
| off.                                                                         |
+------------------------------------------------------------------------------+
| NOTES & TIMELINE                                           [Add Note]        |
+------------------------------------------------------------------------------+
| [2024-11-10 09:15] Check-in by Jane Doe (JD)                                |
| [2024-11-10 10:00] Assigned to Juan Reyes (JR), Bay 1                       |
| [2024-11-10 10:30] Diagnosis complete, estimate created                     |
| [2024-11-10 10:45] Estimate v1 sent to customer                             |
| [2024-11-10 11:00] Customer requested brake pads removed from estimate      |
| [2024-11-10 11:05] Estimate v2 created (brake work removed)                 |
| [2024-11-10 11:15] Customer approved estimate v2 via SMS                    |
| [2024-11-10 11:30] Parts issued by Parts Clerk (PC)                         |
| [2024-11-10 11:45] Work started                                             |
+------------------------------------------------------------------------------+
```

---

## Right Sidebar (Actions Panel)

```
+----------------------------------+
| ACTIONS                          |
+----------------------------------+
| Status: 🔵 IN PROGRESS           |
|                                  |
| [Move to QC Check]               |
| (Available when tech marks done) |
|                                  |
| [Put On Hold]                    |
| [Cancel Job]                     |
+----------------------------------+
| PEOPLE                           |
+----------------------------------+
| Advisor: Jane Doe (JD)           |
| Technician: Juan Reyes (JR)      |
| [Reassign]                       |
+----------------------------------+
| SCHEDULE                         |
+----------------------------------+
| Promised: 2024-11-11 16:00       |
| Elapsed: 1d 3h 15m               |
| ⚠️ Behind schedule by 5h         |
| [Adjust Promised Time]           |
+----------------------------------+
| DOCUMENTS                        |
+----------------------------------+
| [Print Job Card]                 |
| [Print Estimate]                 |
| [Email to Customer]              |
| [SMS Status Update]              |
+----------------------------------+
| WARRANTY                         |
+----------------------------------+
| Warranty: 90 days / 5,000 km     |
| (Configurable in settings)       |
| [ ] Mark as Comeback             |
+----------------------------------+
```

---

## States

1. **Checked In:** Inspection visible, no diagnosis yet
2. **Awaiting Estimate:** Diagnosis visible, estimate in progress
3. **Awaiting Approval:** Estimate sent, approval status shown
4. **Awaiting Parts:** Parts requisition visible, some not issued
5. **In Progress:** Labor log active, timer running
6. **Quality Check:** QC checklist shown, supervisor can approve/reject
7. **Ready for Release:** All work done, invoice button shown
8. **Released:** Read-only, "Released on [date]" badge
9. **On Hold:** Yellow banner "Job on hold: [reason]"
10. **Cancelled:** Red banner "Job cancelled: [reason]"

---

## Permission-Based Views

**Technician:**
- See assigned jobs only
- Can: Add findings, log labor, request parts, mark complete
- Cannot: See cost/margin, edit estimate, change assignment

**Service Advisor:**
- See all jobs
- Can: Create estimates, get approvals, reassign, move statuses
- Cannot: See detailed cost/margin

**Cashier:**
- View-only
- Can: See job to prepare invoice (E)
- Cannot: Edit anything in C

**Owner/GM:**
- Full view including cost/margin
- Can: Override anything
- Sees "Margin: ₱X,XXX (XX%)" in estimate section

---

## Responsive (Tablet - Technician View)

Simplified for tablet (C-S03):
```
+--------------------------------------+
| JOB-2024-11-001  🔵 IN PROGRESS      |
+--------------------------------------+
| ABC 123 | Juan dela Cruz              |
| 2020 Toyota Vios 1.3 E               |
+--------------------------------------+
| COMPLAINT                            |
| Engine overheating, noise            |
+--------------------------------------+
| MY TASKS                             |
| ✅ Diagnosis                         |
| 🔵 Replace radiator hose (in prog.) |
|    [Parts Ready] [Start Timer]      |
|    Timer: 1:15:32 [Pause] [Done]    |
+--------------------------------------+
| [+ Add Finding]                      |
| [📷 Add Photo]                       |
| [Mark Job Complete]                  |
+--------------------------------------+
```

---

## Accessibility

- All sections collapsible for screen readers
- Status announced on change
- Form fields labeled properly
- Color not sole indicator (icons + text + color)

---

**Notes:**
- Estimate v1 vs v2 indicates versioning (immutable estimates)
- Approval log shows who approved what, when, how (SMS, signature, verbal)
- Labor timer is per-job, not per-task (simplified)
- All monetary amounts formatted with platform money utility
