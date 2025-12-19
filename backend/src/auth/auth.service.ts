import { Injectable, BadRequestException, UnauthorizedException } from '@nestjs/common';
import { DatabaseService } from '../shared/database/database.service';
import { RegisterDto } from './models/register.dto';
import { LoginDto } from './models/login.dto';
import { UserEntity } from './models/user.entity';
import * as bcrypt from 'bcryptjs';

interface UserRow {
  id: number;
  email: string;
  password: string;
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
export class AuthService {
  constructor(private readonly db: DatabaseService) {}

  async register(data: RegisterDto): Promise<UserEntity> {
    const existingUser = this.db.queryOne<UserRow>(
      'SELECT * FROM users WHERE email = ?',
      [data.email],
    );

    if (existingUser) {
      throw new BadRequestException('User already exists');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const result = this.db.execute(
      `INSERT INTO users (email, password, full_name, role, bio, hourly_rate, location) 
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        data.email,
        hashedPassword,
        data.full_name,
        data.role,
        data.bio || null,
        data.hourly_rate || null,
        data.location || null,
      ],
    );

    const user = this.db.queryOne<UserRow>(
      'SELECT * FROM users WHERE id = ?',
      [result.lastInsertRowid],
    );

    if (!user) {
      throw new BadRequestException('Failed to create user');
    }

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      bio: user.bio,
      avatar_url: user.avatar_url,
      hourly_rate: user.hourly_rate,
      location: user.location,
      joined_date: user.joined_date,
      balance: user.balance,
      total_earned: user.total_earned,
      rating: user.rating,
      completed_jobs: user.completed_jobs,
    };
  }

  async login({ email, password }: LoginDto): Promise<UserEntity> {
    const user = this.db.queryOne<UserRow>(
      'SELECT * FROM users WHERE email = ?',
      [email]
    );

    if (!user) {
      throw new UnauthorizedException('Invalid credentials');
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }

    return {
      id: user.id,
      email: user.email,
      full_name: user.full_name,
      role: user.role,
      bio: user.bio,
      avatar_url: user.avatar_url,
      hourly_rate: user.hourly_rate,
      location: user.location,
      joined_date: user.joined_date,
      balance: user.balance,
      total_earned: user.total_earned,
      rating: user.rating,
      completed_jobs: user.completed_jobs,
    };
  }
}
