import { useState } from 'react';
import type { UpdateGigDto, Gig } from '@/entities/gig';
import { updateGig } from '../api/gigsApi';

interface UseUpdateGig {
  isSubmitting: boolean;
  error: string | null;
  submit: (id: number, payload: UpdateGigDto) => Promise<Gig>;
}

export function useUpdateGig(): UseUpdateGig {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (id: number, payload: UpdateGigDto) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const gig = await updateGig(id, payload);
      return gig;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to update gig');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, error, submit };
}
