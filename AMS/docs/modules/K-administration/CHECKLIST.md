# Module K: User Management and System Administration — Checklist

**Module Owner:** `PENDING(Q-21)`  
**Phase:** 1 — Foundation  
**Status:** Not Started  
**Priority:** All items Must (foundational module)

---

## Module Overview

**Purpose:** Secure the system, control who can do what, and keep it configured and recoverable.

**Dependencies:**
- Platform Kernel (built first in Phase 1)
- No module dependencies (K is foundational)

**Deferred Integrations:** None (K provides services to all other modules)

---

## Core Functions

- [ ] K-F01: User account management (create, edit, deactivate, password reset) · **Priority:** Must
- [ ] K-F02: Role templates and fine-grained permission management · **Priority:** Must
- [ ] K-F03: Strong authentication (password policy, optional 2FA, session timeout, lockout) · **Priority:** Must
- [ ] K-F04: Approval workflow configuration (discount limits, voids, adjustments, expenses) · **Priority:** Must
- [ ] K-F05: Audit trail (who, what, when, from where, tamper-resistant) · **Priority:** Must
- [ ] K-F06: Company and branch settings (profile, logo, hours, holidays) · **Priority:** Must
- [ ] K-F07: Tax rates and currency configuration · **Priority:** Must
- [ ] K-F08: Document numbering sequences (invoice, receipt, PO, service order) · **Priority:** Must
- [ ] K-F09: Document template management · **Priority:** Must
- [ ] K-F10: Master data configuration (service catalog, labor rates, payment methods) · **Priority:** Must
- [ ] K-F11: Reason codes and status lists configuration · **Priority:** Must
- [ ] K-F12: Notification template management · **Priority:** Must
- [ ] K-F13: Backup and restore functionality · **Priority:** Must
- [ ] K-F14: Data retention and export · **Priority:** Must
- [ ] K-F15: Integration settings (SMS, email, payment, printers, attendance) · **Priority:** Must · `PENDING(Q-03)`
- [ ] K-F16: Data privacy controls (consent records, access/deletion requests, masking) · **Priority:** Must · `PENDING(Q-15)`
- [ ] K-F17: System health monitor and error log viewer · **Priority:** Must
- [ ] K-F18: Multi-branch configuration (disabled in v1, ready for future) · **Priority:** Must

## Screens and Views

- [ ] K-S01: User list and user detail screen · **Priority:** Must
- [ ] K-S02: Role and permission matrix editor · **Priority:** Must
- [ ] K-S03: Audit log viewer with filters (user, action, date range, module) · **Priority:** Must
- [ ] K-S04: Company settings page (profile, logo, hours, holidays) · **Priority:** Must
- [ ] K-S05: Tax and currency settings page · **Priority:** Must
- [ ] K-S06: Numbering sequences configuration · **Priority:** Must
- [ ] K-S07: Document template editor with preview · **Priority:** Must
- [ ] K-S08: Service catalog management · **Priority:** Must
- [ ] K-S09: Labor rates configuration · **Priority:** Must
- [ ] K-S10: Payment methods configuration · **Priority:** Must
- [ ] K-S11: Reason codes management · **Priority:** Must
- [ ] K-S12: Notification templates editor · **Priority:** Must
- [ ] K-S13: Integration settings (API keys, endpoints, credentials) · **Priority:** Must · `PENDING(Q-03)`
- [ ] K-S14: Approval workflow configuration screen · **Priority:** Must
- [ ] K-S15: Backup status and restore interface · **Priority:** Must
- [ ] K-S16: System health dashboard · **Priority:** Must
- [ ] K-S17: Login history and active sessions viewer · **Priority:** Must

## Key Records

- [ ] K-R01: User entity with authentication fields · **Priority:** Must
- [ ] K-R02: Role entity · **Priority:** Must
- [ ] K-R03: Permission entity and role-permission mapping · **Priority:** Must
- [ ] K-R04: Audit Log entry (immutable) · **Priority:** Must
- [ ] K-R05: Setting entity (key-value with metadata) · **Priority:** Must
- [ ] K-R06: Template entity (document templates) · **Priority:** Must
- [ ] K-R07: Integration Credential entity (encrypted) · **Priority:** Must
- [ ] K-R08: Backup Record entity · **Priority:** Must
- [ ] K-R09: Approval Workflow Rule entity · **Priority:** Must
- [ ] K-R10: Session entity (active user sessions) · **Priority:** Must

## Outputs and Reports

- [ ] K-O01: Audit reports (user activity, login history, changes by date range) · **Priority:** Must
- [ ] K-O02: User access review (who has what permissions) · **Priority:** Must
- [ ] K-O03: Backup log and status report · **Priority:** Must
- [ ] K-O04: Settings change history · **Priority:** Must
- [ ] K-O05: System health and error summary · **Priority:** Must

## Rules and Business Logic

- [ ] K-N01: Password complexity rules (min length, character requirements) · **Priority:** Must
- [ ] K-N02: Session timeout after inactivity · **Priority:** Must
- [ ] K-N03: Account lockout after N failed login attempts · **Priority:** Must
- [ ] K-N04: Audit log immutability enforcement · **Priority:** Must
- [ ] K-N05: Settings validation (e.g., tax rate 0-100%, valid date formats) · **Priority:** Must
- [ ] K-N06: Document numbering sequence atomicity (no duplicates, no gaps except voids) · **Priority:** Must
- [ ] K-N07: Role hierarchy (admin > manager > user) and inheritance · **Priority:** Must
- [ ] K-N08: Sensitive setting changes require re-authentication · **Priority:** Must
- [ ] K-N09: Backup retention policy (daily, weekly, monthly) · **Priority:** Must
- [ ] K-N10: Data masking rules for personal data in logs · **Priority:** Must · `PENDING(Q-15)`

## Integration Points

**Provides to all modules:**
- Authentication and session services
- Authorization checks (RBAC)
- Audit logging
- Settings retrieval
- Document number generation
- Template rendering
- Notification sending (via platform engine)

**Consumes from:**
- None (K is foundational)

## Security Notes

- [ ] K-SEC01: Store passwords hashed (bcrypt or Argon2) · **Priority:** Must
- [ ] K-SEC02: Encrypt integration credentials at rest · **Priority:** Must
- [ ] K-SEC03: Rate-limit login attempts (prevent brute force) · **Priority:** Must
- [ ] K-SEC04: CSRF protection on all state-changing endpoints · **Priority:** Must
- [ ] K-SEC05: No user enumeration (same message for wrong user vs. wrong password) · **Priority:** Must
- [ ] K-SEC06: Audit log append-only, tamper detection (hash chain or similar) · **Priority:** Must
- [ ] K-SEC07: Two-factor authentication optional but available · **Priority:** Must
- [ ] K-SEC08: Session token rotation on privilege escalation · **Priority:** Must
- [ ] K-SEC09: Secrets never logged or displayed in UI · **Priority:** Must
- [ ] K-SEC10: Backup encryption with separate key · **Priority:** Must

## Test Plan

- [ ] K-T01: Unit tests for password hashing and validation · **Priority:** Must
- [ ] K-T02: Unit tests for permission checks (all RBAC matrix combinations) · **Priority:** Must
- [ ] K-T03: Integration test for user login flow · **Priority:** Must
- [ ] K-T04: Integration test for audit log immutability · **Priority:** Must
- [ ] K-T05: Integration test for settings CRUD · **Priority:** Must
- [ ] K-T06: Integration test for document number generation (concurrency, no duplicates) · **Priority:** Must
- [ ] K-T07: Negative test: login with wrong password (account lockout) · **Priority:** Must
- [ ] K-T08: Negative test: unauthorized access to admin endpoints · **Priority:** Must
- [ ] K-T09: Negative test: attempt to modify audit log · **Priority:** Must
- [ ] K-T10: Backup and restore test (full cycle) · **Priority:** Must
- [ ] K-T11: Permission tests per RBAC matrix (Module K row) · **Priority:** Must

## Acceptance Criteria

### K-AC01: User Management
**Given** an admin is logged in  
**When** they create a new user with role "Cashier"  
**Then** the user can log in and sees only modules per RBAC matrix  
**And** the action is logged in audit trail

### K-AC02: Authentication Security
**Given** a user enters wrong password 3 times  
**When** they attempt a 4th login  
**Then** account is locked for N minutes  
**And** login attempt is logged

### K-AC03: Audit Trail
**Given** any user performs any state-changing action  
**When** the action completes  
**Then** an audit log entry is created with user, action, timestamp, IP  
**And** the entry cannot be modified or deleted

### K-AC04: Document Numbering
**Given** two cashiers generate invoices simultaneously  
**When** both save within 1 second  
**Then** each gets a unique sequential number with no gap or duplicate

### K-AC05: Backup and Restore
**Given** system has live data  
**When** admin triggers backup  
**Then** encrypted backup is created  
**And** restore test on separate environment succeeds with data intact

## Definition of Done

- [ ] All Must items above complete
- [ ] Module K security.md written (threat model, abuse cases)
- [ ] All acceptance criteria pass
- [ ] All tests green (unit, integration, negative, permission)
- [ ] Migrations tested up and down
- [ ] Every screen exists in all states (empty, populated, error)
- [ ] UI uses only tokens and UI-kit components
- [ ] Design-swap test passes
- [ ] Keyboard navigation works
- [ ] WCAG AA contrast verified
- [ ] API documentation generated
- [ ] User guide written for System Admin role
- [ ] Backup/restore procedure documented
- [ ] Performance: Settings load < 500ms, user list < 1s on 100 users
- [ ] Second reviewer sign-off (K touches auth and permissions)
- [ ] Demo: Admin creates user, user logs in with correct permissions, audit trail verified

## Slices

*To be defined at Gate M1 (Module K start). Proposed slices:*

1. **K-SL01:** Authentication basics (login, logout, session, password hashing)
2. **K-SL02:** User and role CRUD, basic RBAC enforcement
3. **K-SL03:** Permission matrix implementation, authorization middleware
4. **K-SL04:** Audit logging across all endpoints
5. **K-SL05:** Company settings and configuration UI
6. **K-SL06:** Document numbering sequences
7. **K-SL07:** Template management and rendering
8. **K-SL08:** Backup and restore
9. **K-SL09:** Integration settings and health monitor
10. **K-SL10:** Privacy controls and data export

## Gate Log

**Gate M1 (Module Start):**
- Date: —
- Approver: —
- Status: —

**Gate M2 (Module Complete):**
- Date: —
- Approver: —
- Status: —
- Tag: `module-K-v1.0`

---

**Notes:**
- Module K must be complete before any other module starts (foundational dependency)
- Every module will reference K for auth, audit, and settings
- Security review especially critical for K since it controls all access
