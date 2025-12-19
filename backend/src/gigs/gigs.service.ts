import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../shared/database/database.service';
import { Gig, GigWithDetails } from './models/gig.entity';
import { CreateGigDto } from './models/create-gig.dto';
import { UpdateGigDto } from './models/update-gig.dto';
import { SearchGigDto } from './models/search-gig.dto';

@Injectable()
export class GigsService {
  constructor(private readonly db: DatabaseService) {}

  async createGig(freelancerId: number, dto: CreateGigDto): Promise<Gig> {
    const isActive = dto.is_active !== undefined ? dto.is_active : 1;
    const result = this.db.execute(
      `INSERT INTO gigs (freelancer_id, title, description, category, price, delivery_days, status, is_active)
       VALUES (?, ?, ?, ?, ?, ?, 'active', ?)`,
      [freelancerId, dto.title, dto.description, dto.category, dto.price, dto.delivery_days, isActive]
    );

    const gigId = result.lastInsertRowid as number;

    return this.getGigById(gigId);
  }

  async getGigById(id: number): Promise<GigWithDetails> {
    const gigs = this.db.query<Gig>(
      `SELECT g.*, u.full_name as freelancer_name, u.avatar_url as freelancer_avatar, u.rating as freelancer_rating
       FROM gigs g
       JOIN users u ON g.freelancer_id = u.id
       WHERE g.id = ?`,
      [id]
    );

    if (gigs.length === 0) {
      throw new NotFoundException('Gig not found');
    }

    const gig = gigs[0];

    const reviewsData = this.db.query<{ count: number; avg_rating: number }>(
      `SELECT COUNT(*) as count, AVG(rating) as avg_rating
       FROM reviews r
       JOIN orders o ON r.order_id = o.id
       WHERE o.gig_id = ?`,
      [id]
    );

    return {
      ...gig,
      skills: [],
      reviews_count: reviewsData[0]?.count || 0,
      average_rating: reviewsData[0]?.avg_rating || 0
    };
  }

  async getGigByIdWithAccess(id: number, userId: number, userRole: string): Promise<GigWithDetails> {
    const gig = await this.getGigById(id);

    const isOwner = gig.freelancer_id === userId;
    const isAdmin = userRole === 'admin';
    const isActive = gig.status === 'active' && gig.is_active === 1;

    if (!isActive && !isOwner && !isAdmin) {
      throw new NotFoundException('Gig not found or not available');
    }

    return gig;
  }

  async searchGigs(dto: SearchGigDto): Promise<Gig[]> {
    let query = `
      SELECT g.*, u.full_name as freelancer_name, u.avatar_url as freelancer_avatar, u.rating as freelancer_rating
      FROM gigs g
      JOIN users u ON g.freelancer_id = u.id
      WHERE g.status = 'active' AND g.is_active = 1
    `;
    
    const params: any[] = [];

    if (dto.query) {
      query += ` AND (g.title LIKE ? OR g.description LIKE ?)`;
      const searchPattern = `%${dto.query}%`;
      params.push(searchPattern, searchPattern);
    }

    if (dto.category) {
      query += ` AND g.category = ?`;
      params.push(dto.category);
    }

    if (dto.min_price !== undefined && dto.min_price !== null) {
      const minPrice = Number(dto.min_price);
      if (!isNaN(minPrice)) {
        query += ` AND g.price >= ?`;
        params.push(minPrice);
      }
    }

    if (dto.max_price !== undefined && dto.max_price !== null) {
      const maxPrice = Number(dto.max_price);
      if (!isNaN(maxPrice)) {
        query += ` AND g.price <= ?`;
        params.push(maxPrice);
      }
    }

    if (dto.sort_by === 'price') {
      query += ' ORDER BY g.price ASC';
    } else if (dto.sort_by === 'rating') {
      query += ' ORDER BY u.rating DESC';
    } else {
      query += ' ORDER BY g.created_at DESC';
    }

    try {
      return this.db.query<Gig>(query, params);
    } catch (error) {
      return [];
    }
  }

  async getFreelancerGigs(freelancerId: number): Promise<Gig[]> {
    return this.db.query<Gig>(
      `SELECT * FROM gigs WHERE freelancer_id = ? ORDER BY created_at DESC`,
      [freelancerId]
    );
  }

  async updateGig(id: number, freelancerId: number, dto: UpdateGigDto): Promise<Gig> {
    const gigs = this.db.query<Gig>('SELECT * FROM gigs WHERE id = ?', [id]);
    
    if (gigs.length === 0) {
      throw new NotFoundException('Gig not found');
    }

    if (gigs[0].freelancer_id !== freelancerId) {
      throw new ForbiddenException('You can only update your own gigs');
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (dto.title !== undefined) {
      updates.push('title = ?');
      values.push(dto.title);
    }
    if (dto.description !== undefined) {
      updates.push('description = ?');
      values.push(dto.description);
    }
    if (dto.category !== undefined) {
      updates.push('category = ?');
      values.push(dto.category);
    }
    if (dto.price !== undefined) {
      updates.push('price = ?');
      values.push(dto.price);
    }
    if (dto.delivery_days !== undefined) {
      updates.push('delivery_days = ?');
      values.push(dto.delivery_days);
    }
    if (dto.status !== undefined) {
      updates.push('status = ?');
      values.push(dto.status);
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      
      this.db.execute(
        `UPDATE gigs SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    if (dto.skills && dto.skills.length > 0) {
      this.db.execute('DELETE FROM gig_skills WHERE gig_id = ?', [id]);
      
      for (const skillName of dto.skills) {
        let skillResult = this.db.query<{ id: number }>(
          'SELECT id FROM skills WHERE name = ?',
          [skillName]
        );
        
        let skillId: number;
        if (skillResult.length === 0) {
          const insertResult = this.db.execute(
            'INSERT INTO skills (name) VALUES (?)',
            [skillName]
          );
          skillId = insertResult.lastInsertRowid as number;
        } else {
          skillId = skillResult[0].id;
        }

        this.db.execute(
          'INSERT INTO gig_skills (gig_id, skill_id) VALUES (?, ?)',
          [id, skillId]
        );
      }
    }

    return this.getGigById(id);
  }

  async deleteGig(id: number, freelancerId: number): Promise<void> {
    const gigs = this.db.query<Gig>('SELECT * FROM gigs WHERE id = ?', [id]);
    
    if (gigs.length === 0) {
      throw new NotFoundException('Gig not found');
    }

    if (gigs[0].freelancer_id !== freelancerId) {
      throw new ForbiddenException('You can only delete your own gigs');
    }

    this.db.execute('UPDATE gigs SET status = ? WHERE id = ?', ['deleted', id]);
  }
}
