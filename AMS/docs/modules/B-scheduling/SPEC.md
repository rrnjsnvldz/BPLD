# Module B: Appointment and Service Scheduling — Technical Specification

**Version:** 1.0  
**Status:** Phase 2 Module — Not Started  
**Last Updated:** 2026-11-10  
**Module Owner:** TBD

---

## Overview

Module B manages all appointment booking, bay/lift scheduling, technician assignment, and walk-in queue management. It is the **capacity planning engine** that ensures the shop operates smoothly without double-booking or idle time.

**Development Priority:** Module B depends on **Module A** (customer/vehicle data). Development starts in Phase 2 after Module A APIs are stable.

---

## Database Tables

```sql
-- Appointments
b_appointments (
  id, customer_id FK, vehicle_id FK, appointment_date, appointment_time,
  duration_minutes, service_type, notes,
  status (scheduled|confirmed|arrived|no_show|cancelled|converted),
  booking_source (desk|phone|portal|walk_in),
  confirmation_sent_at, reminder_sent_at, cancelled_at, cancellation_reason,
  converted_to_service_order_id FK (nullable), created_at, created_by
)

-- Bays/Lifts
b_bays (
  id, bay_number, bay_name, bay_type (general|lift|alignment|wash),
  specialty_tags text[], is_active, notes, created_at
)

-- Bay assignments
b_bay_assignments (
  id, appointment_id FK, bay_id FK, technician_user_id FK,
  assigned_at, assigned_by
)

-- Waitlist
b_waitlist_entries (
  id, customer_id FK, vehicle_id FK, service_requested,
  preferred_date, notes, status (waiting|notified|booked|expired),
  notified_at, created_at
)

-- Availability overrides
b_availability_overrides (
  id, override_date, override_type (closed|reduced|extended),
  max_appointments, notes, created_at, created_by
)
```

---

## API Contracts

```typescript
// Appointment CRUD
createAppointment(data: CreateAppointmentInput): Promise<ApiResponse<Appointment>>
getAppointments(filter: AppointmentFilter): Promise<ApiResponse<Appointment[]>>
getAppointmentById(id: string): Promise<ApiResponse<AppointmentDetail>>
updateAppointment(id: string, data: UpdateAppointmentInput): Promise<ApiResponse<Appointment>>
cancelAppointment(id: string, reason: string): Promise<ApiResponse<void>>
convertToServiceOrder(id: string): Promise<ApiResponse<{ serviceOrderId: string }>>
markNoShow(id: string): Promise<ApiResponse<void>>

// Calendar / Availability
getAvailableSlots(date: string, duration: number): Promise<ApiResponse<TimeSlot[]>>
getDaySchedule(date: string): Promise<ApiResponse<DaySchedule>>
getWeekSchedule(weekStart: string): Promise<ApiResponse<WeekSchedule>>
checkConflict(bayId: string, date: string, time: string, duration: number): Promise<ApiResponse<ConflictResult>>

// Bay management
getBays(): Promise<ApiResponse<Bay[]>>
assignBay(appointmentId: string, bayId: string, technicianId: string): Promise<ApiResponse<void>>

// Waitlist
addToWaitlist(data: WaitlistInput): Promise<ApiResponse<WaitlistEntry>>
notifyWaitlist(entryId: string): Promise<ApiResponse<void>>
```

---

## UI Screens

- `/appointments` — Calendar view (day/week/month) with drag-drop, bay board
- `/appointments/new` — Book appointment with slot finder
- `/appointments/[id]` — Appointment detail
- `/appointments/today` — Today's arrivals + waiting room queue
- `/appointments/waitlist` — Waitlist management

---

## Business Rules

- **No double-booking:** Same bay + overlapping time rejected
- **Shop hours:** From K settings (opening/closing, lunch break, holidays)
- **Reminder SMS:** Sent X hours before (X from K settings)
- **No-show:** Auto-mark after 15-minute grace period
- **Convert to service order:** Creates stub in Module C, appointment status → converted

---

## Integration Points

**Consumes from A:** `getCustomerById`, `getVehiclesByCustomer`, `searchByPlate`  
**Consumes from K:** Shop hours, holiday calendar, SMS notification service  
**Provides to C:** `convertToServiceOrder` creates service order stub

**Dependency Note:** Module B development MUST wait for Module A's customer/vehicle APIs. Estimated: Module A APIs ready end of Week 4.

---

**Module B ensures shop capacity is planned and utilized efficiently.**
