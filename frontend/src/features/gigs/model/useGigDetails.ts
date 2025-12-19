import { useState, useEffect } from 'react';
import type { Gig } from '@/entities/gig';
import { getGigById } from '../api/gigsApi';

export function useGigDetails(gigId: number) {
  const [gig, setGig] = useState<Gig | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGig = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getGigById(gigId);
        setGig(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load gig');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGig();
  }, [gigId]);

  return { gig, isLoading, error };
}
