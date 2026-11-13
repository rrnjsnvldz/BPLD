# Module K: User Management and System Administration

**Status:** 70% Complete (Phase 1 — In Progress)  
**Dependencies:** None (foundational module)  
**Provides To:** All modules (A through J)

---

## Purpose

Module K is the **security and configuration foundation** for the entire AMS platform. It provides:

- **Authentication:** Login, logout, password reset, session management
- **Authorization:** Role-based access control (RBAC), permission checking
- **Audit:** Immutable trail of all state-changing operations
- **Settings:** System-wide configuration (shop hours, tax rates, templates, integration keys)
- **Document Numbering:** Atomic sequence generation for invoices, service orders, receipts
- **Approval Workflows:** Configurable multi-level approval rules
- **Notifications:** Template management for SMS, email, and push notifications

Every other module depends on Module K services. **Module K must be fully operational before any other module starts development.**

---

## Current Status: 70% Complete

### ✅ What Works

- User CRUD (list, create, edit, deactivate, reactivate)
- Role management (create, edit, delete roles)
- Role assignment to users
- Supabase Auth integration (email/password login)
- Login page with email/password form
- Route protection middleware (redirect to login if not authenticated)
- Basic RBAC middleware (permission checking foundation)
- Database schema: `auth.users`, `user_profiles`, `roles`, `user_roles`

### ❌ What's Missing (30%)

- **Settings Pages:** Company settings, tax config, document sequences, integration settings
- **Audit Log Viewer:** UI to browse audit trail with filters
- **Profile Editor:** Avatar upload, user preferences
- **Document Sequences:** Complete implementation with UI
- **Approval Workflows:** Configuration UI and enforcement logic
- **Notification Templates:** Template editor and test send
- **2FA Support:** Two-factor authentication (optional, deferred)
- **Backup/Restore UI:** Manual backup trigger and restore interface
- **System Health Dashboard:** Error log viewer, health checks
- **Session Management UI:** Active sessions viewer, force logout

---

## Database Tables

### Existing Tables

- `auth.users` — Supabase Auth managed (email, password, sign-in timestamps)
- `user_profiles` — Extended profile (full_name, phone, avatar_url)
- `roles` — Role definitions with permissions JSON
- `user_roles` — Many-to-many mapping of users to roles

### New Tables (To Be Created)

- `k_settings` — Key-value configuration store
- `k_audit_logs` — Immutable audit trail
- `k_document_sequences` — Atomic number generation
- `k_approval_rules` — Approval workflow definitions
- `k_notification_templates` — Message templates with variables
- `k_sessions` — Active session tracking

**See:** `schema.sql` for complete DDL

---

## Key API Actions

### User Management

- `getUsers(filter?)` — List users with optional filtering
- `getUserById(id)` — Get user detail with roles
- `createUser(data)` — Create new user account
- `updateUser(id, data)` — Update user profile
- `deactivateUser(id)` — Soft delete user
- `resetUserPassword(id)` — Send password reset email
- `updateOwnProfile(data)` — Current user updates their profile
- `uploadAvatar(file)` — Upload avatar image

### Roles & Permissions

- `getRoles()` — List all roles
- `createRole(data)` — Create new role with permissions
- `updateRole(id, data)` — Update role permissions
- `assignRole(userId, roleId)` — Assign role to user
- `revokeRole(userId, roleId)` — Remove role from user
- `checkPermission(userId, module, action)` — Check if user can perform action
- `getUserPermissions(userId)` — Get all user's permissions

### Settings

- `getSetting(key)` — Get setting by key
- `getSettingsByCategory(category)` — Get all settings in category
- `updateSetting(key, value)` — Update setting value
- `updateSettings(updates[])` — Bulk update settings

### Audit Log

- `logAudit(event)` — Write audit entry (platform internal)
- `getAuditLogs(filter)` — Query audit trail with pagination
- `exportAuditLogs(filter)` — Export audit logs to CSV

### Document Sequences

- `nextDocumentNumber(seriesCode)` — Get next number atomically
- `getDocumentSequences()` — List all sequences
- `createDocumentSequence(data)` — Create new sequence
- `updateDocumentSequence(id, data)` — Update sequence config

### Approval Workflows

- `getApprovalRules(module)` — Get approval rules for module
- `createApprovalRule(data)` — Create approval rule
- `requiresApproval(module, actionType, value)` — Check if approval needed

### Notification Templates

- `getNotificationTemplates()` — List all templates
- `updateNotificationTemplate(id, data)` — Update template
- `testNotificationTemplate(id, testData)` — Send test notification

**See:** `contracts.ts` for complete type definitions and signatures

---

## UI Screens

### Existing Screens

- `/login` — Login page with email/password
- `/admin/users` — User list
- `/admin/users/new` — Create user form
- `/admin/users/[id]` — User detail
- `/admin/users/[id]/edit` — Edit user
- `/admin/roles` — Role list
- `/admin/roles/[id]/edit` — Edit role permissions

### Screens To Build

- `/admin/settings/company` — Company profile, logo, hours, holidays
- `/admin/settings/tax` — Tax rate, currency
- `/admin/settings/sequences` — Document numbering configuration
- `/admin/settings/approval` — Approval workflow rules
- `/admin/settings/templates` — Notification template editor
- `/admin/settings/integrations` — SMS, email, payment API keys
- `/admin/audit-log` — Audit trail viewer with filters
- `/admin/profile` — Current user's profile editor
- `/admin/health` — System health dashboard (optional)
- `/admin/sessions` — Active sessions viewer (optional)

---

## Dependencies

### Module K Has No Dependencies

Module K is the foundational layer. It depends only on:

- **Supabase Auth** (provided by infrastructure)
- **Supabase Database** (PostgreSQL)
- **Supabase Storage** (for avatar uploads)

### All Other Modules Depend on K

Every module (A through J) depends on Module K for:

| Service | Used By | Purpose |
|---------|---------|---------|
| `requireAuth()` | All modules | Enforce authentication on protected routes |
| `checkPermission()` | All modules | Enforce RBAC on actions |
| `logAudit()` | All modules | Write audit trail entries |
| `getSetting()` | B, E, H | Read system configuration |
| `nextDocumentNumber()` | C, D, E | Generate document numbers |
| `requiresApproval()` | C, E, G | Check if approval needed |
| `sendNotification()` | B, H, I | Send SMS, email, push notifications |

---

## How to Test

### Unit Tests

- Password validation logic
- Permission checking (all RBAC matrix combinations)
- Setting value parsing and validation

### Integration Tests

1. **Authentication Flow:**
   - Register new user → Login → Access protected route → Logout
   
2. **Role Assignment:**
   - Create role with permissions → Assign to user → Verify user has permissions

3. **Audit Trail:**
   - Perform state-changing action → Verify audit log entry created → Attempt to modify audit log (should fail)

4. **Document Numbering:**
   - Generate 100 document numbers concurrently → Verify no duplicates, no gaps

5. **Settings:**
   - Update setting → Read setting → Verify value matches

### Negative Tests

- Login with wrong password → Verify account lockout after max attempts
- Unauthorized user accesses admin endpoint → Verify 403 Forbidden
- Attempt to modify audit log → Verify operation rejected

### Performance Tests

- Settings load time < 500ms
- User list (100 users) load < 1 second
- Permission check < 50ms

### Backup/Restore Test

- Create backup → Restore to separate environment → Verify data integrity

---

## Integration Checklist

Before other modules can start, Module K must provide:

- [ ] `requireAuth()` middleware working and tested
- [ ] `checkPermission()` API working with test coverage for all roles
- [ ] `logAudit()` writing to audit log successfully
- [ ] `getSetting()` returning all common settings (shop hours, tax rate, etc.)
- [ ] `nextDocumentNumber()` generating unique sequential numbers atomically
- [ ] User and role management UI complete
- [ ] All Module K database tables created and seeded
- [ ] RLS policies active and tested
- [ ] Audit log immutability verified
- [ ] Module K security review passed

**Gate:** Module K Gate M2 must pass before Phase 2 (Modules B, C) begins.

---

## Security Notes

- All passwords hashed with bcrypt via Supabase Auth (never stored plaintext)
- Audit log is **append-only** (no UPDATE or DELETE RLS policies)
- Sensitive settings (API keys) are flagged `is_sensitive` and masked in UI
- Integration credentials stored encrypted in Supabase vault
- Session tokens are HTTP-only cookies (managed by Supabase Auth)
- Rate limiting on login endpoint (10 attempts per IP per 15 minutes)
- Account lockout after 5 failed login attempts for 15 minutes
- CSRF protection via Supabase Auth built-in mechanisms

---

## Design Brand Colors

Module K admin UI uses these JVS Autoworks brand colors:

- **Chrome White:** #F8F8F8 (page backgrounds)
- **Chrome Silver:** #C0C0C0 (light borders, secondary UI)
- **Steel Gray:** #989898 (secondary text, mid-tone borders)
- **Gunmetal:** #585858 (primary text, dark shadows)
- **Racing Red:** #950304 (primary actions, alerts, danger states)
- **Steel Blue:** #446A91 (links, info states, secondary actions)
- **Navy:** #203C53 (headers, dark backgrounds, "WORKS" fill)

All UI must use design tokens, not raw hex values. See `docs/design/DESIGN-SYSTEM-PLAN.md` for token mappings.

---

## Developer Notes

### Adding a New Permission

1. Define permission in `permissions.ts`:
   ```typescript
   export const PERMISSIONS = {
     'customers.create': 'Create customers',
     'customers.update': 'Edit customers',
     'customers.delete': 'Delete customers'
   }
   ```

2. Add to role's permissions JSON in `roles` table:
   ```json
   {
     "customers": ["create", "update", "delete"]
   }
   ```

3. Enforce in server action:
   ```typescript
   await requirePermission('customers', 'create')
   ```

### Adding a New Setting

1. Insert into `k_settings` table:
   ```sql
   INSERT INTO k_settings (key, value, description, category)
   VALUES ('feature.new_feature', 'true', 'Enable new feature', 'features');
   ```

2. Read in code:
   ```typescript
   const enabled = await getSetting<boolean>('feature.new_feature')
   ```

### Adding a New Document Sequence

1. Insert into `k_document_sequences`:
   ```sql
   INSERT INTO k_document_sequences (series_code, prefix, padding)
   VALUES ('QT', 'QT-', 6);
   ```

2. Generate numbers:
   ```typescript
   const quoteNumber = await nextDocumentNumber('QT') // "QT-000001"
   ```

---

**Module K is the foundation. Get it right, and the rest of the system stands strong.**
