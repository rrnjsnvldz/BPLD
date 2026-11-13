# Module A: Customer and Vehicle Management

**Status:** Not Started (Phase 1)  
**Dependencies:** Module K only (auth, audit, settings)  
**Provides To:** Modules B, C, E, H, I

---

## Purpose

Module A is the **master data foundation** — the single source of truth for all customer and vehicle information. Every appointment, service order, invoice, and reminder links back to Module A data.

---

## Current Status: Not Started

Module A can be built **immediately in parallel** with Module K completion. No dependency on other business modules.

---

## Database Tables (6)

- `a_customers` — Customer master data
- `a_vehicles` — Vehicle master data
- `a_customer_notes` — Notes, warnings, VIP preferences
- `a_attachments` — OR/CR, insurance, photos
- `a_fleet_accounts` — Fleet/company accounts
- `a_fleet_vehicles` — Fleet vehicle assignments

---

## Key Features

- Customer CRUD with duplicate detection
- Vehicle registry with plate validation
- Vehicle ownership transfer (preserves history)
- Customer merge (consolidates duplicates)
- Service history timeline (from Module C)
- Document attachments with signed URLs
- Fleet account management
- Consent tracking (marketing, SMS, email)
- Soft delete only (archiving)

---

## Key API Actions

### Customer
- `createCustomer`, `getCustomers`, `getCustomerById`, `updateCustomer`, `archiveCustomer`
- `mergeCustomers`, `detectDuplicates`, `searchCustomers`

### Vehicle
- `createVehicle`, `getVehiclesByCustomer`, `getVehicleByPlate`, `getVehicleById`, `updateVehicle`, `transferVehicle`, `searchByPlate`

### Notes & Attachments
- `addCustomerNote`, `getCustomerNotes`, `deleteCustomerNote`
- `uploadAttachment`, `getAttachments`, `getSignedUrl`, `deleteAttachment`

### Fleet
- `createFleetAccount`, `getFleetAccounts`, `getFleetAccountById`, `assignVehicleToFleet`, `removeVehicleFromFleet`

---

## UI Screens

- `/customers` — Customer list with search/filters
- `/customers/new` — Create customer
- `/customers/[id]` — Customer profile
- `/customers/[id]/edit` — Edit customer
- `/customers/[id]/vehicles/new` — Add vehicle
- `/vehicles/[id]` — Vehicle profile
- `/vehicles/[id]/edit` — Edit vehicle
- `/fleet-accounts` — Fleet list
- `/fleet-accounts/[id]` — Fleet detail

---

## Business Rules

- **Duplicate Detection:** Exact match on phone/plate/VIN, fuzzy match on name
- **Plate Validation:** Philippine LTO format (ABC 1234, NAA 1234, etc.)
- **Customer Merge:** Reassigns all vehicles, service orders, invoices to target, then archives source
- **Vehicle Transfer:** Updates ownership, preserves service history
- **Consent:** Separate flags for marketing, SMS, email; timestamp required
- **Soft Delete:** Never hard delete; set `is_archived = true`

---

## Integration Points

### Provides to Other Modules

| Module | Functions | Purpose |
|--------|-----------|---------|
| B (Scheduling) | `getCustomerById`, `getVehiclesByCustomer`, `searchByPlate` | Appointment booking |
| C (Service Orders) | `getCustomerById`, `getVehicleById`, `searchByPlate` | Check-in, quick lookup |
| E (Billing) | `getCustomerById` | Invoice header |
| H (Reminders) | `getCustomers` (with consent filter) | Send reminders |
| I (Follow-Up) | `getCustomerById`, `getVehicleById` | Surveys |

### Consumes from Module K

- `requireAuth()` — Authentication
- `checkPermission()` — RBAC enforcement
- `logAudit()` — Audit all create, update, merge operations
- `getSetting()` — Attachment size limits, storage bucket config

---

## Testing Strategy

### Integration Tests

1. Create customer → Add vehicle → View profile
2. Detect duplicate (existing phone) → Verify warning
3. Merge customers → Verify all data moved
4. Transfer vehicle → Verify history preserved
5. Upload attachment → Get signed URL → Download

### Negative Tests

- Duplicate plate → Error
- Merge without permission → Denied
- Upload 50MB file → Size limit error

---

## Development Notes

- **Duplicate detection** uses Levenshtein distance for fuzzy name matching
- **Plate normalization:** Uppercase, single space (e.g., "ABC 1234")
- **Attachments:** Supabase Storage, private bucket, signed URLs with 1-hour expiry
- **Service history stub:** Shows empty until Module C is built

---

**Module A is master data. Get it right, and everything else flows cleanly.**
