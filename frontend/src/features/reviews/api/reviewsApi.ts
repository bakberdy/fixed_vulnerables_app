import { apiClient } from '@/shared/api/client';
import type { CreateReviewDto, Review } from '@/entities/review';

export async function createReview(dto: CreateReviewDto): Promise<Review> {
  const { data } = await apiClient.post('/reviews', dto);
  return data;
}
