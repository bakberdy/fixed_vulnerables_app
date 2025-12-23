export type ProjectStatus = 'open' | 'in_progress' | 'completed' | 'cancelled';

export interface Project {
  id: number;
  client_id: number;
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  duration_days: number;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
  client_name?: string;
  client_avatar?: string;
  skills?: string[];
  proposals_count?: number;
  has_submitted_proposal?: boolean;
}

export interface ProjectFilters {
  query?: string;
  min_budget?: number;
  max_budget?: number;
  status?: ProjectStatus;
  sort_by?: 'budget' | 'recent';
}

export interface CreateProjectDto {
  title: string;
  description: string;
  budget_min: number;
  budget_max: number;
  duration_days: number;
  skills: string[];
}

export interface UpdateProjectDto {
  title?: string;
  description?: string;
  budget_min?: number;
  budget_max?: number;
  duration_days?: number;
  status?: ProjectStatus;
  skills?: string[];
}
