import { useEffect, useState } from 'react';
import type { Order } from '@/entities/order';
import { getMyOrders } from '../api/ordersApi';

interface MyOrdersState {
  orders: Order[];
  isLoading: boolean;
  error: string | null;
}

export function useMyOrders(): MyOrdersState {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchOrders = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const data = await getMyOrders();
        setOrders(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to load orders');
      } finally {
        setIsLoading(false);
      }
    };

    fetchOrders();
  }, []);

  return { orders, isLoading, error };
}
