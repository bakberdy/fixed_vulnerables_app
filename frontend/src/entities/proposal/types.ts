export type ProposalStatus = 'pending' | 'accepted' | 'rejected';

export interface Proposal {
  id: number;
  project_id: number;
  freelancer_id: number;
  cover_letter: string;
  proposed_amount: number;
  delivery_days: number;
  status: ProposalStatus;
  created_at: string;
  updated_at: string;
  freelancer_name?: string;
  freelancer_avatar?: string;
  freelancer_rating?: number;
  project_title?: string;
}

export interface CreateProposalDto {
  project_id: number;
  cover_letter: string;
  proposed_amount: number;
  delivery_days: number;
}

export interface UpdateProposalDto {
  cover_letter?: string;
  proposed_amount?: number;
  delivery_days?: number;
  status?: ProposalStatus;
}
