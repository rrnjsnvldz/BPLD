# Module C: Service Order and Job Management — Technical Specification

**Version:** 1.0  
**Status:** Phase 3 Module — Not Started  
**Last Updated:** 2026-11-10

---

## Overview

Module C is the **operational core** of AMS. Every vehicle in the shop is tracked as a service order through an 18-state pipeline from check-in to release.

---

## Service Order Status Pipeline (18 States)

```
CHECKED_IN → AWAITING_ESTIMATE
AWAITING_ESTIMATE → AWAITING_APPROVAL | ON_HOLD
AWAITING_APPROVAL → AWAITING_PARTS | IN_PROGRESS | ON_HOLD | CANCELLED
AWAITING_PARTS → IN_PROGRESS | ON_HOLD
IN_PROGRESS → QUALITY_CHECK | ON_HOLD | AWAITING_PARTS
QUALITY_CHECK → IN_PROGRESS (rework) | READY_FOR_RELEASE
READY_FOR_RELEASE → RELEASED
RELEASED → CLOSED
ON_HOLD → (previous state) | CANCELLED
CANCELLED → (terminal)
CLOSED → (terminal)
```

---

## Database Tables (8)

```sql
c_service_orders (
  id, appointment_id FK (nullable), customer_id FK, vehicle_id FK,
  order_number (from K sequence), status, intake_odometer_km,
  promised_at, bay_id FK (nullable), primary_technician_id FK,
  complaint_description, diagnosis_notes, internal_notes,
  is_warranty, warranty_reference, is_comeback, original_order_id FK (self),
  created_at, created_by, updated_at
)

c_job_items (
  id, service_order_id FK, item_type (labor|part|sublet|fee),
  description, quantity, unit_price_centavos, discount_centavos,
  tax_rate, line_total_centavos, part_id FK (nullable),
  technician_id FK (nullable), sort_order, created_at
)

c_estimates (
  id, service_order_id FK, version, subtotal_centavos,
  discount_centavos, tax_centavos, total_centavos, notes,
  status (draft|sent|approved|rejected), approved_at,
  approval_method (digital|sms|verbal), approved_by_name,
  approval_notes, created_at, created_by
)

c_work_logs (
  id, service_order_id FK, technician_id FK,
  clock_in_at, clock_out_at, duration_minutes, notes, created_at
)

c_inspection_items (
  id, service_order_id FK, category, item_name,
  result (pass|attention|fail), technician_notes, photo_path, sort_order
)

c_parts_requests (
  id, service_order_id FK, item_id FK (nullable), part_description,
  quantity_requested, quantity_issued, status (pending|issued|cancelled),
  requested_by, issued_by, requested_at, issued_at
)

c_approval_logs (
  id, service_order_id FK, approval_type (estimate|additional_work|release),
  approved_by_user_id FK, approved_at, notes, is_immutable boolean DEFAULT true
)

c_qc_checklists (
  id, service_order_id FK, inspector_id FK, items jsonb,
  result (pass|fail), rework_reason, inspected_at
)
```

---

## API Contracts

```typescript
// Service Order CRUD
createServiceOrder(data: CreateServiceOrderInput): Promise<ApiResponse<ServiceOrder>>
getServiceOrders(filter: ServiceOrderFilter): Promise<ApiResponse<ServiceOrder[]>>
getServiceOrderById(id: string): Promise<ApiResponse<ServiceOrderDetail>>
updateServiceOrder(id: string, data: UpdateServiceOrderInput): Promise<ApiResponse<ServiceOrder>>
transitionStatus(id: string, newStatus: ServiceOrderStatus, notes?: string): Promise<ApiResponse<ServiceOrder>>

// Job Items (Estimate)
addJobItem(orderId: string, item: JobItemInput): Promise<ApiResponse<JobItem>>
updateJobItem(itemId: string, data: Partial<JobItemInput>): Promise<ApiResponse<JobItem>>
removeJobItem(itemId: string): Promise<ApiResponse<void>>
getEstimateTotals(orderId: string): Promise<ApiResponse<EstimateTotals>>

// Approvals
recordApproval(orderId: string, type: ApprovalType, data: ApprovalInput): Promise<ApiResponse<ApprovalLog>>

// Work Logs (Time Clock)
clockIn(orderId: string, technicianId: string): Promise<ApiResponse<WorkLog>>
clockOut(workLogId: string): Promise<ApiResponse<WorkLog>>
getTimeLogs(orderId: string): Promise<ApiResponse<WorkLog[]>>

// Parts Requests (stub in Phase 2, wire in Phase 3 when D ready)
requestPart(orderId: string, data: PartsRequestInput): Promise<ApiResponse<PartsRequest>>

// Job Board
getJobBoard(): Promise<ApiResponse<JobBoardData>>

// Convert to Invoice (stub in Phase 2, wire in Phase 4 when E ready)
convertToInvoice(orderId: string): Promise<ApiResponse<{ invoiceId: string }>>
```

---

## UI Screens

- `/jobs` — Job board (Kanban by status, filterable)
- `/jobs/new` — New service order (walk-in or from appointment)
- `/jobs/[id]` — Service order detail: inspection, estimate, parts, time logs, approval log
- `/jobs/[id]/inspect` — Inspection checklist form
- `/jobs/[id]/estimate` — Estimate builder
- `/jobs/[id]/release` — Release checklist
- `/jobs/technician` — Simplified technician tablet view

---

## Integration Points

**Consumes from A:** `getCustomerById`, `getVehicleById`  
**Consumes from B:** Appointment data for conversion  
**Provides to D (stub → live):** `requestPart` creates parts request D fulfills  
**Provides to E (stub → live):** `convertToInvoice` creates invoice in E  
**Provides to F:** Work logs used by payroll for labor hours

---

**Module C is the operational heart. Get this right and the shop runs smoothly.**
