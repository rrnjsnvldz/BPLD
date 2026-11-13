# AMS Parallel Development Order

**Version:** 1.0  
**Last Updated:** 2026-11-10  
**Purpose:** Define the sequence, dependencies, and parallel work tracks for building all 11 AMS modules

---

## Dependency Graph

```
K (foundation) ──→ A ──→ B ──→ C ──→ E
                    └──→ C ──→ E
                              ↑
                   D ─────────┘
```

**Module Dependencies:**

- **K (Administration):** No dependencies — foundational
- **A (Customers & Vehicles):** Depends only on K
- **B (Scheduling):** Depends on A (customer/vehicle data) and K
- **C (Service Orders):** Depends on A and K; optionally consumes B (appointment conversion)
- **D (Inventory):** No dependencies — only K for auth
- **E (POS & Billing):** Depends on C (service orders), D (parts pricing), A (customer), K

**Parallel Work Tracks:**

- **Track 1:** K → A → B → C (sequential path)
- **Track 2:** D (can start immediately, parallel to all)
- **Track 3:** E (waits for C and D to be ready)

---

## Phase 1: Weeks 3-4 — Foundation & Master Data

**Goal:** Module K complete (100%), Module A APIs stable (100%)

| Task | Developer | Timeline | Dependencies |
|------|-----------|----------|--------------|
| K: Complete settings pages, audit log viewer, profile editing, sequences | Dev 1 | Week 3 | None |
| K: Notification templates, approval workflows, 2FA (optional) | Dev 1 | Week 4 | None |
| A: Database migration, server actions (all APIs) | Dev 2 | Week 3 | K auth APIs |
| A: Customer/Vehicle UI (list, create, detail, edit) | Dev 3 | Week 3-4 | A backend APIs |
| A: Duplicate detection, merge, transfer, attachments | Dev 3 | Week 4 | A backend APIs |

**Phase 1 Gate:** 
- ✅ Module K signed off (all features working, audit log immutable, sequences atomic)
- ✅ Module A CRUD working (create, read, update, archive)
- ✅ Search by plate working
- ✅ Duplicate detection working
- ✅ Attachment upload/download working

**Deliverables:**
- All Module K database tables created and seeded
- All Module A database tables created
- User can login, manage users, view audit log
- User can create customer, add vehicle, search by plate, upload OR/CR

---

## Phase 2: Weeks 5-6 — Scheduling

**Goal:** Module B complete (100%)

| Task | Developer | Timeline | Dependencies |
|------|-----------|----------|--------------|
| B: Database migration + server actions (backend) | Dev 2 | Week 5 | A APIs (customer/vehicle lookup) |
| B: Calendar UI + appointment form | Dev 3 | Week 5-6 | B backend APIs |
| B: Bay board + waitlist | Dev 1 | Week 6 | B backend APIs |

**Prerequisite:** Module A `getCustomerById`, `getVehiclesByCustomer`, `searchByPlate` must be stable and tested.

**Phase 2 Gate:**
- ✅ Book appointment → receive confirmation SMS → convert to service order stub
- ✅ Attempt double-book → system rejects with conflict message
- ✅ Today's schedule view shows all appointments
- ✅ Bay board shows live status

**Deliverables:**
- All Module B database tables created
- Appointment booking working end-to-end
- Calendar views functional
- Appointment conversion creates stub service order in Module C

---

## Phase 3: Weeks 7-9 — Core Operations (C + D in Parallel)

**Goal:** Modules C and D complete (100%), integrated

| Task | Developer | Timeline | Dependencies |
|------|-----------|----------|--------------|
| **Module C (Service Orders)** | | | |
| C: Database migration + status machine + server actions | Dev 1 | Week 7 | A APIs |
| C: Job board UI + service order detail | Dev 2 | Week 7-8 | C backend APIs |
| C: Estimate builder + approval workflow | Dev 1 | Week 8 | C backend APIs |
| C: Technician tablet view + time clock | Dev 2 | Week 9 | C backend APIs |
| C-D integration: Wire parts requests | Dev 1 + Dev 3 | Week 9 | C and D both ready |
| **Module D (Inventory)** | | | |
| D: Database migration + server actions (backend) | Dev 3 | Week 7 | K auth only |
| D: Parts catalog UI + item CRUD | Dev 3 | Week 7-8 | D backend APIs |
| D: PO workflow + goods receipt | Dev 3 | Week 8-9 | D backend APIs |
| D: Stock count + low stock alerts | Dev 3 | Week 9 | D backend APIs |

**Development Strategy:**

C and D develop in parallel. The C-D integration uses a **stub pattern** during Phase 3:

- **Stub in C:** Module C writes a `c_parts_requests` record when technician requests parts
- **Stub in D:** Module D reads `c_parts_requests` table and allows parts clerk to fulfill
- **Wire in Week 9:** Connect C and D with real-time updates and stock deduction

**Phase 3 Gate:**
- ✅ Full service order lifecycle from check-in to release working
- ✅ Estimate created, sent, approved by customer
- ✅ Technician clocks in/out, time logged
- ✅ Parts requested (from C) → fulfilled (from D) → stock balance updated
- ✅ QC checklist passed, vehicle released
- ✅ Invoice stub created (for Phase 4)

**Deliverables:**
- All Module C and D database tables created
- Service order 18-state pipeline operational
- Parts catalog with barcode scanning
- Purchase orders and goods receipt
- C-D integration wired and tested

---

## Phase 4: Weeks 10-12 — Billing & Integration

**Goal:** Module E complete (100%), all integrations wired, E2E flow tested

| Task | Developer | Timeline | Dependencies |
|------|-----------|----------|--------------|
| E: Database migration + server actions (backend) | Dev 1 | Week 10 | C and D APIs |
| E: POS screen + invoice list | Dev 2 | Week 10-11 | E backend APIs |
| E: Cash session + AR aging | Dev 3 | Week 10-11 | E backend APIs |
| Wire C-E integration (invoice from service order) | Dev 1 + Dev 2 | Week 11 | C and E both ready |
| Wire D-E integration (part pricing) | Dev 3 + Dev 1 | Week 11 | D and E both ready |
| Full E2E test: check-in → job → parts → invoice → payment | All | Week 12 | All modules integrated |

**Phase 4 Gate:**
- ✅ Complete cashier workflow: service order → invoice → payment → receipt
- ✅ Split payment working (cash + card)
- ✅ Cash session open → transactions → close → reconcile
- ✅ AR aging report accurate
- ✅ Payment to closed invoice
- ✅ E2E flow: book appointment → check-in → estimate → approve → work → parts → invoice → pay → release

**Deliverables:**
- All Module E database tables created
- POS screen operational
- Invoice from service order working
- Cash session management
- E2E flow fully tested and documented

---

## Parallel Safety Rules

### 1. Database Isolation

**Table Naming:** All tables prefixed with module letter
- Module K: `k_settings`, `k_audit_logs`, `k_document_sequences`, etc.
- Module A: `a_customers`, `a_vehicles`, `a_customer_notes`, etc.
- Module B: `b_appointments`, `b_bays`, `b_bay_assignments`, etc.
- Module C: `c_service_orders`, `c_job_items`, `c_estimates`, etc.
- Module D: `d_categories`, `d_inventory_items`, `d_stock_movements`, etc.
- Module E: `e_invoices`, `e_payments`, `e_cash_sessions`, etc.

**Migration Naming:** `<module-letter>_<NNN>_<description>.sql`

Examples:
- `K_001_add_settings_table.sql`
- `A_001_create_customers_vehicles.sql`
- `B_001_create_appointments.sql`

This ensures migrations can be applied per-module and tracked separately.

### 2. Cross-Module FK Rules

- ✅ **OK:** FK to `auth.users` from any module
- ✅ **OK:** Module B FK to `a_customers`, `a_vehicles` (B depends on A)
- ✅ **OK:** Module C FK to `a_customers`, `a_vehicles`, `b_bays` (nullable)
- ⚠️ **LOOSE:** Module C → Module D: use `reference_id` text (not real FK)
- ⚠️ **LOOSE:** Module D → Module C: same — loose reference_id
- ⚠️ **LOOSE:** Module E → Module C: `service_order_id` is nullable FK (for OTC sales)
- ❌ **NEVER:** Circular FK (A → C → A not allowed)

### 3. Code Isolation

**No Internal Imports:** Modules never import another module's internals.

```typescript
// ❌ FORBIDDEN
import { someInternalFunction } from '@/lib/modules/customers/utils'

// ✅ ALLOWED
import { getCustomerById } from '@/lib/modules/customers/actions'
```

**Event-Driven Integration:** Cross-module reactions use domain events (future enhancement).

**Feature Flags:** Each module has an on/off flag in K settings for staged rollout.

### 4. Stub Pattern for Deferred Integrations

When Module X needs Module Y but Y isn't built yet:

```typescript
// src/lib/modules/service-orders/actions.ts (Module C)
// STUB: replace with real D call when Module D is complete
export async function requestPartStub(orderId: string, data: PartsRequestInput) {
  // Write to c_parts_requests — D will read this table when built
  await db.insert(c_parts_requests).values({
    service_order_id: orderId,
    ...data,
    status: 'pending'
  })
  return { data: { id: 'stub', status: 'pending' as const }, error: null }
}
```

**When Module D is Ready:** Replace stub with real API call that also updates inventory.

### 5. Integration Points Table

| Consumer | Provider | Function | Phase Available | Stub Until |
|----------|----------|----------|-----------------|------------|
| Module B | Module A | `getCustomerById` | Phase 1 (Week 4) | Hardcoded fixture |
| Module B | Module A | `getVehiclesByCustomer` | Phase 1 (Week 4) | Hardcoded fixture |
| Module C | Module A | `getCustomerById` | Phase 1 (Week 4) | Hardcoded fixture |
| Module C | Module A | `getVehicleById` | Phase 1 (Week 4) | Hardcoded fixture |
| Module C | Module D | `issueToJob` | Phase 3 (Week 9) | Write `c_parts_requests` |
| Module E | Module C | `getServiceOrderById` | Phase 3 (Week 9) | Manual invoice creation |
| Module E | Module D | `getItemById` (pricing) | Phase 3 (Week 9) | Manual price entry |

---

## Testing Isolation

### Unit Tests

Each module has its own test file. Mock all external module calls:

```typescript
// In Module B tests: mock Module A calls
jest.mock('@/lib/modules/customers/actions', () => ({
  getCustomerById: jest.fn().mockResolvedValue({
    data: { id: 'cust-1', full_name: 'Test Customer', phone: '09171234567' },
    error: null
  })
}))
```

### Integration Tests

Only run after BOTH modules involved are complete. Live integration tests in `src/__tests__/integration/`.

### Seed Data

Each module has a seed script in `src/lib/modules/<name>/seed.ts` for local development.

**Seed Order:**
1. K (roles, settings)
2. A (customers, vehicles)
3. B (bays, sample appointments)
4. D (categories, suppliers, sample items)
5. C (sample service orders)
6. E (sample invoices)

---

## Git Branch Strategy

```
main            (production, protected)
develop         (integration branch)
feature/mod-k-<feature-name>
feature/mod-a-<feature-name>
feature/mod-b-<feature-name>
feature/mod-c-<feature-name>
feature/mod-d-<feature-name>
feature/mod-e-<feature-name>
```

**PR Checklist Before Merging to `develop`:**

- [ ] Only your module's tables modified in migrations
- [ ] No imports from other module internals
- [ ] Stubs in place for missing dependencies
- [ ] Tests pass for your module
- [ ] No raw design values (use tokens)
- [ ] Design-swap test passes (if UI changes)
- [ ] Audit logging added for all state-changing operations
- [ ] RLS policies active and tested
- [ ] README.md updated with current status

---

## Timeline Summary

| Phase | Weeks | Modules | Gate | Deliverable |
|-------|-------|---------|------|-------------|
| Phase 1 | 3-4 | K, A | Gate 1 | Foundation complete, master data live |
| Phase 2 | 5-6 | B | Gate 2 | Scheduling operational, appointment → service order |
| Phase 3 | 7-9 | C, D | Gate 3 | Service orders + inventory, parts requests wired |
| Phase 4 | 10-12 | E | Gate 4 | Billing complete, E2E flow tested |

**Total:** 12 weeks for core system (Modules K, A, B, C, D, E)

**Deferred to Phase 5-6:** Modules F (Payroll), G (Finance), H (Reminders), I (Follow-Up), J (Reporting)

---

**The foundation (K+A) is rock solid. Build on it one module at a time, and the system stands strong.**
