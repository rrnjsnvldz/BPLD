# Module H: Preventive Maintenance and Automated Reminders — Checklist

**Module Owner:** `PENDING(Q-21)` | **Phase:** 5 | **Status:** Not Started

## Core Functions (§5.H)
- [ ] H-F01: Maintenance schedule templates by service type and vehicle · **Must**
- [ ] H-F02: Next-due computation from last service date/odometer + estimated mileage · **Must**
- [ ] H-F03: Registration, insurance, emission expiry reminders · **Should**
- [ ] H-F04: Multi-channel notifications (SMS, email, messaging apps) with templates · **Must** · `PENDING(Q-03)`
- [ ] H-F05: Reminder sequences (14 days before, 3 days, day of, overdue) · **Must**
- [ ] H-F06: Smart suppression (no remind if booked/serviced/opted-out) · **Must**
- [ ] H-F07: One-tap booking link in reminders · **Should** · `PENDING(Q-04)`
- [ ] H-F08: Declined-work follow-up · **Should**
- [ ] H-F09: Seasonal and promotional campaigns by segment · **Should**
- [ ] H-F10: Delivery and conversion tracking · **Must**

## Screens: Due-for-service list, reminder calendar, template editor with preview, campaign builder, performance dashboard, vehicle maintenance plan view, opt-out/bounce list

## Key Records: Maintenance Schedule Template, Vehicle Maintenance Plan, Reminder Rule, Message Template, Notification Log, Campaign

## Outputs: Reminders due/overdue, campaign results, reminder conversion rate, lapsed customers list

## Business Rules
- [ ] H-N01: Reminder not sent if customer opted out · **Must**
- [ ] H-N02: Reminder not sent if already booked or serviced since last check · **Must**
- [ ] H-N03: Reminder throttled (max N per customer per day/week) · **Must**
- [ ] H-N04: Next-due updated when service completed (C event) · **Must**
- [ ] H-N05: Campaign audience filters by vehicle type, last service date, segment · **Should**

## Integration
**Provides:** Reminder performance data to J  
**Consumes:** A (customer contact preferences), C/E (service completed events update next-due), K (notification engine, templates)

## Security
- [ ] H-SEC01: Opt-out honored immediately · **Must**
- [ ] H-SEC02: Customer data not exposed in logs · **Must**
- [ ] H-SEC03: Permission tests per RBAC · **Must**

## Acceptance Criteria
**H-AC01:** Service completed, next oil change due computed, reminder scheduled  
**H-AC02:** Reminder sent, delivered, customer books via link, conversion tracked  
**H-AC03:** Customer opts out, no further reminders sent  
**H-AC04:** Campaign created, 50 customers targeted, sent, delivery rate measured  

## DoD: All Must, smart suppression tests green, conversion tracking accurate, user guide for advisor, demo

## Gate: **M1:** — | **M2:** — | **Tag:** `module-H-v1.0`
