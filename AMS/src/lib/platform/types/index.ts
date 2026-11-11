/**
 * Platform Kernel — shared TypeScript types.
 * Import from here, not from individual files.
 */
export type { Database, Json } from './database';

// Role IDs — must match the roles seed in 00001_initial_schema.sql
export enum RoleId {
  Admin = 1,
  Manager = 2,
  Supervisor = 3,
  Mechanic = 4,
  Cashier = 5,
  Accounting = 6,
  Customer = 7,
}

export type Permission = `${string}:${'read' | 'write' | 'delete' | 'admin'}`;

// --- Auth ---
export interface AuthUser {
  id: string;
  email: string | undefined;
  roles: RoleId[];
}

export interface UserSession {
  user: AuthUser;
  expiresAt: number;
}

// --- Database row shapes (convenience re-exports) ---
import type { Database } from './database';
export type UserProfile = Database['public']['Tables']['user_profiles']['Row'];
export type Role = Database['public']['Tables']['roles']['Row'];
export type UserRole = Database['public']['Tables']['user_roles']['Row'];
export type AuditLog = Database['public']['Tables']['audit_log']['Row'];
export type OutboxEvent = Database['public']['Tables']['outbox']['Row'];

// --- API helpers ---
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
  status: number;
}

export interface PaginationParams {
  page: number;
  pageSize: number;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}
