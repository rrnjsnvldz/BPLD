# ADR-002: Architecture Style — Modular Monolith vs. Microservices

**Status**: ✅ ACCEPTED  
**Date Proposed**: 2026-11-10  
**Date Decided**: 2026-11-10  
**Deciders**: Owner  
**Architecture Selected**: Modular Monolith (Option 1/3)

## Context

The AMS has 11 business modules (A–K) that need to be developed, deployed, and maintained. Blueprint §4 describes "modular services (one per module) sharing common services" — this phrase is ambiguous between a modular monolith and a microservices architecture.

The system must:
- Support 11 modules built over 7 phases by a small team (1–3 developers estimated)
- Run on a single shop's servers/cloud today (single-branch)
- Be maintainable by a small team long-term without a dedicated DevOps engineer
- Support cross-module transactions (job → inventory → billing → accounting must be atomic or at least consistent)
- Scale to multi-branch in the future if the business grows
- Be deployable on a simple VPS or low-cost cloud hosting

## Options Considered

### Option 1: Modular Monolith (Recommended)

**Description**: A single deployable application where module code is organized into strict, enforced boundaries within one codebase. Modules share a database but own their tables. Cross-module communication uses internal APIs (function calls) or domain events stored in an outbox table.

**Module structure** (per Master Plan §4):
```
src/modules/
  customers/        # Module A
  scheduling/       # Module B
  service-orders/   # Module C
  inventory/        # Module D
  billing/          # Module E
  payroll/          # Module F
  finance/          # Module G
  reminders/        # Module H
  follow-up/        # Module I
  reporting/        # Module J
  administration/   # Module K
  _platform/        # Shared kernel (auth, audit, notifications, etc.)
```

**Boundary enforcement mechanisms**:
- Linting rules (ESLint import rules or ArchUnit): modules may not import each other's internals
- Each module owns its tables (enforced by naming convention and architectural tests)
- Cross-module access only via each module's public API layer or domain events
- Each module has its own `CONTRACT.md` documenting its public interface

**How cross-module integration works** (§4, §6):
- Synchronous: Module C calls Module D's public API for parts availability
- Asynchronous: Module C emits `ServiceOrderCompleted` event in outbox; Module G and I subscribe
- Stubs: When Module C is built in Phase 2 and Module D is not yet built, C uses a stub implementation of D's contract. When D ships in Phase 3, replace stub with real implementation.

**Deployment**: Single process, single database, single deployment unit. CI/CD pipeline builds and deploys one artifact.

**Scoring**:
| Criterion | Score (1–5) | Notes |
|-----------|------------|-------|
| Development simplicity | 5 | One codebase, one debug context, shared types |
| Deployment simplicity | 5 | One process, one database, easy VPS deployment |
| Transaction consistency | 5 | ACID transactions across modules, no distributed transaction hell |
| Independent module scaling | 2 | Cannot scale Module E (POS) without scaling everything |
| Team size fit | 5 | Ideal for 1–3 developers; no service mesh, no K8s |
| Future microservice extraction | 3 | Can extract later if needed; outbox events are the extraction seam |
| Hosting cost | 5 | One VPS or one cloud app instance |

---

### Option 2: Microservices (11 separate services)

**Description**: Each module is a separately deployable service. Services communicate via HTTP/REST APIs and a message broker (e.g., RabbitMQ or Kafka). Each service has its own database.

**Infrastructure required** (minimum):
- 11 application services
- 1 API gateway
- 1 message broker
- 11 databases (or shared cluster with schema isolation)
- 1 service registry / discovery
- Centralized logging (ELK stack or equivalent)
- Distributed tracing (Jaeger or Zipkin)
- Kubernetes or Docker Swarm for orchestration

**Scoring**:
| Criterion | Score (1–5) | Notes |
|-----------|------------|-------|
| Development simplicity | 1 | 11× deployment configs, service-to-service auth, versioning |
| Deployment simplicity | 1 | Requires container orchestration, service mesh |
| Transaction consistency | 2 | Distributed transactions; saga pattern required |
| Independent module scaling | 5 | POS can scale independently of Finance |
| Team size fit | 1 | Minimum 3–5 engineers just for DevOps; overkill for 1 shop |
| Future microservice extraction | 5 | Already there |
| Hosting cost | 1 | 10–20× more expensive; Kubernetes cluster alone costs $50–200/month |

---

### Option 3: Hybrid — Modular Monolith with Optional Service Extraction

**Description**: Start with Option 1 (modular monolith). Design module contracts and outbox events as the extraction seam. When/if multi-branch scaling requires it, extract high-volume services (e.g., Reminders, Reporting) into separate processes.

This is the same as Option 1 today, with a documented upgrade path.

## Decision: Modular Monolith (Option 1/3) — ACCEPTED

**Selected Architecture**: Build as a Modular Monolith from day one. This fully implements the Blueprint's intent of "modular services sharing common services" while remaining practical for a 3-developer team and single-shop deployment.

**Next.js Implementation**:
- Single Next.js application deployed on Vercel
- Modules organized as feature folders under `app/(modules)/[module-id]/`
- Shared Supabase Postgres database with Row Level Security (RLS)
- Module boundaries enforced via:
  - Next.js file-based routing (each module owns its routes)
  - ESLint import rules (modules cannot import each other's internals)
  - Supabase RLS policies (database-level access control per module tables)
  - Architectural tests (verify table ownership, contract compliance)

**Module structure** (Next.js App Router):
```
app/
  (modules)/
    customers/        # Module A - routes, components, server actions
    scheduling/       # Module B
    service-orders/   # Module C
    inventory/        # Module D
    billing/          # Module E
    payroll/          # Module F
    finance/          # Module G
    reminders/        # Module H
    follow-up/        # Module I
    reporting/        # Module J
    admin/            # Module K
  _platform/          # Shared kernel (auth, audit, notifications)
lib/
  modules/
    [module-id]/
      domain/         # Business logic
      data/           # Supabase queries
      types/          # TypeScript types
      contracts.ts    # Public API exported to other modules
supabase/
  migrations/         # Database schema per module
  ```

**How cross-module integration works**:
- **Synchronous**: Module C imports Module D's `contracts.ts` for parts availability check (server-side only)
- **Asynchronous**: Module C writes domain event to `outbox` table via Supabase trigger; Module G and I subscribe via Supabase Realtime or Edge Function polling
- **Stubs**: When Module C is built in Phase 2 and Module D is not yet built, C uses a stub implementation of D's contract. When D ships in Phase 3, replace stub with real implementation.

**Deployment**: Single Next.js app on Vercel, single Supabase database, single domain.

The outbox pattern (domain events) built into the platform kernel from Phase 1 provides the extraction seam. If the business grows to 3+ branches requiring independent service scaling, individual modules can be extracted into Supabase Edge Functions or separate Next.js deployments at that time — the events, contracts, and table ownership boundaries are already defined.

## Consequences (Next.js + Supabase Implementation)

**Positive**:
- **Simpler local development**: `npm run dev` starts the entire system (Next.js + Supabase local)
- **ACID transactions across modules**: Invoice posting and inventory deduction can be in one Supabase transaction
- **Single deployment pipeline**: `git push` → Vercel auto-deploy, easier rollback
- **Easier debugging**: Single Next.js process, single Supabase log stream, single call stack
- **Lower hosting cost**: One Vercel deployment, one Supabase database (free tiers sufficient)
- **Faster cross-module development**: Module-to-module calls are function calls (no HTTP overhead in Phase 1–3)
- **Schema migrations coordinated**: Supabase migrations run in order across all modules
- **RLS security**: Database enforces access control, prevents many authorization bugs
- **Type safety**: Supabase generates TypeScript types from schema, shared across modules

**Negative / Watch Points**:
- **Module boundary discipline**: Requires enforcement (ESLint rules, code review, architectural tests)
- **Cannot independently scale a single module**: Not a concern at current shop size; future extraction to Edge Functions possible
- **Boundary violations**: If module boundaries are violated early, the "modular" benefit is lost — requires consistent developer discipline
- **Performance bottleneck**: A slow Module J report query could affect the entire application (mitigation: Supabase read replicas or separate reporting database in Phase 6)
- **Vercel function limits**: Serverless functions have 10-second timeout on Hobby tier (15s on Pro). Long-running jobs must use Supabase Edge Functions or scheduled jobs.

**Not affected by this decision**:
- Module specifications, data model, business rules (all stack-agnostic)
- API endpoint design (can expose module APIs externally if needed via Next.js API routes)
- Security model (RBAC, audit, encryption — enforced by Supabase RLS)

## Module Boundary Rules (Binding)

These rules are BINDING from Phase 1 and enforced by ESLint, Supabase RLS, and code review:

1. **Import rules**: A module may only import from its own `lib/modules/[module-id]/*` and from `lib/platform/*`. Cross-module imports must go through `contracts.ts` only.
2. **Server-side only**: Module-to-module calls only allowed in Server Components, Server Actions, or API Routes — never in Client Components (prevents client bundle coupling).
3. **Table ownership**: Database table names are prefixed with the module letter (e.g., `c_service_orders`, `d_items`). Each table owned by exactly one module.
4. **RLS policies**: Supabase Row Level Security policies enforce access control per module. No module bypasses RLS to access another module's tables directly.
5. **Cross-module reads**: Reporting (Module J) that needs cross-module data uses read-only Supabase views or materialized views, never direct joins across module ownership boundaries.
6. **Side effects**: All cross-module side effects go through domain events in the `outbox` table, processed by Supabase Edge Functions or Realtime subscriptions.
7. **Public contracts**: Each module's public contract is documented in `lib/modules/<module-id>/contracts.ts` with TypeScript types and JSDoc.
8. **Exceptions**: Violation of rules 1–4 must be approved by Tech Lead as a documented exception in `docs/DECISIONS.md`.

**Enforcement tooling (Phase 1)**:
- ESLint plugin: `@nx/enforce-module-boundaries` or custom rule
- Supabase RLS policies tested in integration tests
- Architectural tests: verify no direct table access violations
- PR template checklist: "Does this PR violate module boundaries?"

## Links
- Master Plan §4: `docs/01-MASTER-PLAN.md`
- ADR-001 (Technology Stack): `docs/adr/ADR-001-technology-stack.md`
- Open Questions: `docs/OPEN-QUESTIONS.md` (Q-13 resolved)
- Decisions Log: `docs/DECISIONS.md` (AD-002)
