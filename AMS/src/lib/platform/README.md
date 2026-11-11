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
  - `database.ts` — Supabase generated types
  - `index.ts` — Platform types (AuthUser, ApiResponse, RoleId enum, etc.)

## Usage

### Server-side authentication

```typescript
import { requireAuth, getUserRoles, hasRole } from '@/lib/platform/auth/session';
import { RoleId } from '@/lib/platform/types';

export default async function AdminPage() {
  const user = await requireAuth(); // Redirects if not authenticated
  const roles = await getUserRoles();
  const isAdmin = await hasRole(RoleId.Admin);
  // ...
}
```

### Database queries (Server Components)

```typescript
import { createClient } from '@/lib/platform/db/server';

const supabase = await createClient();
const { data, error } = await supabase
  .from('user_profiles')
  .select('*')
  .eq('id', userId);
```

### Client-side queries

```typescript
'use client';
import { createClient } from '@/lib/platform/db/client';

const supabase = createClient();
const { data } = await supabase.from('roles').select('*');
```

### Auth Server Actions

```typescript
'use client';
import { signIn, signUp, signOut } from '@/lib/platform/auth/actions';

async function handleSignIn(email: string, password: string) {
  const result = await signIn(email, password);
  if (result.error) {
    console.error(result.error);
  }
  // Redirects on success
}
```

## Role-Based Access Control (RBAC)

The platform includes 7 predefined roles:

1. **Admin** (1) — Full system access and configuration
2. **Manager** (2) — Manage shop operations and staff
3. **Supervisor** (3) — Supervise mechanics and service quality
4. **Mechanic** (4) — Service technician — perform work
5. **Cashier** (5) — POS and billing operations
6. **Accounting** (6) — Finance and accounting functions
7. **Customer** (7) — External customer portal access

Use `requireRole()` to protect routes by role:

```typescript
import { requireRole } from '@/lib/platform/auth/session';
import { RoleId } from '@/lib/platform/types';

export default async function AdminOnlyPage() {
  await requireRole(RoleId.Admin, RoleId.Manager); // Allow Admin OR Manager
  // ...
}
```

## Extending the Platform

When adding new platform services:

1. Create a new folder under `src/lib/platform/`
2. Export public API from an `index.ts` file
3. Document usage in this README
4. Add tests in `src/__tests__/platform/`

## Do Not

- ❌ Import from module internals (domain/, data/, types/) — use contracts.ts
- ❌ Use browser client in Server Components — use server client
- ❌ Hardcode role IDs — use RoleId enum
- ❌ Skip RLS policies when creating new tables
- ❌ Store sensitive data in auth.users.raw_user_meta_data — use user_profiles table
