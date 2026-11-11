# AMS Modules

Each business module follows a standard structure to enforce boundaries (ADR-002).

## Module Structure

```
src/lib/modules/[module-name]/
├── contracts.ts      # PUBLIC API — only file other modules can import
├── types/            # Module-specific types
│   └── index.ts
├── domain/           # Business logic (PRIVATE — internal only)
├── data/             # Database queries (PRIVATE — internal only)
└── README.md         # Module documentation
```

## Boundary Rules (ADR-002 — BINDING)

1. **Cross-module imports:** Only allowed through `contracts.ts`
2. **Server-side only:** Module-to-module calls must be server-side (Server Components, Server Actions, API Routes)
3. **No direct database access:** Modules cannot query another module's tables directly
4. **Event-driven side effects:** Use the `outbox` table for cross-module reactions

## contracts.ts Pattern

Every module exports its public API through `contracts.ts`:

```typescript
/**
 * Module Inventory — Public Contract
 * 
 * This is the ONLY file other modules may import from Module Inventory.
 * All cross-module integration goes through this contract.
 */

// Example: Module D (Inventory) contract

export interface PartAvailability {
  itemId: string;
  quantityAvailable: number;
  estimatedArrival: string | null;
}

/**
 * Check if parts are available for issuance
 * Called by Module C (Service Orders) when creating job
 */
export async function checkPartsAvailability(
  itemIds: string[]
): Promise<PartAvailability[]> {
  // Implementation in domain/ or data/
}

/**
 * Reserve parts for a service order
 * Called by Module C when job is approved
 */
export async function reserveParts(
  serviceOrderId: string,
  items: { itemId: string; quantity: number }[]
): Promise<{ success: boolean; error?: string }> {
  // Implementation
}

// Domain events this module publishes
export const EVENTS = {
  PARTS_RESERVED: 'inventory.parts_reserved',
  STOCK_LOW: 'inventory.stock_low',
} as const;
```

## Usage Example

Module C (Service Orders) needs to check parts availability from Module D (Inventory):

```typescript
// ✅ CORRECT: Import from contracts.ts
import { checkPartsAvailability } from '@/lib/modules/inventory/contracts';

const availability = await checkPartsAvailability(['item-123', 'item-456']);

// ❌ WRONG: Direct import from internals (ESLint will error)
import { InventoryService } from '@/lib/modules/inventory/domain/inventory-service';
```

## Stub Dependencies

When Module X depends on Module Y that isn't built yet:

1. Define Y's `contracts.ts` interface
2. Implement a stub in X that returns mock data
3. Mark `DEFERRED-INTEGRATION(with Y)` in both modules' checklists
4. Replace stub with real implementation when Y is delivered

Example stub:

```typescript
// In Module C, waiting for Module D (Inventory)
import type { PartAvailability } from '@/lib/modules/inventory/contracts';

// Stub implementation (replace when Module D is ready)
export async function checkPartsAvailability(
  itemIds: string[]
): Promise<PartAvailability[]> {
  // TODO: DEFERRED-INTEGRATION(with inventory)
  return itemIds.map(id => ({
    itemId: id,
    quantityAvailable: 999,
    estimatedArrival: null,
  }));
}
```

## Module List

The AMS system consists of 11 business modules:

- **Module A: customers** — Customer and Vehicle Management
- **Module B: scheduling** — Appointment and Service Scheduling
- **Module C: service-orders** — Service Order and Job Management
- **Module D: inventory** — Inventory and Stock Management
- **Module E: billing** — POS and Billing
- **Module F: payroll** — Payroll and HR
- **Module G: finance** — Finance and Accounting
- **Module H: reminders** — Maintenance Reminders
- **Module I: follow-up** — After-Service Follow-Up
- **Module J: reporting** — Reports and Analytics
- **Module K: administration** — System Administration

## Testing Module Boundaries

Architectural tests enforce these rules:

- `src/__tests__/architecture.test.ts` verifies no cross-module internal imports
- ESLint `no-restricted-imports` rule prevents direct violations

Run tests: `npm run test`

## Adding a New Module

1. Create directory structure:
   ```bash
   mkdir -p src/lib/modules/my-module/{domain,data,types}
   ```

2. Create `contracts.ts`:
   ```typescript
   /**
    * Module my-module — Public Contract
    */
   export {};
   ```

3. Create `types/index.ts`:
   ```typescript
   /**
    * Module my-module — Type definitions.
    */
   export {};
   ```

4. Add module to architecture test MODULE_NAMES array

5. Create migration: `supabase/migrations/00NNN_module_my_module.sql`

6. Document in module's README.md
