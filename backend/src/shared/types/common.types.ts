export interface User {
  id: number;
  email: string;
  password: string;
  role: 'user' | 'admin';
  created_at: string;
}

export interface Task {
  id: number;
  user_id: number;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  created_at: string;
}

export interface Comment {
  id: number;
  task_id: number;
  user_id: number;
  content: string;
  created_at: string;
}

export interface Message {
  id: number;
  sender_id: number;
  receiver_id: number;
  subject: string;
  body: string;
  created_at: string;
}

export interface File {
  id: number;
  task_id: number;
  user_id: number;
  filename: string;
  path: string;
  created_at: string;
}
