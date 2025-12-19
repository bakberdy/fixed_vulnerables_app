export interface Order {
  id: number;
  gig_id: number | null;
  project_id: number | null;
  client_id: number;
  freelancer_id: number;
  amount: number;
  status: 'pending' | 'in_progress' | 'completed' | 'cancelled' | 'disputed';
  requirements: string | null;
  delivery_date: string | null;
  created_at: string;
  updated_at: string;
  gig_title?: string;
  project_title?: string;
  client_name?: string;
  freelancer_name?: string;
  client_avatar?: string;
  freelancer_avatar?: string;
}
