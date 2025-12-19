import { apiClient } from '@/shared/api/client';
import type { Transaction } from '@/entities/transaction';

export async function getTransactions(): Promise<Transaction[]> {
  const { data } = await apiClient.get('/transactions');
  return data;
}
