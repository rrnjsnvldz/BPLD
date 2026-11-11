# AMS Database Setup

This project uses Supabase Postgres with Row Level Security (RLS).

## Prerequisites

1. **Supabase CLI**: Install from https://supabase.com/docs/guides/cli
   ```bash
   npm install -g supabase
   ```

2. **Supabase Project**: Create at https://app.supabase.com

3. **Environment Variables**: Copy `.env.local.example` to `.env.local` and fill in your project credentials

## Local Development

### Start Supabase locally

```bash
supabase start
```

This starts:
- Local Postgres database
- Kong API gateway
- Supabase Studio (web UI at http://localhost:54323)

### Run migrations

```bash
supabase db reset
```

This drops the database, re-runs all migrations in `supabase/migrations/`, and seeds data.

### Generate TypeScript types

After any schema changes:

```bash
supabase gen types typescript --local --schema public > src/lib/platform/types/database.ts
```

This generates types from your database schema that match the Supabase client API.

## Production Setup

### Link to Supabase project

```bash
supabase link --project-ref your-project-ref
```

Find your project ref in: Supabase Dashboard → Project Settings → General

### Push migrations to production

```bash
supabase db push
```

⚠️ **Warning**: This applies migrations to production. Always test locally first.

## Environment Variables

Required in `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Get these from: **Supabase Dashboard → Project Settings → API**

## Migration Naming Convention

Migrations must follow: `00NNN_description.sql`

Examples:
- `00001_initial_schema.sql` — Platform tables (user_profiles, roles, audit_log, outbox)
- `00002_module_k_administration.sql` — Module K tables
- `00003_module_a_customers.sql` — Module A tables
- etc.

**Rules:**
- Use 5-digit zero-padded numbers
- Use snake_case for description
- Keep descriptions short but meaningful
- Migrations are immutable — never edit existing files

## Row Level Security (RLS)

**All tables MUST have RLS enabled.**

Default policy patterns:

### user_profiles
- Users can SELECT/UPDATE their own profile
- Admins can view all profiles

### roles
- Authenticated users can SELECT all roles
- Only service role can INSERT/UPDATE/DELETE

### user_roles
- Users can SELECT their own roles
- Admins can manage all role assignments

### audit_log
- No direct access (service role only)
- Reports consume via views/functions

### outbox
- No direct access (service role only)
- Event processor consumes unpublished events

## Creating a New Migration

1. Create a new file: `supabase/migrations/00NNN_description.sql`

2. Write idempotent SQL (use `IF NOT EXISTS`, `ON CONFLICT`, etc.)

3. Include:
   - Table definitions with comments
   - Indexes for performance
   - RLS policies
   - Seed data (if applicable)

4. Test locally:
   ```bash
   supabase db reset
   npm run build
   ```

5. Generate types:
   ```bash
   supabase gen types typescript --local --schema public > src/lib/platform/types/database.ts
   ```

## Backup and Restore

### Backup local database

```bash
supabase db dump -f backup.sql
```

### Restore from backup

```bash
psql -h localhost -U postgres -d postgres -f backup.sql
```

### Backup production (via dashboard)

Supabase Dashboard → Database → Backups

Daily automated backups are enabled by default on paid plans.

## Troubleshooting

### Reset local database

```bash
supabase db reset
```

### Check migration status

```bash
supabase migration list
```

### View database logs

```bash
supabase logs db
```

### Connect via psql

```bash
psql postgresql://postgres:postgres@localhost:54322/postgres
```

### Studio not loading

Check if port 54323 is available:
```bash
netstat -ano | findstr :54323
```

Stop Supabase and restart:
```bash
supabase stop
supabase start
```

## Database Schema Principles

1. **Module isolation**: Tables are prefixed with module letters (e.g., `a_customers`, `c_service_orders`)

2. **Audit everything**: Sensitive operations write to `audit_log`

3. **Event-driven**: Cross-module side effects use `outbox` table

4. **Immutable logs**: audit_log and outbox are append-only

5. **RLS everywhere**: No table bypasses RLS (except with service role)

6. **Timestamps**: All tables have `created_at`, mutable entities add `updated_at`

7. **Soft deletes**: Consider `deleted_at` instead of hard deletes for compliance

## Next Steps

- Read the migration: `supabase/migrations/00001_initial_schema.sql`
- Explore types: `src/lib/platform/types/database.ts`
- Learn platform auth: `src/lib/platform/README.md`
- Understand modules: `src/lib/modules/README.md`
