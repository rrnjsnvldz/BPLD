# ADR-002: Architecture Style — Modular Monolith vs. Microservices

**Status**: PENDING — awaiting Gate 0 approval  `PENDING(Q-13)`  
**Date**: 2026-11-10  
**Deciders**: Owner, Tech Lead  
**Reviewed by**: [to be assigned at Gate 0]

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

## Decision: Modular Monolith (Option 1 / Option 3)

**Recommendation**: Build as a Modular Monolith from day one. This fully implements the Blueprint's intent of "modular services sharing common services" while remaining practical for a small team and single-shop deployment.

The outbox pattern (domain events) built into the platform kernel from Phase 1 provides the extraction seam. If the business grows to 3+ branches requiring independent service scaling, individual modules can be extracted into separate services at that time — the events, contracts, and table ownership boundaries are already defined.

## Consequences

**Positive**:
- Simpler local development: `npm run dev` or `php artisan serve` starts the entire system
- ACID transactions across modules: invoice posting and inventory deduction can be in one database transaction
- Single deployment pipeline: one build, one deploy, easier rollback
- Easier debugging: single log stream, single call stack
- Lower hosting cost: one process, one database connection pool
- Faster cross-module development: no network calls between modules in Phase 1–3
- Schema migrations across modules in one migration run (no cross-service migration coordination)

**Negative / Watch Points**:
- Module boundary discipline requires enforcement (linting rules, code review)
- Cannot independently scale a single module (not a concern at current shop size)
- If module boundaries are violated early, the "modular" benefit is lost — requires consistent developer discipline
- Performance bottleneck: a slow Module J report query could affect the entire application (mitigation: read replicas or separate reporting database in Phase 6)

**Not affected by this decision**:
- Module specifications, data model, business rules (all stack-agnostic)
- API endpoint design (can expose module APIs externally if needed)
- Security model (RBAC, audit, encryption)

## Module Boundary Rules (Binding)

These rules are BINDING from Phase 1 and enforced by linting and code review:

1. A module may only import from its own files and from `_platform/`
2. A module may call another module's public API layer, never its internals (domain, application, infrastructure)
3. Database table names are prefixed with the module letter (e.g., `c_service_orders`, `d_items`)
4. A table is owned by exactly one module; no other module writes to it directly
5. Cross-module reads that cannot go through an API (e.g., reporting) use a read-only view or materialized view, never direct joins across module ownership boundaries
6. All cross-module side effects go through domain events in the outbox table
7. Each module's public contract is documented in `src/modules/<x>/CONTRACT.md`
8. Violation of rules 1–4 must be approved by Tech Lead as a documented exception

## Decision Required at Gate 0

`PENDING(Q-13)`: Tech Lead must confirm architecture choice at Gate 0. Record in `docs/DECISIONS.md`.

Inputs needed:
1. Tech Lead: confirm modular monolith is acceptable, or provide technical rationale for microservices
2. If microservices: identify which modules genuinely need independent scaling today, and confirm DevOps capacity

## Links
- Master Plan §4: `docs/01-MASTER-PLAN.md`
- ADR-001: `docs/adr/ADR-001-technology-stack.md`
- Open Questions: `docs/OPEN-QUESTIONS.md` (Q-13)
- Decisions Log: `docs/DECISIONS.md`
