### E. Architecture guardrails (so each module can be built and debugged on its own)

- **Technology.** Start from the options in §10 and the team's skills, budget and hosting preference. Put 2–3 options with a recommendation in `docs/adr/ADR-001`; the team decides at Gate 0. Do not add any other framework, library or service without an ADR.
- **Architecture style.** §4 describes "modular services (one per module) sharing common services". In `docs/adr/ADR-002`, compare a modular monolith (one deployable, strictly separated modules that can be extracted later) with separate services. Recommended default: modular monolith. The team decides.
- **Same layout for every module:** domain · application (services) · infrastructure (repositories, adapters) · api (routes, validation) · ui (screens) · tests · seed data · README · a **public contract** that lists the module's API and the events it publishes and consumes.
- **Boundaries.** Each table is owned by exactly one module. Other modules refer to it by ID and read or write only through the owner's contract. No imports of another module's internals (enforce with a lint or dependency rule). Cross-module reactions use **domain events stored in an outbox from day one**, so later modules can consume or back-fill them.
- **Isolation tools per module:** an on/off feature flag · module-prefixed migrations · its own seed data and fixtures · its own permissions · routes under `/api/v1/<module>/…` · a health check · structured logs tagged with module and correlation ID.
- **Platform kernel**, built once in Phase 1 and used by every module: authentication, RBAC, audit log, settings, file storage, notification engine (provider-agnostic), document and template generation, scheduler and background jobs, events and outbox, i18n, error handling, logging, money and date utilities.
- **Dependencies on later modules** (for example C needs D for parts, and C, D, E and F feed G, H and I): build against the contract with a stub, mark the item `DEFERRED-INTEGRATION` in both modules, and wire and test it when the later module lands.
- **Data rules** (§7, §9):
  - One customer record and one vehicle record, shared by all modules.
  - Every transaction records the user who created it, and the job order and customer where applicable (over-the-counter sales have no job order).
  - No hard deletes of financial or inventory records; void or reverse instead.
  - `branch_id` on every business table (single branch now, multi-branch ready).
  - **Money is stored as integer centavos or fixed-point decimal, never floating point.** Rounding and tax mode (inclusive or exclusive) are settings.
  - Timestamps are stored in UTC and shown in the shop's timezone setting.
  - Document numbers (invoice, receipt, PO, service order) come from transactional per-series sequences, and a void keeps its number.
  - Rates, taxes, templates, reason codes and status lists are configuration, not code.
- **API-first.** A versioned REST API with generated OpenAPI documentation, and authentication that the web app, the customer portal and a future Android client can all use.
- **Terminology.** One canonical term per concept, with synonyms recorded in `docs/GLOSSARY.md` (for example Service Order = job card = job order), used in code, UI and documents.

### F. Design readiness (there is no design yet, so the draft must be easy to re-skin)

Build the draft UI **functional and neutral**: clean and usable, with no brand decisions. The final design is applied later in a separate Design Pass (Part 4) that must not touch business logic. To make that possible:

- **F1 — Tokens are the only source of visual values.** Keep them in `design/tokens/` in three tiers (primitive, semantic, component), emitted as CSS variables with a JSON source that design tools can sync later. Cover colors (primary, neutral ramp, success / warning / danger / info, surface / border / text), typography, spacing, radius, shadow, border, z-index, motion, breakpoints and density. Provide light and dark themes through a theme attribute.
- **F2 — No raw visual values in feature code:** no hex or rgb colors, px font sizes, ad-hoc margins or inline styles. A lint rule fails CI when it finds one. Unavoidable exceptions are logged in `docs/design/DESIGN-DEBT.md`, which must be empty before the Design Pass.
- **F3 — A UI-kit layer (`ui/`) holds every shared component:** app shell, page header, buttons, form fields (label, help, error), select, date picker, one generic metadata-driven data table (sort, filter, paginate, row actions, loading / empty / error states), modal and drawer, confirm dialog, toast, status pill, card, tabs, stepper, timeline, kanban board, calendar grid, chart wrapper, empty state, skeleton, money and date formatters, and a permission gate. Feature screens compose these and nothing else. Any third-party UI library or admin template is wrapped behind this layer, and features never import it directly, so the look or the library can be swapped.
- **F4 — One status map.** Every status list in the Blueprint (job pipeline, appointment, invoice and payment, purchase order, complaint, reminder and so on) maps to a semantic color token, a label key and an icon. Show statuses as soft pills with text or an icon, never color alone. Fixed meaning: success = green, error = red, in-between = amber, neutral = gray.
- **F5 — Every screen handles loading, empty, error and no-permission states.** Destructive actions use the confirm dialog. A failed action shows an error; it never silently looks like "no data".
- **F6 — Three device profiles from the Blueprint:** desktop (front desk, cashier, admin), tablet (technician, large touch targets) and mobile (customer portal). Each screen declares its profile.
- **F7 — All user-facing text uses i18n keys**, English first and ready for a Filipino pack if the team wants bilingual labels (§9). No concatenated sentences; leave about 40% room for longer text.
- **F8 — Printable documents are templates, not screens.** Estimate, job card, invoice and receipt, payslip, statements and the end-of-day report are template-driven and separate from the UI, so the Design Pass restyles them in one place. Shop name, logo and brand colors come from settings (module K), never from code.
- **F9 — Accessibility baseline:** semantic HTML, keyboard navigation, visible focus, WCAG AA contrast checked on the token set, labelled inputs.
- **F10 — A component gallery** (`/dev/ui-kit`, or Storybook if approved) shows every token and component in every state, in both themes. Designers review it, and visual-regression tests compare against it.
- **F11 — `docs/design/SCREEN-INVENTORY.md`** lists every screen in §5 with an ID (for example `C-S03`), module, roles, device profile, required states, route, wireframe status and design status, and is kept current.
- **F12 — The design-swap test.** Changing the primary color and the font family in the token files alone restyles the whole app with zero edits to feature files; the raw-value lint is clean; the dark theme has no unreadable screens; and changing the logo and name in settings updates the app shell and the documents. Run it at the Phase 1 gate and at every module gate for new screens.

### G. Build order (§11 — do not reorder without a Change Request)

- **Phase 0 — Discovery and design:** documents only (section N).
- **Phase 1 — Foundation: K, then A.** The platform kernel and the design-ready UI kit are built here as enablers. List them as `PLAT-nn` and `DSN-nn` items and mark them `[CLARIFICATION]` of §4 and §11 for approval at Gate 0.
- **Phase 2 — Core operations: B, then C.** C builds its parts and invoice links against stubs and emits the events that D, E, F, H and I will use.
- **Phase 3 — Parts and money in: D, then E,** plus a basic J (daily sales and jobs-in-shop view), as the Blueprint's note requires.
- **Phase 4 — Back office: F, then G.** G consumes the events that D, E and F have been emitting.
- **Phase 5 — Retention: H, then I.**
- **Phase 6 — Insight: J** (full dashboards, report library, scheduled reports).
- **Phase 7 — Hardening and launch:** UAT, training, data migration, parallel run (2–4 weeks), go-live, hypercare and the vulnerability assessment.

Modules: K administration · A customers and vehicles · B scheduling · C service orders · D inventory · E POS and billing · F payroll and HR · G finance · H reminders · I follow-up · J dashboards and reports.

### H. Quality and testing (§9, §12)

- Every module has unit, integration and negative tests (invalid input, not allowed, wrong state). Migrations are tested up and down on a fresh database.
- **The RBAC matrix (§8) is the test oracle.** Generate permission tests from it: every cell, including "Limited", "Own", "assigned" and "Request", becomes at least one positive and one negative server-side test. Sensitive fields (cost, margin, salary, bank details) are hidden by default.
- Money, tax and stock logic is tested for rounding, tax inclusive and exclusive, discounts, split and partial payments, voids and refunds, weighted-average and FIFO costing, two people issuing the same stock at once, and retried requests (idempotency).
- Payroll is validated against manual samples from the accountant before module F is signed off. Statutory rates, brackets and rules are effective-dated settings marked UNVERIFIED until the accountant confirms them, and are never hard-coded from memory.
- An end-to-end scenario grows with every module: booking → check-in → estimate → approval → parts → work → quality check → release → invoice → payment → accounting posting → reminder → follow-up.
- Performance budgets: common screens under 2 seconds and search under 1 second on a realistic seeded data volume (state the volume you tested). Load-test before launch.
- Test names include their checklist IDs, so a failing test points straight to its plan item.

