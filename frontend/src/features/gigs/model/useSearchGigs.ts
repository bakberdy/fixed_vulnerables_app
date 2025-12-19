import { useState, useEffect } from 'react';
import type { Gig, GigFilters } from '@/entities/gig';
import { searchGigs } from '../api/gigsApi';

export function useSearchGigs(filters: GigFilters) {
  const [gigs, setGigs] = useState<Gig[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchGigs = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await searchGigs(filters);
        setGigs(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load gigs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchGigs();
  }, [filters]);

  return { gigs, isLoading, error };
}
