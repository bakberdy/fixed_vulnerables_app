export interface Project {
  id: number;
  client_id: number;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  duration_days: number;
  status: 'open' | 'in_progress' | 'completed' | 'cancelled';
  created_at: string;
  updated_at: string;
  client_name?: string;
  client_avatar?: string;
}

export interface ProjectWithDetails extends Project {
  skills: string[];
  proposals_count: number;
  has_submitted_proposal?: boolean;
}
