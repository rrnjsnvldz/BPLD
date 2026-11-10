# AMS Master Checklist v1.0

**Last Updated:** 2026-11-10  
**Current Phase:** Phase 0 — Discovery and Design  
**Current Module:** N/A (documentation phase)  
**Overall Progress:** Phase 0 in progress, 0 of 11 modules complete

---

## Legend

### Status Notation
- `- [ ]` Not started
- `- [x]` Done (evidence required)

### Inline Tags
- `IN PROGRESS` — Work underway
- `BLOCKED(Q-nn)` — Waiting on answer to question Q-nn
- `DEFERRED-INTEGRATION(with <module>)` — Stub in place, wire when module ships
- `DEFERRED(CR-nn)` — Postponed by Change Request
- `DROPPED(CR-nn)` — Removed from scope by Change Request

### Priority (set at Gate M1 per module)
- **Must** — Required for module sign-off
- **Should** — Highly valuable, defer only if blocked
- **Could** — Nice-to-have, defer if time-constrained

### ID Conventions
- `P0-NN` — Phase 0 item
- `<Module>-F<NN>` — Core function
- `<Module>-S<NN>` — Screen/view
- `<Module>-R<NN>` — Key record
- `<Module>-O<NN>` — Output/report
- `<Module>-N<NN>` — Rule/note
- `<Module>-SL<NN>` — Slice (added at module start)
- `PLAT-NN` — Platform kernel item
- `DSN-NN` — Design system item
- `SEC-NN` — Security item
- `DOC-NN` — Documentation item
- `MIG-NN` — Data migration item
- `TRN-NN` — Training item
- `LGL-NN` — Legal/contract item
- `Q-NN` — Open question
- `A-NN` — Assumption
- `CR-NN` — Change request
- `ADR-NNN` — Architecture decision record

---

## Phase 0: Discovery and Design

**Entry Criteria:** Master Prompt received, Blueprint readable

**Exit Gate:** Gate 0 — Team approves plan, checklist, tech stack, design approach, security approach

### Phase 0 Tasks

- [ ] P0-01: Read Blueprint end-to-end · **Priority:** Must
- [ ] P0-02: Post system summary and gaps/contradictions analysis · **Priority:** Must
- [x] P0-03: Create Master Plan (`docs/01-MASTER-PLAN.md`) · **Priority:** Must · **Evidence:** File created
- [ ] P0-04: Create Master Checklist (`docs/02-MASTER-CHECKLIST.md`) · **Priority:** Must · `IN PROGRESS`
- [ ] P0-05: Create module checklists for K, A, B, C, D, E, F, G, H, I, J · **Priority:** Must
- [ ] P0-06: Create Open Questions document with recommendations · **Priority:** Must
- [ ] P0-07: Create Assumptions list · **Priority:** Must
- [ ] P0-08: Create Decisions log · **Priority:** Must
- [ ] P0-09: Create Design System Plan · **Priority:** Must
- [ ] P0-10: Create Screen Inventory · **Priority:** Must
- [ ] P0-11: Create wireframes (job board, service order, POS, dashboard) · **Priority:** Must
- [ ] P0-12: Create Design Intake Checklist · **Priority:** Must
- [ ] P0-13: Create Apply Design Runbook · **Priority:** Must
- [ ] P0-14: Create Design Debt log (initially empty) · **Priority:** Must
- [ ] P0-15: Create Security Plan · **Priority:** Must
- [ ] P0-16: Create Data Migration Plan · **Priority:** Must
- [ ] P0-17: Create Contract Draft · **Priority:** Must
- [ ] P0-18: Create README.md · **Priority:** Must
- [ ] P0-19: Create CONTRIBUTING.md · **Priority:** Must
- [ ] P0-20: Create PR template · **Priority:** Must
- [ ] P0-21: Create Glossary · **Priority:** Must
- [ ] P0-22: Create ADR-001 (Technology Stack decision) · **Priority:** Must
- [ ] P0-23: Create ADR-002 (Architecture Style decision) · **Priority:** Must
- [ ] P0-24: Collect current workflow documentation from shop · **Priority:** Should · `PENDING(Q-19)`
- [ ] P0-25: Collect sample forms (job card, invoice, payroll) · **Priority:** Should · `PENDING(Q-19)`
- [ ] P0-26: Document team composition and roles · **Priority:** Must · `PENDING(Q-21)`
- [ ] P0-27: Create Gate 0 package (1-page summary) · **Priority:** Must
- [ ] P0-28: Owner review and Q&A session · **Priority:** Must · `PENDING(Q-17)`
- [ ] P0-29: Gate 0 approval recorded in DECISIONS.md · **Priority:** Must

**Exit Criteria:**
- All P0 Must items complete with evidence
- All Q-nn questions answered or accepted as pending with plan
- All A-nn assumptions confirmed or corrected
- Technology stack (ADR-001) approved
- Architecture approach (ADR-002) approved
- Module priorities set (Must/Should/Could per module)
- Phase 1 timeline and team confirmed

---

## Module Status Summary

| Module | Phase | Owner | Status | Coverage % | Gate M1 | Gate M2 | Tag |
|--------|-------|-------|--------|-----------|---------|---------|-----|
| K Administration | 1 | `PENDING(Q-21)` | Not Started | 0% | — | — | `module-K-v0.0` |
| A Customers & Vehicles | 1 | `PENDING(Q-21)` | Not Started | 0% | — | — | `module-A-v0.0` |
| B Scheduling | 2 | `PENDING(Q-21)` | Not Started | 0% | — | — | `module-B-v0.0` |
| C Service Orders | 2 | `PENDING(Q-21)` | Not Started | 0% | — | — | `module-C-v0.0` |
| D Inventory | 3 | `PENDING(Q-21)` | Not Started | 0% | — | — | `module-D-v0.0` |
| E POS & Billing | 3 | `PENDING(Q-21)` | Not Started | 0% | — | — | `module-E-v0.0` |
| F Payroll & HR | 4 | `PENDING(Q-21)` | Not Started | 0% | — | — | `module-F-v0.0` |
| G Finance | 4 | `PENDING(Q-21)` | Not Started | 0% | — | — | `module-G-v0.0` |
| H Reminders | 5 | `PENDING(Q-21)` | Not Started | 0% | — | — | `module-H-v0.0` |
| I Follow-Up | 5 | `PENDING(Q-21)` | Not Started | 0% | — | — | `module-I-v0.0` |
| J Reporting | 3, 6 | `PENDING(Q-21)` | Not Started | 0% | — | — | `module-J-v0.0` |

---

## Cross-Cutting Tracks

### Platform Kernel Track (Phase 1)

- [ ] PLAT-01: Authentication & session management · **Priority:** Must
- [ ] PLAT-02: Role-based access control (RBAC) engine · **Priority:** Must
- [ ] PLAT-03: Audit logging (append-only, tamper-evident) · **Priority:** Must
- [ ] PLAT-04: Settings and configuration management · **Priority:** Must
- [ ] PLAT-05: File storage abstraction · **Priority:** Must
- [ ] PLAT-06: Notification engine (SMS, email, push) · **Priority:** Must
- [ ] PLAT-07: Document & template generation engine · **Priority:** Must
- [ ] PLAT-08: Scheduler & background jobs · **Priority:** Must
- [ ] PLAT-09: Domain events & outbox pattern · **Priority:** Must
- [ ] PLAT-10: Internationalization (i18n) support · **Priority:** Must
- [ ] PLAT-11: Error handling & structured logging · **Priority:** Must
- [ ] PLAT-12: Money utilities (centavo arithmetic, rounding, tax) · **Priority:** Must
- [ ] PLAT-13: Date/time utilities (UTC storage, timezone display) · **Priority:** Must

### Design System Track (Phase 1)

- [ ] DSN-01: Token system (primitive, semantic, component tiers) · **Priority:** Must
- [ ] DSN-02: Theme system (light/dark) · **Priority:** Must
- [ ] DSN-03: UI Kit — App shell & page header · **Priority:** Must
- [ ] DSN-04: UI Kit — Buttons & form fields · **Priority:** Must
- [ ] DSN-05: UI Kit — Select, date picker, inputs · **Priority:** Must
- [ ] DSN-06: UI Kit — Data table (generic, metadata-driven) · **Priority:** Must
- [ ] DSN-07: UI Kit — Modal, drawer, confirm dialog · **Priority:** Must
- [ ] DSN-08: UI Kit — Toast notifications · **Priority:** Must
- [ ] DSN-09: UI Kit — Status pill & badges · **Priority:** Must
- [ ] DSN-10: UI Kit — Card, tabs, stepper · **Priority:** Must
- [ ] DSN-11: UI Kit — Timeline, kanban board · **Priority:** Must
- [ ] DSN-12: UI Kit — Calendar grid · **Priority:** Must
- [ ] DSN-13: UI Kit — Chart wrapper · **Priority:** Must
- [ ] DSN-14: UI Kit — Empty state, skeleton loaders · **Priority:** Must
- [ ] DSN-15: UI Kit — Money & date formatters · **Priority:** Must
- [ ] DSN-16: UI Kit — Permission gate component · **Priority:** Must
- [ ] DSN-17: Component gallery (/dev/ui-kit or Storybook) · **Priority:** Must
- [ ] DSN-18: Lint rule for raw visual values · **Priority:** Must
- [ ] DSN-19: Design-swap test at Phase 1 gate · **Priority:** Must
- [ ] DSN-20: Accessibility baseline verification (WCAG AA) · **Priority:** Must

### Security Track (All Phases)

- [ ] SEC-01: Secret scanning tool setup (pre-commit, CI) · **Priority:** Must (Phase 1)
- [ ] SEC-02: Dependency audit in CI · **Priority:** Must (Phase 1)
- [ ] SEC-03: Security headers configuration · **Priority:** Must (Phase 1)
- [ ] SEC-04: Rate limiting implementation · **Priority:** Must (Phase 1)
- [ ] SEC-05: CSRF protection · **Priority:** Must (Phase 1)
- [ ] SEC-06: Input validation framework · **Priority:** Must (Phase 1)
- [ ] SEC-07: Output encoding · **Priority:** Must (Phase 1)
- [ ] SEC-08: Parameterized query enforcement · **Priority:** Must (Phase 1)
- [ ] SEC-09: File upload security controls · **Priority:** Must (Phase 1)
- [ ] SEC-10: Encryption at rest setup · **Priority:** Must (Phase 1)
- [ ] SEC-11: Encryption in transit (HTTPS) · **Priority:** Must (Phase 1)
- [ ] SEC-12: Backup encryption · **Priority:** Must (Phase 1)
- [ ] SEC-13: First restore test · **Priority:** Must (Phase 1)
- [ ] SEC-14: Security.md per module (K through J) · **Priority:** Must (per module)
- [ ] SEC-15: Permission tests per RBAC matrix · **Priority:** Must (per module)
- [ ] SEC-16: Vulnerability assessment (OWASP Top 10) · **Priority:** Must (Phase 7)
- [ ] SEC-17: Penetration testing · **Priority:** Must (Phase 7)
- [ ] SEC-18: Findings remediation · **Priority:** Must (Phase 7)
- [ ] SEC-19: Final restore test before go-live · **Priority:** Must (Phase 7)

### Documentation Track (All Phases)

- [ ] DOC-01: API documentation generation setup · **Priority:** Must (Phase 1)
- [ ] DOC-02: Module README per module (K through J) · **Priority:** Must (per module)
- [ ] DOC-03: USER-GUIDE.md per module · **Priority:** Must (per module)
- [ ] DOC-04: TESTS.md per module · **Priority:** Must (per module)
- [ ] DOC-05: DATA.md per module · **Priority:** Must (per module)
- [ ] DOC-06: Glossary maintenance · **Priority:** Should (ongoing)
- [ ] DOC-07: UAT scripts · **Priority:** Must (Phase 7)
- [ ] DOC-08: Training materials (quick-reference guides) · **Priority:** Must (Phase 7)
- [ ] DOC-09: Training videos · **Priority:** Should (Phase 7)
- [ ] DOC-10: Operations runbook (backup, restore, incidents) · **Priority:** Must (Phase 7)
- [ ] DOC-11: Release notes per module · **Priority:** Must (per module)
- [ ] DOC-12: Changelog maintenance · **Priority:** Must (ongoing)

### Data Migration Track (Phase 7)

- [ ] MIG-01: Export existing customer data · **Priority:** Must
- [ ] MIG-02: Clean customer data (duplicates, formatting) · **Priority:** Must
- [ ] MIG-03: Export existing vehicle data · **Priority:** Must
- [ ] MIG-04: Clean vehicle data · **Priority:** Must
- [ ] MIG-05: Export existing item/parts data · **Priority:** Must
- [ ] MIG-06: Clean item data · **Priority:** Must
- [ ] MIG-07: Export supplier data · **Priority:** Must
- [ ] MIG-08: Full stock count for opening balances · **Priority:** Must
- [ ] MIG-09: Export opening AR/AP balances · **Priority:** Must
- [ ] MIG-10: Import templates and validation scripts · **Priority:** Must
- [ ] MIG-11: Test migration on staging · **Priority:** Must
- [ ] MIG-12: Reconcile counts and totals · **Priority:** Must
- [ ] MIG-13: Migration sign-off · **Priority:** Must

### Training Track (Phase 7)

- [ ] TRN-01: Owner/GM training session · **Priority:** Must
- [ ] TRN-02: Service Advisor / Front Desk training · **Priority:** Must
- [ ] TRN-03: Cashier training · **Priority:** Must
- [ ] TRN-04: Technician / Mechanic training · **Priority:** Must
- [ ] TRN-05: Parts Clerk training · **Priority:** Must
- [ ] TRN-06: HR/Payroll Officer training · **Priority:** Must
- [ ] TRN-07: Accountant / Bookkeeper training · **Priority:** Must
- [ ] TRN-08: System Administrator training · **Priority:** Must
- [ ] TRN-09: Sandbox practice environment setup · **Priority:** Must
- [ ] TRN-10: Training completion sign-off · **Priority:** Must

### Legal / Contract Track (Phase 0, Phase 7)

- [ ] LGL-01: Contract draft created · **Priority:** Must (Phase 0)
- [ ] LGL-02: Contract reviewed by licensed Philippine lawyer · **Priority:** Must (Phase 7)
- [ ] LGL-03: Contract negotiation and revisions · **Priority:** Must (Phase 7)
- [ ] LGL-04: Contract signing · **Priority:** Must (Phase 7)

---

## Phase 1: Foundation (K, A + Platform + Design System)

**Entry Criteria:** Gate 0 approved

**Module Focus:** K Administration, A Customers & Vehicles, Platform Kernel, Design-Ready UI Kit

**Exit Gate:** Gate 1 — Foundation complete, authentication works, customers/vehicles live, design-swap test passes

### Phase 1 Items
*Detailed items to be added from module K and A checklists after Phase 0*

---

## Phase 2: Core Operations (B, C)

**Entry Criteria:** Gate 1 passed

**Module Focus:** B Scheduling, C Service Orders

**Exit Gate:** Gate 2 — Job board operational, estimate workflow complete

### Phase 2 Items
*Detailed items to be added from module B and C checklists after Phase 0*

---

## Phase 3: Parts and Money In (D, E, basic J)

**Entry Criteria:** Gate 2 passed

**Module Focus:** D Inventory, E POS & Billing, Basic J (daily dashboard)

**Exit Gate:** Gate 3 — End-to-end flow works (appointment → job → parts → invoice → payment)

### Phase 3 Items
*Detailed items to be added from module D, E, and J(basic) checklists after Phase 0*

---

## Phase 4: Back Office (F, G)

**Entry Criteria:** Gate 3 passed

**Module Focus:** F Payroll & HR, G Finance

**Exit Gate:** Gate 4 — Payroll validated, accounting integrated, P&L accurate

### Phase 4 Items
*Detailed items to be added from module F and G checklists after Phase 0*

---

## Phase 5: Retention (H, I)

**Entry Criteria:** Gate 4 passed

**Module Focus:** H Maintenance Reminders, I Follow-Up

**Exit Gate:** Gate 5 — Automated reminders sending, follow-up workflow complete

### Phase 5 Items
*Detailed items to be added from module H and I checklists after Phase 0*

---

## Phase 6: Insight (J full)

**Entry Criteria:** Gate 5 passed

**Module Focus:** J Reporting (expand basic J from Phase 3)

**Exit Gate:** Gate 6 — All dashboards live, report library complete

### Phase 6 Items
*Detailed items to be added from module J(full) checklist after Phase 0*

---

## Phase 7: Hardening and Launch

**Entry Criteria:** Gate 6 passed

**Activities:** UAT, training, migration, parallel run, vulnerability assessment, go-live

**Exit Gate:** Gate L (Launch) — Production authorization

### Phase 7 Tasks

- [ ] P7-01: UAT planning and script preparation · **Priority:** Must
- [ ] P7-02: UAT execution with shop staff · **Priority:** Must
- [ ] P7-03: UAT findings remediation · **Priority:** Must
- [ ] P7-04: UAT sign-off · **Priority:** Must
- [ ] P7-05: Training execution (all roles) · **Priority:** Must
- [ ] P7-06: Data migration execution · **Priority:** Must
- [ ] P7-07: Migration reconciliation · **Priority:** Must
- [ ] P7-08: Parallel run start (2-4 weeks) · **Priority:** Must
- [ ] P7-09: Daily reconciliation during parallel run · **Priority:** Must
- [ ] P7-10: Parallel run completion · **Priority:** Must
- [ ] P7-11: Vulnerability assessment execution · **Priority:** Must
- [ ] P7-12: Penetration testing · **Priority:** Must
- [ ] P7-13: Security findings tracking in SECURITY-FINDINGS.md · **Priority:** Must
- [ ] P7-14: Security findings remediation · **Priority:** Must
- [ ] P7-15: Final security verification · **Priority:** Must
- [ ] P7-16: Production infrastructure setup · **Priority:** Must
- [ ] P7-17: Backup automation verified · **Priority:** Must
- [ ] P7-18: Final restore test · **Priority:** Must
- [ ] P7-19: Monitoring and alerting setup · **Priority:** Must
- [ ] P7-20: Contract signing · **Priority:** Must
- [ ] P7-21: Go-live cutover plan · **Priority:** Must
- [ ] P7-22: Go-live execution · **Priority:** Must
- [ ] P7-23: Hypercare support (1-2 weeks) · **Priority:** Must
- [ ] P7-24: Launch retrospective · **Priority:** Should
- [ ] P7-25: Hypercare completion and handover · **Priority:** Must

**Exit Criteria:**
- All Must items complete
- UAT passed with sign-off
- Vulnerability findings closed
- Restore test successful
- Data migration reconciled with sign-off
- Staff trained with completion certificates
- Parallel run successful (2-4 weeks minimum)
- Contract signed by both parties
- Production launch authorization obtained

---

**END OF MASTER CHECKLIST**

*Module-specific checklists (K through J) are in `docs/modules/<X>-<name>/CHECKLIST.md` and will be created next.*
