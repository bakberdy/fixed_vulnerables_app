import { useState } from 'react';
import type { CreateGigDto, Gig } from '@/entities/gig';
import { createGig } from '../api/gigsApi';

interface UseCreateGig {
  isSubmitting: boolean;
  error: string | null;
  submit: (payload: CreateGigDto) => Promise<Gig>;
}

export function useCreateGig(): UseCreateGig {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (payload: CreateGigDto) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const gig = await createGig(payload);
      return gig;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create gig');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, error, submit };
}
