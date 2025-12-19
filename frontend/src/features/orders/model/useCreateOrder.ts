import { useState } from 'react';
import type { CreateOrderDto, Order } from '@/entities/order';
import { createOrder } from '../api/ordersApi';

interface UseCreateOrder {
  isSubmitting: boolean;
  error: string | null;
  submit: (payload: CreateOrderDto) => Promise<Order>;
}

export function useCreateOrder(): UseCreateOrder {
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const submit = async (payload: CreateOrderDto) => {
    setIsSubmitting(true);
    setError(null);
    try {
      const order = await createOrder(payload);
      return order;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create order');
      throw err;
    } finally {
      setIsSubmitting(false);
    }
  };

  return { isSubmitting, error, submit };
}
