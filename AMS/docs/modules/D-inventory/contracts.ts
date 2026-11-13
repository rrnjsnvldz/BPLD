/**
 * Module D: Inventory — TypeScript Type Contracts (Abbreviated)
 */

export type InventoryItem = {
  id: string
  category_id: string | null
  sku: string
  name: string
  description: string | null
  unit_of_measure: string
  barcode: string | null
  brand: string | null
  is_active: boolean
  is_service_item: boolean
  reorder_point: number
  reorder_quantity: number
  avg_cost_centavos: number
  selling_price_centavos: number
  selling_price_vip_centavos: number | null
  selling_price_fleet_centavos: number | null
  current_stock_quantity: number
  created_at: string
  updated_at: string
}

export type StockBalance = {
  id: string
  item_id: string
  location_id: string
  quantity: number
  avg_cost_centavos: number
  last_updated: string
}

export type StockMovement = {
  id: string
  item_id: string
  movement_type: 'receipt' | 'issuance' | 'adjustment' | 'return' | 'transfer' | 'count_variance'
  quantity_change: number
  unit_cost_centavos: number | null
  reference_type: string | null
  reference_id: string | null
  location_id: string | null
  notes: string | null
  created_at: string
  created_by: string | null
}

export type ApiResponse<T> = { data: T | null; error: string | null; message?: string }

export declare function createItem(data: any): Promise<ApiResponse<InventoryItem>>
export declare function getItems(filter?: any): Promise<ApiResponse<InventoryItem[]>>
export declare function getItemById(id: string): Promise<ApiResponse<any>>
export declare function getStockBalance(itemId: string): Promise<ApiResponse<StockBalance>>
export declare function issueToJob(data: any): Promise<ApiResponse<StockMovement>>
// ... other actions
