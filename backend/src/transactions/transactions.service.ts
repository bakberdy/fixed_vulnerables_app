import { Injectable, NotFoundException } from '@nestjs/common';
import { DatabaseService } from '../shared/database/database.service';
import { Transaction } from './models/transaction.entity';
import { CreateTransactionDto } from './models/create-transaction.dto';

@Injectable()
export class TransactionsService {
  constructor(private readonly db: DatabaseService) {}

  async createTransaction(dto: CreateTransactionDto): Promise<Transaction> {
    const result = this.db.execute(
      `INSERT INTO transactions (user_id, order_id, amount, type, status, description)
       VALUES (?, ?, ?, ?, 'completed', ?)`,
      [dto.user_id, dto.order_id || null, dto.amount, dto.type, dto.description || null]
    );

    if (dto.type === 'payment' || dto.type === 'withdrawal') {
      this.db.execute(
        'UPDATE users SET balance = balance - ? WHERE id = ?',
        [dto.amount, dto.user_id]
      );
    } else if (dto.type === 'deposit' || dto.type === 'refund') {
      this.db.execute(
        'UPDATE users SET balance = balance + ? WHERE id = ?',
        [dto.amount, dto.user_id]
      );
    }

    return this.getTransactionById(result.lastInsertRowid as number);
  }

  async getTransactionById(id: number): Promise<Transaction> {
    const transactions = this.db.query<Transaction>(
      `SELECT t.*,
              CASE 
                WHEN o.gig_id IS NOT NULL THEN 'Gig: ' || g.title
                WHEN o.project_id IS NOT NULL THEN 'Project: ' || p.title
                ELSE NULL
              END as order_details
       FROM transactions t
       LEFT JOIN orders o ON t.order_id = o.id
       LEFT JOIN gigs g ON o.gig_id = g.id
       LEFT JOIN projects p ON o.project_id = p.id
       WHERE t.id = ?`,
      [id]
    );

    if (transactions.length === 0) {
      throw new NotFoundException('Transaction not found');
    }

    return transactions[0];
  }

  async getUserTransactions(userId: number): Promise<Transaction[]> {
    return this.db.query<Transaction>(
      `SELECT t.*,
              CASE 
                WHEN o.gig_id IS NOT NULL THEN 'Gig: ' || g.title
                WHEN o.project_id IS NOT NULL THEN 'Project: ' || p.title
                ELSE NULL
              END as order_details
       FROM transactions t
       LEFT JOIN orders o ON t.order_id = o.id
       LEFT JOIN gigs g ON o.gig_id = g.id
       LEFT JOIN projects p ON o.project_id = p.id
       WHERE t.from_user_id = ? OR t.to_user_id = ?
       ORDER BY t.created_at DESC`,
      [userId, userId]
    );
  }

  async getUserBalance(userId: number): Promise<{ balance: number; total_earned: number }> {
    const result = this.db.query<{ balance: number; total_earned: number }>(
      'SELECT balance, total_earned FROM users WHERE id = ?',
      [userId]
    );

    if (result.length === 0) {
      throw new NotFoundException('User not found');
    }

    return result[0];
  }
}
