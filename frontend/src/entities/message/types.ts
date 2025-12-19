export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  subject: string;
  body: string;
  read: boolean;
  created_at: string;
  sender_name?: string;
  sender_avatar?: string;
  receiver_name?: string;
  receiver_avatar?: string;
}

export interface CreateMessageDto {
  receiver_id: number;
  subject: string;
  body: string;
}
