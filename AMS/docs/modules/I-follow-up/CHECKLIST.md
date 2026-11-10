# Module I: Customer Follow-Up and After-Service Monitoring — Checklist

**Module Owner:** `PENDING(Q-21)` | **Phase:** 5 | **Status:** Not Started

## Core Functions (§5.I)
- [ ] I-F01: Automatic follow-up tasks after job release (day 1, 7, 30 by service type) · **Must**
- [ ] I-F02: Satisfaction survey (rating scale, questions, free text) via SMS/email/QR · **Must**
- [ ] I-F03: Complaint and comeback logging with severity, root cause, owner, resolution · **Must**
- [ ] I-F04: Warranty tracking (coverage terms, expiry, claim handling, supplier recovery) · **Must**
- [ ] I-F05: Callback task list for advisors with outcome capture · **Must**
- [ ] I-F06: Review and referral requests for satisfied customers · **Should**
- [ ] I-F07: Loyalty program (points, tiers, rewards, expiring points) · **Should**
- [ ] I-F08: Customer communication history (calls, messages, emails) in timeline · **Must**
- [ ] I-F09: Escalation rules for low scores or unresolved complaints · **Must**

## Screens: Follow-up task queue, survey results dashboard, complaint board, warranty register, communication timeline, loyalty balance/redemption screen

## Key Records: Follow-Up Task, Survey, Survey Response, Complaint/Comeback, Warranty Claim, Loyalty Account, Communication Log

## Outputs: CSAT/NPS report, complaint analysis, comeback rate by technician/service, warranty cost report, follow-up completion rate, loyalty summary

## Business Rules
- [ ] I-N01: Follow-up task auto-created on vehicle released (C/E event) · **Must**
- [ ] I-N02: Survey response tied to specific service order · **Must**
- [ ] I-N03: CSAT < 3 escalates to supervisor · **Must**
- [ ] I-N04: Complaint unresolved > 7 days escalates · **Must**
- [ ] I-N05: Warranty claim records cost recovery from supplier · **Should**

## Integration
**Provides:** CSAT/complaint data to J  
**Consumes:** C/E (vehicle released, payment received events trigger follow-ups), A (customer contact), K (notification, templates)

## Security
- [ ] I-SEC01: Complaint details visible to authorized roles only · **Must**
- [ ] I-SEC02: Survey responses anonymous option · **Should**
- [ ] I-SEC03: Permission tests per RBAC · **Must**

## Acceptance Criteria
**I-AC01:** Vehicle released, day-1 follow-up task created, advisor completes, logs outcome  
**I-AC02:** Customer receives survey link, submits rating 2, escalated to supervisor  
**I-AC03:** Complaint logged, assigned, resolved, closed, appears in analysis  
**I-AC04:** Warranty claim created, cost tracked, reported  

## DoD: All Must, escalation tests green, user guide for advisors, demo

## Gate: **M1:** — | **M2:** — | **Tag:** `module-I-v1.0`
