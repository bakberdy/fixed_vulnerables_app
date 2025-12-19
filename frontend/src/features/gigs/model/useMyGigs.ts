import { useEffect, useState } from 'react';
import type { Gig } from '@/entities/gig';
import { getMyGigs } from '../api/gigsApi';

interface MyGigsState {
  gigs: Gig[];
  isLoading: boolean;
  error: string | null;
}

export function useMyGigs(): MyGigsState {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGigs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMyGigs();
        setGigs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load gigs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGigs();
  }, []);

  return { gigs, isLoading, error };
}
