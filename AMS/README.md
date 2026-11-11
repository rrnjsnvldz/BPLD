# Autoshop Management System (AMS)

**For JRS Bongabon**

A comprehensive web-based platform managing all autoshop operations: customer and vehicle records, scheduling, service orders, inventory, billing, payroll, accounting, maintenance reminders, follow-ups, and reporting.

---

## 🚀 Quick Start (Developer Onboarding)

**🎉 Phase 1 is LIVE! Get running in 15 minutes.**

### Prerequisites
- **Node.js:** 18.17+ ([Download](https://nodejs.org/))
- **npm:** 9+
- **Git**
- **Code editor:** VS Code recommended

### Setup Steps

```bash
# 1. Clone repository
git clone <repository-url>
cd AMS

# 2. Install dependencies
npm install

# 3. Configure environment
cp .env.local.example .env.local
# Edit .env.local with your Supabase credentials

# 4. Start development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

**📖 Full setup guide:** See `SETUP.md` for detailed instructions including Supabase setup, database migrations, and troubleshooting.

**🔧 Having trouble?** Check `docs/PHASE-1-PROGRESS.md` for current status, or see `SETUP.md` troubleshooting section.

---

## Project Structure

```
AMS/
├── docs/                    # Phase 0 documentation
│   ├── 01-MASTER-PLAN.md   # System blueprint
│   ├── 02-MASTER-CHECKLIST.md
│   ├── PHASE-1-PROGRESS.md # Current sprint tracking
│   ├── STATUS.md           # Overall project status
│   ├── OPEN-QUESTIONS.md
│   ├── DECISIONS.md
│   ├── GLOSSARY.md
│   ├── modules/            # Per-module checklists (K, A-J)
│   ├── design/             # Design system, wireframes
│   ├── adr/                # Architecture decisions
│   └── legal/              # Contract draft
├── src/                     # Application source code
│   ├── app/                # Next.js App Router
│   │   ├── (modules)/      # Module routes
│   │   │   ├── admin/      # Module K - Administration
│   │   │   ├── customers/  # Module A - Customers & Vehicles
│   │   │   └── ...         # Other modules (B-J)
│   │   └── (platform)/     # Auth routes (login, register)
│   ├── components/
│   │   ├── ui/             # shadcn/ui components
│   │   └── platform/       # Shared components
│   ├── lib/
│   │   ├── platform/       # Platform Kernel (auth, db, types)
│   │   └── modules/        # Module business logic
│   └── ...
├── supabase/
│   └── migrations/         # Database migrations
├── public/                 # Static files
├── SETUP.md                # Developer setup guide
├── CONTRIBUTING.md         # Git workflow, coding standards
└── README.md               # This file
```

**Key Documents:**
- **🚀 New developer?** Read `SETUP.md` (get running in 15 minutes)
- **📖 System overview?** Read `docs/01-MASTER-PLAN.md` (vision, architecture, modules)
- **✅ Contributing?** Read `CONTRIBUTING.md` (git workflow, commit format, review process)
- **📊 Current sprint?** Check `docs/PHASE-1-PROGRESS.md` (Week 1-4 tasks)
- **🎯 Overall status?** Check `docs/STATUS.md` and `docs/02-MASTER-CHECKLIST.md`
- **❓ Questions?** See `docs/OPEN-QUESTIONS.md` or ask in team chat

---

## System Overview

AMS replaces paper job cards, notebooks, and spreadsheets with 11 integrated modules covering:

| Module | Name | Purpose |
|--------|------|---------|
| K | Administration | Users, roles, settings, audit, backups |
| A | Customers & Vehicles | Customer directory, vehicle records, service history |
| B | Scheduling | Appointments, bay allocation, capacity management |
| C | Service Orders | Job cards, estimates, approvals, work tracking, QC |
| D | Inventory | Parts, purchasing, stock control, costing |
| E | POS & Billing | Invoicing, payments, receipts, cash sessions, AR |
| F | Payroll & HR | Employees, attendance, compensation, payroll runs |
| G | Finance | Expenses, AP, bank reconciliation, financial statements |
| H | Reminders | Preventive maintenance reminders, campaigns |
| I | Follow-Up | Satisfaction surveys, complaints, warranty, loyalty |
| J | Reporting | Dashboards and reports for all roles |

**Build Order:** K → A → B → C → D → E → F → G → H → I → J  
**Current Phase:** See `docs/STATUS.md`

---

## Technology Stack

**✅ Decided at Gate 0 (2026-11-10):**

- **Frontend:** Next.js 14+ (App Router) + React 18+ + TypeScript
- **Backend:** Next.js API Routes + Supabase Edge Functions
- **Database:** Supabase (PostgreSQL 15+)
- **Auth:** Supabase Auth
- **Storage:** Supabase Storage
- **Hosting:** Vercel
- **UI:** shadcn/ui + Tailwind CSS
- **Forms:** React Hook Form + Zod

**Architecture:** Modular Monolith (see `docs/adr/ADR-002-architecture-style.md`)
- Single Next.js application
- Module boundaries enforced via ESLint + RLS policies
- Event-driven cross-module integration via outbox pattern
- Can extract to microservices later if needed

**Full rationale:** See `docs/adr/ADR-001-technology-stack.md`

---

## Development Workflow

1. **Pick a task** from `docs/PHASE-1-PROGRESS.md` (current sprint) or module checklist
2. **Create feature branch:** `feature/module-k-user-list` or `fix/auth-session-bug`
3. **Implement:** Follow module boundary rules (see `docs/adr/ADR-002-architecture-style.md`)
4. **Test:** Run `npm run build` and `npm run lint` before committing
5. **Commit:** Use conventional commits (e.g., `feat(module-k): add user list screen`)
6. **Open PR:** Use template (auto-generated), add screenshots if UI
7. **Review:** All PRs require approval; security-sensitive changes need 2 approvals
8. **Merge:** Squash and merge to `main`, delete branch
9. **Update:** Tick checklist item, update `docs/PHASE-1-PROGRESS.md`

**Module Boundary Rules (Critical):**
- ❌ Modules cannot import each other's internals
- ✅ Cross-module communication via `contracts.ts` only
- ✅ All database tables use Row Level Security (RLS)
- ✅ Tables prefixed with module letter (e.g., `k_users`, `a_customers`)

**Details:** `CONTRIBUTING.md` and `SETUP.md`

---

## Testing

**Test strategy:**
- **Unit tests:** Business logic, utilities (Vitest)
- **Integration tests:** API routes, database operations
- **E2E tests:** Full user flows (Playwright)
- **RLS tests:** Row Level Security policy verification

**Run tests:**
```bash
npm test                 # Run all tests
npm run test:watch       # Watch mode
npm run test:e2e         # End-to-end tests
```

**Coverage target:** 80% for business logic, 100% for money/stock/payroll calculations

*Note: Test suite setup in progress (Phase 1, Week 1)*

---

## Security

- **Authentication:** Supabase Auth (email/password, magic links, OAuth)
- **Authorization:** Row Level Security (RLS) enforced at database level
- **Audit:** All state-changing actions logged to `audit_log` table
- **Data:** Encrypted in transit (HTTPS) and at rest (Supabase encryption)
- **Secrets:** Environment variables only, never committed to git
- **Backups:** Automated via Supabase (daily backups, point-in-time recovery)

**Security reviews required for:** auth flows, RLS policies, money handling, inventory, file uploads, integrations

See `docs/SECURITY-PLAN.md` for full security baseline.

---

## Deployment

**Current environment:** Development (Phase 1)

**Hosting:**
- **Frontend + API:** Vercel (automatic deployment on git push)
- **Database:** Supabase Cloud (free tier)
- **Domain:** `jrs-ams.vercel.app` (or custom domain TBD)

**Deployment process:**
```bash
# Automatic deployment
git push origin main  # Deploys to production
git push origin dev   # Deploys to preview

# Manual deployment (if needed)
vercel --prod
```

**Environments:**
- **Development:** Local (`npm run dev`)
- **Preview:** Per-branch on Vercel (auto-created on PR)
- **Production:** `main` branch → Vercel production

**Backups:** Automated daily via Supabase, restore tested monthly

*Full deployment guide will be added in Phase 7*

---

## Support and Contacts

**Team:** 3 developers + AI assistance

**Communication:**
- **Sprint progress:** `docs/PHASE-1-PROGRESS.md` (updated daily)
- **Overall status:** `docs/STATUS.md`
- **Questions:** `docs/OPEN-QUESTIONS.md` or team chat
- **Issues:** GitHub Issues
- **Decisions:** `docs/DECISIONS.md`

**Key Decisions Made:**
- ✅ Gate 0 approved (2026-11-10)
- ✅ Stack: Next.js + Supabase + Vercel
- ✅ Architecture: Modular Monolith
- ✅ Timeline: 12 weeks to core system

---

## License

**Proprietary** — JRS Bongabon Autoshop Management System  
Copyright © 2026 [Development Team Name]  
All rights reserved.

See `docs/legal/CONTRACT-DRAFT.md` for IP and licensing terms.

---

## Resources

- **📖 Master Plan:** `docs/01-MASTER-PLAN.md` — Complete system specification
- **✅ Master Checklist:** `docs/02-MASTER-CHECKLIST.md` — All phases and tasks
- **📊 Phase 1 Progress:** `docs/PHASE-1-PROGRESS.md` — Current sprint (Week 1-4)
- **🎯 Status:** `docs/STATUS.md` — Overall project status
- **📚 Glossary:** `docs/GLOSSARY.md` — Canonical terms
- **🏗️ ADRs:** `docs/adr/` — Architecture decisions
- **🔒 Security:** `docs/SECURITY-PLAN.md` — Security baseline
- **🚀 Setup:** `SETUP.md` — Developer onboarding guide

**External:**
- **Next.js:** https://nextjs.org/docs
- **Supabase:** https://supabase.com/docs
- **shadcn/ui:** https://ui.shadcn.com
- **Tailwind:** https://tailwindcss.com/docs

---

**Last Updated:** 2026-11-10  
**Current Phase:** Phase 1 (Platform Kernel + UI Kit + Module K + Module A)  
**Current Sprint:** Week 1 of 12  
**Next Gate:** Gate M1 (Module K + A complete)
