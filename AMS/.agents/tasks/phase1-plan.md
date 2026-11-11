# Implementation Plan: Phase 1 Platform Kernel Foundation

**Project:** AMS (Autoshop Management System)  
**Phase:** Phase 1 - Platform Kernel + Directory Scaffolding  
**Stack:** Next.js 16 (App Router) + React 19 + TypeScript + Supabase + Tailwind CSS + shadcn/ui  
**Target:** Establish foundation for all 11 modules (A–K)

---

## Exploration Summary

**Current State:**
- Next.js 16 with App Router configured (tsx, tailwind, App Router)
- TypeScript with strict mode enabled, path alias `@/*` → `./src/*`
- Dependencies installed: @supabase/ssr ^0.12.7, @supabase/supabase-js ^2.119.0, zod ^4.6.7, react-hook-form ^7.91.0, shadcn/ui components (lucide-react, class-variance-authority, clsx, tailwind-merge)
- ESLint configured with Next.js defaults (next/core-web-vitals, next/typescript)
- Root layout exists at src/app/layout.tsx with Geist fonts
- Existing structure: src/app/, src/lib/
- No supabase/ directory yet
- .gitignore excludes .env* files (already compliant)

**ADR-002 Module Boundary Rules (BINDING):**
1. Modules may only import from their own `lib/modules/[module-id]/*` and `lib/platform/*`
2. Cross-module imports must go through `contracts.ts` only
3. Module-to-module calls server-side only (Server Components, Server Actions, API Routes)
4. Database tables prefixed with module letter (e.g., `c_service_orders`, `d_items`)
5. RLS policies enforce access control per module
6. Cross-module side effects via outbox table domain events
7. Public contracts documented in `lib/modules/<module-id>/contracts.ts`

**Build Command:** `npm run build` (Next.js production build)  
**Test Framework:** Vitest (not yet installed — must be added)  
**Database:** Supabase Postgres with Row Level Security (RLS)  
**Migration Tool:** Supabase CLI (`supabase db reset`, `supabase gen types typescript`)

**Module List (11 modules from Master Plan §5):**
- Module A: customers (Customer and Vehicle Management)
- Module B: scheduling (Appointment and Service Scheduling)
- Module C: service-orders (Service Order and Job Management)
- Module D: inventory (Inventory and Stock Management)
- Module E: billing (POS and Billing)
- Module F: payroll (Payroll and HR)
- Module G: finance (Finance and Accounting)
- Module H: reminders (Maintenance Reminders)
- Module I: follow-up (After-Service Follow-Up)
- Module J: reporting (Reports and Analytics)
- Module K: administration (System Administration)

---

## Implementation Plan

### 1. Install Vitest and Create Workspace Configuration

- [x] **What:** Add Vitest as devDependency with TypeScript and path alias support
- [x] **Files:**
  - package.json (add vitest, @vitest/ui, @types/node to devDependencies)
  - vitest.config.ts (create with path alias resolution matching tsconfig.json)
- [x] **Verify:** Run `npm install` and confirm vitest installed; run `npx vitest --version` to confirm CLI works
- [x] **Dependencies:** None
- [x] **Notes:** Vitest required before writing architectural tests in step 9

---

### 2. Create Directory Scaffolding (Module Placeholders and Platform Folders)

- [x] **What:** Create empty directory structure per ADR-002 module layout for all 11 modules, platform kernel folders, UI component folders, and supabase migrations folder
- [x] **Files/Directories to Create:**
  ```
  src/app/(modules)/(platform)/         # Auth routes group (login, callback)
  src/app/(modules)/admin/              # Module K placeholder (administration)
  src/app/(modules)/customers/          # Module A placeholder
  src/app/(modules)/scheduling/         # Module B placeholder
  src/app/(modules)/service-orders/     # Module C placeholder
  src/app/(modules)/inventory/          # Module D placeholder
  src/app/(modules)/billing/            # Module E placeholder
  src/app/(modules)/payroll/            # Module F placeholder
  src/app/(modules)/finance/            # Module G placeholder
  src/app/(modules)/reminders/          # Module H placeholder
  src/app/(modules)/follow-up/          # Module I placeholder
  src/app/(modules)/reporting/          # Module J placeholder
  src/lib/platform/auth/
  src/lib/platform/db/
  src/lib/platform/types/
  src/lib/modules/customers/
  src/lib/modules/scheduling/
  src/lib/modules/service-orders/
  src/lib/modules/inventory/
  src/lib/modules/billing/
  src/lib/modules/payroll/
  src/lib/modules/finance/
  src/lib/modules/reminders/
  src/lib/modules/follow-up/
  src/lib/modules/reporting/
  src/lib/modules/administration/
  src/components/ui/
  src/components/platform/
  supabase/migrations/
  src/__tests__/
  .agents/tasks/
  ```
- [x] **Verify:** Run `Get-ChildItem -Path "c:\Users\User\AMS\src" -Recurse -Directory | Select-Object FullName` and confirm all folders exist
- [x] **Dependencies:** None
- [x] **Notes:** Empty folders establish structure; actual code added in later steps

---

### 3. Create Supabase Client Files (Browser, Server, Middleware Helper)

- [x] **What:** Implement Supabase client initialization using @supabase/ssr for browser and server contexts, plus middleware session refresh helper
- [x] **Files:**
  - `src/lib/platform/db/client.ts` — Browser client using `createBrowserClient` from @supabase/ssr
  - `src/lib/platform/db/server.ts` — Server client using `createServerClient` with cookies() from next/headers
  - `src/lib/platform/db/middleware.ts` — Exported `updateSession()` function for session refresh (not the middleware.ts file itself)
- [x] **Implementation Details:**
  - client.ts: Import createBrowserClient, read NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY from env, export singleton instance
  - server.ts: Import createServerClient and cookies from next/headers, return new client instance per request with cookie handlers
  - middleware.ts: Export async updateSession(request) function that creates supabase client with middleware cookie handlers, calls getUser() to refresh session, returns NextResponse
- [x] **Verify:** Run `npm run build` and confirm no TypeScript errors in these files; check that environment variables are read (will fail at runtime if missing, but should compile)
- [x] **Dependencies:** Step 2 (src/lib/platform/db/ folder must exist)
- [x] **Notes:** These files depend on environment variables defined in step 4; actual runtime requires .env.local

---

### 4. Create Environment Variable Template

- [x] **What:** Document required Supabase environment variables in a template file
- [x] **Files:**
  - `.env.local.example` — Template with placeholders for NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY, NEXT_PUBLIC_APP_URL
- [x] **Template Content:**
  ```
  # Supabase Configuration
  # Get these from your Supabase project settings: https://app.supabase.com/project/_/settings/api
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key-here
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key-here
  
  # Application URL (for redirects)
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```
- [x] **Verify:** Confirm file exists and contains all four variables with explanatory comments
- [x] **Dependencies:** None
- [x] **Notes:** Developers must copy to .env.local and fill in actual values; .env.local already excluded by .gitignore

---

### 5. Create Next.js Middleware for Session Refresh

- [x] **What:** Implement Next.js middleware at root level to refresh Supabase auth session on every request and protect routes
- [x] **Files:**
  - `src/middleware.ts` — Import updateSession from lib/platform/db/middleware, call it, redirect unauthenticated users to /login except for /login and /auth/callback
- [x] **Implementation Details:**
  - Import { updateSession } from '@/lib/platform/db/middleware'
  - Export async middleware(request: NextRequest)
  - Call const response = await updateSession(request)
  - Check if user authenticated: if not and path is not /login or /auth/callback, redirect to /login
  - Export config with matcher: exclude _next/static, _next/image, favicon.ico
- [x] **Verify:** Run `npm run build` and confirm middleware compiles without errors
- [x] **Dependencies:** Step 3 (middleware helper must exist)
- [x] **Notes:** Middleware runs on every request; actual auth check depends on Supabase connection

---

### 6. Create Base SQL Migration Schema

- [x] **What:** Write initial database schema migration with user_profiles, roles, user_roles, audit_log, outbox tables, RLS policies, and role seeds
- [x] **Files:**
  - `supabase/migrations/00001_initial_schema.sql`
- [x] **Schema Components:**
  1. CREATE TABLE public.user_profiles (id uuid REFERENCES auth.users ON DELETE CASCADE PRIMARY KEY, full_name text, avatar_url text, phone text, timezone text DEFAULT 'Asia/Manila', locale text DEFAULT 'en-PH', created_at timestamptz DEFAULT now(), updated_at timestamptz DEFAULT now())
  2. CREATE TABLE public.roles (id smallint PRIMARY KEY, name text UNIQUE NOT NULL, description text)
  3. INSERT INTO public.roles (id, name, description) VALUES (1,'Admin','Full system access'), (2,'Manager','Manage shop operations'), (3,'Supervisor','Supervise mechanics'), (4,'Mechanic','Service technician'), (5,'Cashier','POS and billing'), (6,'Accounting','Finance and accounting'), (7,'Customer','External customer portal')
  4. CREATE TABLE public.user_roles (user_id uuid REFERENCES auth.users ON DELETE CASCADE, role_id smallint REFERENCES public.roles ON DELETE CASCADE, granted_by uuid REFERENCES auth.users, granted_at timestamptz DEFAULT now(), PRIMARY KEY (user_id, role_id))
  5. CREATE TABLE public.audit_log (id bigserial PRIMARY KEY, user_id uuid REFERENCES auth.users, action text NOT NULL, table_name text NOT NULL, record_id text, old_data jsonb, new_data jsonb, ip_address inet, created_at timestamptz DEFAULT now())
  6. CREATE INDEX idx_audit_log_created_at ON public.audit_log(created_at)
  7. CREATE INDEX idx_audit_log_table_name ON public.audit_log(table_name)
  8. CREATE TABLE public.outbox (id bigserial PRIMARY KEY, aggregate_type text NOT NULL, aggregate_id text NOT NULL, event_type text NOT NULL, payload jsonb NOT NULL, published_at timestamptz, created_at timestamptz DEFAULT now())
  9. CREATE INDEX idx_outbox_published_at ON public.outbox(published_at)
  10. CREATE INDEX idx_outbox_aggregate ON public.outbox(aggregate_type, aggregate_id)
  11. Enable RLS: ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY; (repeat for roles, user_roles, audit_log, outbox)
  12. RLS Policies:
      - user_profiles: SELECT own row (auth.uid() = id), UPDATE own row (auth.uid() = id)
      - roles: SELECT for authenticated users
      - user_roles: SELECT own rows (auth.uid() = user_id)
      - audit_log: No direct SELECT policy (service role only)
      - outbox: No direct SELECT policy (service role only)
- [x] **Verify:** After running `supabase db reset` (when Supabase CLI configured), check all 5 tables exist, RLS enabled, indexes created, 7 roles seeded
- [x] **Dependencies:** Step 2 (supabase/migrations/ folder must exist)
- [x] **Notes:** Migration follows Supabase conventions; file name 00001_* ensures it runs first; RLS policies enforce security at database level per ADR-002

---

### 7. Create TypeScript Type Definitions

- [x] **What:** Define TypeScript types for database tables, auth, API responses, pagination, roles, and permissions
- [x] **Files:**
  - `src/lib/platform/types/index.ts`
- [x] **Type Definitions:**
  ```typescript
  // Database row types (match migration schema)
  export interface UserProfile {
    id: string;
    full_name: string | null;
    avatar_url: string | null;
    phone: string | null;
    timezone: string;
    locale: string;
    created_at: string;
    updated_at: string;
  }
  
  export interface Role {
    id: number;
    name: string;
    description: string | null;
  }
  
  export interface UserRole {
    user_id: string;
    role_id: number;
    granted_by: string | null;
    granted_at: string;
  }
  
  export interface AuditLog {
    id: number;
    user_id: string | null;
    action: string;
    table_name: string;
    record_id: string | null;
    old_data: Record<string, unknown> | null;
    new_data: Record<string, unknown> | null;
    ip_address: string | null;
    created_at: string;
  }
  
  export interface OutboxEvent {
    id: number;
    aggregate_type: string;
    aggregate_id: string;
    event_type: string;
    payload: Record<string, unknown>;
    published_at: string | null;
    created_at: string;
  }
  
  // Auth types
  export interface AuthUser {
    id: string;
    email: string;
    roles: number[];
  }
  
  export interface UserSession {
    user: AuthUser;
    access_token: string;
    expires_at: number;
  }
  
  // API response helpers
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    error?: string;
  }
  
  export interface PaginatedResponse<T> {
    data: T[];
    total: number;
    page: number;
    pageSize: number;
    hasMore: boolean;
  }
  
  export interface PaginationParams {
    page: number;
    pageSize: number;
  }
  
  // Role enum (matches seeded roles)
  export enum RoleId {
    Admin = 1,
    Manager = 2,
    Supervisor = 3,
    Mechanic = 4,
    Cashier = 5,
    Accounting = 6,
    Customer = 7,
  }
  
  // Permission helper type
  export type Permission = string; // e.g., "service-orders:create", "inventory:view"
  ```
- [x] **Verify:** Run `npm run build` and confirm types/index.ts compiles without errors
- [x] **Dependencies:** Step 2 (src/lib/platform/types/ folder must exist)
- [x] **Notes:** Types match migration schema from step 6; Supabase CLI can generate types later with `supabase gen types typescript`, but manual types sufficient for Phase 1

---

### 8. Create Auth Utilities (Session Helpers and Server Actions)

- [x] **What:** Implement authentication helper functions for session management and user actions
- [x] **Files:**
  - `src/lib/platform/auth/session.ts` — getSession(), getUser(), getUserRoles(), hasRole(), requireAuth()
  - `src/lib/platform/auth/actions.ts` — signIn(), signUp(), signOut(), resetPassword() Server Actions
- [x] **session.ts Implementation:**
  ```typescript
  import { createServerClient } from '@/lib/platform/db/server';
  import { redirect } from 'next/navigation';
  import { RoleId } from '@/lib/platform/types';
  
  export async function getSession() {
    const supabase = createServerClient();
    const { data: { session } } = await supabase.auth.getSession();
    return session;
  }
  
  export async function getUser() {
    const supabase = createServerClient();
    const { data: { user } } = await supabase.auth.getUser();
    return user;
  }
  
  export async function getUserRoles(userId: string): Promise<number[]> {
    const supabase = createServerClient();
    const { data, error } = await supabase
      .from('user_roles')
      .select('role_id')
      .eq('user_id', userId);
    if (error) return [];
    return data.map(row => row.role_id);
  }
  
  export async function hasRole(userId: string, roleId: RoleId): Promise<boolean> {
    const roles = await getUserRoles(userId);
    return roles.includes(roleId);
  }
  
  export async function requireAuth() {
    const user = await getUser();
    if (!user) {
      redirect('/login');
    }
    return user;
  }
  ```
- [x] **actions.ts Implementation:**
  ```typescript
  'use server';
  
  import { createServerClient } from '@/lib/platform/db/server';
  import { redirect } from 'next/navigation';
  import { revalidatePath } from 'next/cache';
  
  export async function signIn(email: string, password: string) {
    const supabase = createServerClient();
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      return { success: false, error: error.message };
    }
    revalidatePath('/', 'layout');
    redirect('/');
  }
  
  export async function signUp(email: string, password: string, fullName: string) {
    const supabase = createServerClient();
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName }
      }
    });
    if (error) {
      return { success: false, error: error.message };
    }
    // Create user_profile entry
    if (data.user) {
      await supabase.from('user_profiles').insert({
        id: data.user.id,
        full_name: fullName,
      });
    }
    return { success: true };
  }
  
  export async function signOut() {
    const supabase = createServerClient();
    await supabase.auth.signOut();
    revalidatePath('/', 'layout');
    redirect('/login');
  }
  
  export async function resetPassword(email: string) {
    const supabase = createServerClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email);
    if (error) {
      return { success: false, error: error.message };
    }
    return { success: true };
  }
  ```
- [x] **Verify:** Run `npm run build` and confirm both auth files compile without errors
- [x] **Dependencies:** Step 3 (db/server.ts), Step 7 (types)
- [x] **Notes:** All functions are server-side only; Server Actions use 'use server' directive

---

### 9. Add ESLint Module Boundary Rule and Create Architectural Test

- [x] **What:** Enforce module boundary rules via ESLint and write Vitest architectural test to verify no cross-module imports
- [x] **Files:**
  - `eslint.config.mjs` — Add custom no-restricted-imports rule for module boundaries
  - `src/__tests__/architecture.test.ts` — Vitest architectural tests
- [x] **eslint.config.mjs Addition:**
  ```javascript
  // Add to the existing config array before globalIgnores:
  {
    rules: {
      // Module Boundary Enforcement (ADR-002):
      // Modules in src/lib/modules/[moduleA]/ cannot import from src/lib/modules/[moduleB]/ directly.
      // All cross-module imports must go through contracts.ts.
      'no-restricted-imports': ['error', {
        patterns: [
          {
            group: ['@/lib/modules/*/domain/*', '@/lib/modules/*/data/*', '@/lib/modules/*/types/*'],
            message: 'Direct imports from another module\'s internals are forbidden. Use the module\'s contracts.ts instead.'
          }
        ]
      }]
    }
  }
  ```
- [x] **architecture.test.ts Implementation:**
  ```typescript
  import { describe, it, expect } from 'vitest';
  import { globSync } from 'glob';
  import { readFileSync } from 'fs';
  import { resolve } from 'path';
  
  describe('Architecture Rules (ADR-002)', () => {
    it('modules cannot import from other module internals', () => {
      const moduleFiles = globSync('src/lib/modules/*/{domain,data,types}/**/*.{ts,tsx}', { 
        cwd: resolve(__dirname, '..') 
      });
      
      const violations: string[] = [];
      
      moduleFiles.forEach(file => {
        const content = readFileSync(resolve(__dirname, '..', file), 'utf-8');
        const currentModule = file.split('/')[3]; // Extract module name from path
        
        // Check for imports from other modules' internals
        const importPattern = /@\/lib\/modules\/([^/]+)\/(domain|data|types)/g;
        let match;
        while ((match = importPattern.exec(content)) !== null) {
          const importedModule = match[1];
          if (importedModule !== currentModule) {
            violations.push(`${file} imports from ${importedModule}/${match[2]}`);
          }
        }
      });
      
      expect(violations).toEqual([]);
    });
    
    it('all module contracts export from contracts.ts', () => {
      const contractFiles = globSync('src/lib/modules/*/contracts.ts', {
        cwd: resolve(__dirname, '..')
      });
      
      // For now, just verify contracts.ts files exist for all modules
      const expectedModules = [
        'customers', 'scheduling', 'service-orders', 'inventory', 
        'billing', 'payroll', 'finance', 'reminders', 
        'follow-up', 'reporting', 'administration'
      ];
      
      expectedModules.forEach(module => {
        const hasContract = contractFiles.some(f => f.includes(`/${module}/contracts.ts`));
        expect(hasContract).toBe(true);
      });
    });
    
    it('migration files follow naming pattern 00NNN_*.sql', () => {
      const migrations = globSync('supabase/migrations/*.sql', {
        cwd: resolve(__dirname, '..')
      });
      
      migrations.forEach(file => {
        const filename = file.split('/').pop()!;
        expect(filename).toMatch(/^\d{5}_.*\.sql$/);
      });
    });
  });
  ```
- [x] **Verify:** Run `npm run lint` to check ESLint rule works; run `npx vitest run src/__tests__` to execute architectural tests
- [x] **Dependencies:** Step 1 (Vitest installed), Step 2 (module folders exist), Step 11 (contracts.ts files exist)
- [x] **Notes:** Tests will pass once all contracts.ts files created in step 11; migrations test passes after step 6

---

### 10. Create Module README Documentation

- [x] **What:** Document Platform Kernel structure, module organization patterns, and database setup procedures
- [x] **Files:**
  - `src/lib/platform/README.md` — Platform Kernel overview
  - `src/lib/modules/README.md` — Module structure guide with sample contracts.ts
  - `supabase/README.md` — Database setup instructions
- [x] **src/lib/platform/README.md Content:**
  ```markdown
  # Platform Kernel
  
  The Platform Kernel provides shared infrastructure services used by all AMS modules.
  
  ## Structure
  
  - **auth/** — Authentication and session management
    - `session.ts` — Get user, check roles, require auth
    - `actions.ts` — Sign in/up/out Server Actions
  
  - **db/** — Supabase database clients
    - `client.ts` — Browser client
    - `server.ts` — Server-side client with cookie handling
    - `middleware.ts` — Session refresh helper for middleware
  
  - **types/** — Shared TypeScript types
    - Database row types (UserProfile, Role, AuditLog, etc.)
    - Auth types (AuthUser, UserSession)
    - API response types (ApiResponse, PaginatedResponse)
    - RoleId enum
  
  ## Usage
  
  ### Server-side authentication
  ```typescript
  import { requireAuth, getUserRoles, hasRole } from '@/lib/platform/auth/session';
  import { RoleId } from '@/lib/platform/types';
  
  export default async function AdminPage() {
    const user = await requireAuth(); // Redirects if not authenticated
    const roles = await getUserRoles(user.id);
    const isAdmin = await hasRole(user.id, RoleId.Admin);
    // ...
  }
  ```
  
  ### Database queries (Server Components)
  ```typescript
  import { createServerClient } from '@/lib/platform/db/server';
  
  const supabase = createServerClient();
  const { data, error } = await supabase
    .from('user_profiles')
    .select('*')
    .eq('id', userId);
  ```
  
  ### Client-side queries
  ```typescript
  'use client';
  import { createBrowserClient } from '@/lib/platform/db/client';
  
  const supabase = createBrowserClient();
  const { data } = await supabase.from('roles').select('*');
  ```
  
  ## Extending the Platform
  
  When adding new platform services:
  1. Create a new folder under `src/lib/platform/`
  2. Export public API from an `index.ts` file
  3. Document usage in this README
  4. Add tests in `src/__tests__/platform/`
  ```
- [x] **src/lib/modules/README.md Content:**
  ```markdown
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
   * Module X Public API
   * 
   * This is the ONLY file other modules may import from Module X.
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
  
  ## Testing Module Boundaries
  
  Architectural tests enforce these rules:
  - `src/__tests__/architecture.test.ts` verifies no cross-module internal imports
  - ESLint `no-restricted-imports` rule prevents direct violations
  ```
- [x] **supabase/README.md Content:**
  ```markdown
  # AMS Database Setup
  
  This project uses Supabase Postgres with Row Level Security (RLS).
  
  ## Prerequisites
  
  1. Install Supabase CLI: https://supabase.com/docs/guides/cli
  2. Create a Supabase project: https://app.supabase.com
  3. Copy `.env.local.example` to `.env.local` and fill in your project credentials
  
  ## Local Development
  
  ### Start Supabase locally
  ```bash
  supabase start
  ```
  
  This starts a local Postgres instance, Kong API gateway, and Supabase Studio.
  
  ### Run migrations
  ```bash
  supabase db reset
  ```
  
  This drops the database, re-runs all migrations in `supabase/migrations/`, and seeds data.
  
  ### Generate TypeScript types
  ```bash
  supabase gen types typescript --local > src/lib/platform/types/database.ts
  ```
  
  This generates types from your database schema. Run after any migration changes.
  
  ## Production Setup
  
  ### Link to Supabase project
  ```bash
  supabase link --project-ref your-project-ref
  ```
  
  ### Push migrations to production
  ```bash
  supabase db push
  ```
  
  ## Environment Variables
  
  Required in `.env.local`:
  
  ```env
  NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
  NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
  SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
  NEXT_PUBLIC_APP_URL=http://localhost:3000
  ```
  
  Get these from: Supabase Dashboard → Project Settings → API
  
  ## Migration Naming Convention
  
  Migrations must follow: `00NNN_description.sql`
  
  - `00001_initial_schema.sql` — Platform tables (user_profiles, roles, audit_log, outbox)
  - `00002_module_a_customers.sql` — Module A tables
  - `00003_module_b_scheduling.sql` — Module B tables
  - etc.
  
  ## Row Level Security (RLS)
  
  All tables MUST have RLS enabled. Default policies:
  
  - **user_profiles**: Users can SELECT/UPDATE their own profile
  - **roles**: Authenticated users can SELECT
  - **user_roles**: Users can SELECT their own roles
  - **audit_log**: No direct access (service role only)
  - **outbox**: No direct access (service role only)
  
  Module tables inherit similar patterns based on their access control needs.
  
  ## Backup and Restore
  
  ### Backup
  ```bash
  supabase db dump -f backup.sql
  ```
  
  ### Restore
  ```bash
  psql -h localhost -U postgres -d postgres -f backup.sql
  ```
  
  ## Troubleshooting
  
  ### Reset local database
  ```bash
  supabase db reset
  ```
  
  ### Check migration status
  ```bash
  supabase migration list
  ```
  
  ### View logs
  ```bash
  supabase logs
  ```
  ```
- [x] **Verify:** Confirm all three README files exist and contain comprehensive documentation
- [x] **Dependencies:** Steps 3, 6, 7, 8 (document what already exists)
- [x] **Notes:** READMEs serve as onboarding for future developers and module implementers

---

### 11. Create Module Placeholder Files (contracts.ts and types/index.ts)

- [x] **What:** Create empty contracts.ts and types/index.ts files for all 11 modules with JSDoc comments explaining their purpose
- [x] **Files:** For each module in [customers, scheduling, service-orders, inventory, billing, payroll, finance, reminders, follow-up, reporting, administration]:
  - `src/lib/modules/[module]/contracts.ts`
  - `src/lib/modules/[module]/types/index.ts`
- [x] **contracts.ts Template:**
  ```typescript
  /**
   * Module [X] Public API
   * 
   * This is the ONLY file other modules may import from Module [X].
   * All cross-module integration must go through this contract.
   * 
   * Implementation pending. This file will be populated during Module [X] development.
   */
  
  // Export placeholder to prevent import errors during build
  export const MODULE_NAME = '[module-name]';
  ```
- [x] **types/index.ts Template:**
  ```typescript
  /**
   * Module [X] Type Definitions
   * 
   * Internal types for Module [X]. Other modules should not import these directly;
   * use the public types exported from contracts.ts instead.
   * 
   * Implementation pending.
   */
  
  // Export placeholder
  export type Placeholder = Record<string, never>;
  ```
- [x] **Verify:** Run `npx vitest run src/__tests__` and confirm architectural test "all module contracts export from contracts.ts" passes
- [x] **Dependencies:** Step 2 (module folders exist)
- [x] **Notes:** 11 modules × 2 files = 22 files total; actual implementation deferred to each module's phase

---

### 12. Verify .gitignore Excludes .env.local

- [x] **What:** Confirm .env.local is already excluded from git to prevent committing secrets
- [x] **Files:** `.gitignore` (read-only check)
- [x] **Verification:** Read .gitignore and confirm `.env*` pattern is present (already confirmed in exploration: line with `# env files (can opt-in for committing if needed)` followed by `.env*`)
- [x] **Dependencies:** None
- [x] **Notes:** Already compliant; no changes needed, but verification step ensures security requirement met

---

### 13. Update package.json Scripts for Testing

- [x] **What:** Add test scripts to package.json for running Vitest tests
- [x] **Files:** `package.json`
- [x] **Changes:**
  ```json
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "eslint",
    "test": "vitest",
    "test:run": "vitest run",
    "test:ui": "vitest --ui"
  }
  ```
- [x] **Verify:** Run `npm run test:run` and confirm Vitest executes tests (architectural tests from step 9 should pass)
- [x] **Dependencies:** Step 1 (Vitest installed), Step 9 (tests exist)
- [x] **Notes:** Provides standard commands for running tests during development and CI

---

### 14. Final Verification — Build and Test All Components

- [x] **What:** Run full Next.js production build and all tests to verify Phase 1 foundation is complete and error-free
- [x] **Commands:**
  1. `npm run build` — Must complete without TypeScript or build errors
  2. `npm run test:run` — All architectural tests must pass
  3. `npm run lint` — No ESLint errors
- [x] **Expected Outcomes:**
  - Build succeeds and generates .next/ output
  - All 3 architectural tests pass (no cross-module imports, contracts.ts exist, migration naming correct)
  - ESLint passes with no module boundary violations
- [x] **Dependencies:** All previous steps (1-13)
- [x] **Notes:** This is the Gate M1 checkpoint; if any errors, trace back to dependent steps and fix before proceeding

---

## Summary

This plan establishes the Platform Kernel foundation and modular structure for all 11 AMS modules following ADR-002 architecture principles. Upon completion:

- ✅ Directory structure scaffolded for all modules
- ✅ Supabase authentication and database clients configured
- ✅ Base database schema with user management, RBAC, audit log, and outbox pattern
- ✅ TypeScript types for platform entities
- ✅ Auth utilities (session management, sign in/up/out)
- ✅ Module boundary enforcement via ESLint and architectural tests
- ✅ Comprehensive documentation for platform, modules, and database
- ✅ All 11 module contracts.ts placeholders created
- ✅ Testing infrastructure with Vitest
- ✅ Build and test verification passing

**Next Phase:** Module K (Administration) — settings, user management, roles, permissions UI, followed by Modules A–J per Master Plan §11.

**Estimated Completion Time:** 2-3 days for experienced Next.js/Supabase developer

**Risk Mitigations:**
- Environment variables documented in .env.local.example — developers must configure Supabase project
- RLS policies enforce security at database level per ADR-002
- Architectural tests prevent boundary violations during development
- Stub pattern documented for handling module dependencies

---

**Plan Status:** Ready for Implementation  
**Blockers:** None (all dependencies resolved or documented)  
**Gate M1 Ready:** After Step 14 verification passes
