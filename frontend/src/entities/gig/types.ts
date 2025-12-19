export type GigStatus = 'active' | 'paused' | 'deleted';

export interface Gig {
  id: number;
  freelancer_id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  delivery_days: number;
  status: GigStatus;
  is_active: number;
  views: number;
  orders: number;
  rating: number;
  created_at: string;
  updated_at: string;
  freelancer_name?: string;
  freelancer_avatar?: string;
  freelancer_rating?: number;
}

export interface GigFilters {
  query?: string;
  category?: string;
  min_price?: number;
  max_price?: number;
  sort_by?: 'price' | 'rating' | 'recent';
}

export interface CreateGigDto {
  title: string;
  description: string;
  category: string;
  price: number;
  delivery_days: number;
}

export interface UpdateGigDto {
  title?: string;
  description?: string;
  category?: string;
  price?: number;
  delivery_days?: number;
  status?: GigStatus;
}
