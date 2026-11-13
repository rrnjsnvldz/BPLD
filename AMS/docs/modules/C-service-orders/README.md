# Module C: Service Order and Job Management

**Status:** Not Started (Phase 3)  
**Dependencies:** Module A (customer/vehicle), Module B (appointment conversion optional)  
**Provides To:** Modules D (parts requests), E (invoicing), F (payroll)

---

## Purpose

Module C is the **operational core** — every vehicle in the shop is tracked through an 18-state pipeline from check-in to release.

---

## Database Tables (8)

- `c_service_orders` — Job master record
- `c_job_items` — Labor, parts, sublet line items
- `c_estimates` — Versioned estimates with approvals
- `c_work_logs` — Time clock entries
- `c_inspection_items` — Inspection checklist results
- `c_parts_requests` — Parts requisition from inventory
- `c_approval_logs` — Immutable approval trail
- `c_qc_checklists` — Quality control results

---

## Key Features

- 18-state pipeline (checked-in → closed)
- Digital inspection checklist
- Estimate builder with approvals
- Time clock (technician clock in/out)
- Parts requisition (integrates with Module D)
- QC checklist
- Warranty tracking
- Comeback tracking
- Convert to invoice (integrates with Module E)
- Job board (Kanban view)
- Technician tablet view

---

## Status Pipeline

```
CHECKED_IN → AWAITING_ESTIMATE → AWAITING_APPROVAL → AWAITING_PARTS → IN_PROGRESS → QUALITY_CHECK → READY_FOR_RELEASE → RELEASED → CLOSED
```

Also: ON_HOLD, CANCELLED (terminal states)

---

## Integration

**Consumes from A:** Customer/vehicle lookup  
**Consumes from B:** Appointment conversion (optional)  
**Provides to D:** Parts requests (stub → live in Phase 3)  
**Provides to E:** Invoice conversion (stub → live in Phase 4)  
**Provides to F:** Work logs for payroll

---

**Module C is the operational heart. Every job flows through here.**
