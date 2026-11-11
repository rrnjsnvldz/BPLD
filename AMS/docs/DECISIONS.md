# AMS Decisions and Change Requests

**Last Updated:** 2026-11-10

---

## Purpose

This document is the official record of:
- **Approved Decisions** (AD-nn) — answers to open questions, architectural choices, process agreements
- **Change Requests** (CR-nn) — approved deviations from the Master Plan
- **Gate Approvals** — sign-offs at Gate 0, M1, M2, P, and L

All decisions are binding. Changes require a new CR.

---

## Gate Approvals

### Gate 0: Discovery and Design Complete
**Status:** ✅ APPROVED  
**Date:** 2026-11-10  
**Approver:** Owner  
**Criteria Met:**
- [x] Master Plan approved
- [x] Master Checklist approved
- [x] Module checklists reviewed
- [x] Critical questions answered (Q-12, Q-13, Q-20, Q-21)
- [x] Non-critical questions deferred to implementation phases
- [x] Technology stack decided (ADR-001: Next.js + Supabase + Vercel)
- [x] Architecture style decided (ADR-002: Modular Monolith)
- [x] Design approach approved
- [x] Security approach approved
- [x] Data migration approach approved
- [x] Team composition and timeline confirmed (3 developers, 12-week core target)

**Notes:**  
Fast-track approval granted. Questions Q-01 to Q-11 and Q-14 to Q-19 deferred to clarify during module implementation. Budget constraint noted: zero infrastructure cost, SMS/email pay-as-you-go. Email will use free tier (Resend 3K emails/month). SMS via Semaphore PH (~₱250-500/month pay-as-you-go). Timeline accelerated due to 3-developer team + AI assistance.

---

## Approved Decisions

### AD-001: Technology Stack Selection
**Date:** 2026-11-10  
**Decider:** Owner  
**Context:** Need to select technology stack for AMS development. Evaluated 4 options in ADR-001. Critical factors: zero initial budget, need SMS/email integration, 3-developer team, ASAP timeline requirement.  
**Decision:** Next.js 14+ (App Router) + React 18+ + Supabase + Vercel  
**Impact:**  
- Platform Kernel work reduced by ~4-5 weeks (Supabase provides auth, RLS, realtime, storage)
- Zero infrastructure cost to start (Supabase free tier + Vercel Hobby tier)
- Type safety end-to-end with TypeScript
- Email integration via Resend free tier (3K emails/month)
- SMS integration via Semaphore PH pay-as-you-go (~₱250-500/month)
- Vercel deployment eliminates DevOps overhead
- See ADR-001 for full rationale

### AD-002: Architecture Style Selection
**Date:** 2026-11-10  
**Decider:** Owner  
**Context:** Need to decide between modular monolith, microservices, or other architecture style. Evaluated in ADR-002. Single-shop deployment, 3-developer team, ASAP timeline.  
**Decision:** Modular Monolith with Next.js feature folders  
**Impact:**  
- Simpler deployment (single Next.js app on Vercel)
- Faster development (no inter-service communication overhead)
- Modules organized as Next.js feature folders: `/app/(modules)/[module-id]/...`
- Shared Supabase database with RLS for access control
- Can extract Edge Functions later if needed
- See ADR-002 for full rationale

### AD-003: Budget and Service Constraints
**Date:** 2026-11-10  
**Decider:** Owner  
**Context:** No initial budget available. System requires SMS reminders and email notifications. Need to minimize costs while delivering full functionality.  
**Decision:**  
- Infrastructure: FREE (Supabase free tier + Vercel Hobby tier)
- Email: FREE via Resend free tier (3,000 emails/month limit)
- SMS: Pay-as-you-go via Semaphore PH (~₱0.50/SMS, estimated ₱250-500/month)
- Domain: Deferred (use Vercel subdomain initially, e.g., `jrs-ams.vercel.app`)
- Upgrade plan: Move to Supabase Pro ($25/mo) + Vercel Pro ($20/mo) when free tiers exhausted  
**Impact:**  
- Total monthly cost: ₱250-500 (~$5-10) for SMS only
- Email module must respect 3K/month limit (monitor usage, queue non-urgent emails)
- SMS module must batch reminders efficiently
- Infrastructure scales automatically on Vercel/Supabase (no manual scaling needed)

### AD-004: Team Composition and Timeline
**Date:** 2026-11-10  
**Decider:** Owner  
**Context:** Need to establish realistic timeline for AMS delivery. Team size impacts schedule and task allocation.  
**Decision:**  
- **Team:** 3 developers + AI assistance (Kiro)
- **Target:** Core system (Modules K+A+B+C+D+E) in 12 weeks
- **Build order:** Platform Kernel + UI Kit → Module K → Module A → Module B → Module C → Module D → Module E → (remaining modules F-J in Phase 4+)
- **Parallelization:** With 3 developers, can run Platform Kernel + UI Kit in parallel after initial setup  
**Impact:**  
- Phase 1 (Platform + K + A): 4 weeks (can parallelize once kernel stable)
- Phase 2 (B + C): 4 weeks
- Phase 3 (D + E): 4 weeks
- First usable system: 12 weeks (vs 18 weeks with 1-2 devs)
- Remaining modules (F, G, H, I, J) delivered incrementally after core system live

---

## Change Requests

### CR-001: [Placeholder — First Change Request Goes Here]
**Date:** —  
**Requester:** —  
**Status:** —  
**What Changes:** —  
**Why:** —  
**Impact on:**
- Modules: —
- Data Model: —
- Security: —
- Design: —
- Timeline: —

**Approval:** —  
**Implementation:** —

---

## Decision Log Summary

| ID | Type | Description | Date | Status |
|----|------|-------------|------|--------|
| Gate-0 | Gate | Phase 0 approval | 2026-11-10 | ✅ Approved |
| AD-001 | Decision | Technology Stack: Next.js + Supabase + Vercel | 2026-11-10 | ✅ Approved |
| AD-002 | Decision | Architecture: Modular Monolith | 2026-11-10 | ✅ Approved |
| AD-003 | Decision | Budget: Free infra, free email, pay-as-you-go SMS | 2026-11-10 | ✅ Approved |
| AD-004 | Decision | Team: 3 developers, 12-week core target | 2026-11-10 | ✅ Approved |

*Additional decisions, CRs, and gate approvals will be added as they occur.*

---

## Notes

- Decisions (AD-nn) are permanent once approved; they can only be changed via a new CR
- Change Requests (CR-nn) require impact analysis and approval before implementation
- Gate approvals require all entry criteria met and documented evidence
- Always update the Master Plan and affected specs when a CR is approved
