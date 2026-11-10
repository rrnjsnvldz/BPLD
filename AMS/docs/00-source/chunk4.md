### N. Phase 0 — do this now (skip this section if `docs/STATUS.md` already says Gate 0 is approved)

Create the following **in this order**. Write no application code. Write for people: short sentences, tables where they help, Mermaid for diagrams.

**0. Read and reflect.** Read the Blueprint end to end. Immediately post (a) a summary of the system in about 10 lines, in your own words, and (b) the gaps and contradictions you found. Then continue.

**1. The Master Plan — `docs/01-MASTER-PLAN.md`.** Carry every part of the Blueprint (§1–§15) over faithfully, cite the § for each, and add the development approach. Where you clarify something, tag it `[CLARIFICATION]` and list it for Gate 0. Where you disagree, raise a question instead of rewriting. Sections:

- vision, scope, and out-of-scope (an Always / Never list)
- goals and KPIs (§1)
- users, roles and access (§2, §8)
- business flow (§3), with a state machine for the job status pipeline and for every other status list in the Blueprint (allowed transitions, who may trigger each, side effects such as notifications, stock reservations and billing)
- architecture and technology decisions (section E)
- module map with dependency graph, build order, stubs and deferred integrations (section G, §6)
- data model overview and ERD (§7)
- cross-cutting services (§4)
- design readiness (section F), security (I), quality and testing (H), documents (J)
- data migration and go-live (§12)
- risk register (§13 plus new risks, each with an owner)
- links to open questions, decisions and the glossary
- change control and gates (R5, section L)

**2. The Master Checklist — `docs/02-MASTER-CHECKLIST.md`, plus one `docs/modules/<X>-<name>/CHECKLIST.md` for every module.**

- *Master:* a header (last updated, current phase and module, overall progress) · the legend from section K · one section per Phase 0–7 with entry criteria, items and exit gate · a module status table (module, phase, owner, status, coverage %, Gate M1, Gate M2, tag) · cross-cutting tracks (security, documents, design, migration, training, legal) · and the Blueprint's §15 next steps as human-owned Phase 0 items: validate the plan with the owner; prioritize must-have versus nice-to-have per module; document current workflows and collect sample forms (job card, invoice, payroll sheet); wireframes for the job board, service order, POS and dashboard; finalize stack, hosting and budget; confirm the Phase 1 timeline.
- *Per module:* one line per §5 bullet (F, S, R, O and N IDs) with priority, status, slice and evidence · an integrations table (live, stubbed or deferred, with the counterpart module) · the module's Definition of Done (section L) · a gate log. Slices are added when the module starts (Part 2).

**3. Questions, assumptions and decisions — `docs/OPEN-QUESTIONS.md` and `docs/DECISIONS.md`.** Put every question in one batch. Give each one a recommended answer, worded so that "yes" accepts it. Add a numbered list titled "Assumptions I am making — correct me now or I proceed." The seed list below is a floor, not a ceiling; find more.

- technology stack, hosting, budget and team skills (ADR-001); architecture style (ADR-002)
- offline-capable POS, or fast-recovery mode (§9)
- customer portal and Android app: in v1, later, or a separate track? (§4 calls the portal optional; the §14 note says it "can be executed now but for android only")
- attendance in module F is marked "(optional)": in or out of v1, and which device (biometric, QR, PIN)?
- OBD-II and telematics (the §14 note asks "needed api or something?"): treat as out of scope for v1, and write a research note only if approved
- access-control gaps: §8 has no column for the Shop Supervisor / Foreman or for the Customer, although both are in §2; §2 gives the Owner "all (view)" while §8 gives Full; portal customers approve estimates and pay (modules C and E) but §2 lists only A, B, H and I for them; define what "Limited" means
- §7 says every transaction references the job order, but §5.E allows over-the-counter sales without one: should the job order be optional?
- tax and receipts: VAT status, invoice and receipt formats and numbering under current BIR rules, statutory discounts, payroll contributions and withholding (effective-dated tables supplied by the accountant)
- language (English only, or English and Filipino), currency (PHP) and timezone
- existing data to migrate: what, where (paper, spreadsheets), and how many records
- integrations: SMS gateway, email provider, payment channels, printers, scanners, cash drawer, attendance device
- availability and backup targets (the Blueprint gives no numbers): uptime during shop hours, recovery point and recovery time
- which contract is meant (default assumption: a development and service agreement between the team and the shop owner), who the parties are, and the payment structure
- the team: members, skills, roles (module owner, reviewer, security reviewer, QA) and target dates (never invent dates)

Assumptions to confirm at minimum: the shop is in the Philippines (PHP, Asia/Manila, Philippine statutory rules and receipts, Data Privacy Act); one branch now, multi-branch ready; Phase 1 includes the platform kernel and the UI kit.

**4. Design pack — `docs/design/`.**

- `DESIGN-SYSTEM-PLAN.md`: section F as a plan, with the token list, the component list and the device profiles.
- `SCREEN-INVENTORY.md`: every screen in §5, with status columns.
- `wireframes/`: low-fidelity wireframes (grayscale, structure and states only; Markdown, ASCII, Mermaid or one simple HTML file each) for the four screens the Blueprint names first: job board, service order detail, POS and executive dashboard.
- `DESIGN-INTAKE-CHECKLIST.md`: what to collect from the designer — brand colors, logo files, fonts and their licenses, icon set, component specs or Figma links, density, print layouts, all states.
- `APPLY-DESIGN-RUNBOOK.md`: numbered steps — import tokens, skin the UI kit, apply screens module by module, restyle print templates, run visual-regression and contrast checks, sign-off.
- `DESIGN-DEBT.md`: an empty log.

**5. Security plan — `docs/SECURITY-PLAN.md`.** Expand section I: control catalog, threat-model template, per-module abuse-case seeds, tooling (secret scan, dependency audit, static analysis, dynamic tests), hardening checklist, backup and restore test procedure, and the Phase 7 vulnerability-assessment plan.

**6. Data migration plan — `docs/DATA-MIGRATION-PLAN.md`.** Sources, cleaning rules, import templates, reconciliation of counts and totals, opening stock count and balances, sign-off (§12, §13).

**7. Contract draft — `docs/legal/CONTRACT-DRAFT.md`** (section J).

**8. Orientation files.** `docs/STATUS.md`, `README.md`, `CONTRIBUTING.md` (branching, commit format with IDs, review rules, Definition of Done), a pull-request template (checklist ID, plan section, tests run, security notes, documents updated, screenshots) and `docs/GLOSSARY.md`.

**9. Gate 0 package.** End with a one-page summary: what you produced, the five decisions that matter most, your assumptions, the top risks, and a **fidelity list** of every place where the Master Plan differs from the Blueprint. Then **stop** and wait for "Gate 0 approved." Do not start Phase 1 on your own.

**END OF PART 1**

---

## PART 2 — MODULE PROMPT (paste at the start of each module)

*Replace the bracketed words, then copy.*

Start module **[LETTER — NAME]** (folder `docs/modules/[folder]`). Follow the Master Prompt.

1. **Read:** Blueprint §5.[LETTER], every row of §6 that mentions it, §7, its column in §8, §11, the module's `CHECKLIST.md`, `docs/STATUS.md` and `docs/DECISIONS.md`.
2. **Write `SPEC.md`:** purpose · in and out of scope · roles and permissions (from §8) · screens (inventory IDs, device profile, states) · data (tables owned versus referenced, ERD) · public contract (API, events published and consumed) · integrations (live, stubbed, deferred) · business rules, each with its source (unknowns become questions) · status machines · edge cases · security notes (threat model, abuse cases) · acceptance criteria (Given / When / Then) · test plan · demo scenario · document deliverables · and the **slice plan**: vertical slices (migration → domain → service → API → UI → tests → documents), risk-first, each with at most 3 acceptance criteria, a named verification command, the files likely touched, and a `Blocked by` line.
3. **Update the checklist:** confirm or adjust priorities, add slice IDs, add `DEFERRED-INTEGRATION` lines. Never renumber plan-coverage IDs.
4. **Ask all questions for this module in one batch**, each with your recommendation. Then **stop for Gate M1.**
5. **After approval, build slice by slice** under the Master Prompt: tests first for business rules; UI from the UI kit and tokens only; documents and checklist updated in each slice. Do not interrupt except for the Ask-first list or a contradiction in the Blueprint.
6. **When all slices are done:** run the Gate M2 checklist, write the module report (what shipped, what is deferred, evidence, known issues, security notes, next module), and **stop for sign-off.**

**Module hot spots — expensive mistakes to design against:**

- **K:** build it first and security-first; the RBAC matrix drives the permission tests; audit log from day one; settings, numbering and templates are configuration; backup and restore.
- **A:** duplicate detection; merging customers or vehicles must never lose history; consent and contact preferences; safe attachments.
- **B:** double-booking and closing-time conflicts; capacity and specialty-bay rules; no-show tracking; notifications go through the platform engine.
- **C:** the job status machine; an immutable, timestamped approval log; estimate versioning; additional-work approvals; the time clock; stubs for D and E; comeback and warranty flags.
- **D:** an immutable stock ledger; the costing method; concurrent issuance; reservations; reason codes and approvals for adjustments; units of measure.
- **E:** money correctness; per-series numbering without duplicates, where a void keeps its number; void and refund approvals; cash sessions; customer ledger and aging; split and partial payments; the offline decision.
- **F:** statutory rules as effective-dated settings; payroll lock; salary and bank data visibility; loan amortization; validation against the accountant's samples.
- **G:** balanced journal postings; period closing; reconciliation; consuming events from D, E and F; export.
- **H:** smart suppression (no reminder if already booked, serviced or opted out); throttling; next-due computation; template tokens; conversion tracking.
- **I:** follow-up tasks; surveys; escalation rules; warranty claims; loyalty rules (ask the owner, because the Blueprint gives none).
- **J:** read-only reporting queries per module; role-limited reports; performance on large date ranges; scheduled exports.

---

## PART 3 — RESUME PROMPT (new session, new teammate, or after a break)

Resume AMS work. Follow the Master Prompt. Read `docs/STATUS.md`, `docs/02-MASTER-CHECKLIST.md` and the active module's `SPEC.md` and `CHECKLIST.md`. In 10 lines or fewer, tell me: the current phase and module; what is done, in progress and blocked; open questions waiting on the team; and the next slice you propose. Then continue with the next unblocked slice. If anything in the repo contradicts the Blueprint, the Master Plan or the checklist, stop and report it; do not fix it silently.

---

## PART 4 — DESIGN PASS PROMPT (paste when the visual design is ready)

*Fill in the inputs, then copy.*

The design is ready. Run the Design Pass by following `docs/design/APPLY-DESIGN-RUNBOOK.md`. Follow the Master Prompt.

**Inputs:** [Figma link, exported tokens, brand assets, fonts, icons, print layouts]

**Rules:** work on a `design/[module]` branch. Change only token files, theme and config, UI-kit components, print templates and visual snapshots. **Do not change business logic, APIs, the database or functional tests.** If the design cannot be met without a logic change, raise a Change Request instead of changing the logic.

1. Check the inputs against `DESIGN-INTAKE-CHECKLIST.md`. List what is missing, and stop if anything blocks the work.
2. Map the design tokens into `design/tokens/`. Build and verify the component gallery in both themes, and fix any contrast failures.
3. Restyle the UI-kit components to the specs. Then apply the design module by module in build order, updating the design status in `SCREEN-INVENTORY.md`.
4. After each module: before-and-after screenshots, a visual-regression run, an accessibility and contrast check, and the full test suite still green. Then stop for review.
5. Restyle the print templates (estimate, job card, invoice and receipt, payslip, statements, end-of-day report). Update the runbook with anything you learned.
