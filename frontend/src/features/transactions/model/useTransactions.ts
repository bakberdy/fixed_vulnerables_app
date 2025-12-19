import { useEffect, useState } from 'react';
import type { Transaction } from '@/entities/transaction';
import { getTransactions } from '../api/transactionsApi';

interface UseTransactionsState {
  transactions: Transaction[];
  isLoading: boolean;
  error: string | null;
}

export function useTransactions(): UseTransactionsState {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getTransactions();
        setTransactions(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load transactions');
      } finally {
        setIsLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  return { transactions, isLoading, error };
}
