# Module A: Customer and Vehicle Management — Checklist

**Module Owner:** `PENDING(Q-21)` | **Phase:** 1 | **Status:** Not Started

---

## Core Functions (§5.A)

- [ ] A-F01: Add, edit, merge, archive customers (individual/fleet) · **Must**
- [ ] A-F02: Register multiple vehicles per customer · **Must**
- [ ] A-F03: Transfer vehicle ownership · **Must**
- [ ] A-F04: Store full service history per vehicle · **Must**
- [ ] A-F05: Customer classification (regular, VIP, fleet, credit, blacklisted) · **Must**
- [ ] A-F06: Duplicate detection (phone, plate, VIN) · **Must**
- [ ] A-F07: Document attachments (OR/CR, insurance, photos) · **Must**
- [ ] A-F08: Consent and communication preferences · **Must** · `PENDING(Q-15)`

## Screens (§5.A)

- [ ] A-S01: Customer list with search and filters · **Must**
- [ ] A-S02: Customer profile (full detail view) · **Must**
- [ ] A-S03: Vehicle profile (full detail view) · **Must**
- [ ] A-S04: Vehicle service timeline · **Must**
- [ ] A-S05: Fleet account view (consolidated) · **Should**

## Key Records (§5.A)

- [ ] A-R01: Customer entity · **Must**
- [ ] A-R02: Vehicle entity · **Must**
- [ ] A-R03: Fleet Account entity · **Should**
- [ ] A-R04: Contact Preference entity · **Must**
- [ ] A-R05: Attachment entity · **Must**

## Outputs (§5.A)

- [ ] A-O01: Customer list export · **Must**
- [ ] A-O02: Vehicle history report · **Must**
- [ ] A-O03: Fleet summary report · **Should**
- [ ] A-O04: Inactive customer list · **Should**
- [ ] A-O05: Birthday/anniversary list · **Could**

## Business Rules

- [ ] A-N01: Duplicate detection logic (fuzzy match on name, exact on phone/plate/VIN) · **Must**
- [ ] A-N02: Customer merge preserves all history · **Must**
- [ ] A-N03: Vehicle transfer updates ownership but keeps history · **Must**
- [ ] A-N04: Soft delete only (customers/vehicles archived, not hard deleted) · **Must**
- [ ] A-N05: Consent recorded with timestamp for marketing communications · **Must** · `PENDING(Q-15)`

## Integration

**Provides to:** B, C, E, H, I (customer/vehicle master data)  
**Consumes from:** K (auth, audit, settings)  
**Deferred:** None

## Security

- [ ] A-SEC01: Customer data access limited by role (advisor sees all, customer portal sees own) · **Must** · `PENDING(Q-04)`
- [ ] A-SEC02: Attachment file upload security (type check, size limit, scan, signed URLs) · **Must**
- [ ] A-SEC03: Personal data masked in logs and non-privileged views · **Must**
- [ ] A-SEC04: Permission tests per RBAC matrix (Module A row) · **Must**

## Acceptance Criteria

**A-AC01:** Add customer with vehicle, search by plate, view full history  
**A-AC02:** Detect duplicate when adding customer with existing phone  
**A-AC03:** Merge two customers, verify history preserved  
**A-AC04:** Upload OR/CR attachment, retrieve via signed URL  
**A-AC05:** Archive customer, verify appears in archive list not active list

## Definition of Done
- All Must items complete, tests green, security.md written, second reviewer sign-off on attachment handling, user guide complete, demo successful

## Gate Log
**M1:** — | **M2:** — | **Tag:** `module-A-v1.0`
