export interface UserEntity {
  id: number;
  email: string;
  full_name: string;
  role: 'client' | 'freelancer' | 'admin';
  bio?: string;
  avatar_url?: string;
  hourly_rate?: number;
  location?: string;
  joined_date: string;
  balance: number;
  total_earned: number;
  rating: number;
  completed_jobs: number;
}

export type User = UserEntity;

export interface UserProfile extends UserEntity {
  skills?: string[];
}

export interface UserStats {
  total_earned: number;
  completed_jobs: number;
  rating: number;
  active_orders: number;
  pending_proposals: number;
}
