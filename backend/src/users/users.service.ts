import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../shared/database/database.service';
import { UserEntity, UserProfile, UserStats } from '../auth/models/user.entity';

interface UserRow {
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

@Injectable()
export class UsersService {
  constructor(private readonly db: DatabaseService) {}

  async getUserById(id: number): Promise<UserEntity> {
    const user = this.db.queryOne<UserRow>(
      'SELECT * FROM users WHERE id = ?',
      [id],
    );

    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  async getUserProfile(userId: number): Promise<UserProfile> {
    const user = await this.getUserById(userId);

    const skills = this.db.query<{ name: string }>(
      `SELECT s.name FROM skills s
       INNER JOIN user_skills us ON s.id = us.skill_id
       WHERE us.user_id = ?`,
      [userId],
    );

    return {
      ...user,
      skills: skills.map(s => s.name),
    };
  }

  async updateProfile(userId: number, data: Partial<UserEntity>): Promise<UserEntity> {
    const updates: string[] = [];
    const values: any[] = [];

    if (data.full_name) {
      updates.push('full_name = ?');
      values.push(data.full_name);
    }
    if (data.bio !== undefined) {
      updates.push('bio = ?');
      values.push(data.bio);
    }
    if (data.avatar_url !== undefined) {
      updates.push('avatar_url = ?');
      values.push(data.avatar_url);
    }
    if (data.hourly_rate !== undefined) {
      updates.push('hourly_rate = ?');
      values.push(data.hourly_rate);
    }
    if (data.location !== undefined) {
      updates.push('location = ?');
      values.push(data.location);
    }

    if (updates.length === 0) {
      return this.getUserById(userId);
    }

    values.push(userId);
    this.db.execute(
      `UPDATE users SET ${updates.join(', ')} WHERE id = ?`,
      values,
    );

    return this.getUserById(userId);
  }

  async getUserStats(userId: number): Promise<UserStats> {
    const user = await this.getUserById(userId);

    const activeOrdersCount = this.db.queryOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM orders 
       WHERE (freelancer_id = ? OR client_id = ?) 
       AND status IN ('pending', 'in_progress', 'delivered')`,
      [userId, userId],
    );

    const pendingProposalsCount = this.db.queryOne<{ count: number }>(
      `SELECT COUNT(*) as count FROM proposals 
       WHERE freelancer_id = ? AND status = 'pending'`,
      [userId],
    );

    return {
      total_earned: user.total_earned,
      completed_jobs: user.completed_jobs,
      rating: user.rating,
      active_orders: activeOrdersCount?.count || 0,
      pending_proposals: pendingProposalsCount?.count || 0,
    };
  }

  async getUsersByRole(role: 'client' | 'freelancer' | 'admin'): Promise<UserEntity[]> {
    return this.db.query<UserRow>(
      'SELECT * FROM users WHERE role = ?',
      [role],
    );
  }
}
