export type UserRole = 'client' | 'freelancer' | 'admin';

export interface User {
  id: number;
  email: string;
  full_name: string;
  role: UserRole;
  bio?: string;
  avatar_url?: string;
  hourly_rate?: number;
  location?: string;
  balance: number;
  total_earned: number;
  rating: number;
  completed_jobs: number;
  joined_date: string;
}

export interface UserProfile extends User {
  skills?: string[];
}

export interface UserStats {
  active_orders: number;
  total_orders: number;
  pending_proposals: number;
  total_proposals: number;
  total_earnings: number;
  average_rating: number;
  total_earned: number;
  completed_jobs: number;
  rating: number;
}

export interface ApiError {
  statusCode: number;
  message: string;
  timestamp: string;
}

export type { LoginDto, RegisterDto, RegisterRole } from './auth'
