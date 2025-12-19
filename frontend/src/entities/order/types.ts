export type OrderStatus = 'pending' | 'in_progress' | 'delivered' | 'completed' | 'cancelled' | 'disputed';

export interface Order {
  id: number;
  gig_id: number | null;
  project_id: number | null;
  buyer_id: number;
  seller_id: number;
  amount: number;
  status: OrderStatus;
  requirements: string | null;
  delivery_date: string | null;
  created_at: string;
  updated_at: string;
  gig_title?: string;
  project_title?: string;
  buyer_name?: string;
  seller_name?: string;
  buyer_avatar?: string;
  seller_avatar?: string;
}

export interface CreateOrderDto {
  gig_id?: number;
  project_id?: number;
  seller_id: number;
  amount: number;
  requirements?: string;
  delivery_date?: string;
}

export interface UpdateOrderDto {
  status?: OrderStatus;
  requirements?: string;
  delivery_date?: string;
}
