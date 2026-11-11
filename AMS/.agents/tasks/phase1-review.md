# Phase 1 Platform Kernel Implementation

Platform Kernel foundation built with Supabase client patterns, authentication utilities, database migration, module boundaries, and architectural enforcement. The implementation establishes the infrastructure layer for all AMS modules.

This is the first implementation pass following ADR-001 (Next.js + Supabase stack) and ADR-002 (modular monolith architecture). The kernel provides database clients, auth helpers, RLS policies, audit logging, event outbox, RBAC scaffolding, and module boundary enforcement.

**Watch for:** Service role key exposure risk (**likely**), missing RLS policy for user profile creation (**confirmed**), weak auth redirect allowing data leakage (**possible**), incomplete TypeScript types missing constraints (**confirmed**), architectural test gaps (**confirmed**).

**Verdict**: NEEDS_CHANGES

## High-level view

The Supabase client separation follows the correct SSR pattern: browser client for Client Components, server client with Next.js cookies() for Server Components and actions, and middleware client for session refresh. All three read from public environment variables except the service role key, which appears in .env.local.example but has no usage guard preventing accidental client-side exposure.

RLS policies cover read and update for user_profiles, but the INSERT policy is missing — new users cannot create their own profile row after signup, which will break the registration flow. The signup action in auth/actions.ts doesn't create the profile row either, so this path is incomplete.

The requireAuth and requireRole redirects happen before data fetching, which is correct, but error handling in the auth actions returns error messages to the client without sanitizing Supabase error details that might leak schema information.

Database types in database.ts are manually defined stubs matching the migration schema. Column nullability, constraints, and enum types are present but the stub approach means no compile-time enforcement if the migration changes — types will drift unless regenerated.

Module boundary enforcement combines ESLint restricted imports and architectural tests. The ESLint rule blocks cross-module internal imports (domain/, data/, types/) for both modules and app/components, which is correct. The architectural test verifies contracts.ts existence and scans imports for violations, but it only checks TypeScript files and will miss violations in .tsx, .js, or dynamic imports. It also doesn't verify that contracts.ts exports are actually used, so an empty export satisfies the test.

The migration creates five tables with indexes and RLS policies, plus an updated_at trigger for user_profiles. Audit_log and outbox have no RLS policies (service role only), which matches the design. The roles table is seeded idempotently. Missing: no index on outbox.event_type (queries will filter by event type), no composite index on audit_log(table_name, record_id) for fast record history lookups.

<details>
<summary>Issues (9)</summary>

1. **Service role key in example without guard** — .env.local.example includes SUPABASE_SERVICE_ROLE_KEY with no code guard preventing accidental client-side use. Add a runtime check or move to separate .env.service.local file and document that it must never be imported in client-side code. (**likely**)

2. **Missing RLS INSERT policy for user_profiles** — Users cannot create their own profile row after signup. Add policy: `CREATE POLICY user_profiles_insert_own ON public.user_profiles FOR INSERT WITH CHECK (auth.uid() = id);` (**confirmed**)

3. **signUp action doesn't create user_profiles row** — After Supabase auth.signUp succeeds, no profile row is created. Either add server-side insert in the action or use a Supabase trigger on auth.users insert. (**confirmed**)

4. **Auth error messages leak Supabase internals** — signIn, signUp, resetPassword return error.message directly from Supabase, which may expose schema details like table names or constraint violations. Sanitize to user-friendly messages. (**likely**)

5. **requireAuth redirect timing allows data fetch** — If requireAuth is called after a database query in the same Server Component, the query executes before the redirect. Document that requireAuth must be the first call, or restructure to throw instead of redirect. (**possible**)

6. **App-to-module ESLint rule is warn, not error** — The ESLint rule blocking app/components from importing module internals is severity 'warn', which won't fail CI. Change to 'error' for consistency with ADR-002. (**confirmed**)

7. **Missing outbox.event_type index** — Queries filtering by event type (e.g., `SELECT * FROM outbox WHERE event_type = 'service_order.approved' AND published_at IS NULL`) will scan all unpublished events. Add index: `CREATE INDEX idx_outbox_event_type ON outbox(event_type) WHERE published_at IS NULL;` (**confirmed**)

8. **Missing composite index on audit_log** — Looking up a record's history (`WHERE table_name = 'c_service_orders' AND record_id = '123'`) will use only one index. Add: `CREATE INDEX idx_audit_log_record ON audit_log(table_name, record_id);` (**confirmed**)

9. **Architectural test doesn't catch .tsx or dynamic imports** — Test only scans .ts files. Add .tsx to the extension list. Dynamic imports (`import()`) won't be caught by the regex; document this limitation. (**confirmed**)

</details>

<details>
<summary>Details</summary>

## Service role key exposure risk

The service role key appears in .env.local.example with no guard preventing accidental client-side use. If SUPABASE_SERVICE_ROLE_KEY were accessed in a Client Component, it would be bundled and exposed to the browser. No code currently uses this key, but the presence in the example file without a warning comment creates risk.

The middleware's public path check includes /login, /auth, /_next, and /favicon but not /register or /signup. If those routes exist, users will be redirected to /login when visiting them unauthenticated. The unauthenticated redirect target is hardcoded to /login with no next parameter to return the user to their original destination after auth.

## RLS policies and the user profile creation gap

User_profiles has SELECT and UPDATE policies allowing users to access their own profile (WHERE auth.uid() = id), but no INSERT policy. When a user signs up via auth.signUp, Supabase creates a row in auth.users but doesn't automatically create a user_profiles row. The signup flow needs either (1) an INSERT policy allowing users to create their own profile, or (2) a database trigger on auth.users insert. Neither is present.

The signUp action calls supabase.auth.signUp with metadata but doesn't insert into user_profiles. Metadata goes into auth.users.raw_user_meta_data, not the user_profiles table. When the new user tries to access their profile, any code querying user_profiles directly will get null.

User_roles has a SELECT policy for users to view their own roles but no INSERT policy, so regular users can't grant themselves roles. Missing: no policy for admins to grant roles to others. This probably requires a Postgres function that checks if auth.uid() has role_id = 1 (Admin). Right now only service role can assign roles.

## Auth error message leakage

Error handling: if Supabase returns an error, the action returns { data: null, error: error.message, status: 4xx }. The error.message from Supabase can include details like "duplicate key value violates unique constraint" or "column 'foo' does not exist" — database implementation details that shouldn't reach the user.

resetPassword constructs a redirectTo URL pointing to /auth/update-password, but there's no /auth/update-password route in the codebase yet. This will 404 after the user clicks the reset link.

## requireAuth redirect timing risk

requireAuth and requireRole both use redirect() from next/navigation. redirect() throws a NEXT_REDIRECT error internally, which Next.js catches to perform the redirect. This means code after requireAuth never executes — unless the developer does a database query before calling requireAuth. Server Components execute top-to-bottom, so if someone writes:

```typescript
const data = await supabase.from('sensitive_table').select('*');
const user = await requireAuth();
```

The query executes, the data is fetched, then the redirect happens. The data isn't sent to the client (redirect aborts rendering), but the query still ran, which could be a timing side channel or logging leak. The requireAuth JSDoc says "Use at the top of protected server components" but doesn't explain why.

requireRole redirects to /unauthorized if the role check fails. No /unauthorized route exists in the codebase yet.

## TypeScript type stubs and drift risk

database.ts defines the Database type manually with five tables. Each table has Row, Insert, Update shapes matching the migration schema.

Type mismatches:
- audit_log.action: CHECK constraint with 6 enum values — type is string, not a union. TypeScript won't catch an invalid action value. Should be: action: 'INSERT' | 'UPDATE' | 'DELETE' | 'LOGIN' | 'LOGOUT' | 'EXPORT'.

The types are manually maintained. The comment at the top says "Replace with generated types: `npx supabase gen types typescript --local > ...`". Types will drift if someone changes the migration without regenerating.

## Module boundary enforcement gaps

ESLint config defines two rules: one for src/lib/modules/**/*.{ts,tsx} blocking cross-module internal imports (error level), and one for src/app/**/*.{ts,tsx} and src/components/**/*.{ts,tsx} blocking module internals (warn level). The module-to-module rule is error. The app-to-module rule is warn, which won't block CI unless --max-warnings 0 is set. Should be error for consistency, since ADR-002 says module boundaries are binding.

The restricted patterns don't block:
- Relative imports: `import { Foo } from '../customers/domain/customer-service'` (if a module uses ../../another-module)
- Dynamic imports: `const mod = await import('@/lib/modules/customers/domain/...')` (ESLint no-restricted-imports doesn't catch dynamic imports)

Architectural test checks: (1) each module has contracts.ts, (2) no module imports another module's internals, (3) migration files follow 00NNN_*.sql naming.

Test 2 reads file content and filters lines starting with 'import', then regex-checks if the line includes `modules/${modB}/domain` or `/data` or `/types`. This catches static imports but not:
- .tsx files (getAllFiles only includes .ts, not .tsx)
- Dynamic imports (not matched by the regex)
- Require statements (if any old JS code exists)

## Missing database indexes

audit_log has four indexes: created_at DESC, table_name, user_id, record_id. Missing: composite index on (table_name, record_id) for fast record history queries. Looking up a record's history (`WHERE table_name = 'c_service_orders' AND record_id = '123'`) will use only one index, requiring index intersection or sequential scan.

outbox has three indexes: published_at (partial WHERE published_at IS NULL), aggregate (composite on aggregate_type + aggregate_id), created_at DESC. Missing: index on event_type. Queries filtering by event type (e.g., `SELECT * FROM outbox WHERE event_type = 'service_order.approved' AND published_at IS NULL`) will scan all unpublished events.



</details>

<details>
<summary>File map</summary>

**Platform Core:**
- `src/lib/platform/db/client.ts` — Browser Supabase client
- `src/lib/platform/db/server.ts` — Server Supabase client with Next.js cookies()
- `src/lib/platform/db/middleware.ts` — Middleware session refresh helper
- `src/lib/platform/types/database.ts` — Manual Database type stub
- `src/lib/platform/types/index.ts` — Platform types: RoleId enum, AuthUser, ApiResponse, table row re-exports
- `src/lib/platform/auth/session.ts` — getUser, requireAuth, requireRole, hasRole server helpers
- `src/lib/platform/auth/actions.ts` — signIn, signUp, signOut, resetPassword Server Actions
- `src/lib/platform/README.md` — Platform usage documentation

**Application Entry:**
- `src/middleware.ts` — Next.js middleware calling updateSession

**Module Boundaries:**
- `eslint.config.mjs` — ESLint module boundary rules
- `src/__tests__/architecture.test.ts` — Architectural tests for module contracts and imports
- `src/lib/modules/customers/contracts.ts` — Stub (and 10 other module contracts, all stubs)

**Database:**
- `supabase/migrations/00001_initial_schema.sql` — Platform tables: user_profiles, roles, user_roles, audit_log, outbox with RLS policies
- `supabase/README.md` — Database setup and migration instructions

**Documentation:**
- `README.md` — Project overview and quick start
- `.env.local.example` — Environment variable template

Full diff: `git diff main` (or view individual files above)

</details>
