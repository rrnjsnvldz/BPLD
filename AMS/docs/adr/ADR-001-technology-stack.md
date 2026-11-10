# ADR-001: Technology Stack Selection

**Status**: PENDING — awaiting Gate 0 approval `PENDING(Q-12)`  
**Date**: 2025-01-24  
**Deciders**: Owner, Tech Lead  
**Reviewed by**: [to be assigned at Gate 0]

---

## Context

The AMS project requires a technology stack for:
- A responsive web application (desktop, tablet, mobile device profiles)
- An API-based backend with modular architecture (11 modules: A–K)
- A relational database
- File and document storage
- Background job scheduling (reminders, payroll processing, backups)
- Integration with SMS gateway, email provider, payment channels, printers, scanners
- A single-branch deployment today, multi-branch-ready architecture
- Philippine business context (PHP currency, Asia/Manila timezone, statutory payroll rules)

Blueprint §10 recommends: React or Vue frontend, Node.js/Laravel/Django/.NET backend, PostgreSQL or MySQL database. Final choice deferred to team skills, budget, and hosting preference.

This ADR evaluates four concrete options and provides a decision framework.

---

## Decision Framework

Evaluation criteria with weights:

| Criterion | Weight | Rationale |
|-----------|--------|-----------|
| Team familiarity and skill match | 30% | Faster delivery, fewer mistakes, lower training cost |
| Ecosystem maturity and library support | 20% | Payroll rules, receipt printing, Philippine-specific libs |
| Hosting cost and simplicity | 20% | SME budget; single VPS or low-cost cloud ideal |
| Development velocity | 15% | 11 modules, phases 1–6, 1–2 developers likely |
| Long-term maintainability | 15% | System must run 5–10 years with limited DevOps |

---

## Options Considered

### Option A: Node.js (TypeScript) + React

**Stack**:
- Frontend: React 18+ with TypeScript, Tailwind CSS, Vite
- Backend: Node.js with Express or Fastify, TypeScript
- Database: PostgreSQL
- ORM: Prisma (type-safe, migration-first) or TypeORM
- Job scheduler: BullMQ (Redis-backed) or node-cron
- File storage: local filesystem or AWS S3 / Cloudflare R2
- Hosting: single VPS (DigitalOcean Droplet, Linode, or Hostinger VPS) or Railway/Render
- Testing: Vitest (unit), Supertest (API), Playwright (E2E)

**Scoring**:

| Criterion | Score (1–5) | Notes |
|-----------|------------|-------|
| Team familiarity | ? | Depends on team — confirm at Gate 0 |
| Ecosystem maturity | 4 | Rich npm ecosystem; Prisma + React excellent for this shape |
| Hosting cost | 4 | ~$6–24/month VPS; no PHP hosting quirks |
| Development velocity | 4 | Full-stack TypeScript, shared types, great DX |
| Maintainability | 4 | Strong typing, modern tooling, active community |

**Pros**: Modern full-stack TypeScript, JSON-native, single language front and back, excellent tooling, Prisma migrations are robust, large community.  
**Cons**: Async/callback complexity for developers new to Node; no built-in admin panel; more boilerplate for some patterns than Laravel.

**Recommendation**: Strong choice if team has JavaScript/TypeScript experience.

---

### Option B: Laravel (PHP) + Vue 3

**Stack**:
- Frontend: Vue 3 with TypeScript, Tailwind CSS, Inertia.js (SPA without separate API)
- Backend: Laravel 11+, PHP 8.2+
- Database: MySQL 8 or PostgreSQL
- ORM: Eloquent (built-in)
- Job scheduler: Laravel Queue + Horizon (Redis) or database queue
- File storage: Laravel Storage (local, S3, or FTP)
- Hosting: Laravel Forge + DigitalOcean, or Hostinger/SiteGround VPS, or cPanel shared hosting
- Testing: Pest PHP (unit/feature), Dusk (browser E2E)

**Scoring**:

| Criterion | Score (1–5) | Notes |
|-----------|------------|-------|
| Team familiarity | ? | Confirm at Gate 0 |
| Ecosystem maturity | 5 | Most batteries-included; built-in queue, scheduler, mail, auth |
| Hosting cost | 5 | PHP shared hosting widely available in PH at ₱500–2000/month |
| Development velocity | 5 | Laravel is very fast to build CRUD-heavy apps |
| Maintainability | 4 | Excellent docs, Eloquent is productive, Inertia reduces API complexity |

**Pros**: Batteries-included (auth, queues, scheduler, mail, file storage, task scheduling all built-in), excellent documentation, Eloquent ORM is productive for CRUD-heavy apps, PHP hosting widely available in Philippines at low cost, Inertia.js avoids API duplication overhead.  
**Cons**: PHP requires a PHP-capable server (not just Node on VPS); two languages (PHP + JavaScript); Eloquent has some gotchas for complex queries; Vue + Inertia is less popular than React globally (smaller ecosystem).

**Recommendation**: Strong choice if team has PHP/Laravel experience. Best fit for rapid MVP delivery in Philippine hosting environment.

---

### Option C: Django (Python) + React

**Stack**:
- Frontend: React 18+ with TypeScript, Tailwind CSS
- Backend: Django 5+ with Django REST Framework (DRF)
- Database: PostgreSQL
- ORM: Django ORM (built-in)
- Job scheduler: Celery + Redis or Django-Q
- File storage: Django storages (local, S3)
- Hosting: PythonAnywhere, Heroku, Railway, or VPS
- Testing: pytest-django, Playwright

**Scoring**:

| Criterion | Score (1–5) | Notes |
|-----------|------------|-------|
| Team familiarity | ? | Confirm at Gate 0 |
| Ecosystem maturity | 4 | Django admin is powerful; DRF is mature |
| Hosting cost | 3 | Python hosting less common in PH; VPS required |
| Development velocity | 3 | Django admin accelerates back-office; React separation adds overhead |
| Maintainability | 4 | Strong typing with mypy, good for data-heavy apps |

**Pros**: Django admin panel accelerates back-office screens, Django ORM is excellent for complex queries, strong data handling, Python ecosystem for future reporting/analytics.  
**Cons**: Python-specific hosting less common in Philippines; Celery for background jobs adds operational complexity; two languages (Python + JavaScript); smaller local developer pool in PH.

**Recommendation**: Consider only if team has strong Python/Django experience.

---

### Option D: .NET (C#) + React or Blazor

**Stack**:
- Frontend: React with TypeScript + Tailwind, or Blazor Server/WASM
- Backend: ASP.NET Core 8+, C#
- Database: SQL Server 2022 or PostgreSQL
- ORM: Entity Framework Core
- Job scheduler: Hangfire or Quartz.NET
- File storage: local or Azure Blob Storage
- Hosting: Azure App Service, or Windows VPS, or Linux VPS with .NET SDK
- Testing: xUnit, Playwright

**Scoring**:

| Criterion | Score (1–5) | Notes |
|-----------|------------|-------|
| Team familiarity | ? | Confirm at Gate 0 |
| Ecosystem maturity | 5 | Enterprise-grade, excellent IDE support (Visual Studio / Rider) |
| Hosting cost | 2 | Azure or Windows Server significantly more expensive; SQL Server licensing |
| Development velocity | 3 | Verbose compared to Laravel; strong for large enterprise teams |
| Maintainability | 5 | Strong typing, excellent refactoring, long-term stability |

**Pros**: Strongly typed end-to-end (Blazor shares C# types), excellent IDE support, enterprise-proven, long-term Microsoft support commitment.  
**Cons**: Highest hosting cost (Azure or Windows VPS + possible SQL Server licensing); steepest learning curve; overkill for single-shop deployment; smaller PH developer pool vs. PHP/JS.

**Recommendation**: Only if team is .NET-experienced and budget allows Azure hosting.

---

## Decision Framework Scoring Summary

| Criterion | Weight | Option A (Node+React) | Option B (Laravel+Vue) | Option C (Django+React) | Option D (.NET+Blazor/React) |
|-----------|--------|-----------------------|------------------------|-------------------------|-----------------------------|
| Team familiarity | 30% | TBD | TBD | TBD | TBD |
| Ecosystem maturity | 20% | 4 | 5 | 4 | 5 |
| Hosting cost | 20% | 4 | 5 | 3 | 2 |
| Dev velocity | 15% | 4 | 5 | 3 | 3 |
| Maintainability | 15% | 4 | 4 | 4 | 5 |
| **Weighted Total (excl. team)** | 70% | 2.80 | 3.43 | 2.38 | 2.73 |
| Team familiarity fills remaining 30% | | Confirm | Confirm | Confirm | Confirm |

**Break-even analysis**: For team familiarity to override the Option B default, the team's familiarity with another stack must be significantly higher (score of 5 vs. assumed 3 for Laravel).

---

## Recommendation

- **If team has PHP/Laravel experience**: Choose **Option B (Laravel + Vue)**. Best overall score, widest hosting options in PH, fastest delivery for CRUD-heavy shop management app.
- **If team has JavaScript/TypeScript experience**: Choose **Option A (Node.js + React)**. Modern, single-language, strong ecosystem.
- **If team has Python experience**: Option C is viable but hosting overhead is a real cost.
- **If team is .NET-only**: Option D works but expect higher hosting costs.

---

## Decision Required at Gate 0

`PENDING(Q-12)`: Owner and Tech Lead must select one option at Gate 0. Record decision in `docs/DECISIONS.md`.

Inputs needed:
1. Tech Lead: list team's primary language skills and years of experience
2. Owner: preferred hosting budget (monthly)
3. Owner: preferred hosting provider (local PH provider vs. international cloud)
4. Tech Lead: estimated project timeline with chosen stack

---

## Consequences

- The chosen stack determines the platform kernel, UI kit tooling, database migrations, testing frameworks, and CI/CD pipeline
- Stack choice does NOT affect module specifications, data model, or business rules — these are stack-agnostic
- If the stack must change mid-project (team change, acquisition), a Change Request (CR) is required; architecture documents will need partial updates but module specs and data model are reusable
- All four options can implement the full AMS feature set

---

## Links

- Master Plan §4: `docs/01-MASTER-PLAN.md`
- ADR-002: `docs/adr/ADR-002-architecture-style.md`
- Open Questions: `docs/OPEN-QUESTIONS.md` (Q-12)
- Decisions Log: `docs/DECISIONS.md`
