export interface Client {
  id: number
  speed_code: number
  name: string
  phone: string | null
  car_model: string | null
  created_at: string
}

export interface ClientPart {
  id: number
  client_id: number
  part_name: string
  reference: string | null
  category: string | null
  notes: string | null
}

export interface Sale {
  id: number
  client_id: number
  total: number
  date: string
  created_at: string
}

export interface SaleItem {
  id: number
  sale_id: number
  part_name: string
  quantity: number
  unit_price: number
}

export interface CatalogPart {
  id: number
  name: string
  category: string
  price: number
  reference: string | null
}

export interface TopPart {
  part_name: string
  total_qty: number
}
