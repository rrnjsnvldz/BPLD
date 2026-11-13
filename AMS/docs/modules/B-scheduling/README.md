# Module B: Appointment and Service Scheduling

**Status:** Not Started (Phase 2)  
**Dependencies:** Module A (customer/vehicle data), Module K (auth, settings)  
**Provides To:** Module C (converts appointment to service order)

---

## Purpose

Module B is the **capacity planning engine** — it manages all appointment booking, bay/lift scheduling, technician assignment, and walk-in queue.

---

## Database Tables (5)

- `b_appointments` — Appointment bookings
- `b_bays` — Bay/lift definitions
- `b_bay_assignments` — Appointment → Bay → Technician
- `b_waitlist_entries` — Waiting list for fully booked dates
- `b_availability_overrides` — Shop closures, reduced hours

---

## Key Features

- Calendar views (day/week/month)
- Bay board (live status of all bays)
- Slot finder (available times)
- Conflict detection (no double-booking)
- Confirmation and reminder SMS
- No-show tracking
- Walk-in queue
- Convert appointment → service order

---

## Business Rules

- No double-booking: same bay + overlapping time rejected
- Shop hours from K settings
- Reminder sent X hours before (configurable)
- No-show auto-marked after 15-minute grace
- Convert to service order creates stub in Module C

---

## Integration

**Consumes from A:** Customer/vehicle lookup  
**Consumes from K:** Shop hours, holidays, SMS service  
**Provides to C:** Appointment conversion

---

## Dependency

Module B waits for Module A APIs: `getCustomerById`, `getVehiclesByCustomer`, `searchByPlate`

**Estimated Ready:** End of Week 4 (after Module A complete)

---

**Module B keeps the shop running smoothly without double-booking or idle time.**
