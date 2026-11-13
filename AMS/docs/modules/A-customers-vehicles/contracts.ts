/**
 * Module A: Customers & Vehicles — TypeScript Type Contracts
 */

export type Customer = {
  id: string
  auth_user_id: string | null
  full_name: string
  email: string | null
  phone: string
  phone_alt: string | null
  address: string | null
  customer_type: 'individual' | 'fleet' | 'vip' | 'credit' | 'blacklisted'
  classification_notes: string | null
  credit_limit_centavos: number
  credit_terms_days: number
  consent_marketing: boolean
  consent_sms: boolean
  consent_email: boolean
  consent_recorded_at: string | null
  is_archived: boolean
  created_at: string
  updated_at: string
  created_by: string | null
}

export type CustomerDetail = Customer & {
  vehicles: Vehicle[]
  notes: CustomerNote[]
  attachments: Attachment[]
  service_history_count: number
  last_service_date: string | null
}

export type Vehicle = {
  id: string
  customer_id: string
  plate_number: string
  vin: string | null
  make: string
  model: string
  year: number | null
  color: string | null
  body_type: string | null
  fuel_type: string | null
  engine_displacement_cc: number | null
  transmission: string | null
  odometer_km: number | null
  odometer_recorded_at: string | null
  insurance_expiry: string | null
  registration_expiry: string | null
  is_archived: boolean
  created_at: string
  updated_at: string
}

export type VehicleDetail = Vehicle & {
  customer: Customer
  service_history: ServiceHistoryStub[]
  attachments: Attachment[]
}

export type ServiceHistoryStub = {
  id: string
  service_date: string
  service_type: string
  odometer_km: number | null
  total_centavos: number
}

export type CustomerNote = {
  id: string
  customer_id: string
  note_text: string
  note_type: 'general' | 'vip' | 'credit' | 'warning'
  created_by: string | null
  created_by_name: string | null
  created_at: string
}

export type Attachment = {
  id: string
  entity_type: 'customer' | 'vehicle'
  entity_id: string
  file_name: string
  file_path: string
  file_size_bytes: number | null
  mime_type: string | null
  attachment_type: 'or_cr' | 'insurance' | 'photo' | 'other'
  uploaded_by: string | null
  uploaded_by_name: string | null
  created_at: string
}

export type FleetAccount = {
  id: string
  company_name: string
  contact_person: string | null
  contact_phone: string | null
  contact_email: string | null
  address: string | null
  credit_limit_centavos: number
  payment_terms_days: number
  is_active: boolean
  created_at: string
  updated_at: string
}

export type FleetAccountDetail = FleetAccount & {
  vehicles: Array<Vehicle & { customer: Customer }>
}

// Input Types
export type CreateCustomerInput = {
  full_name: string
  email?: string
  phone: string
  phone_alt?: string
  address?: string
  customer_type?: Customer['customer_type']
  classification_notes?: string
  credit_limit_centavos?: number
  credit_terms_days?: number
  consent_marketing?: boolean
  consent_sms?: boolean
  consent_email?: boolean
}

export type UpdateCustomerInput = Partial<Omit<CreateCustomerInput, never>>

export type CustomerFilter = {
  search?: string
  customer_type?: Customer['customer_type']
  is_archived?: boolean
  has_consent?: boolean
}

export type CreateVehicleInput = {
  plate_number: string
  vin?: string
  make: string
  model: string
  year?: number
  color?: string
  body_type?: string
  fuel_type?: string
  engine_displacement_cc?: number
  transmission?: string
  odometer_km?: number
  insurance_expiry?: string
  registration_expiry?: string
}

export type UpdateVehicleInput = Partial<CreateVehicleInput>

export type DuplicateCheckInput = {
  full_name: string
  phone?: string
  email?: string
  plate_number?: string
  vin?: string
}

export type CreateNoteInput = {
  note_text: string
  note_type?: CustomerNote['note_type']
}

export type CreateFleetAccountInput = {
  company_name: string
  contact_person?: string
  contact_phone?: string
  contact_email?: string
  address?: string
  credit_limit_centavos?: number
  payment_terms_days?: number
}

export type ApiResponse<T> = {
  data: T | null
  error: string | null
  message?: string
}

// Server Action Signatures
export declare function createCustomer(data: CreateCustomerInput): Promise<ApiResponse<Customer>>
export declare function getCustomers(filter?: CustomerFilter): Promise<ApiResponse<Customer[]>>
export declare function getCustomerById(id: string): Promise<ApiResponse<CustomerDetail>>
export declare function updateCustomer(id: string, data: UpdateCustomerInput): Promise<ApiResponse<Customer>>
export declare function archiveCustomer(id: string): Promise<ApiResponse<void>>
export declare function mergeCustomers(sourceId: string, targetId: string): Promise<ApiResponse<Customer>>
export declare function detectDuplicates(data: DuplicateCheckInput): Promise<ApiResponse<Customer[]>>
export declare function searchCustomers(query: string): Promise<ApiResponse<Customer[]>>

export declare function createVehicle(customerId: string, data: CreateVehicleInput): Promise<ApiResponse<Vehicle>>
export declare function getVehiclesByCustomer(customerId: string): Promise<ApiResponse<Vehicle[]>>
export declare function getVehicleByPlate(plate: string): Promise<ApiResponse<VehicleDetail>>
export declare function getVehicleById(id: string): Promise<ApiResponse<VehicleDetail>>
export declare function updateVehicle(id: string, data: UpdateVehicleInput): Promise<ApiResponse<Vehicle>>
export declare function transferVehicle(vehicleId: string, newCustomerId: string): Promise<ApiResponse<void>>
export declare function searchByPlate(plate: string): Promise<ApiResponse<Array<Vehicle & { customer: Customer }>>>

export declare function addCustomerNote(customerId: string, note: CreateNoteInput): Promise<ApiResponse<CustomerNote>>
export declare function getCustomerNotes(customerId: string): Promise<ApiResponse<CustomerNote[]>>
export declare function deleteCustomerNote(noteId: string): Promise<ApiResponse<void>>

export declare function uploadAttachment(entityType: 'customer' | 'vehicle', entityId: string, file: File, attachmentType: string): Promise<ApiResponse<Attachment>>
export declare function getAttachments(entityType: string, entityId: string): Promise<ApiResponse<Attachment[]>>
export declare function getSignedUrl(attachmentId: string): Promise<ApiResponse<{ url: string; expiresAt: string }>>
export declare function deleteAttachment(attachmentId: string): Promise<ApiResponse<void>>

export declare function createFleetAccount(data: CreateFleetAccountInput): Promise<ApiResponse<FleetAccount>>
export declare function getFleetAccounts(): Promise<ApiResponse<FleetAccount[]>>
export declare function getFleetAccountById(id: string): Promise<ApiResponse<FleetAccountDetail>>
export declare function assignVehicleToFleet(fleetId: string, vehicleId: string): Promise<ApiResponse<void>>
export declare function removeVehicleFromFleet(fleetId: string, vehicleId: string): Promise<ApiResponse<void>>
