import { useEffect, useState } from 'react';
import type { Proposal } from '@/entities/proposal';
import { getMyProposals } from '../api/proposalsApi';

interface MyProposalsState {
  proposals: Proposal[];
  isLoading: boolean;
  error: string | null;
}

export function useMyProposals(): MyProposalsState {
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProposals = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMyProposals();
        setProposals(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load proposals');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProposals();
  }, []);

  return { proposals, isLoading, error };
}
