# Module A: Customer and Vehicle Management — Technical Specification

**Version:** 1.0  
**Status:** Phase 1 Module — Not Started  
**Last Updated:** 2026-11-10  
**Module Owner:** TBD

---

## Overview

Module A is the **master data foundation** for all customer and vehicle information. It manages the complete customer directory, vehicle registry, service history, fleet accounts, and document attachments. Every service order, appointment, invoice, and reminder links back to customer and vehicle records in Module A.

**Development Priority:** Module A can be built **immediately in parallel** with Module K completion. It has no dependencies on other business modules — only on Module K for authentication, audit, and settings.

---

## Database Tables

### Primary Tables

```sql
-- Customer master data
a_customers (
  id uuid PRIMARY KEY,
  auth_user_id uuid REFERENCES auth.users(id) NULL, -- For customer portal login
  full_name text NOT NULL,
  email text,
  phone text NOT NULL,
  phone_alt text,
  address text,
  customer_type text NOT NULL DEFAULT 'regular', -- individual, fleet, vip, credit, blacklisted
  classification_notes text,
  credit_limit_centavos bigint DEFAULT 0,
  credit_terms_days integer DEFAULT 0,
  consent_marketing boolean DEFAULT false,
  consent_sms boolean DEFAULT false,
  consent_email boolean DEFAULT false,
  consent_recorded_at timestamptz,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  created_by uuid REFERENCES auth.users(id)
)

-- Vehicle master data
a_vehicles (
  id uuid PRIMARY KEY,
  customer_id uuid REFERENCES a_customers(id) NOT NULL,
  plate_number text UNIQUE NOT NULL,
  vin text,
  make text NOT NULL,
  model text NOT NULL,
  year integer,
  color text,
  body_type text, -- sedan, suv, pickup, van, motorcycle, etc.
  fuel_type text, -- gasoline, diesel, hybrid, electric
  engine_displacement_cc integer,
  transmission text, -- manual, automatic, cvt
  odometer_km integer,
  odometer_recorded_at timestamptz,
  insurance_expiry date,
  registration_expiry date,
  is_archived boolean DEFAULT false,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Customer notes (warnings, VIP preferences, credit notes)
a_customer_notes (
  id uuid PRIMARY KEY,
  customer_id uuid REFERENCES a_customers(id) ON DELETE CASCADE,
  note_text text NOT NULL,
  note_type text DEFAULT 'general', -- general, vip, credit, warning
  created_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
)

-- Document attachments (OR/CR, insurance, photos)
a_attachments (
  id uuid PRIMARY KEY,
  entity_type text NOT NULL, -- customer, vehicle
  entity_id uuid NOT NULL,
  file_name text NOT NULL,
  file_path text NOT NULL, -- Supabase Storage path
  file_size_bytes bigint,
  mime_type text,
  attachment_type text, -- or_cr, insurance, photo, other
  uploaded_by uuid REFERENCES auth.users(id),
  created_at timestamptz DEFAULT now()
)

-- Fleet accounts (companies with multiple vehicles)
a_fleet_accounts (
  id uuid PRIMARY KEY,
  company_name text NOT NULL,
  contact_person text,
  contact_phone text,
  contact_email text,
  address text,
  credit_limit_centavos bigint DEFAULT 0,
  payment_terms_days integer DEFAULT 0,
  is_active boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Fleet vehicle assignments
a_fleet_vehicles (
  id uuid PRIMARY KEY,
  fleet_account_id uuid REFERENCES a_fleet_accounts(id) ON DELETE CASCADE,
  vehicle_id uuid REFERENCES a_vehicles(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES auth.users(id),
  UNIQUE(fleet_account_id, vehicle_id)
)
```

---

## API Contracts

### Customer CRUD

```typescript
/**
 * Create a new customer
 */
createCustomer(data: CreateCustomerInput): Promise<ApiResponse<Customer>>

/**
 * Get all customers with optional filtering
 */
getCustomers(filter?: CustomerFilter): Promise<ApiResponse<Customer[]>>

/**
 * Get customer by ID with full detail (vehicles, notes, service history)
 */
getCustomerById(id: string): Promise<ApiResponse<CustomerDetail>>

/**
 * Update customer information
 */
updateCustomer(id: string, data: UpdateCustomerInput): Promise<ApiResponse<Customer>>

/**
 * Archive customer (soft delete)
 */
archiveCustomer(id: string): Promise<ApiResponse<void>>

/**
 * Merge duplicate customers (preserves all history)
 */
mergeCustomers(sourceId: string, targetId: string): Promise<ApiResponse<Customer>>

/**
 * Detect potential duplicates before creating customer
 */
detectDuplicates(data: DuplicateCheckInput): Promise<ApiResponse<Customer[]>>

/**
 * Search customers by name, phone, or email
 */
searchCustomers(query: string): Promise<ApiResponse<Customer[]>>
```

### Vehicle CRUD

```typescript
/**
 * Create a new vehicle for a customer
 */
createVehicle(customerId: string, data: CreateVehicleInput): Promise<ApiResponse<Vehicle>>

/**
 * Get all vehicles for a customer
 */
getVehiclesByCustomer(customerId: string): Promise<ApiResponse<Vehicle[]>>

/**
 * Get vehicle by plate number with customer and service history
 */
getVehicleByPlate(plate: string): Promise<ApiResponse<VehicleDetail>>

/**
 * Get vehicle by ID
 */
getVehicleById(id: string): Promise<ApiResponse<VehicleDetail>>

/**
 * Update vehicle information
 */
updateVehicle(id: string, data: UpdateVehicleInput): Promise<ApiResponse<Vehicle>>

/**
 * Transfer vehicle to new customer (ownership change)
 */
transferVehicle(vehicleId: string, newCustomerId: string): Promise<ApiResponse<void>>

/**
 * Search vehicles by plate number (partial match)
 */
searchByPlate(plate: string): Promise<ApiResponse<Array<Vehicle & { customer: Customer }>>>
```

### Customer Notes

```typescript
/**
 * Add note to customer
 */
addCustomerNote(customerId: string, note: CreateNoteInput): Promise<ApiResponse<CustomerNote>>

/**
 * Get all notes for customer
 */
getCustomerNotes(customerId: string): Promise<ApiResponse<CustomerNote[]>>

/**
 * Delete customer note
 */
deleteCustomerNote(noteId: string): Promise<ApiResponse<void>>
```

### Attachments

```typescript
/**
 * Upload attachment for customer or vehicle
 */
uploadAttachment(
  entityType: 'customer' | 'vehicle',
  entityId: string,
  file: File,
  attachmentType: string
): Promise<ApiResponse<Attachment>>

/**
 * Get all attachments for entity
 */
getAttachments(entityType: string, entityId: string): Promise<ApiResponse<Attachment[]>>

/**
 * Get signed URL for attachment download (1-hour expiry)
 */
getSignedUrl(attachmentId: string): Promise<ApiResponse<{ url: string; expiresAt: string }>>

/**
 * Delete attachment
 */
deleteAttachment(attachmentId: string): Promise<ApiResponse<void>>
```

### Fleet Accounts

```typescript
/**
 * Create fleet account
 */
createFleetAccount(data: CreateFleetAccountInput): Promise<ApiResponse<FleetAccount>>

/**
 * Get all fleet accounts
 */
getFleetAccounts(): Promise<ApiResponse<FleetAccount[]>>

/**
 * Get fleet account with all vehicles
 */
getFleetAccountById(id: string): Promise<ApiResponse<FleetAccountDetail>>

/**
 * Assign vehicle to fleet account
 */
assignVehicleToFleet(fleetId: string, vehicleId: string): Promise<ApiResponse<void>>

/**
 * Remove vehicle from fleet account
 */
removeVehicleFromFleet(fleetId: string, vehicleId: string): Promise<ApiResponse<void>>
```

---

## UI Screens

- **`/customers`** — Customer list with search, filters (type, active/archived), pagination
- **`/customers/new`** — Create customer form (name, contact, type, consent)
- **`/customers/[id]`** — Customer profile: details, vehicles list, service history summary, notes, attachments
- **`/customers/[id]/edit`** — Edit customer form
- **`/customers/[id]/vehicles/new`** — Add vehicle to customer
- **`/vehicles/[id]`** — Vehicle profile: details, service timeline, odometer history, attachments
- **`/vehicles/[id]/edit`** — Edit vehicle form
- **`/fleet-accounts`** — Fleet account list
- **`/fleet-accounts/[id]`** — Fleet detail with vehicle assignments

---

## Business Rules

### Duplicate Detection

**Exact Match Rules:**
- Phone number (must match exactly)
- Plate number (must match exactly)
- VIN (must match exactly)

**Fuzzy Match Rules:**
- Customer name (Levenshtein distance < 3)

**Before creating customer:** Run `detectDuplicates()`. If matches found, show warning with merge option.

### Philippine Plate Format Validation

Valid formats:
- `ABC 1234` (standard private)
- `ABC 123` (older format)
- `NAA 1234` (government)
- `ABCD 123` (motorcycle)
- `1234 AB` (some regions)

Case-insensitive, store normalized (uppercase, single space).

### Customer Merge

When merging customer A → customer B:
1. Reassign all vehicles from A to B
2. Reassign all service orders from A to B
3. Reassign all invoices from A to B
4. Copy all notes from A to B
5. Copy all attachments from A to B
6. Archive customer A (soft delete)
7. Log audit entry for merge operation

**No undo** — require manager approval before merge.

### Vehicle Transfer

When transferring vehicle to new customer:
1. Update `customer_id` on vehicle
2. **Preserve service history** (service orders keep old customer_id reference)
3. Add customer note to both old and new customer documenting transfer
4. Log audit entry

### Consent Management

- Marketing, SMS, and email consent are separate flags
- `consent_recorded_at` timestamp required when any consent is true
- Before sending marketing messages, check `consent_sms` or `consent_email` flag
- Customer can withdraw consent anytime (update flags to false)

### Soft Delete Only

- Customers and vehicles are **never hard deleted**
- Set `is_archived = true` instead
- Archived records hidden from default lists (filter required to view)
- Service history, invoices, and attachments remain intact

---

## Integration Points

### Provides To Other Modules

| Consumer | Function | Purpose |
|----------|----------|---------|
| Module B (Scheduling) | `getCustomerById`, `getVehiclesByCustomer`, `searchByPlate` | Populate appointment form |
| Module C (Service Orders) | `getCustomerById`, `getVehicleById`, `searchByPlate` | Create service order, lookup walk-ins |
| Module E (Billing) | `getCustomerById` | Generate invoice header |
| Module H (Reminders) | `getCustomers` (with consent filter) | Send maintenance reminders |
| Module I (Follow-Up) | `getCustomerById`, `getVehicleById` | Send satisfaction surveys |

### Consumes From Module K

- `requireAuth()` — Protect all routes
- `checkPermission()` — Enforce RBAC (advisor can edit, customer portal can view own)
- `logAudit()` — Log all customer/vehicle create, update, merge operations
- `getSetting()` — Read attachment size limits, storage bucket

---

## Folder Structure

```
src/lib/modules/customers/
  actions.ts        # Server actions (all APIs)
  types.ts          # TypeScript types
  utils.ts          # Duplicate detection, plate validation
  
src/app/(modules)/customers/
  page.tsx          # Customer list
  new/page.tsx      # Create customer
  [id]/page.tsx     # Customer detail
  [id]/edit/page.tsx  # Edit customer
  [id]/vehicles/new/page.tsx  # Add vehicle
  
src/app/(modules)/vehicles/
  [id]/page.tsx     # Vehicle detail
  [id]/edit/page.tsx  # Edit vehicle
```

---

## Development Notes

### Duplicate Detection Algorithm

```typescript
// Exact matches (high confidence)
const exactMatches = await db
  .select()
  .from(a_customers)
  .where(
    or(
      eq(a_customers.phone, input.phone),
      eq(a_customers.email, input.email)
    )
  )

// Fuzzy name match (medium confidence)
const fuzzyMatches = await db
  .select()
  .from(a_customers)
  .where(sql`levenshtein(full_name, ${input.full_name}) < 3`)

return [...exactMatches, ...fuzzyMatches]
```

### Philippine Plate Normalization

```typescript
function normalizePlate(plate: string): string {
  return plate
    .toUpperCase()
    .replace(/\s+/g, ' ') // Normalize spaces
    .trim()
}
```

### Attachment Security

- **File upload:** Validate MIME type and file extension (reject .exe, .sh, .bat)
- **Max size:** 10MB per file (configurable via settings)
- **Storage:** Supabase Storage with private bucket
- **Access:** Signed URLs with 1-hour expiry
- **Scan:** Virus scanning via Supabase Storage policies (if available)

### Service History Stub

Module A displays service history **from Module C** (service orders). Until Module C is built:
- Show placeholder: "No service history yet"
- Or fetch from stub endpoint returning empty array

---

## Testing Strategy

### Unit Tests

- Plate number normalization and validation
- Duplicate detection logic (exact + fuzzy)
- Customer merge data reassignment

### Integration Tests

1. **Create Customer → Add Vehicle → View Profile**
2. **Detect Duplicate:** Create customer with existing phone → Verify warning shown
3. **Merge Customers:** Create 2 customers → Merge A into B → Verify all data moved
4. **Transfer Vehicle:** Assign vehicle to customer A → Transfer to customer B → Verify history preserved
5. **Upload Attachment:** Upload OR/CR file → Retrieve signed URL → Verify download works

### Negative Tests

- Create vehicle with duplicate plate → Verify error
- Attempt to merge customers as non-admin → Verify permission denied
- Upload 50MB file → Verify size limit error
- Transfer vehicle to archived customer → Verify error

---

**Module A is master data. Get the data model right, and everything else flows cleanly.**
