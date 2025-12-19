export interface Gig {
  id: number;
  freelancer_id: number;
  title: string;
  description: string;
  category: string;
  price: number;
  delivery_days: number;
  status: 'active' | 'paused' | 'deleted';
  is_active: number;
  created_at: string;
  updated_at: string;
  freelancer_name?: string;
  freelancer_avatar?: string;
  freelancer_rating?: number;
}

export interface GigWithDetails extends Gig {
  skills: string[];
  reviews_count: number;
  average_rating: number;
}
