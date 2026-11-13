# AMS Module Isolation Guide — Rules for Parallel Development

**Version:** 1.0  
**Last Updated:** 2026-11-10  
**Purpose:** Enforce strict module boundaries to enable safe parallel development without conflicts

---

## 1. Database Isolation

### Table Naming Convention

**Rule:** All tables MUST be prefixed with the module letter.

| Module | Prefix | Examples |
|--------|--------|----------|
| K (Administration) | `k_` | `k_settings`, `k_audit_logs`, `k_document_sequences`, `k_approval_rules` |
| A (Customers & Vehicles) | `a_` | `a_customers`, `a_vehicles`, `a_customer_notes`, `a_attachments`, `a_fleet_accounts` |
| B (Scheduling) | `b_` | `b_appointments`, `b_bays`, `b_bay_assignments`, `b_waitlist_entries` |
| C (Service Orders) | `c_` | `c_service_orders`, `c_job_items`, `c_estimates`, `c_work_logs`, `c_inspection_items` |
| D (Inventory) | `d_` | `d_categories`, `d_suppliers`, `d_inventory_items`, `d_stock_movements`, `d_purchase_orders` |
| E (POS & Billing) | `e_` | `e_invoices`, `e_invoice_items`, `e_payments`, `e_cash_sessions`, `e_customer_ledger` |
| Shared/Legacy | none | `user_profiles`, `roles`, `user_roles` (Module K manages these) |

**Exception:** Supabase Auth tables (`auth.users`) have no prefix.

**Why:** Table prefixes prevent naming collisions and make ownership clear at a glance.

---

### Migration Naming Convention

**Format:** `<module-letter>_<NNN>_<description>.sql`

**Examples:**
```
K_001_create_settings_table.sql
K_002_add_audit_logs.sql
A_001_create_customers_vehicles.sql
A_002_add_fleet_accounts.sql
B_001_create_appointments.sql
C_001_create_service_orders.sql
D_001_create_inventory_tables.sql
E_001_create_invoices.sql
```

**Why:** Per-module migration numbers prevent conflicts when multiple developers create migrations simultaneously. Module A's `A_005` and Module B's `B_005` can coexist without collision.

**Tooling:** Use a migration tracker that respects module prefixes and applies migrations in dependency order.

---

### Cross-Module Foreign Key Rules

**Rule:** Understand the difference between **hard FK** (enforced by database) and **loose reference** (text field).

#### ✅ Hard FK — ALLOWED

```sql
-- Module B can FK to Module A (B depends on A)
CREATE TABLE b_appointments (
  customer_id uuid REFERENCES a_customers(id) NOT NULL,
  vehicle_id uuid REFERENCES a_vehicles(id) NOT NULL,
  ...
);

-- Module C can FK to Module A and B
CREATE TABLE c_service_orders (
  customer_id uuid REFERENCES a_customers(id) NOT NULL,
  vehicle_id uuid REFERENCES a_vehicles(id) NOT NULL,
  appointment_id uuid REFERENCES b_appointments(id), -- nullable
  bay_id uuid REFERENCES b_bays(id), -- nullable
  ...
);

-- Any module can FK to auth.users
work_logs (
  technician_id uuid REFERENCES auth.users(id),
  ...
);
```

**Use hard FK when:**
- Dependency is explicit and stable
- Parent record deletion should cascade or block
- Referential integrity is critical

#### ⚠️ Loose Reference — RECOMMENDED for Circular or Deferred Dependencies

```sql
-- Module C → Module D: use loose reference (not hard FK)
CREATE TABLE c_parts_requests (
  service_order_id uuid REFERENCES c_service_orders(id),
  item_id uuid, -- NO FK to d_inventory_items
  part_description text NOT NULL,
  ...
);

-- Module D → Module C: use loose reference
CREATE TABLE d_stock_movements (
  item_id uuid REFERENCES d_inventory_items(id),
  reference_type text, -- 'service_order', 'purchase_order', 'adjustment'
  reference_id text,   -- NO FK, just text UUID
  ...
);

-- Module E → Module C: nullable FK for optional linkage
CREATE TABLE e_invoices (
  service_order_id uuid REFERENCES c_service_orders(id), -- nullable (OTC sales have NULL)
  ...
);
```

**Use loose reference when:**
- Circular dependency exists (C ↔ D)
- One module may not be deployed yet
- Reference is optional or informational only

**Enforcement:** Application code validates loose references. No database-level cascade.

#### ❌ Circular FK — FORBIDDEN

```sql
-- ❌ NEVER DO THIS
-- Module A → Module C → Module A creates a cycle
CREATE TABLE a_customers (
  last_service_order_id uuid REFERENCES c_service_orders(id) -- BAD
);
```

**Why:** Circular FKs create deployment deadlocks and make it impossible to delete test data.

---

## 2. Code Isolation

### Folder Structure

**Strict Module Boundaries:**

```
src/
├── lib/
│   ├── modules/
│   │   ├── admin/              # Module K
│   │   │   ├── actions.ts      # Server actions (public API)
│   │   │   ├── types.ts        # TypeScript types
│   │   │   ├── permissions.ts  # Permission constants
│   │   │   └── utils.ts        # Internal helpers
│   │   ├── customers/          # Module A
│   │   │   ├── actions.ts
│   │   │   ├── types.ts
│   │   │   └── utils.ts        # Duplicate detection, plate validation
│   │   ├── scheduling/         # Module B
│   │   ├── service-orders/     # Module C
│   │   ├── inventory/          # Module D
│   │   └── billing/            # Module E
│   └── platform/               # Shared utilities (no business logic)
│       ├── auth.ts             # requireAuth, getCurrentUser
│       ├── supabase.ts         # Supabase client
│       ├── audit.ts            # logAudit helper
│       ├── error.ts            # Error types
│       └── money.ts            # Centavo math utilities
├── app/
│   ├── (modules)/              # Protected module pages
│   │   ├── admin/              # Module K pages
│   │   ├── customers/          # Module A pages
│   │   ├── appointments/       # Module B pages
│   │   ├── jobs/               # Module C pages
│   │   ├── inventory/          # Module D pages
│   │   └── billing/            # Module E pages
```

**Ownership:**
- Each module owns its own `lib/modules/<name>/` folder
- Each module owns its own `app/(modules)/<name>/` folder
- NO cross-importing between module internals

---

### Import Rules

#### ✅ ALLOWED Imports

```typescript
// 1. Import from platform (shared utilities)
import { requireAuth } from '@/lib/platform/auth'
import { logAudit } from '@/lib/platform/audit'
import { centavosToPhp } from '@/lib/platform/money'

// 2. Import your own module's types and utils
import type { Customer } from '@/lib/modules/customers/types'
import { normalizePlate } from '@/lib/modules/customers/utils'

// 3. Call another module's PUBLIC server actions
import { getCustomerById } from '@/lib/modules/customers/actions'

// 4. Import shared UI Kit components
import { Button, Input, DataTable } from '@/ui-kit'
```

#### ❌ FORBIDDEN Imports

```typescript
// ❌ Never import another module's internal utils
import { someHelperFunction } from '@/lib/modules/customers/utils'

// ❌ Never import another module's types directly (use contracts.ts or actions.ts return types)
import type { CustomerInternal } from '@/lib/modules/customers/types'

// ❌ Never import from another module's domain/infrastructure layers
import { CustomerRepository } from '@/lib/modules/customers/infrastructure/CustomerRepository'
```

**Enforcement:** Use ESLint rule `no-restricted-imports` to block cross-module internal imports.

**Example ESLint Config:**
```json
{
  "rules": {
    "no-restricted-imports": [
      "error",
      {
        "patterns": [
          {
            "group": ["@/lib/modules/*/utils", "@/lib/modules/*/types"],
            "message": "Do not import module internals. Use public actions only."
          }
        ]
      }
    ]
  }
}
```

---

### Public API Surface: `actions.ts`

**Rule:** Each module exposes ONLY its `actions.ts` as the public API.

**Example:** Module A's `lib/modules/customers/actions.ts`

```typescript
'use server'

// ✅ PUBLIC: Other modules can call this
export async function getCustomerById(id: string): Promise<ApiResponse<Customer>> {
  // Implementation...
}

// ✅ PUBLIC: Other modules can call this
export async function searchByPlate(plate: string): Promise<ApiResponse<Vehicle[]>> {
  // Implementation...
}

// ❌ INTERNAL: Not exported, used only within Module A
async function internalDuplicateCheck(phone: string) {
  // ...
}
```

**Contract:** The `contracts.ts` file documents all public action signatures and types, serving as the module's API documentation.

---

## 3. Integration Points

Document each cross-module call with the contract signature and the stub used during development.

### Integration Matrix

| Consumer Module | Provider Module | Function | Phase Available | Stub Strategy |
|-----------------|-----------------|----------|-----------------|---------------|
| B (Scheduling) | A (Customers) | `getCustomerById` | Phase 1 (Week 4) | Hardcoded fixture returning mock customer |
| B (Scheduling) | A (Customers) | `getVehiclesByCustomer` | Phase 1 (Week 4) | Hardcoded fixture returning mock vehicles |
| B (Scheduling) | A (Customers) | `searchByPlate` | Phase 1 (Week 4) | Hardcoded fixture |
| B (Scheduling) | K (Admin) | `getSetting('shop.hours')` | Phase 1 (Week 3) | Default 08:00-17:00 |
| C (Service Orders) | A (Customers) | `getCustomerById` | Phase 1 (Week 4) | Hardcoded fixture |
| C (Service Orders) | A (Customers) | `getVehicleById` | Phase 1 (Week 4) | Hardcoded fixture |
| C (Service Orders) | B (Scheduling) | `getAppointmentById` | Phase 2 (Week 6) | Hardcoded fixture (optional) |
| C (Service Orders) | D (Inventory) | `issueToJob` | Phase 3 (Week 9) | Write `c_parts_requests`, Module D reads it |
| C (Service Orders) | K (Admin) | `nextDocumentNumber('SO')` | Phase 1 (Week 4) | 'SO-000001' hardcoded |
| E (POS & Billing) | C (Service Orders) | `getServiceOrderById` | Phase 3 (Week 9) | Manual invoice entry (stub) |
| E (POS & Billing) | D (Inventory) | `getItemById` (pricing) | Phase 3 (Week 9) | Manual price entry (stub) |
| E (POS & Billing) | K (Admin) | `nextDocumentNumber('INV')` | Phase 1 (Week 4) | 'INV-000001' hardcoded |

---

### Stub Pattern Example

**Scenario:** Module C needs to issue parts from Module D, but D isn't built yet (Phase 3 Week 7).

**Step 1:** Module C writes a stub

```typescript
// src/lib/modules/service-orders/actions.ts
export async function requestPart(
  orderId: string,
  data: { itemId?: string; description: string; quantity: number }
): Promise<ApiResponse<PartsRequest>> {
  // STUB: Write to c_parts_requests table
  // Module D will read this table when it's ready
  const request = await db.insert(c_parts_requests).values({
    service_order_id: orderId,
    item_id: data.itemId,
    part_description: data.description,
    quantity_requested: data.quantity,
    status: 'pending',
    requested_at: new Date(),
    requested_by: (await requireAuth()).id
  }).returning()
  
  return { data: request[0], error: null }
}
```

**Step 2:** Module D reads the stub table

```typescript
// src/lib/modules/inventory/actions.ts (Phase 3 Week 9)
export async function getPendingPartsRequests(): Promise<ApiResponse<PartsRequest[]>> {
  // Read c_parts_requests table
  const requests = await db
    .select()
    .from(c_parts_requests)
    .where(eq(c_parts_requests.status, 'pending'))
  
  return { data: requests, error: null }
}

export async function fulfillPartsRequest(
  requestId: string,
  quantityIssued: number
): Promise<ApiResponse<void>> {
  // Update c_parts_requests
  await db.update(c_parts_requests)
    .set({ quantity_issued: quantityIssued, status: 'issued', issued_at: new Date() })
    .where(eq(c_parts_requests.id, requestId))
  
  // Deduct from inventory
  await issueToJob({ ... })
  
  return { data: null, error: null }
}
```

**Step 3:** Wire Together (Phase 3 Week 9)

Both modules now operate on the same `c_parts_requests` table. No code changes needed — integration works automatically.

---

## 4. Testing Isolation

### Unit Tests

**Rule:** Each module has its own test file. Mock all external module calls.

**Example:** Testing Module B (which depends on Module A)

```typescript
// src/lib/modules/scheduling/__tests__/actions.test.ts

import { createAppointment } from '../actions'
import * as customersActions from '@/lib/modules/customers/actions'

// Mock Module A's actions
jest.mock('@/lib/modules/customers/actions', () => ({
  getCustomerById: jest.fn().mockResolvedValue({
    data: { id: 'cust-1', full_name: 'John Doe', phone: '09171234567' },
    error: null
  }),
  getVehicleById: jest.fn().mockResolvedValue({
    data: { id: 'veh-1', plate_number: 'ABC 1234', make: 'Toyota', model: 'Vios' },
    error: null
  })
}))

describe('createAppointment', () => {
  it('should create appointment with valid customer and vehicle', async () => {
    const result = await createAppointment({
      customer_id: 'cust-1',
      vehicle_id: 'veh-1',
      appointment_date: '2024-12-01',
      appointment_time: '10:00'
    })
    
    expect(result.error).toBeNull()
    expect(result.data).toHaveProperty('id')
  })
})
```

**Why Mock?** 
- Module B tests should run even if Module A database tables don't exist yet
- Tests run faster without real database calls
- Tests are isolated from external state

---

### Integration Tests

**Rule:** Integration tests run ONLY after both modules involved are complete.

**Location:** `src/__tests__/integration/<module-A>-<module-B>.test.ts`

**Example:** `src/__tests__/integration/appointments-customers.test.ts`

```typescript
// Only runs after Module A AND Module B are complete
import { createCustomer } from '@/lib/modules/customers/actions'
import { createAppointment } from '@/lib/modules/scheduling/actions'

describe('Appointment-Customer Integration', () => {
  let customerId: string
  let vehicleId: string
  
  beforeAll(async () => {
    // Create real customer and vehicle in database
    const customer = await createCustomer({ full_name: 'Test Customer', phone: '09171234567' })
    customerId = customer.data!.id
    
    const vehicle = await createVehicle(customerId, { plate_number: 'TEST 123', make: 'Honda', model: 'Civic' })
    vehicleId = vehicle.data!.id
  })
  
  it('should create appointment with real customer lookup', async () => {
    const result = await createAppointment({
      customer_id: customerId,
      vehicle_id: vehicleId,
      appointment_date: '2024-12-01',
      appointment_time: '10:00'
    })
    
    expect(result.error).toBeNull()
    expect(result.data).toHaveProperty('id')
  })
  
  afterAll(async () => {
    // Clean up test data
  })
})
```

---

### Seed Data

**Rule:** Each module has a seed script for local development.

**Location:** `src/lib/modules/<name>/seed.ts`

**Seed Order (Important):**
1. K (roles, settings, document sequences)
2. A (customers, vehicles)
3. B (bays, sample appointments)
4. D (categories, suppliers, sample items)
5. C (sample service orders)
6. E (sample invoices)

**Example:** `src/lib/modules/customers/seed.ts`

```typescript
import { db } from '@/lib/platform/supabase'
import { a_customers, a_vehicles } from './schema'

export async function seedCustomers() {
  const customers = await db.insert(a_customers).values([
    { full_name: 'Juan Dela Cruz', phone: '09171234567', customer_type: 'individual' },
    { full_name: 'Maria Santos', phone: '09189876543', customer_type: 'vip' }
  ]).returning()
  
  await db.insert(a_vehicles).values([
    { customer_id: customers[0].id, plate_number: 'ABC 1234', make: 'Toyota', model: 'Vios', year: 2020 },
    { customer_id: customers[1].id, plate_number: 'XYZ 9876', make: 'Honda', model: 'City', year: 2021 }
  ])
  
  console.log('✅ Seeded 2 customers and 2 vehicles')
}
```

**Run Seeds:** `npm run seed` (calls all module seeds in dependency order)

---

## 5. Event-Driven Integration (Future Enhancement)

**Current State:** Direct API calls between modules (e.g., Module B calls Module A's `getCustomerById`).

**Future State:** Modules emit domain events; other modules subscribe.

**Example Event:**
```typescript
// Module C emits
await publishEvent('ServiceOrderCompleted', {
  serviceOrderId: 'so-123',
  customerId: 'cust-456',
  vehicleId: 'veh-789',
  totalCentavos: 500000
})

// Module G subscribes (accounting)
subscribeToEvent('ServiceOrderCompleted', async (event) => {
  await recordSale(event.serviceOrderId, event.totalCentavos)
})

// Module I subscribes (follow-up)
subscribeToEvent('ServiceOrderCompleted', async (event) => {
  await scheduleFollowUp(event.customerId, event.vehicleId)
})

// Module H subscribes (maintenance reminders)
subscribeToEvent('ServiceOrderCompleted', async (event) => {
  await updateMaintenanceSchedule(event.vehicleId)
})
```

**Benefits:**
- Module C doesn't need to know about G, H, I
- New modules can subscribe to existing events without touching old code
- Events are queued and processed asynchronously

**Implementation:** Use Supabase Realtime or a dedicated event table with Postgres triggers.

**Timeline:** Deferred to Phase 5+ (not required for core system)

---

## 6. Git and PR Workflow

### Branch Strategy

```
main            # Production (protected)
develop         # Integration branch
feature/mod-k-<feature>
feature/mod-a-<feature>
feature/mod-b-<feature>
feature/mod-c-<feature>
feature/mod-d-<feature>
feature/mod-e-<feature>
```

### PR Checklist

Before merging to `develop`, verify:

- [ ] **Only your module's tables modified** — no accidental changes to other modules
- [ ] **No imports from other module internals** — only public `actions.ts`
- [ ] **Stubs in place for missing dependencies** — documented in code comments
- [ ] **Tests pass** — unit tests green, integration tests green (if dependencies ready)
- [ ] **No raw design values** — all colors/fonts/spacing use tokens
- [ ] **Design-swap test passes** — if UI changes (visual tokens only, no business logic)
- [ ] **Audit logging added** — all state-changing operations call `logAudit()`
- [ ] **RLS policies active and tested** — row-level security enforced
- [ ] **README.md updated** — current status, what works, what's pending
- [ ] **Migration file named correctly** — `<module>_<NNN>_<description>.sql`

### Merge Conflicts

**If migration numbers conflict:**
- Renumber YOUR migration (don't touch theirs)
- Example: Both created `A_005_...` → rename yours to `A_006_...`

**If table names conflict:**
- You missed the prefix rule. Fix it. Prefix all tables with module letter.

---

## 7. Design Token Isolation

**Rule:** No raw visual values in module code. Use only design tokens.

**Example: Module C Service Order Status Badge**

```typescript
// ❌ FORBIDDEN
<span className="bg-red-500 text-white px-2 py-1 rounded">Cancelled</span>

// ✅ CORRECT
import { StatusBadge } from '@/ui-kit'

<StatusBadge status="cancelled" />
```

The `StatusBadge` component internally maps `status="cancelled"` → `--status-danger-bg`, `--status-danger-text` tokens.

**Why:** When design changes (new color scheme), only token values change. No module code changes needed.

---

## Summary: The Three Boundaries

| Boundary | Rule | Enforcement |
|----------|------|-------------|
| **Database** | Table prefix (`k_`, `a_`, `b_`, etc.) | Migration naming convention, code review |
| **Code** | No internal imports, only public `actions.ts` | ESLint `no-restricted-imports`, PR checklist |
| **Design** | No raw values, only tokens | Lint rule, design-swap test at Gate |

---

**Respect the boundaries. Build in parallel. Ship faster.**
