# Phase 1 Platform Kernel Implementation Review

**Date:** 2024-01-10  
**Reviewer:** Kiro (AI Code Reviewer)  
**Implementation:** AMS Platform Kernel — Authentication, Database, Module Structure  
**Base Branch:** main  
**Verdict:** CHANGES_REQUESTED

---

## Summary

The Platform Kernel establishes the foundation for the AMS system: Supabase authentication integrated with Next.js 14 App Router, Row Level Security policies, audit logging, event-driven architecture via outbox pattern, and module boundary enforcement. The implementation follows ADR-002's modular monolith architecture with 11 module placeholders and comprehensive RLS policies.

The core patterns are sound: server/client Supabase separation is correct, middleware properly refreshes sessions, requireAuth guards are documented with security warnings, and ESLint rules enforce module boundaries. The migration creates all kernel tables with appropriate indexes and triggers.

**Watch for:** Admin users have no ability to manage other user profiles or roles (**confirmed**), the signUp action uses an `any` cast to bypass TypeScript for profile insertion (**confirmed**), no admin policy exists for viewing or managing user_roles table (**confirmed**), and middleware redirects unauthenticated users but doesn't enforce role-based access at the edge (**confirmed**).

**Verdict**: CHANGES_REQUESTED

---

## High-level view

Admin users are locked out of administrative operations. The RLS policies allow users to view and update only their own profiles and roles, but there's no policy granting admins the ability to view all users, assign roles, or manage the user directory — essential Module K functionality. This will block admin screens from working when implemented.

The signUp Server Action bypasses TypeScript with an `any` cast because the Database type stub doesn't include the Insert type for user_profiles. This works at runtime but defeats type safety for what is effectively user input flowing into the database.

Middleware performs authentication but not authorization. It redirects unauthenticated users to /login but doesn't check roles, meaning role-based page protection relies entirely on requireRole calls within Server Components, which can be forgotten.

The outbox table has no unique constraint or mechanism preventing duplicate event publishing if a transaction retries or a worker crashes mid-publish. The aggregate_type + aggregate_id + event_type + created_at combination could produce duplicates under concurrent writes.

---

<details>
<summary>Issues (7)</summary>

1. **Admin policy gap — user_profiles** — Admins cannot view or manage other users' profiles. Add a policy: `CREATE POLICY user_profiles_admin_all ON public.user_profiles FOR ALL TO authenticated USING (EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_id = 1));` (severity: HIGH, confirmed)

2. **Admin policy gap — user_roles** — Admins cannot assign roles or view role assignments for other users. Add policies for INSERT and SELECT allowing role_id = 1 (Admin). (severity: HIGH, confirmed)

3. **Type safety bypass in signUp** — `supabase as any` defeats type checking for profile insertion. Fix by removing the cast and using an explicit typed payload: `const payload: Database['public']['Tables']['user_profiles']['Insert'] = { ... }` (severity: MEDIUM, confirmed)

4. **No idempotency protection in outbox** — Concurrent or retried transactions can insert duplicate events. Add a unique partial index or application-level deduplication keys (idempotency_key column). (severity: MEDIUM, likely)

5. **Middleware doesn't enforce roles** — Unauthenticated users are redirected, but role checks happen only in Server Components via requireRole. Consider whether certain routes (e.g., /admin/*) should be blocked at the middleware level or if component-level checks are sufficient. (severity: LOW, likely)

6. **Missing /unauthorized page** — requireRole redirects to /unauthorized, but if that page doesn't exist, users see a 404. Create the page in Module K or document the requirement. (severity: LOW, confirmed)

7. **Migration comments incomplete** — user_roles.granted_by comment says "Admin who granted this role" but the column is nullable for system-granted roles. audit_log.user_id is nullable for system actions but doesn't document it. Clarify both comments. (severity: LOW, confirmed)

</details>

---

<details>
<summary>Details</summary>

## Admin role policies missing from RLS

The migration enables RLS on user_profiles, roles, user_roles, audit_log, and outbox, but only creates policies for users to access their own data. The roles table allows any authenticated user to SELECT, which is correct. But user_profiles and user_roles have no admin-override policies.

For user_profiles, the policies are:

```sql
CREATE POLICY user_profiles_select_own ON public.user_profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY user_profiles_insert_own ON public.user_profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

CREATE POLICY user_profiles_update_own ON public.user_profiles
  FOR UPDATE USING (auth.uid() = id);
```

An admin with role_id = 1 cannot view other users' profiles, cannot create profiles on behalf of users, and cannot update another user's profile. Module K's user management screens will return zero rows or permission errors when an admin tries to list users.

The same gap exists for user_roles:

```sql
CREATE POLICY user_roles_select_own ON public.user_roles
  FOR SELECT USING (auth.uid() = user_id);
```

An admin cannot view which roles are assigned to other users, cannot insert new role assignments, and cannot revoke roles. Role management is completely non-functional for admins under these policies.

This is a blocking issue for Module K. The fix is to add admin-override policies that check for role_id = 1 in the user_roles table before applying the USING clause.

Example for user_profiles:

```sql
CREATE POLICY user_profiles_admin_all ON public.user_profiles
  FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_roles 
      WHERE user_id = auth.uid() AND role_id = 1
    )
  );
```

Example for user_roles:

```sql
CREATE POLICY user_roles_admin_select ON public.user_roles
  FOR SELECT
  TO authenticated
  USING (
    auth.uid() = user_id OR
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_id = 1)
  );

CREATE POLICY user_roles_admin_insert ON public.user_roles
  FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (SELECT 1 FROM user_roles WHERE user_id = auth.uid() AND role_id = 1)
  );

-- Similar for UPDATE/DELETE
```

Without these, the first admin screen built in Module K will fail to load any data.

---

## Type safety bypassed in signUp action

The signUp Server Action in `src/lib/platform/auth/actions.ts` creates a user profile row after successful auth.users creation:

```typescript
if (authData.user) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { error: profileError } = await (supabase as any)
    .from('user_profiles')
    .insert([{
      id: authData.user.id,
      full_name: fullName,
      timezone: 'Asia/Manila',
      locale: 'en-PH',
    }]);
```

The cast to `any` is flagged with an eslint-disable comment, indicating the developer knew this was a workaround. The reason is that the Database type stub in `src/lib/platform/types/database.ts` defines the Insert type for user_profiles, but the createClient type parameter doesn't expose insert overloads correctly, or the types are incomplete.

This defeats TypeScript's purpose. If the insert payload includes an extra field, a misspelled column, or a type mismatch, TypeScript won't catch it. The database will reject it at runtime, but that's too late — the error surfaces in production or during testing, not during development or build.

The fix is to either regenerate the Database types using `supabase gen types typescript --local` (which produces complete Insert/Update types), or to manually add the Insert type and cast the insert payload explicitly:

```typescript
type UserProfileInsert = Database['public']['Tables']['user_profiles']['Insert'];

const payload: UserProfileInsert = {
  id: authData.user.id,
  full_name: fullName,
  timezone: 'Asia/Manila',
  locale: 'en-PH',
};

const { error: profileError } = await supabase
  .from('user_profiles')
  .insert([payload]);
```

This preserves type safety without requiring an `any` cast. The stub types in database.ts already define Insert with optional fields for columns with defaults, so this should work as-is once the cast is removed.

---

## Outbox pattern lacks idempotency protection

The outbox table is designed for event-driven cross-module integration. The migration creates it with columns for aggregate_type, aggregate_id, event_type, payload, published_at, and created_at. Indexes exist for unpublished events and for queries by aggregate or event type.

But there's no mechanism to prevent duplicate events. If a transaction that inserts an outbox row is retried (due to network failure, deadlock, or application crash), the same event will be inserted twice with different IDs but identical content. If an event worker crashes after marking an event as published but before committing, the event might be republished.

The indexes are:

```sql
CREATE INDEX IF NOT EXISTS idx_outbox_published_at ON public.outbox(published_at) WHERE published_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_outbox_event_type ON public.outbox(event_type) WHERE published_at IS NULL;
CREATE INDEX IF NOT EXISTS idx_outbox_aggregate ON public.outbox(aggregate_type, aggregate_id);
CREATE INDEX IF NOT EXISTS idx_outbox_created_at ON public.outbox(created_at DESC);
```

None of these prevent duplicates. A unique partial index on (aggregate_type, aggregate_id, event_type, created_at) would catch most retries, but created_at has microsecond precision and could still differ between retries.

The standard solution is a deduplication key (idempotency token) generated by the application before the insert:

```sql
ALTER TABLE public.outbox ADD COLUMN idempotency_key uuid UNIQUE;
```

The application generates a UUID based on the aggregate and event details, and the unique constraint prevents duplicate inserts. The insert then becomes:

```typescript
await supabase.from('outbox').insert({
  aggregate_type: 'service-orders.ServiceOrder',
  aggregate_id: orderId,
  event_type: 'service_order.approved',
  payload: { ... },
  idempotency_key: uuidv5(`service-orders.ServiceOrder:${orderId}:approved`, NAMESPACE),
});
```

Retries will hit the unique constraint and return a conflict error, which the application can ignore. This is a standard pattern for outbox tables.

Without this, duplicate events are possible. Whether this is a blocker depends on whether consuming modules are idempotent (can handle the same event twice) or whether the event worker implements deduplication. If neither is guaranteed, this is a data integrity risk.

---

## Middleware authorization gap

Middleware does not enforce role-based access. An authenticated user with role_id = 7 (Customer) can request /admin/users, and the middleware will allow it. The requireRole guard in the Server Component will redirect them to /unauthorized, but only after Next.js routes the request and starts rendering the component. For high-security routes, this might leak timing information (whether the route exists) or trigger unnecessary database queries before the auth check completes.

---

## Module boundary enforcement via ESLint and tests

The eslint.config.mjs defines no-restricted-imports rules for cross-module imports. The first rule applies to files under `src/lib/modules/**` and forbids imports matching `@/lib/modules/*/domain/*`, `@/lib/modules/*/data/*`, or `@/lib/modules/*/types/*`. The second rule applies to `src/app/**` and `src/components/**` and forbids `domain/*` and `data/*` but not `types/*` (allowing types from contracts.ts).

The architectural test in `src/__tests__/architecture.test.ts` verifies each of the 11 modules has a contracts.ts file, no module imports another module's domain/, data/, or types/ folders, and migration files follow the 00NNN_*.sql naming convention. The test parses import statements with a regex, which won't detect dynamic imports (import()). This is acceptable — dynamic imports are rare in this codebase.

All 11 module contracts.ts files exist and contain the same placeholder comment.

---

## Migration schema comments need clarification

The user_roles.granted_by comment says "Admin who granted this role", but the column is nullable and allows system-granted roles (NULL). The comment should say "User who granted this role (NULL if system-granted)".

The audit_log.user_id is nullable, allowing system-triggered audits (e.g., automated backup) to log with user_id = NULL, but the comment doesn't clarify that NULL means "system action".

---

## TypeScript type coverage and RoleId enum sync

The Database type stub in `src/lib/platform/types/database.ts` defines Row, Insert, and Update types for all five tables. The types match the migration schema.

The RoleId enum in `src/lib/platform/types/index.ts` matches the roles seed: Admin = 1, Manager = 2, etc. The comment says "must match the roles seed in 00001_initial_schema.sql". This is a manual sync point — no automation enforces it. Consider adding a test that queries the roles table and asserts the IDs match the enum, or embedding the enum values in the migration as CHECK constraints.

The AuthUser type includes `roles: RoleId[]`, populated by getUser() via a query to user_roles. The type does not include user metadata like full_name or avatar_url — that's in UserProfile. This separation is correct: AuthUser is the session identity, UserProfile is the extended data.

No `any` types appear in the type definitions themselves. The only `any` is the cast in actions.ts, already discussed.

---

## requireAuth security documentation and requireRole gaps

The requireAuth function in `src/lib/platform/auth/session.ts` includes a JSDoc comment explaining that requireAuth must be called FIRST in a Server Component, before any database queries or data fetching. The comment includes correct and wrong examples. The security risk is real: if requireAuth is called after a database query, the query still executes (and its results might be logged or cached) before the redirect happens.

The comment notes that "Calling it after queries will still execute those queries before the redirect happens, which could leak data in logs or create timing side-channels." This shows awareness of both information disclosure and timing attacks.

Two gaps: requireRole redirects to /unauthorized, but if that route doesn't exist, the user sees a 404. This should be documented (and the /unauthorized page should be created in Module K). Also, requireRole accepts a variadic list of role IDs and checks if the user has ANY of them (logical OR). There's no requireAllRoles for AND logic, which is fine for Phase 1 — most access checks are OR-based.

---

## Test coverage gaps

The architectural test covers presence of contracts.ts files for all 11 modules, cross-module import violations, and migration file naming convention.

What is NOT tested: RLS policies (no test inserts rows as different users and verifies access), auth flows (no test signs up, signs in, signs out), requireAuth / requireRole behavior (no test verifies redirects), type correctness of Database stub (no test compares stub to actual schema), middleware redirect logic (no test simulates requests to protected routes).

The lack of RLS tests is the biggest gap. When an admin policy is added, there should be a test that creates two users (one admin, one regular user), verifies the admin can query all user_profiles while the regular user sees only their own row, verifies the admin can insert role assignments while the regular user cannot. These tests require Supabase to be running and a test database. This is deferred to Module K.

---

## File map

</details>

<details>
<summary>Files changed</summary>

- **src/middleware.ts** — Next.js middleware entry point, calls updateSession
- **src/lib/platform/db/client.ts** — Browser Supabase client (Client Components)
- **src/lib/platform/db/server.ts** — Server Supabase client with cookie handling
- **src/lib/platform/db/middleware.ts** — Session refresh helper for middleware
- **src/lib/platform/auth/session.ts** — getUser, requireAuth, requireRole, hasRole
- **src/lib/platform/auth/actions.ts** — signIn, signUp, signOut, resetPassword Server Actions
- **src/lib/platform/types/database.ts** — Supabase Database type stub (Row/Insert/Update for 5 tables)
- **src/lib/platform/types/index.ts** — Platform types (AuthUser, RoleId, ApiResponse, etc.)
- **src/__tests__/architecture.test.ts** — Module boundary and migration naming tests
- **eslint.config.mjs** — ESLint rules for module boundary enforcement
- **supabase/migrations/00001_initial_schema.sql** — Kernel tables: user_profiles, roles, user_roles, audit_log, outbox with RLS
- **.env.local.example** — Environment variable template with security warnings
- **src/lib/modules/*/contracts.ts** — 11 placeholder contract files for modules A-K
- **README.md** — Root project README with quickstart and structure
- **src/lib/platform/README.md** — Platform Kernel usage guide
- **supabase/README.md** — Database setup, migration workflow, local dev guide

</details>
