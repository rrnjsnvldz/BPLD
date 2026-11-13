# Module K: User Management and System Administration — Technical Specification

**Version:** 1.0  
**Status:** Phase 1 Module  
**Last Updated:** 2026-11-10  
**Module Owner:** TBD

---

## Overview

Module K is the **foundational security and configuration layer** for the entire AMS platform. It controls who can access the system, what they can do, what happened, and how the system behaves. Every other module depends on K for authentication, authorization, audit logging, settings retrieval, document numbering, and notifications.

**Development Priority:** Module K must be deployed before any other module. It is approximately **70% complete** as of 2026-11-10:

### What is Working (70% Complete)

- ✅ User CRUD (list, create, edit, deactivate)
- ✅ Role assignment to users
- ✅ Basic authentication (Supabase Auth integration with email/password)
- ✅ Login page with email/password form
- ✅ Route protection middleware (authenticated routes redirect to login)
- ✅ Basic RBAC middleware (permission checking foundation)
- ✅ Database schema: `auth.users` (Supabase), `user_profiles`, `roles`, `user_roles`

### What Still Needs Building (30% Remaining)

- ❌ Settings pages (K-S04 through K-S16 from checklist)
- ❌ Audit log viewer (K-S03)
- ❌ Extended profile editing (avatar upload, preferences)
- ❌ Document numbering sequences (K-F08, K-S06)
- ❌ Approval workflow configuration (K-F04, K-S14)
- ❌ Backup/restore UI (K-F13, K-S15)
- ❌ Integration settings pages (K-F15, K-S13)
- ❌ 2FA support (K-F03 extension)
- ❌ Template editor (K-F09, K-S07)
- ❌ System health dashboard (K-S16)
- ❌ Session management UI (K-S17)
- ❌ Complete permission matrix implementation
- ❌ Notification template management (K-S12)

---

## Current Status: Database Schema

### Existing Tables (Already in Supabase)

```sql
-- Managed by Supabase Auth
auth.users (
  id uuid PRIMARY KEY,
  email text UNIQUE NOT NULL,
  encrypted_password text,
  email_confirmed_at timestamptz,
  last_sign_in_at timestamptz,
  created_at timestamptz DEFAULT now()
)

-- User profile extension (already created)
user_profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  full_name text NOT NULL,
  phone text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Roles (already created)
roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text UNIQUE NOT NULL,
  description text,
  permissions jsonb NOT NULL DEFAULT '{}',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- User role assignments (already created)
user_roles (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  role_id uuid REFERENCES roles(id) ON DELETE CASCADE,
  assigned_at timestamptz DEFAULT now(),
  assigned_by uuid REFERENCES auth.users(id),
  UNIQUE(user_id, role_id)
)
```

### New Tables Needed

These tables must be created to complete Module K:

```sql
-- System settings key-value store
k_settings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  key text UNIQUE NOT NULL,
  value jsonb NOT NULL DEFAULT '""',
  description text,
  category text NOT NULL DEFAULT 'general',
  is_sensitive boolean NOT NULL DEFAULT false,
  updated_at timestamptz DEFAULT now(),
  updated_by uuid REFERENCES auth.users(id)
)

-- Immutable audit log
k_audit_logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id),
  action text NOT NULL,
  module text NOT NULL,
  table_name text,
  record_id text,
  old_data jsonb,
  new_data jsonb,
  ip_address inet,
  user_agent text,
  created_at timestamptz DEFAULT now()
)

-- Document number sequences (atomic)
k_document_sequences (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  series_code text UNIQUE NOT NULL,
  prefix text NOT NULL,
  last_number integer NOT NULL DEFAULT 0,
  padding integer NOT NULL DEFAULT 6,
  fiscal_year integer,
  reset_annually boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
)

-- Approval workflow rules
k_approval_rules (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  module text NOT NULL,
  action_type text NOT NULL,
  threshold_value numeric,
  approver_role_id uuid REFERENCES roles(id),
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Notification templates
k_notification_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  template_code text UNIQUE NOT NULL,
  channel text NOT NULL, -- sms, email, push
  subject text,
  body_template text NOT NULL,
  variables jsonb NOT NULL DEFAULT '[]',
  is_active boolean NOT NULL DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
)

-- Active sessions tracking
k_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  session_token text UNIQUE NOT NULL,
  ip_address inet,
  user_agent text,
  last_activity_at timestamptz DEFAULT now(),
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now()
)
```

---

## API Contracts

All server actions follow the standard response envelope:

```typescript
type ApiResponse<T> = {
  data: T | null
  error: string | null
  message?: string
}
```

### User Management Actions

```typescript
/**
 * Get all users with optional filtering
 */
getUsers(filter?: UserFilter): Promise<ApiResponse<User[]>>

/**
 * Get a single user by ID with full profile and roles
 */
getUserById(id: string): Promise<ApiResponse<UserDetail>>

/**
 * Create a new user account
 */
createUser(data: CreateUserInput): Promise<ApiResponse<User>>

/**
 * Update user profile information
 */
updateUser(id: string, data: UpdateUserInput): Promise<ApiResponse<User>>

/**
 * Deactivate user (soft delete - sets is_active flag)
 */
deactivateUser(id: string): Promise<ApiResponse<void>>

/**
 * Reactivate a previously deactivated user
 */
reactivateUser(id: string): Promise<ApiResponse<void>>

/**
 * Send password reset email
 */
resetUserPassword(id: string): Promise<ApiResponse<void>>

/**
 * Update user's own profile
 */
updateOwnProfile(data: UpdateProfileInput): Promise<ApiResponse<UserProfile>>

/**
 * Upload avatar image
 */
uploadAvatar(file: File): Promise<ApiResponse<{ url: string }>>
```

### Role and Permission Actions

```typescript
/**
 * Get all roles
 */
getRoles(): Promise<ApiResponse<Role[]>>

/**
 * Get role by ID with permissions detail
 */
getRoleById(id: string): Promise<ApiResponse<RoleDetail>>

/**
 * Create a new role
 */
createRole(data: CreateRoleInput): Promise<ApiResponse<Role>>

/**
 * Update role name, description, or permissions
 */
updateRole(id: string, data: UpdateRoleInput): Promise<ApiResponse<Role>>

/**
 * Delete a role (only if no users assigned)
 */
deleteRole(id: string): Promise<ApiResponse<void>>

/**
 * Assign role to user
 */
assignRole(userId: string, roleId: string): Promise<ApiResponse<void>>

/**
 * Revoke role from user
 */
revokeRole(userId: string, roleId: string): Promise<ApiResponse<void>>

/**
 * Check if user has specific permission
 */
checkPermission(userId: string, module: string, action: string): Promise<ApiResponse<boolean>>

/**
 * Get all permissions for a user (aggregated from all their roles)
 */
getUserPermissions(userId: string): Promise<ApiResponse<Permission[]>>
```

### Settings Actions

```typescript
/**
 * Get setting by key
 */
getSetting(key: string): Promise<ApiResponse<Setting>>

/**
 * Get all settings in a category
 */
getSettingsByCategory(category: string): Promise<ApiResponse<Setting[]>>

/**
 * Get all settings (admin only)
 */
getAllSettings(): Promise<ApiResponse<Setting[]>>

/**
 * Update setting value
 */
updateSetting(key: string, value: unknown): Promise<ApiResponse<Setting>>

/**
 * Bulk update settings
 */
updateSettings(updates: SettingUpdate[]): Promise<ApiResponse<Setting[]>>
```

### Audit Log Actions

```typescript
/**
 * Log an audit event (called by platform, not directly by UI)
 */
logAudit(event: AuditEvent): Promise<ApiResponse<void>>

/**
 * Get audit logs with filtering and pagination
 */
getAuditLogs(filter: AuditLogFilter): Promise<ApiResponse<PaginatedAuditLogs>>

/**
 * Export audit logs to CSV
 */
exportAuditLogs(filter: AuditLogFilter): Promise<ApiResponse<{ url: string }>>
```

### Document Sequence Actions

```typescript
/**
 * Get next document number atomically
 */
nextDocumentNumber(seriesCode: string): Promise<ApiResponse<string>>

/**
 * Get all document sequences (for settings screen)
 */
getDocumentSequences(): Promise<ApiResponse<DocumentSequence[]>>

/**
 * Create new document sequence
 */
createDocumentSequence(data: CreateSequenceInput): Promise<ApiResponse<DocumentSequence>>

/**
 * Update document sequence configuration (not the number itself)
 */
updateDocumentSequence(id: string, data: UpdateSequenceInput): Promise<ApiResponse<DocumentSequence>>
```

### Approval Workflow Actions

```typescript
/**
 * Get approval rules for a module
 */
getApprovalRules(module: string): Promise<ApiResponse<ApprovalRule[]>>

/**
 * Create approval rule
 */
createApprovalRule(data: CreateApprovalRuleInput): Promise<ApiResponse<ApprovalRule>>

/**
 * Update approval rule
 */
updateApprovalRule(id: string, data: UpdateApprovalRuleInput): Promise<ApiResponse<ApprovalRule>>

/**
 * Delete approval rule
 */
deleteApprovalRule(id: string): Promise<ApiResponse<void>>

/**
 * Check if action requires approval
 */
requiresApproval(module: string, actionType: string, value: number): Promise<ApiResponse<{ required: boolean; approverRoleId?: string }>>
```

### Notification Template Actions

```typescript
/**
 * Get all notification templates
 */
getNotificationTemplates(): Promise<ApiResponse<NotificationTemplate[]>>

/**
 * Get template by code
 */
getNotificationTemplate(code: string): Promise<ApiResponse<NotificationTemplate>>

/**
 * Update notification template
 */
updateNotificationTemplate(id: string, data: UpdateTemplateInput): Promise<ApiResponse<NotificationTemplate>>

/**
 * Test notification template (send to admin)
 */
testNotificationTemplate(id: string, testData: Record<string, unknown>): Promise<ApiResponse<void>>
```

---

## Folder Structure

```
src/
├── lib/
│   ├── modules/
│   │   └── admin/              # Module K code
│   │       ├── actions.ts      # Server actions (all APIs above)
│   │       ├── types.ts        # TypeScript type definitions
│   │       ├── permissions.ts  # Permission constants and helpers
│   │       └── utils.ts        # Helper functions (password validation, etc.)
│   └── platform/               # Shared platform services
│       ├── auth.ts             # Auth helpers (requireAuth, getCurrentUser)
│       ├── audit.ts            # Audit logging helper (logAudit wrapper)
│       ├── settings.ts         # Settings cache and helpers
│       └── rbac.ts             # RBAC enforcement utilities
├── app/
│   ├── (auth)/                 # Public auth pages
│   │   ├── login/
│   │   │   └── page.tsx        # Login page
│   │   └── forgot-password/
│   │       └── page.tsx        # Password reset request
│   └── (modules)/              # Protected module pages
│       └── admin/              # Module K pages
│           ├── users/
│           │   ├── page.tsx             # User list
│           │   ├── new/page.tsx         # Create user
│           │   └── [id]/
│           │       ├── page.tsx         # User detail
│           │       └── edit/page.tsx    # Edit user
│           ├── roles/
│           │   ├── page.tsx             # Role list
│           │   ├── new/page.tsx         # Create role
│           │   └── [id]/
│           │       ├── page.tsx         # Role detail
│           │       └── edit/page.tsx    # Edit role + permissions
│           ├── settings/
│           │   ├── company/page.tsx     # Company settings
│           │   ├── tax/page.tsx         # Tax & currency settings
│           │   ├── sequences/page.tsx   # Document numbering
│           │   ├── approval/page.tsx    # Approval rules
│           │   ├── templates/page.tsx   # Notification templates
│           │   └── integrations/page.tsx # Integration settings
│           ├── audit-log/
│           │   └── page.tsx             # Audit log viewer
│           └── profile/
│               └── page.tsx             # Current user's profile editor
```

---

## Integration Points

Module K **provides services to all other modules**. It has no dependencies on other modules.

### Services Provided to All Modules

#### Authentication Service
```typescript
// Used by: All modules
requireAuth(): Promise<User> // Throws if not authenticated
getCurrentUser(): Promise<User | null>
signIn(email: string, password: string): Promise<User>
signOut(): Promise<void>
```

#### Authorization Service
```typescript
// Used by: All modules
checkPermission(userId: string, module: string, action: string): Promise<boolean>
requirePermission(module: string, action: string): void // Middleware
hasAnyRole(userId: string, roles: string[]): Promise<boolean>
```

#### Audit Service
```typescript
// Used by: All modules
logAudit(event: {
  action: string
  module: string
  tableName?: string
  recordId?: string
  oldData?: unknown
  newData?: unknown
}): Promise<void>
```

#### Settings Service
```typescript
// Used by: All modules
getSetting<T>(key: string): Promise<T>
getSetting<T>(key: string, defaultValue: T): Promise<T>

// Common settings consumed by other modules:
// - shop.hours (B: scheduling)
// - shop.holidays (B: scheduling)
// - tax.rate (E: billing)
// - tax.inclusive (E: billing)
// - currency.code (E: billing)
// - sms.provider (H, I: reminders)
// - email.provider (H, I: reminders)
```

#### Document Numbering Service
```typescript
// Used by: C (service orders), E (invoices, receipts), D (purchase orders)
nextDocumentNumber(seriesCode: 'SO' | 'INV' | 'REC' | 'PO'): Promise<string>
// Returns: 'SO-000001', 'INV-2024-000042', etc.
```

#### Notification Service
```typescript
// Used by: B (appointment reminders), H (maintenance reminders), I (follow-ups)
sendNotification(event: {
  templateCode: string
  channel: 'sms' | 'email' | 'push'
  recipient: string
  data: Record<string, unknown>
}): Promise<void>
```

---

## Development Remaining

### High Priority (Blocks Other Modules)

1. **Complete Audit Logging** — All modules need `logAudit()` working
2. **Settings API Complete** — Modules B, C, E need settings (shop hours, tax rate, etc.)
3. **Document Sequences** — Module C (service orders) and E (invoices) need atomic numbering
4. **Permission Matrix Complete** — Implement all RBAC checks per matrix in Master Plan

### Medium Priority (Complete in Phase 1)

1. **Settings UI Pages** — K-S04 through K-S11, K-S13
2. **Audit Log Viewer** — K-S03
3. **Profile Editing** — Avatar upload, extended preferences
4. **Approval Workflow Config** — K-S14 (needed by Module E for voids, discounts)
5. **Notification Templates** — K-S12 (needed by Modules B, H, I)

### Low Priority (Can Defer to Phase 2)

1. **2FA Support** — K-F03 extension
2. **Backup/Restore UI** — K-S15 (manual backups work via Supabase dashboard for now)
3. **System Health Dashboard** — K-S16
4. **Session Management UI** — K-S17

---

## Security Notes

- All passwords hashed with bcrypt via Supabase Auth
- Audit log is append-only (no UPDATE or DELETE policies)
- Settings marked `is_sensitive` are masked in UI unless user has `admin.settings.view_sensitive` permission
- Integration credentials encrypted at rest in Supabase vault
- Session tokens are HTTP-only cookies managed by Supabase Auth
- CSRF protection via Supabase Auth built-in mechanisms
- Rate limiting on login endpoint (10 attempts per IP per 15 minutes)

---

## Testing Strategy

- **Unit Tests:** Permission checking logic, password validation, setting value parsing
- **Integration Tests:** Full auth flow (login → protected route → logout), role assignment flow, audit log writes
- **Negative Tests:** Unauthorized access attempts, invalid permission checks, audit log tampering attempts
- **Concurrency Tests:** Document sequence generation under simultaneous load (no duplicates)
- **Backup/Restore Test:** Full cycle test required before Gate M2

---

## Design Brand Colors Reference

Module K admin UI uses these brand colors:

- **Chrome White:** #F8F8F8 (page backgrounds)
- **Chrome Silver:** #C0C0C0 (light borders)
- **Steel Gray:** #989898 (secondary text)
- **Gunmetal:** #585858 (primary text)
- **Racing Red:** #950304 (primary action buttons, alerts)
- **Steel Blue:** #446A91 (links, info states)
- **Navy:** #203C53 (headers, dark backgrounds)

---

**END OF MODULE K SPECIFICATION**
