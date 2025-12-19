import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../shared/database/database.service';
import { Review } from './models/review.entity';
import { CreateReviewDto } from './models/create-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly db: DatabaseService) {}

  async createReview(reviewerId: number, dto: CreateReviewDto): Promise<Review> {
    const orders = this.db.query<{ buyer_id: number; seller_id: number; status: string }>(
      'SELECT buyer_id, seller_id, status FROM orders WHERE id = ?',
      [dto.order_id]
    );

    if (orders.length === 0) {
      throw new NotFoundException('Order not found');
    }

    const order = orders[0];
    if (order.status !== 'completed') {
      throw new BadRequestException('Can only review completed orders');
    }

    if (order.buyer_id !== reviewerId && order.seller_id !== reviewerId) {
      throw new BadRequestException('You can only review orders you are part of');
    }

    const existing = this.db.query(
      'SELECT id FROM reviews WHERE order_id = ? AND reviewer_id = ?',
      [dto.order_id, reviewerId]
    );

    if (existing.length > 0) {
      throw new BadRequestException('You have already reviewed this order');
    }

    const result = this.db.execute(
      `INSERT INTO reviews (order_id, reviewer_id, reviewee_id, rating, comment)
       VALUES (?, ?, ?, ?, ?)`,
      [dto.order_id, reviewerId, dto.reviewee_id, dto.rating, dto.comment]
    );

    this.updateUserRating(dto.reviewee_id);

    return this.getReviewById(result.lastInsertRowid as number);
  }

  async getReviewById(id: number): Promise<Review> {
    const reviews = this.db.query<Review>(
      `SELECT r.*,
              reviewer.full_name as reviewer_name,
              reviewer.avatar_url as reviewer_avatar,
              reviewee.full_name as reviewee_name
       FROM reviews r
       JOIN users reviewer ON r.reviewer_id = reviewer.id
       JOIN users reviewee ON r.reviewee_id = reviewee.id
       WHERE r.id = ?`,
      [id]
    );

    if (reviews.length === 0) {
      throw new NotFoundException('Review not found');
    }

    return reviews[0];
  }

  async getUserReviews(userId: number): Promise<Review[]> {
    return this.db.query<Review>(
      `SELECT r.*,
              reviewer.full_name as reviewer_name,
              reviewer.avatar_url as reviewer_avatar
       FROM reviews r
       JOIN users reviewer ON r.reviewer_id = reviewer.id
       WHERE r.reviewee_id = ?
       ORDER BY r.created_at DESC`,
      [userId]
    );
  }

  private updateUserRating(userId: number): void {
    const stats = this.db.query<{ avg_rating: number; review_count: number }>(
      `SELECT AVG(rating) as avg_rating, COUNT(*) as review_count
       FROM reviews
       WHERE reviewee_id = ?`,
      [userId]
    );

    if (stats.length > 0 && stats[0].avg_rating !== null) {
      this.db.execute(
        'UPDATE users SET rating = ? WHERE id = ?',
        [Math.round(stats[0].avg_rating * 10) / 10, userId]
      );
    }
  }
}
