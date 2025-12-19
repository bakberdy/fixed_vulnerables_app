import { apiClient } from '@/shared/api/client';
import type { CreateOrderDto, Order } from '@/entities/order';

export async function getMyOrders(): Promise<Order[]> {
  const [purchases, sales] = await Promise.all([
    apiClient.get<Order[]>('/orders/purchases').then((res) => res.data),
    apiClient.get<Order[]>('/orders/sales').then((res) => res.data),
  ]);

  const merged = [...purchases, ...sales];
  const uniqueById = new Map<number, Order>();
  merged.forEach((order) => {
    uniqueById.set(order.id, order);
  });

  return Array.from(uniqueById.values()).sort((a, b) => (
    new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  ));
}

export async function createOrder(dto: CreateOrderDto): Promise<Order> {
  const { data } = await apiClient.post('/orders', dto);
  return data;
}
