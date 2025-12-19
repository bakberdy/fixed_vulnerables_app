export interface Transaction {
  id: number;
  user_id: number;
  order_id: number | null;
  amount: number;
  type: 'payment' | 'refund' | 'withdrawal' | 'deposit';
  status: 'pending' | 'completed' | 'failed';
  description: string | null;
  created_at: string;
  order_details?: string;
}
