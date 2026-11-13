/**
 * Module B: Scheduling — TypeScript Type Contracts
 */

export type Appointment = {
  id: string
  customer_id: string
  vehicle_id: string
  appointment_date: string
  appointment_time: string
  duration_minutes: number
  service_type: string | null
  notes: string | null
  status: 'scheduled' | 'confirmed' | 'arrived' | 'no_show' | 'cancelled' | 'converted'
  booking_source: 'desk' | 'phone' | 'portal' | 'walk_in'
  confirmation_sent_at: string | null
  reminder_sent_at: string | null
  cancelled_at: string | null
  cancellation_reason: string | null
  converted_to_service_order_id: string | null
  created_at: string
  created_by: string | null
}

export type AppointmentDetail = Appointment & {
  customer_name: string
  vehicle_plate: string
  vehicle_description: string
  bay_assignment: BayAssignment | null
}

export type Bay = {
  id: string
  bay_number: string
  bay_name: string | null
  bay_type: 'general' | 'lift' | 'alignment' | 'wash'
  specialty_tags: string[]
  is_active: boolean
  notes: string | null
  created_at: string
}

export type BayAssignment = {
  id: string
  appointment_id: string
  bay_id: string
  bay_name: string
  technician_user_id: string | null
  technician_name: string | null
  assigned_at: string
}

export type WaitlistEntry = {
  id: string
  customer_id: string
  customer_name: string
  vehicle_id: string | null
  vehicle_plate: string | null
  service_requested: string | null
  preferred_date: string | null
  notes: string | null
  status: 'waiting' | 'notified' | 'booked' | 'expired'
  notified_at: string | null
  created_at: string
}

export type TimeSlot = {
  date: string
  time: string
  duration_minutes: number
  available_bays: number
  is_available: boolean
}

export type DaySchedule = {
  date: string
  appointments: AppointmentDetail[]
  available_slots: TimeSlot[]
}

export type WeekSchedule = {
  week_start: string
  days: DaySchedule[]
}

export type ConflictResult = {
  has_conflict: boolean
  conflicting_appointment_id: string | null
  message: string | null
}

export type CreateAppointmentInput = {
  customer_id: string
  vehicle_id: string
  appointment_date: string
  appointment_time: string
  duration_minutes?: number
  service_type?: string
  notes?: string
  booking_source?: Appointment['booking_source']
}

export type UpdateAppointmentInput = Partial<Omit<CreateAppointmentInput, 'customer_id' | 'vehicle_id'>>

export type AppointmentFilter = {
  customer_id?: string
  vehicle_id?: string
  date_from?: string
  date_to?: string
  status?: Appointment['status']
}

export type WaitlistInput = {
  customer_id: string
  vehicle_id?: string
  service_requested?: string
  preferred_date?: string
  notes?: string
}

export type ApiResponse<T> = {
  data: T | null
  error: string | null
  message?: string
}

export declare function createAppointment(data: CreateAppointmentInput): Promise<ApiResponse<Appointment>>
export declare function getAppointments(filter: AppointmentFilter): Promise<ApiResponse<Appointment[]>>
export declare function getAppointmentById(id: string): Promise<ApiResponse<AppointmentDetail>>
export declare function updateAppointment(id: string, data: UpdateAppointmentInput): Promise<ApiResponse<Appointment>>
export declare function cancelAppointment(id: string, reason: string): Promise<ApiResponse<void>>
export declare function convertToServiceOrder(id: string): Promise<ApiResponse<{ serviceOrderId: string }>>
export declare function markNoShow(id: string): Promise<ApiResponse<void>>

export declare function getAvailableSlots(date: string, duration: number): Promise<ApiResponse<TimeSlot[]>>
export declare function getDaySchedule(date: string): Promise<ApiResponse<DaySchedule>>
export declare function getWeekSchedule(weekStart: string): Promise<ApiResponse<WeekSchedule>>
export declare function checkConflict(bayId: string, date: string, time: string, duration: number): Promise<ApiResponse<ConflictResult>>

export declare function getBays(): Promise<ApiResponse<Bay[]>>
export declare function assignBay(appointmentId: string, bayId: string, technicianId: string): Promise<ApiResponse<void>>

export declare function addToWaitlist(data: WaitlistInput): Promise<ApiResponse<WaitlistEntry>>
export declare function notifyWaitlist(entryId: string): Promise<ApiResponse<void>>
