# AMS Open Questions and Assumptions

**Last Updated:** 2026-11-10  
**Status:** Awaiting Gate 0 Review

---

## Instructions

This document lists every question where the Blueprint is ambiguous, missing information, or presents options without a decision. Each question has:
- A unique ID (`Q-nn`)
- The question text
- A **recommended answer** (worded so "yes" accepts it, or as an explicit choice)
- Where applicable, the impact and rationale

**Please review and respond to each question.** If you accept the recommendation, reply "yes" or "approved." If you have a different answer, provide it. Unanswered questions will block related work items.

---

## Questions for Owner / Team

### Q-01: KPI Targets and Baselines
**Question:** What are the baseline and target values for each KPI listed in §1?

**KPIs needing values:**
- Average job turnaround time (check-in to release)
- Bay and technician utilization rate
- No-show rate
- Inventory accuracy percentage
- Stock-out incidents per month
- Gross margin per job (target %)
- Repeat-customer rate (%)
- Reminder-to-booking conversion rate (%)
- Customer satisfaction score (CSAT target)
- Days to collect on credit accounts

**Recommendation:** Establish baseline from current operations (if measurable) and set 6-month and 12-month target improvements. Example: If current turnaround is 3 days average, target might be 2 days by month 6, 1.5 days by month 12.

**Impact:** Affects dashboard design and alert thresholds in Module J.

---

### Q-02: Language Support
**Question:** Should the system support bilingual labels (English and Filipino)?

**Context:** Blueprint §9 mentions "bilingual labels if needed." Master Prompt asks for clarification.

**Recommendation:** Start with English only (EN-US) in Phase 1-6, with i18n infrastructure ready. Add Filipino language pack in Phase 7 or post-launch if needed. This reduces Phase 0-6 workload while keeping the door open.

**Impact:** Translation work, larger design-swap test surface, potentially more UI space needed for longer Filipino text.

**Your Answer:**

---

### Q-03: Integration Vendor Selection
**Question:** Which specific vendors/services should be used for:
- SMS gateway (e.g., Semaphore, Twilio, Vonage, M360)
- Email service provider (e.g., SendGrid, Mailgun, AWS SES, Gmail SMTP)
- Payment channels (cash, card terminal brand, e-wallet APIs: GCash, PayMaya, others?)
- Optional: Vehicle data lookup API (plate/VIN decode service)
- Optional: Messaging app APIs (Viber Business, Messenger Platform, WhatsApp Business)

**Recommendation:** 
- **SMS:** Semaphore or M360 (local PH providers with peso pricing, good for transactional SMS)
- **Email:** SendGrid free tier or AWS SES (reliable, affordable)
- **Payment:** Start with cash + manual card entry (no terminal integration); add GCash/PayMaya in Phase 3-4 if APIs available
- **Vehicle lookup:** Defer to post-launch (nice-to-have, not critical)
- **Messaging apps:** Defer to post-launch unless owner has strong preference

**Impact:** API integration effort, monthly recurring costs, feature availability timeline.

**Your Answer:**

---

### Q-04: Customer Portal Scope
**Question:** Is the customer portal in scope for v1 (Phases 1-6), or deferred?

**Context:** Blueprint is inconsistent:
- §2 marks it "(optional portal)" and lists modules A, B, H, I for customers
- §4 describes a "mobile-friendly customer portal"
- §5.C and §5.E imply customers approve estimates and pay online
- No explicit decision on whether it's v1 or future enhancement

**Recommendation:** **Include a minimal customer portal in Phase 5** with:
- View service history (A)
- Book appointments (B)
- View and approve estimates via secure link (C)
- Opt-in/out of reminders (H)
- Submit survey responses (I)
- **Exclude** online payment in v1 (add in Phase 7 or post-launch when payment gateway ready)

Alternative: Defer entire portal to post-launch and handle approvals via SMS link + phone confirmation.

**Impact:** Additional UI screens (5-8), authentication for customers, secure link generation, testing surface.

**Your Answer:**

---

### Q-05: Android App Timing
**Question:** Should the customer mobile app (Android) be included now or treated as future enhancement?

**Context:** Blueprint §14 says it "can be executed now but for android only," which conflicts with listing it under "Future Enhancements."

**Recommendation:** **Defer Android app to post-launch.** The customer portal (Q-04) delivered as mobile-responsive web covers the same use cases without app store overhead. Re-evaluate after v1 launch based on customer feedback.

**Impact:** If included now: Android development, Play Store setup, app maintenance. If deferred: no immediate impact.

**Your Answer:**

---

### Q-06: OBD-II and Telematics Scope
**Question:** Is OBD-II / telematics integration in scope, and if so, to what extent?

**Context:** Blueprint §14 mentions it with "needed api or something?" but provides no guidance.

**Recommendation:** **Out of scope for v1.** Treat as research-only: document potential APIs and use cases (predictive maintenance, real-time diagnostics) in a research note for future consideration. No integration work.

**Impact:** If included: significant integration complexity, hardware requirements (OBD readers), API research and contracts. If deferred: no impact.

**Your Answer:**

---

### Q-07: Shop Supervisor and Customer Portal Permissions
**Question:** What are the exact permissions for "Shop Supervisor / Foreman" and "Customer" roles?

**Context:** Blueprint §2 lists these roles but §8 (RBAC matrix) has no columns for them.

**Proposed Permissions:**

**Shop Supervisor / Foreman:**
- A Customers/Vehicles: View
- B Scheduling: Full (assign, reschedule)
- C Service Orders: Full (assign technicians, approve QC, release vehicles)
- D Inventory: View
- E POS/Billing: View
- F Payroll: None
- G Finance: None
- H Reminders: None
- I Follow-Up: View
- J Reports: Limited (operational reports: jobs, technicians, bays; no financial)
- K Administration: None

**Customer (if portal in scope per Q-04):**
- A: Own records only (view history)
- B: Own appointments (book, view, cancel)
- C: Own service orders (view, approve estimates)
- E: Own invoices (view, pay if online payment enabled)
- H: Own reminders (opt-in/out)
- I: Own surveys and follow-ups (respond)
- All others: None

**Your Answer (approve or modify):**

---

### Q-08: "Limited" Permission Definition
**Question:** What does "Limited" permission mean in the RBAC matrix?

**Context:** Blueprint §8 uses "Limited" for:
- Cashier in G Finance
- Technician in J Reports
- Owner/GM in some contexts (though mostly "Full")

**Recommendation:**
- **Cashier in G Finance:** Can view cash and bank accounts, record cash expenses with receipts, but cannot access full P&L, balance sheet, or payroll expenses
- **Technician in J Reports:** Can view own productivity (jobs completed, hours, efficiency), but cannot see shop-wide financial or other technicians' detailed reports
- **General definition:** Limited = role-specific subset of data with read and limited write, no delete, no sensitive fields

**Your Answer (approve or modify):**

---

### Q-09: Owner/GM Access Level Reconciliation
**Question:** Should Owner/GM have "Full" access or "View-only" in certain modules?

**Context:** Blueprint §2 says Owner/GM has "all (view)" but §8 grants "Full" in most modules.

**Recommendation:** **Owner/GM has Full access** to all modules except:
- F Payroll: View only (HR Officer processes; Owner approves but doesn't edit directly for separation of duties)
- G Finance: View only for journal entries (Accountant posts; Owner reviews)
- Owner retains approval rights for high-value transactions, discounts, voids, and adjustments via approval workflows (K)

**Your Answer (approve or modify):**

---

### Q-10: Offline POS Capability
**Question:** Should the POS (Module E) work offline, or rely on fast recovery after internet/power interruption?

**Context:** Blueprint §9 mentions "offline-tolerant POS or quick recovery plan" but doesn't decide which.

**Recommendation:** **Fast recovery mode** (not full offline):
- Critical: UPS (uninterruptible power supply) for POS terminal and server
- Invoice/payment data saved locally (browser localStorage or local DB) if connection drops, auto-sync when restored
- Graceful degradation: POS warns "connectivity issue" but allows cash sales; card/e-wallet requires connection
- Full offline POS (service workers, local DB sync) is complex and only needed if prolonged outages are common

Is internet reliability at the shop good enough for this approach, or do you experience frequent multi-hour outages?

**Your Answer:**

---

### Q-11: Attendance Tracking in Module F
**Question:** Is attendance tracking (time in/out) included in v1, and if so, which device?

**Context:** Blueprint §5.F marks attendance "(optional)" and lists biometric, QR, or PIN as options.

**Recommendation:** 
- **Phase 4 (Module F): Include basic attendance** (manual time in/out entry by HR, or simple PIN entry at a shared terminal)
- **Phase 7 or post-launch:** Add biometric or QR device if needed
- Technician time-clock for jobs (Module C) is separate and **required** (tracks billable hours)

Rationale: Payroll needs attendance data for accurate computation. Starting simple (PIN or manual) reduces Phase 4 hardware dependency.

**Your Answer (approve, or specify if biometric/QR required in Phase 4):**

---

### Q-12: Technology Stack Decision (ADR-001)
**Question:** Which technology stack should be used?

**Options (from Master Plan §4):**
1. **Node.js + React** (TypeScript, Tailwind, PostgreSQL, Prisma)
2. **Laravel + Vue** (PHP, Inertia.js, MySQL/PostgreSQL, Eloquent)
3. **Django + React** (Python, DRF, PostgreSQL)
4. **ASP.NET Core + Blazor/React** (C#, EF Core, SQL Server/PostgreSQL)

**Recommendation:** **Option 1 (Node.js + React)** or **Option 2 (Laravel + Vue)** depending on team's PHP vs. JavaScript preference.

Both meet all requirements. Laravel has more batteries-included (queue, scheduler, auth scaffolding). Node.js is more modern, JSON-native, better for real-time features if needed later.

**Your Answer (select one and state team's current skill set):**

---

### Q-13: Architecture Style Decision (ADR-002)
**Question:** Should the system be a modular monolith or separate microservices?

**Options:**
1. **Modular Monolith** (recommended): Single deployable, strict module boundaries, shared database, can extract services later if needed
2. **Microservices**: Separate services per module, independent deploy, eventual consistency

**Recommendation:** **Modular Monolith.** Simpler deployment, easier testing, transaction consistency, suitable for single-branch shop. Microservices add operational complexity with no clear benefit at current scale.

**Your Answer:**

---

### Q-14: Job Order Reference for OTC Sales
**Question:** Should over-the-counter sales (parts sold without a service order) have a NULL job_order_id, or should we create a special "OTC" job order type?

**Context:** Blueprint §7 says "every transaction references the job order," but §5.E allows OTC sales without a job.

**Recommendation:** **Allow NULL job_order_id** for OTC sales. Simpler data model. Reports distinguish job-attached vs. OTC sales via the NULL check.

Alternative: Create synthetic "OTC-yyyy-mm-dd" job orders daily, but this adds unnecessary records.

**Your Answer:**

---

### Q-15: Privacy Law Compliance
**Question:** Does the Philippine Data Privacy Act apply to this system, and should compliance measures be built in?

**Context:** Blueprint mentions privacy (§5.K, §9) but doesn't explicitly state jurisdiction.

**Recommendation:** **Yes, assume Data Privacy Act of 2012 (DPA) applies.** Build in:
- Consent records for marketing communications
- Retention and deletion policy (configurable per data type)
- Data access request workflow (customer can request their data)
- Data deletion request workflow (right to be forgotten, subject to legal retention rules)
- Personal data masking in logs and audit trail

Confirm with legal counsel during Phase 7 contract review.

**Your Answer:**

---

### Q-16: Risk Owners
**Question:** Who owns each risk in the risk register (§13)?

**Risks needing owners:**
1. Staff resistance or low adoption
2. Inaccurate opening inventory or customer data
3. Internet or power interruptions
4. Payroll or tax rule errors
5. Poor reminder quality
6. No second reviewer available for security-critical changes
7. Vendor integration delays

**Recommendation:** Assign as follows (adjust to actual team):
1. Owner / GM (requires their sponsorship and communication)
2. Parts Clerk + Data Migration Lead
3. Shop Manager (responsible for UPS, backup internet)
4. HR/Payroll Officer + Accountant
5. Service Advisor + System Admin (owns notification config)
6. System Admin / Tech Lead (establish reviewer pool, budget for external review)
7. System Admin / Tech Lead (vendor selection and contracts)

**Your Answer (assign names or confirm roles):**

---

### Q-17: Owner Review Session
**Question:** When can the owner review the Master Plan, Master Checklist, and this Questions document for Gate 0 approval?

**Recommendation:** Schedule a 2-hour review session within the next week. Bring printed or shared-screen copies of:
- `docs/01-MASTER-PLAN.md` (focus on Vision, Modules, Architecture, Risks)
- `docs/02-MASTER-CHECKLIST.md` (focus on phases and module status)
- This document (OPEN-QUESTIONS.md)

**Your Answer (propose date/time):**

---

### Q-18: Module Prioritization
**Question:** Within each module, which features are Must / Should / Could?

**Context:** Blueprint lists many features per module. Some may be nice-to-have vs. critical for launch.

**Recommendation:** Default: **everything in Blueprint §5 is Must** unless you explicitly downgrade. We will review each module's checklist at its Gate M1 and can defer "Could" items if timeline-constrained.

Alternatively, we can do a prioritization pass now during Phase 0 (adds time to Gate 0).

**Your Answer (prioritize now, or defer to per-module Gate M1):**

---

### Q-19: Current Workflow Documentation
**Question:** Can the shop provide:
- Current workflow descriptions (how jobs are tracked today, how payments are recorded, how inventory is managed)
- Sample forms (current job card, invoice, payroll sheet, stock count sheet)
- Photos of current process (optional but helpful: job board, parts shelves, cashier setup)

**Recommendation:** Collect these during Phase 0 before Gate 0. They inform wireframes, data migration plan, and training materials.

**Your Answer (who can provide, and by when):**

---

### Q-20: Budget
**Question:** What is the budget for:
- Development (team cost, if outsourced)
- Hosting (monthly cost limit)
- Third-party services (SMS, email, payment gateways — monthly cost limit)
- Hardware (printers, scanners, tablets, UPS, attendance device — one-time cost limit)
- Legal (contract review)
- Security audit (Phase 7 penetration testing, if external)

**Recommendation:** Provide ranges so technology and vendor decisions can stay within budget.

**Your Answer:**

---

### Q-21: Team Composition and Timeline
**Question:** 
- Who is on the development team (names, roles: backend dev, frontend dev, QA, tech lead, etc.)?
- Who owns each module (Module K, A, B, C, D, E, F, G, H, I, J)?
- What is the target start date for Phase 1?
- What is the target launch date (end of Phase 7)?

**Recommendation:** Establish now so Master Checklist and roadmap have real names and dates.

**Your Answer:**

---

## Assumptions I Am Making — Correct Me Now or I Proceed

Below are assumptions the AI is making where the Blueprint is silent. If any assumption is wrong, correct it immediately.

### A-01: Geographic and Regulatory Context
**Assumption:** JRS Bongabon autoshop is located in the Philippines, operates in Philippine pesos (PHP), follows Philippine tax and labor laws (BIR, SSS, PhilHealth, Pag-IBIG), uses Asia/Manila timezone, and is subject to the Data Privacy Act of 2012.

**Correct? (yes / no, with correction if no):**

---

### A-02: Single Branch, Multi-Branch Ready
**Assumption:** The shop currently operates as a single branch. The system will be designed with `branch_id` on all business tables so multi-branch can be enabled later, but v1 UI will not include branch selection or cross-branch operations.

**Correct?:**

---

### A-03: Platform Kernel and UI Kit in Phase 1
**Assumption:** The shared platform services (authentication, RBAC, audit, notifications, etc.) and the design-ready UI kit (tokens, components, gallery) are built as part of Phase 1 before Module K and A, since every module depends on them.

Blueprint §11 says Phase 1 is "K, then A" but §4 and §G describe shared services. I'm interpreting this as: Phase 1 = Platform + UI Kit + K + A.

**Correct?:**

---

### A-04: No Existing System to Integrate With
**Assumption:** There is no existing software system in use that AMS must integrate with or import live data from (e.g., no existing QuickBooks, no legacy POS). Data migration is from paper, spreadsheets, or manual records only.

**Correct?:**

---

### A-05: Standard Operating Hours
**Assumption:** The shop operates Monday-Saturday, 8am-6pm (or similar), with defined holidays. No 24/7 operation. This affects appointment scheduling rules and support availability.

**Correct? (if no, provide actual hours):**

---

### A-06: Internet Connectivity Generally Reliable
**Assumption:** The shop has internet connectivity that is generally stable during business hours, with occasional brief outages (minutes, not hours). This justifies the "fast recovery" approach (Q-10) over full offline capability.

**Correct?:**

---

### A-07: Owner Has Final Approval Authority
**Assumption:** The "Owner / General Manager" role is the ultimate decision-maker for system approvals, change requests, and Gate sign-offs.

**Correct?:**

---

### A-08: No Credit Card Terminal Integration in v1
**Assumption:** Card payments in v1 are recorded manually (customer pays via card, cashier enters payment as "Card" in system). Actual card terminal integration (swipe, chip, tap) is deferred to post-launch due to hardware/API complexity.

**Correct?:**

---

### A-09: Tax Configuration from Accountant
**Assumption:** VAT rates, tax computation rules (inclusive/exclusive), payroll statutory rates (SSS, PhilHealth, Pag-IBIG, withholding tax tables), and BIR receipt formats will be provided by the shop's accountant or bookkeeper. The system will implement them as settings, but we will not invent these rules.

**Correct? (yes, and who is the accountant contact?):**

---

### A-10: English Canonical Terms in Code
**Assumption:** All code (variables, functions, database tables, API endpoints) uses English terminology. UI labels may be bilingual per Q-02, but code stays English for maintainability.

**Correct?:**

---

## Question Status Summary

| ID | Topic | Status | Assigned To |
|----|-------|--------|-------------|
| Q-01 | KPI targets | Open | Owner |
| Q-02 | Language support | Open | Owner |
| Q-03 | Integration vendors | Open | Owner + Admin |
| Q-04 | Customer portal scope | Open | Owner |
| Q-05 | Android app timing | Open | Owner |
| Q-06 | OBD-II scope | Open | Owner |
| Q-07 | Supervisor & Customer permissions | Open | Owner |
| Q-08 | "Limited" permission definition | Open | Owner |
| Q-09 | Owner/GM access level | Open | Owner |
| Q-10 | Offline POS | Open | Owner + Shop Manager |
| Q-11 | Attendance in v1 | Open | Owner + HR |
| Q-12 | Technology stack | Open | Tech Lead + Owner |
| Q-13 | Architecture style | Open | Tech Lead |
| Q-14 | Job order for OTC sales | Open | Tech Lead + Owner |
| Q-15 | Privacy law compliance | Open | Owner + Legal |
| Q-16 | Risk owners | Open | Owner |
| Q-17 | Owner review session | Open | Owner |
| Q-18 | Module prioritization | Open | Owner |
| Q-19 | Current workflow docs | Open | Shop Staff |
| Q-20 | Budget | Open | Owner |
| Q-21 | Team & timeline | Open | Owner + Tech Lead |

**Total Questions:** 21 open, 0 answered

---

**Next Step:** Review this document with the team, answer all questions, and record approvals in `docs/DECISIONS.md`. Gate 0 cannot proceed until all Must-answer questions (Q-12, Q-13, Q-17, Q-20, Q-21, and all Assumptions) are resolved.
