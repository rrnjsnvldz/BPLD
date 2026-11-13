/**
 * Module K: Administration — TypeScript Type Contracts
 * 
 * This file defines all TypeScript types and server action signatures for Module K.
 * Other modules import types from here, never from internal implementation files.
 */

// ============================================================================
// Core Types
// ============================================================================

export type User = {
  id: string
  email: string
  full_name: string
  phone: string | null
  avatar_url: string | null
  is_active: boolean
  email_confirmed_at: string | null
  last_sign_in_at: string | null
  created_at: string
  updated_at: string
}

export type UserDetail = User & {
  roles: Role[]
  permissions: Permission[]
}

export type Role = {
  id: string
  name: string
  description: string | null
  permissions: Record<string, string[]> // { "module_code": ["action1", "action2"] }
  created_at: string
  updated_at: string
}

export type RoleDetail = Role & {
  user_count: number
}

export type Permission = {
  module: string
  action: string
  resource?: string
}

export type Setting = {
  id: string
  key: string
  value: unknown // JSON value (string, number, boolean, object, array)
  description: string | null
  category: string
  is_sensitive: boolean
  updated_at: string
  updated_by: string | null
}

export type AuditLog = {
  id: string
  user_id: string | null
  action: string
  module: string
  table_name: string | null
  record_id: string | null
  old_data: Record<string, unknown> | null
  new_data: Record<string, unknown> | null
  ip_address: string | null
  user_agent: string | null
  created_at: string
}

export type AuditLogWithUser = AuditLog & {
  user_name: string | null
  user_email: string | null
}

export type DocumentSequence = {
  id: string
  series_code: string
  prefix: string
  last_number: number
  padding: number
  fiscal_year: number | null
  reset_annually: boolean
  created_at: string
}

export type ApprovalRule = {
  id: string
  module: string
  action_type: string
  threshold_value: number | null
  approver_role_id: string
  approver_role_name?: string
  is_active: boolean
  created_at: string
  updated_at: string
}

export type NotificationTemplate = {
  id: string
  template_code: string
  channel: 'sms' | 'email' | 'push'
  subject: string | null
  body_template: string
  variables: string[]
  is_active: boolean
  created_at: string
  updated_at: string
}

export type Session = {
  id: string
  user_id: string
  session_token: string
  ip_address: string | null
  user_agent: string | null
  last_activity_at: string
  expires_at: string
  created_at: string
}

// ============================================================================
// Input Types
// ============================================================================

export type CreateUserInput = {
  email: string
  full_name: string
  phone?: string
  password: string
  role_ids?: string[]
}

export type UpdateUserInput = {
  full_name?: string
  phone?: string
  avatar_url?: string
}

export type UpdateProfileInput = {
  full_name?: string
  phone?: string
  avatar_url?: string
}

export type UserFilter = {
  search?: string // Search by name, email, phone
  role_id?: string
  is_active?: boolean
  created_after?: string
  created_before?: string
}

export type CreateRoleInput = {
  name: string
  description?: string
  permissions: Record<string, string[]>
}

export type UpdateRoleInput = {
  name?: string
  description?: string
  permissions?: Record<string, string[]>
}

export type SettingUpdate = {
  key: string
  value: unknown
}

export type AuditEvent = {
  action: string
  module: string
  table_name?: string
  record_id?: string
  old_data?: unknown
  new_data?: unknown
}

export type AuditLogFilter = {
  user_id?: string
  module?: string
  action?: string
  table_name?: string
  from_date?: string
  to_date?: string
  limit?: number
  offset?: number
}

export type PaginatedAuditLogs = {
  data: AuditLogWithUser[]
  total: number
  limit: number
  offset: number
}

export type CreateSequenceInput = {
  series_code: string
  prefix: string
  padding?: number
  reset_annually?: boolean
  fiscal_year?: number
}

export type UpdateSequenceInput = {
  prefix?: string
  padding?: number
  reset_annually?: boolean
  fiscal_year?: number
}

export type CreateApprovalRuleInput = {
  module: string
  action_type: string
  threshold_value?: number
  approver_role_id: string
}

export type UpdateApprovalRuleInput = {
  threshold_value?: number
  approver_role_id?: string
  is_active?: boolean
}

export type UpdateTemplateInput = {
  subject?: string
  body_template?: string
  variables?: string[]
  is_active?: boolean
}

// ============================================================================
// API Response Envelope
// ============================================================================

export type ApiResponse<T> = {
  data: T | null
  error: string | null
  message?: string
}

// ============================================================================
// Server Action Signatures
// ============================================================================

/**
 * USER MANAGEMENT
 */

/**
 * Get all users with optional filtering
 * @example
 * const result = await getUsers({ is_active: true })
 * if (result.data) { console.log(result.data) }
 */
export declare function getUsers(filter?: UserFilter): Promise<ApiResponse<User[]>>

/**
 * Get a single user by ID with full profile and roles
 */
export declare function getUserById(id: string): Promise<ApiResponse<UserDetail>>

/**
 * Create a new user account
 */
export declare function createUser(data: CreateUserInput): Promise<ApiResponse<User>>

/**
 * Update user profile information (admin only)
 */
export declare function updateUser(id: string, data: UpdateUserInput): Promise<ApiResponse<User>>

/**
 * Deactivate user (soft delete)
 */
export declare function deactivateUser(id: string): Promise<ApiResponse<void>>

/**
 * Reactivate a previously deactivated user
 */
export declare function reactivateUser(id: string): Promise<ApiResponse<void>>

/**
 * Send password reset email
 */
export declare function resetUserPassword(id: string): Promise<ApiResponse<void>>

/**
 * Update current user's own profile
 */
export declare function updateOwnProfile(data: UpdateProfileInput): Promise<ApiResponse<User>>

/**
 * Upload avatar image for current user
 */
export declare function uploadAvatar(file: File): Promise<ApiResponse<{ url: string }>>

/**
 * ROLE AND PERMISSION MANAGEMENT
 */

/**
 * Get all roles
 */
export declare function getRoles(): Promise<ApiResponse<Role[]>>

/**
 * Get role by ID with permissions detail
 */
export declare function getRoleById(id: string): Promise<ApiResponse<RoleDetail>>

/**
 * Create a new role
 */
export declare function createRole(data: CreateRoleInput): Promise<ApiResponse<Role>>

/**
 * Update role name, description, or permissions
 */
export declare function updateRole(id: string, data: UpdateRoleInput): Promise<ApiResponse<Role>>

/**
 * Delete a role (only if no users assigned)
 */
export declare function deleteRole(id: string): Promise<ApiResponse<void>>

/**
 * Assign role to user
 */
export declare function assignRole(userId: string, roleId: string): Promise<ApiResponse<void>>

/**
 * Revoke role from user
 */
export declare function revokeRole(userId: string, roleId: string): Promise<ApiResponse<void>>

/**
 * Check if user has specific permission
 * @example
 * const canEdit = await checkPermission(userId, 'customers', 'update')
 */
export declare function checkPermission(
  userId: string,
  module: string,
  action: string
): Promise<ApiResponse<boolean>>

/**
 * Get all permissions for a user (aggregated from all their roles)
 */
export declare function getUserPermissions(userId: string): Promise<ApiResponse<Permission[]>>

/**
 * SETTINGS MANAGEMENT
 */

/**
 * Get setting by key
 * @example
 * const result = await getSetting('shop.hours')
 * const hours = result.data?.value as Record<string, string>
 */
export declare function getSetting(key: string): Promise<ApiResponse<Setting>>

/**
 * Get all settings in a category
 */
export declare function getSettingsByCategory(category: string): Promise<ApiResponse<Setting[]>>

/**
 * Get all settings (admin only)
 */
export declare function getAllSettings(): Promise<ApiResponse<Setting[]>>

/**
 * Update setting value
 */
export declare function updateSetting(key: string, value: unknown): Promise<ApiResponse<Setting>>

/**
 * Bulk update settings
 */
export declare function updateSettings(updates: SettingUpdate[]): Promise<ApiResponse<Setting[]>>

/**
 * AUDIT LOG
 */

/**
 * Log an audit event (called by platform, not directly by UI)
 */
export declare function logAudit(event: AuditEvent): Promise<ApiResponse<void>>

/**
 * Get audit logs with filtering and pagination
 */
export declare function getAuditLogs(filter: AuditLogFilter): Promise<ApiResponse<PaginatedAuditLogs>>

/**
 * Export audit logs to CSV
 */
export declare function exportAuditLogs(filter: AuditLogFilter): Promise<ApiResponse<{ url: string }>>

/**
 * DOCUMENT SEQUENCES
 */

/**
 * Get next document number atomically (thread-safe)
 * @example
 * const result = await nextDocumentNumber('SO')
 * console.log(result.data) // 'SO-000042'
 */
export declare function nextDocumentNumber(seriesCode: string): Promise<ApiResponse<string>>

/**
 * Get all document sequences (for settings screen)
 */
export declare function getDocumentSequences(): Promise<ApiResponse<DocumentSequence[]>>

/**
 * Create new document sequence
 */
export declare function createDocumentSequence(
  data: CreateSequenceInput
): Promise<ApiResponse<DocumentSequence>>

/**
 * Update document sequence configuration (not the number itself)
 */
export declare function updateDocumentSequence(
  id: string,
  data: UpdateSequenceInput
): Promise<ApiResponse<DocumentSequence>>

/**
 * APPROVAL WORKFLOW
 */

/**
 * Get approval rules for a module
 */
export declare function getApprovalRules(module: string): Promise<ApiResponse<ApprovalRule[]>>

/**
 * Create approval rule
 */
export declare function createApprovalRule(
  data: CreateApprovalRuleInput
): Promise<ApiResponse<ApprovalRule>>

/**
 * Update approval rule
 */
export declare function updateApprovalRule(
  id: string,
  data: UpdateApprovalRuleInput
): Promise<ApiResponse<ApprovalRule>>

/**
 * Delete approval rule
 */
export declare function deleteApprovalRule(id: string): Promise<ApiResponse<void>>

/**
 * Check if action requires approval
 * @example
 * const result = await requiresApproval('E', 'discount', 1500000) // 15,000 pesos = 1,500,000 centavos
 * if (result.data?.required) {
 *   console.log('Approval needed from role:', result.data.approverRoleId)
 * }
 */
export declare function requiresApproval(
  module: string,
  actionType: string,
  value: number
): Promise<ApiResponse<{ required: boolean; approverRoleId?: string }>>

/**
 * NOTIFICATION TEMPLATES
 */

/**
 * Get all notification templates
 */
export declare function getNotificationTemplates(): Promise<ApiResponse<NotificationTemplate[]>>

/**
 * Get template by code
 */
export declare function getNotificationTemplate(code: string): Promise<ApiResponse<NotificationTemplate>>

/**
 * Update notification template
 */
export declare function updateNotificationTemplate(
  id: string,
  data: UpdateTemplateInput
): Promise<ApiResponse<NotificationTemplate>>

/**
 * Test notification template (send to admin email/phone)
 */
export declare function testNotificationTemplate(
  id: string,
  testData: Record<string, unknown>
): Promise<ApiResponse<void>>

/**
 * ERROR CODES
 */

export enum ErrorCode {
  // Authentication
  INVALID_CREDENTIALS = 'INVALID_CREDENTIALS',
  ACCOUNT_LOCKED = 'ACCOUNT_LOCKED',
  SESSION_EXPIRED = 'SESSION_EXPIRED',
  
  // Authorization
  PERMISSION_DENIED = 'PERMISSION_DENIED',
  ROLE_NOT_FOUND = 'ROLE_NOT_FOUND',
  
  // User management
  USER_NOT_FOUND = 'USER_NOT_FOUND',
  EMAIL_ALREADY_EXISTS = 'EMAIL_ALREADY_EXISTS',
  WEAK_PASSWORD = 'WEAK_PASSWORD',
  
  // Settings
  SETTING_NOT_FOUND = 'SETTING_NOT_FOUND',
  INVALID_SETTING_VALUE = 'INVALID_SETTING_VALUE',
  
  // Document sequences
  SEQUENCE_NOT_FOUND = 'SEQUENCE_NOT_FOUND',
  SEQUENCE_CODE_EXISTS = 'SEQUENCE_CODE_EXISTS',
  
  // General
  VALIDATION_ERROR = 'VALIDATION_ERROR',
  INTERNAL_ERROR = 'INTERNAL_ERROR'
}

// ============================================================================
// Example Usage
// ============================================================================

/**
 * Example: Create a user and assign roles
 * 
 * ```typescript
 * import { createUser, assignRole } from '@/lib/modules/admin/actions'
 * 
 * async function setupNewCashier() {
 *   const userResult = await createUser({
 *     email: 'cashier@jrs.com',
 *     full_name: 'Maria Santos',
 *     phone: '09171234567',
 *     password: 'SecurePassword123!'
 *   })
 *   
 *   if (userResult.error) {
 *     console.error('Failed to create user:', userResult.error)
 *     return
 *   }
 *   
 *   const userId = userResult.data!.id
 *   
 *   // Assign cashier role
 *   await assignRole(userId, 'cashier-role-id')
 *   
 *   console.log('Cashier created successfully')
 * }
 * ```
 */

/**
 * Example: Check permission before action
 * 
 * ```typescript
 * import { checkPermission } from '@/lib/modules/admin/actions'
 * 
 * async function deleteCustomer(userId: string, customerId: string) {
 *   const permResult = await checkPermission(userId, 'customers', 'delete')
 *   
 *   if (!permResult.data) {
 *     throw new Error('Permission denied: cannot delete customers')
 *   }
 *   
 *   // Proceed with deletion...
 * }
 * ```
 */

/**
 * Example: Get shop hours setting
 * 
 * ```typescript
 * import { getSetting } from '@/lib/modules/admin/actions'
 * 
 * async function getShopHours() {
 *   const result = await getSetting('shop.hours')
 *   
 *   if (result.data) {
 *     const hours = result.data.value as Record<string, string>
 *     console.log('Monday hours:', hours.monday) // "08:00-17:00"
 *   }
 * }
 * ```
 */

/**
 * Example: Generate next invoice number
 * 
 * ```typescript
 * import { nextDocumentNumber } from '@/lib/modules/admin/actions'
 * 
 * async function createInvoice() {
 *   const result = await nextDocumentNumber('INV')
 *   
 *   const invoiceNumber = result.data! // "INV-000042"
 *   
 *   // Use in invoice creation...
 * }
 * ```
 */
