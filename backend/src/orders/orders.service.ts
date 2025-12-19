import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { DatabaseService } from '../shared/database/database.service';
import { Order } from './models/order.entity';
import { CreateOrderDto } from './models/create-order.dto';
import { UpdateOrderDto } from './models/update-order.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly db: DatabaseService) {}

  async createOrder(buyerId: number, dto: CreateOrderDto): Promise<Order> {
    if (!dto.gig_id && !dto.project_id) {
      throw new BadRequestException('Either gig_id or project_id must be provided');
    }

    if (dto.gig_id && dto.project_id) {
      throw new BadRequestException('Cannot order both gig and project');
    }

    if (buyerId === dto.seller_id) {
      throw new BadRequestException('Cannot create order with yourself');
    }

    const result = this.db.execute(
      `INSERT INTO orders (gig_id, project_id, client_id, freelancer_id, amount, requirements, delivery_date, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'pending')`,
      [dto.gig_id || null, dto.project_id || null, buyerId, dto.seller_id, dto.amount, dto.requirements || null, dto.delivery_date || null]
    );

    return this.getOrderById(result.lastInsertRowid as number);
  }

  async getOrderById(id: number): Promise<Order> {
    const orders = this.db.query<Order>(
      `SELECT o.*, o.client_id as buyer_id, o.freelancer_id as seller_id,
              g.title as gig_title,
              p.title as project_title,
              buyer.full_name as buyer_name,
              buyer.avatar_url as buyer_avatar,
              seller.full_name as seller_name,
              seller.avatar_url as seller_avatar
       FROM orders o
       LEFT JOIN gigs g ON o.gig_id = g.id
       LEFT JOIN projects p ON o.project_id = p.id
       JOIN users buyer ON o.client_id = buyer.id
       JOIN users seller ON o.freelancer_id = seller.id
       WHERE o.id = ?`,
      [id]
    );

    if (orders.length === 0) {
      throw new NotFoundException('Order not found');
    }

    return orders[0];
  }

  async getBuyerOrders(buyerId: number): Promise<Order[]> {
    return this.db.query<Order>(
      `SELECT o.*, o.client_id as buyer_id, o.freelancer_id as seller_id,
              g.title as gig_title,
              p.title as project_title,
              seller.full_name as seller_name,
              seller.avatar_url as seller_avatar
       FROM orders o
       LEFT JOIN gigs g ON o.gig_id = g.id
       LEFT JOIN projects p ON o.project_id = p.id
       JOIN users seller ON o.freelancer_id = seller.id
       WHERE o.client_id = ?
       ORDER BY o.created_at DESC`,
      [buyerId]
    );
  }

  async getSellerOrders(sellerId: number): Promise<Order[]> {
    return this.db.query<Order>(
      `SELECT o.*, o.client_id as buyer_id, o.freelancer_id as seller_id,
              g.title as gig_title,
              p.title as project_title,
              buyer.full_name as buyer_name,
              buyer.avatar_url as buyer_avatar
       FROM orders o
       LEFT JOIN gigs g ON o.gig_id = g.id
       LEFT JOIN projects p ON o.project_id = p.id
       JOIN users buyer ON o.client_id = buyer.id
       WHERE o.freelancer_id = ?
       ORDER BY o.created_at DESC`,
      [sellerId]
    );
  }

  async updateOrder(id: number, userId: number, dto: UpdateOrderDto): Promise<Order> {
    const orders = this.db.query<Order>('SELECT * FROM orders WHERE id = ?', [id]);
    
    if (orders.length === 0) {
      throw new NotFoundException('Order not found');
    }

    const order = orders[0];
    if (order.client_id !== userId && order.freelancer_id !== userId) {
      throw new ForbiddenException('You can only update your own orders');
    }

    const updates: string[] = [];
    const values: any[] = [];

    if (dto.status !== undefined) {
      updates.push('status = ?');
      values.push(dto.status);
    }
    if (dto.requirements !== undefined) {
      updates.push('requirements = ?');
      values.push(dto.requirements);
    }
    if (dto.delivery_date !== undefined) {
      updates.push('delivery_date = ?');
      values.push(dto.delivery_date);
    }

    if (updates.length > 0) {
      updates.push('updated_at = CURRENT_TIMESTAMP');
      values.push(id);
      
      this.db.execute(
        `UPDATE orders SET ${updates.join(', ')} WHERE id = ?`,
        values
      );
    }

    return this.getOrderById(id);
  }

  async cancelOrder(id: number, userId: number): Promise<void> {
    const orders = this.db.query<Order>('SELECT * FROM orders WHERE id = ?', [id]);
    
    if (orders.length === 0) {
      throw new NotFoundException('Order not found');
    }

    const order = orders[0];
    if (order.client_id !== userId && order.freelancer_id !== userId) {
      throw new ForbiddenException('You can only cancel your own orders');
    }

    if (order.status !== 'pending') {
      throw new BadRequestException('Can only cancel pending orders');
    }

    this.db.execute('UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?', ['cancelled', id]);
  }
}
