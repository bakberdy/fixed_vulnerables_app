import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { DatabaseService } from '../shared/database/database.service';
import { Message } from './models/message.entity';
import { CreateMessageDto } from './models/create-message.dto';

@Injectable()
export class MessagesService {
  constructor(private readonly db: DatabaseService) {}

  async sendMessage(senderId: number, dto: CreateMessageDto): Promise<Message> {
    const result = this.db.execute(
      `INSERT INTO messages (sender_id, receiver_id, subject, body, read)
       VALUES (?, ?, ?, ?, 0)`,
      [senderId, dto.receiver_id, dto.subject, dto.body]
    );

    return this.getMessageById(result.lastInsertRowid as number);
  }

  async getMessageById(id: number): Promise<Message> {
    const messages = this.db.query<Message>(
      `SELECT m.*,
              sender.full_name as sender_name,
              sender.avatar_url as sender_avatar,
              receiver.full_name as receiver_name,
              receiver.avatar_url as receiver_avatar
       FROM messages m
       JOIN users sender ON m.sender_id = sender.id
       JOIN users receiver ON m.receiver_id = receiver.id
       WHERE m.id = ?`,
      [id]
    );

    if (messages.length === 0) {
      throw new NotFoundException('Message not found');
    }

    return messages[0];
  }

  async getInbox(userId: number): Promise<Message[]> {
    return this.db.query<Message>(
      `SELECT m.*,
              sender.full_name as sender_name,
              sender.avatar_url as sender_avatar
       FROM messages m
       JOIN users sender ON m.sender_id = sender.id
       WHERE m.receiver_id = ?
       ORDER BY m.created_at DESC`,
      [userId]
    );
  }

  async getSent(userId: number): Promise<Message[]> {
    return this.db.query<Message>(
      `SELECT m.*,
              receiver.full_name as receiver_name,
              receiver.avatar_url as receiver_avatar
       FROM messages m
       JOIN users receiver ON m.receiver_id = receiver.id
       WHERE m.sender_id = ?
       ORDER BY m.created_at DESC`,
      [userId]
    );
  }

  async markAsRead(id: number, userId: number): Promise<void> {
    const messages = this.db.query<Message>('SELECT * FROM messages WHERE id = ?', [id]);
    
    if (messages.length === 0) {
      throw new NotFoundException('Message not found');
    }

    if (messages[0].receiver_id !== userId) {
      throw new ForbiddenException('You can only mark your own messages as read');
    }

    this.db.execute('UPDATE messages SET read = 1 WHERE id = ?', [id]);
  }

  async deleteMessage(id: number, userId: number): Promise<void> {
    const messages = this.db.query<Message>('SELECT * FROM messages WHERE id = ?', [id]);
    
    if (messages.length === 0) {
      throw new NotFoundException('Message not found');
    }

    if (messages[0].sender_id !== userId && messages[0].receiver_id !== userId) {
      throw new ForbiddenException('You can only delete your own messages');
    }

    this.db.execute('DELETE FROM messages WHERE id = ?', [id]);
  }
}
