export interface Review {
  id: number;
  order_id: number;
  reviewer_id: number;
  reviewee_id: number;
  rating: number;
  comment: string;
  created_at: string;
  reviewer_name?: string;
  reviewer_avatar?: string;
  reviewee_name?: string;
}
