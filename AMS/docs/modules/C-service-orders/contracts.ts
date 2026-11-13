/**
 * Module C: Service Orders — TypeScript Type Contracts (Abbreviated)
 */

export type ServiceOrderStatus = 
  | 'checked_in' | 'awaiting_estimate' | 'awaiting_approval' | 'awaiting_parts'
  | 'in_progress' | 'quality_check' | 'ready_for_release' | 'released'
  | 'closed' | 'on_hold' | 'cancelled'

export type ServiceOrder = {
  id: string
  appointment_id: string | null
  customer_id: string
  vehicle_id: string
  order_number: string
  status: ServiceOrderStatus
  intake_odometer_km: number | null
  promised_at: string | null
  bay_id: string | null
  primary_technician_id: string | null
  complaint_description: string | null
  diagnosis_notes: string | null
  internal_notes: string | null
  is_warranty: boolean
  warranty_reference: string | null
  is_comeback: boolean
  original_order_id: string | null
  created_at: string
  created_by: string | null
  updated_at: string
}

export type JobItem = {
  id: string
  service_order_id: string
  item_type: 'labor' | 'part' | 'sublet' | 'fee'
  description: string
  quantity: number
  unit_price_centavos: number
  discount_centavos: number
  tax_rate: number
  line_total_centavos: number
  part_id: string | null
  technician_id: string | null
  sort_order: number
}

export type ApiResponse<T> = { data: T | null; error: string | null; message?: string }

export declare function createServiceOrder(data: any): Promise<ApiResponse<ServiceOrder>>
export declare function getServiceOrders(filter: any): Promise<ApiResponse<ServiceOrder[]>>
export declare function getServiceOrderById(id: string): Promise<ApiResponse<any>>
export declare function transitionStatus(id: string, newStatus: ServiceOrderStatus, notes?: string): Promise<ApiResponse<ServiceOrder>>
// ... other actions
