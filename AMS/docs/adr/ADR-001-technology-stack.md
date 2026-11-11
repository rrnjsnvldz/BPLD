# ADR-001: Technology Stack Selection

**Status**: ✅ ACCEPTED  
**Date Proposed**: 2025-01-24  
**Date Decided**: 2026-11-10  
**Deciders**: Owner  
**Stack Selected**: Next.js + React + Supabase + Vercel

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

## Decision

**Selected Stack: Next.js 14+ with App Router + React 18+ + Supabase + Vercel**

### Architecture Components

**Frontend:**
- Next.js 14+ with App Router (server components, streaming SSR, ISR)
- React 18+ with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- Zod for validation
- React Hook Form for forms

**Backend:**
- Next.js API Routes (server actions, route handlers)
- Supabase Edge Functions (for complex background jobs)
- Supabase Postgres (database)
- Supabase Auth (authentication & authorization)
- Supabase Storage (file uploads)
- Supabase Realtime (live updates)

**Infrastructure:**
- Vercel (hosting, CDN, edge network)
- Supabase Cloud (free tier → Pro as needed)
- Vercel Postgres (optional fallback)
- Vercel Cron Jobs (scheduled tasks)

### Rationale

This modern stack provides exceptional value for AMS:

**1. Supabase eliminates massive Platform Kernel work:**
- ✅ **Auth out-of-the-box**: Email/password, magic links, OAuth ready (Module K authentication ~80% done)
- ✅ **Row Level Security (RLS)**: Database-level security enforces access control automatically
- ✅ **Realtime subscriptions**: Live job board updates, POS synchronization, inventory changes
- ✅ **Storage**: Document uploads, work order photos, invoice PDFs
- ✅ **Postgres**: Full-featured relational database with triggers, functions, full-text search

**2. Next.js accelerates development:**
- Server components reduce client bundle size
- API routes colocated with frontend code
- Built-in image optimization
- TypeScript end-to-end type safety
- Excellent developer experience

**3. Vercel deployment is zero-config:**
- Git push → automatic deployment
- Preview deployments for branches
- Automatic HTTPS
- Edge network (fast for Philippines users)
- No DevOps overhead

**4. Cost-effective for single-shop:**
- Supabase free tier: 500MB database, 1GB storage, 50,000 monthly active users
- Vercel Hobby tier: Free for non-commercial (or $20/month Pro)
- Total monthly cost: ₱0–₱2,000 ($0–$40) until significant growth

**5. Philippine context advantages:**
- Supabase hosted in AWS Singapore (low latency to Manila)
- PostgreSQL handles PHP currency decimal precision correctly
- Timezone support built into Postgres
- JSON columns for flexible statutory payroll rules

### Comparison to Original Options

| Feature | Next.js+Supabase | Laravel+Vue | Node+React | Django+React |
|---------|------------------|-------------|------------|--------------|
| Auth built-in | ✅ Supabase Auth | ✅ Laravel Auth | ❌ DIY | ✅ Django Auth |
| Realtime | ✅ Supabase | ❌ DIY w/ Redis | ❌ DIY | ❌ DIY |
| Hosting complexity | ✅ Git push | ⚠️ PHP host | ⚠️ VPS setup | ⚠️ VPS setup |
| Database migrations | ✅ Supabase CLI | ✅ Laravel | ⚠️ Prisma setup | ✅ Django |
| TypeScript E2E | ✅ Native | ❌ PHP/JS split | ✅ Native | ❌ Python/JS |
| Admin panel | ⚠️ DIY | ✅ Laravel Nova | ❌ DIY | ✅ Django Admin |
| Row-level security | ✅ RLS | ❌ App code | ❌ App code | ❌ App code |

**Trade-off accepted**: No built-in admin panel like Laravel Nova or Django Admin. Module K Administration will require custom UI, but Supabase Auth + RLS + Next.js Server Actions make this straightforward.

---

## Consequences

### Positive

1. **Massive acceleration**: Supabase Auth, RLS, Realtime, and Storage eliminate weeks of Platform Kernel work
2. **Type safety end-to-end**: TypeScript from database (via Supabase types) → API → UI
3. **Zero DevOps**: Vercel handles deployment, HTTPS, CDN, scaling automatically
4. **Low cost**: Free tiers suitable for initial deployment, predictable pricing as you grow
5. **Modern DX**: Hot reload, TypeScript, component library, great debugging tools
6. **Security by default**: Supabase RLS enforces access control at database level (prevents many authorization bugs)
7. **Realtime ready**: Job board live updates, POS inventory sync work out-of-the-box
8. **Edge functions**: Supabase Edge Functions (Deno) handle background jobs that need isolation

### Negative / Mitigations

1. **Vendor lock-in to Supabase:**
   - **Mitigation**: Supabase is open-source; can self-host if needed. Postgres schema is standard SQL (portable).
   - **Exit path**: Migrate to standard Postgres + custom auth layer if Supabase discontinued.

2. **No built-in admin panel (unlike Laravel Nova / Django Admin):**
   - **Mitigation**: Module K screens must be custom-built. Use shadcn/ui data tables + forms. Supabase Studio provides database admin UI for developers.

3. **Next.js Server Components learning curve:**
   - **Mitigation**: Well-documented, large community, many tutorials. Team learns once, benefits throughout project.

4. **Cold start latency on Vercel Hobby tier:**
   - **Mitigation**: Upgrade to Vercel Pro ($20/month) if needed. Supabase API is always warm.

5. **Supabase free tier limits (500MB DB, 1GB storage):**
   - **Mitigation**: Monitor usage. Upgrade to Supabase Pro ($25/month) when approaching limits. Sufficient for single-shop launch.

### Impact on Phase 1 (Platform Kernel + UI Kit)

**Platform Kernel work significantly reduced:**

| Original Kernel Component | Next.js + Supabase Implementation |
|---------------------------|-----------------------------------|
| Authentication | ✅ Supabase Auth (~2 days setup vs ~2 weeks DIY) |
| Authorization | ✅ Supabase RLS policies (~1 week vs ~2 weeks app-level) |
| Database layer | ✅ Supabase client + generated types (~2 days vs ~1 week ORM setup) |
| File uploads | ✅ Supabase Storage (~2 days vs ~1 week) |
| Background jobs | ⚠️ Vercel Cron + Supabase Edge Functions (~1 week) |
| Logging/monitoring | ⚠️ Vercel Analytics + Supabase logs (~3 days setup) |
| Email/SMS integration | ⚠️ Still need Twilio/SendGrid integration (~1 week) |

**Estimated Platform Kernel savings: ~4–5 weeks** (from ~8 weeks → ~3–4 weeks)

**UI Kit unchanged:**
- shadcn/ui components (React/Tailwind) work perfectly with Next.js
- Design System Plan already specifies React components
- All 67 components from Design System Plan remain valid

---

## Links

- Master Plan §4: `docs/01-MASTER-PLAN.md`
- ADR-002: `docs/adr/ADR-002-architecture-style.md`
- Open Questions: `docs/OPEN-QUESTIONS.md` (Q-12)
- Decisions Log: `docs/DECISIONS.md`
