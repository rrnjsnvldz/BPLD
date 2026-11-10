# Module C: Service Order and Job Management — Checklist

**Module Owner:** `PENDING(Q-21)` | **Phase:** 2 | **Status:** Not Started

## Core Functions (§5.C)
- [ ] C-F01: Create service order from appointment or walk-in · **Must**
- [ ] C-F02: Digital vehicle check-in inspection with photos · **Must**
- [ ] C-F03: Capture complaints and requested services · **Must**
- [ ] C-F04: Diagnosis notes and recommended work (priority levels) · **Must**
- [ ] C-F05: Estimate/quotation builder with versioning · **Must**
- [ ] C-F06: Customer approval capture (digital signature, SMS, verbal logged) · **Must**
- [ ] C-F07: Additional-work approval workflow mid-job · **Must**
- [ ] C-F08: Assign technician(s) and bay · **Must**
- [ ] C-F09: Time clock per job (start, pause, stop) · **Must**
- [ ] C-F10: Parts requisition (stub to D in Phase 2, wire in Phase 3) · **Must** · `DEFERRED-INTEGRATION(with D)`
- [ ] C-F11: Job status pipeline with customer notifications · **Must**
- [ ] C-F12: Sublet/outsourced work tracking · **Should**
- [ ] C-F13: QC checklist and supervisor sign-off · **Must**
- [ ] C-F14: Warranty and comeback flagging · **Must**
- [ ] C-F15: Convert to invoice (stub to E in Phase 2, wire in Phase 3) · **Must** · `DEFERRED-INTEGRATION(with E)`

## Screens (§5.C)
- [ ] C-S01: Job board (kanban/list view, all active jobs) · **Must**
- [ ] C-S02: Service order detail (full view) · **Must**
- [ ] C-S03: Technician tablet view (simplified) · **Must**
- [ ] C-S04: Estimate screen with live totals · **Must**
- [ ] C-S05: Inspection form with pass/attention/fail indicators · **Must**
- [ ] C-S06: Promised-time tracker · **Should**
- [ ] C-S07: Release screen with final checklist · **Must**

## Key Records: Service Order, Inspection, Estimate, Estimate Line, Labor Entry, Parts Requisition, Sublet Job, QC Checklist, Approval Log, Warranty Record

## Outputs: Job card, estimate/quotation, work summary, technician productivity, comeback report, turnaround time report, declined-work report

## Business Rules (§5.C Job Status Pipeline — see Master Plan §3)
- [ ] C-N01: Job status transitions per state machine (18 rules) · **Must**
- [ ] C-N02: Estimate versioning on changes · **Must**
- [ ] C-N03: Additional work requires separate approval if price changes · **Must**
- [ ] C-N04: Time clock pauses when job on hold · **Must**
- [ ] C-N05: QC failure sends back to In Progress with rework reason · **Must**
- [ ] C-N06: Released status immutable, new job for comebacks · **Must**

## Integration
**Provides:** Events to D (parts requested), E (job completed → invoice), F (labor logged → payroll), H (service complete → reminder update), I (vehicle released → follow-up)  
**Consumes:** A (customer/vehicle), B (appointment), K (settings, audit)  
**Deferred:** Wire D and E in Phase 3 (stubs in Phase 2)

## Security
- [ ] C-SEC01: Technicians see assigned jobs only · **Must**
- [ ] C-SEC02: Cost/margin visible to authorized roles only · **Must**
- [ ] C-SEC03: Approval log immutable · **Must**
- [ ] C-SEC04: Second reviewer for estimate approval workflow · **Must**
- [ ] C-SEC05: Permission tests per RBAC · **Must**

## Acceptance Criteria
**C-AC01:** Create service order, complete inspection, generate estimate, get approval, start work  
**C-AC02:** Technician logs time, requests parts (stubbed), marks complete, QC approves, release  
**C-AC03:** Additional finding mid-job, request approval, customer approves, continue  
**C-AC04:** Job released, event emitted, invoice stubbed  

## DoD: All Must, tests green, security.md, stub integration with D and E documented, user guide for advisor and technician, demo

## Gate: **M1:** — | **M2:** — | **Tag:** `module-C-v1.0`
