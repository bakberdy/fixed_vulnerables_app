export type TransactionType = 'credit' | 'debit';
export type TransactionStatus = 'pending' | 'completed' | 'failed';

export interface Transaction {
  id: number;
  amount: number;
  type: TransactionType;
  description: string;
  status: TransactionStatus;
  created_at: string;
}
