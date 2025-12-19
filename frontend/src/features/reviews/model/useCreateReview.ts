import { useState } from 'react';
import type { CreateReviewDto, Review } from '@/entities/review';
import { createReview } from '../api/reviewsApi';

interface UseCreateReviewResult {
  isSubmitting: boolean;
  error: string | null;
  submit: (payload: CreateReviewDto) => Promise<Review>;
}

export function useCreateReview(): UseCreateReviewResult {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (payload: CreateReviewDto) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const review = await createReview(payload);
      return review;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to submit review');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, error, submit };
}
