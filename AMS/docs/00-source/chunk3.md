### I. Security (the Blueprint asks for a deep dive into system vulnerabilities)

**Baseline for every module** (part of its Definition of Done):

- Authorization is enforced **on the server** for every endpoint and every object. Hidden buttons are not security. One customer must never reach another customer's records, especially through the portal. The UI reads the same authorization source the server enforces. Test authentication and authorization separately, each with a negative and a positive case.
- Field-level protection for cost, margin, salary and bank details.
- Strong authentication: hashed passwords, lockout after failed attempts, session timeout, optional two-factor, and no user enumeration (same message and same timing for unknown users and wrong passwords).
- Validate all input, encode all output, use parameterized queries, add CSRF protection, restrictive CORS and security headers, and rate-limit login, search, SMS and email triggers, and public booking.
- File uploads (photos, OR/CR copies, receipts): type and size allowlist, rename on save, store outside the web root, malware scan, access through short-lived signed links.
- Secrets come only from the environment or a secret store. Run secret scanning on every commit and in CI. Pin dependencies with a lockfile, vet each one before adding it, and audit them in CI.
- The audit log is append-only and tamper-evident, and records who, what, when and from where. Personal data is masked in logs. Data is encrypted in transit and at rest. Backups are encrypted and **restores are tested**.
- Payments, receipts and webhooks (SMS, e-wallet) use idempotency keys, signature verification and replay protection. Any server-side fetch of a URL a user can influence is allowlisted (SSRF).
- Privacy (§5.K, §9): consent records, retention and deletion rules, access and deletion requests, masking. Assume the Philippine Data Privacy Act applies; the team confirms with counsel.

**Process:**

- Before coding a module, write `docs/modules/<X>/SECURITY.md`: trust boundaries, a STRIDE threat model, abuse cases specific to that module (for example discount and void abuse at the POS, stock shrinkage through adjustments, payroll tampering, customer enumeration in the portal), and the tests that prove each control.
- A **second human reviewer** is required for changes touching: authentication or permissions · money (POS, payroll, commissions, tax) · inventory adjustments and costing · file uploads · integrations and webhooks · security headers and CORS · CI, infrastructure or secrets · any diff over about 400 lines.
- Phase 7: a full vulnerability assessment and penetration test, using OWASP Top 10 and ASVS as the yardstick. Track findings in `docs/SECURITY-FINDINGS.md`, then fix and re-test them before go-live.

### J. Documents and contract

**Documents.** The Blueprint says documents must be made during development, so a module is not done until its documents exist. Per module (`docs/modules/<X>/`): `SPEC.md`, `DATA.md` (tables and ERD), `SECURITY.md`, `TESTS.md` (test plan and results), `USER-GUIDE.md` (plain-language quick reference per role for shop staff), generated API docs, and a changelog entry. Project-wide: `README.md` (a new teammate runs the app in under 30 minutes), `CONTRIBUTING.md`, `docs/GLOSSARY.md`, `docs/DATA-MIGRATION-PLAN.md`, UAT scripts, training material, an admin and operations runbook (backup, restore, incident), release notes, and the contract. Write staff-facing text in short plain steps. Write developer documents for a teammate who has never seen the code.

**Contract.** The Blueprint says "Create also a contract." Draft `docs/legal/CONTRACT-DRAFT.md` as a **software development and service agreement** between the development team and JRS Bongabon. Cover: parties · project description and scope (modules A–K, Phases 0–7, out-of-scope items) · deliverables and documentation · milestones and a payment schedule tied to the phase gates · acceptance and UAT criteria · the change-request procedure (R5) and how changes are priced · client responsibilities (data, access, hardware, SMS, payment and cloud accounts) · intellectual property and licensing, including third-party components · confidentiality and data protection · security responsibilities · warranty, defect-fix period, support and hypercare · hosting and third-party running costs · backups, data ownership, exit and handover · limitation of liability · force majeure · termination · dispute resolution · governing law · signatures. Put `[brackets]` around every amount, date and name you do not know, and never invent figures or legal terms. Label it clearly as a template that a licensed Philippine lawyer must review before anyone signs. If the team meant a different contract, `docs/OPEN-QUESTIONS.md` records which one.

### K. IDs and checklist conventions

- **IDs** have the form `<Module>-<Type><NN>`. Types: **F** core function · **S** screen, view or dashboard · **R** key record · **O** output or report · **N** rule or note stated elsewhere in the Blueprint. Slices are `<Module>-SL<NN>`. Other prefixes: `P0-NN` Phase 0 · `PLAT-NN` platform kernel · `DSN-NN` design · `SEC-NN` security · `DOC-NN` documents · `MIG-NN` migration · `TRN-NN` training · `LGL-NN` legal · `Q-NN` question · `A-NN` assumption · `CR-NN` change request · `ADR-NNN` decision record. IDs are stable: never renumber or reuse one.
- **Status** uses `- [ ]` for not started and `- [x]` for done (evidence required), plus an inline tag when needed: `IN PROGRESS`, `BLOCKED(Q-nn)`, `DEFERRED-INTEGRATION(with <module>)`, `DEFERRED(CR-nn)`, `DROPPED(CR-nn)`.
- **Priority** is proposed by you and confirmed by the owner at Gate M1: Must, Should or Could. Priority sets build order only; it never removes scope.
- **Coverage rule.** Every bullet of §5 for a module gets exactly one ID, in the Blueprint's order, worded briefly but faithfully. A bullet that bundles several capabilities keeps one ID with sub-items beneath it. At Gate M2 every ID must be done, or deferred or dropped by an approved CR.

### L. Gates and Definition of Done

- **Gate 0 (end of Phase 0).** The team approves the Master Plan, the checklist, the stack and hosting decisions, the design plan and the security plan.
- **Gate M1 (before coding a module).** The module brief is approved (Part 2).
- **Gate M2 (module done).** All of the following, with evidence, and then a human sign-off recorded in `docs/DECISIONS.md`:
  1. **Coverage:** every module ID is done, or deferred or dropped by an approved CR.
  2. **Tests:** unit, integration, negative and permission tests are green (including this module's row of the RBAC matrix); money and stock edge cases are covered where relevant; migrations run up and down on a fresh database; CI is green with no new lint or type errors.
  3. **Security:** `SECURITY.md` is complete, the baseline controls are verified, the dependency audit is clean or accepted, and a second reviewer has signed off on any trigger-path changes.
  4. **Integrations:** contract tests pass against every built module this one touches, and stubs for later modules are listed.
  5. **UI:** every screen in the module's inventory exists in all required states, uses only UI-kit components and tokens, passes the design-swap test (F12), and has been checked on its device profile for keyboard use and contrast.
  6. **Performance:** budgets are met on the stated data volume.
  7. **Documents:** every item in section J exists for the module.
  8. **Demo:** a human runs the module's demo scenario end to end.
  9. **Records:** checklist, `STATUS.md` and changelog are updated, and the release is tagged `module-<X>-v<major.minor>`.
- **Gate P (phase exit).** Every module in the phase has passed M2, the end-to-end scenario and the earlier modules' regression tests are green, and a phase report is written.
- **Gate L (launch, Phase 7).** UAT passed · vulnerability findings closed · restore test passed · data migration reconciled · staff trained · parallel-run plan agreed · contract signed.

### M. Session protocol and report format

**Start of every session, no exceptions:** read `docs/STATUS.md`, the current phase in `docs/02-MASTER-CHECKLIST.md`, and the active module's `SPEC.md` and `CHECKLIST.md`. Then say in 8 lines or fewer where the project stands, what is blocked and what you will do next. Then proceed.

**End of every session:** update the checklist (with evidence), `STATUS.md` and `DECISIONS.md`, commit, and post this report:

- **Worked on:** checklist IDs
- **Done (with evidence):** …
- **Not done or blocked:** …
- **Deviations from the plan:** none, or CR-nn
- **Assumptions made:** A-nn …
- **Questions for the team (each with your recommendation):** Q-nn …
- **Security and risk notes:** …
- **Next step:** …

Write files to disk and summarize in chat instead of pasting whole files. If you cannot write files in this environment, output each file in full, preceded by its path.

