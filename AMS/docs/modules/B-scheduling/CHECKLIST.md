# Module B: Appointment and Service Scheduling — Checklist

**Module Owner:** `PENDING(Q-21)` | **Phase:** 2 | **Status:** Not Started

## Core Functions (§5.B)
- [ ] B-F01: Book appointments (desk, phone, online portal) · **Must** · `PENDING(Q-04)`
- [ ] B-F02: Service catalog with standard durations · **Must**
- [ ] B-F03: Bay/lift and technician calendar with drag-drop · **Must**
- [ ] B-F04: Conflict detection (double-book, closing time) · **Must**
- [ ] B-F05: Capacity rules (max per day, specialty bays) · **Must**
- [ ] B-F06: Confirmation, reminder, reschedule notifications · **Must**
- [ ] B-F07: Walk-in queue and waitlist · **Must**
- [ ] B-F08: No-show and cancellation tracking · **Must**
- [ ] B-F09: Convert appointment to service order (one click) · **Must**

## Screens (§5.B)
- [ ] B-S01: Calendar views (day, week, month) with filters · **Must**
- [ ] B-S02: Bay board (live status) · **Must**
- [ ] B-S03: Appointment form · **Must**
- [ ] B-S04: Today's arrivals and waiting room queue · **Must**
- [ ] B-S05: Available slot finder · **Should**

## Key Records: Appointment, Bay/Lift, Service Catalog Item, Shop Hours, Waitlist Entry

## Outputs: Daily schedule, no-show report, utilization by bay, booking source analysis

## Business Rules
- [ ] B-N01: No double-booking same bay/technician at same time · **Must**
- [ ] B-N02: Appointments outside shop hours flagged/rejected · **Must**
- [ ] B-N03: No-show after 15 min grace period, status auto-updated · **Should**
- [ ] B-N04: Reminder sent X hours before (configurable) · **Must**

## Integration
**Provides to:** C (appointment → service order)  
**Consumes:** A (customer/vehicle data), K (settings: hours, holidays)  
**Deferred:** None

## Security
- [ ] B-SEC01: Customers (portal) see own appointments only · **Must** · `PENDING(Q-04)`
- [ ] B-SEC02: Permission tests per RBAC · **Must**

## Acceptance Criteria
**B-AC01:** Book appointment, receive confirmation SMS, convert to service order  
**B-AC02:** Attempt double-book, system rejects with conflict message  
**B-AC03:** No-show marked, appears in no-show report  

## DoD: All Must items, tests green, security.md, user guide, demo

## Gate: **M1:** — | **M2:** — | **Tag:** `module-B-v1.0`
