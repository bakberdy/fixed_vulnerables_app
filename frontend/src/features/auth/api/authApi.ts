import { apiClient } from '@/shared/api/client';
import type { User } from '@/entities/user';
import type { LoginDto, RegisterDto } from '@/shared/types';

export type RegisterData = RegisterDto;
export type LoginData = LoginDto;

export async function register(data: RegisterDto): Promise<User> {
  const response = await apiClient.post('/auth/register', data);
  return response.data;
}

export async function login(data: LoginDto): Promise<User> {
  const response = await apiClient.post('/auth/login', data);
  return response.data;
}

export async function logout(): Promise<void> {
  await apiClient.post('/auth/logout');
}

export async function getCurrentUser(): Promise<User> {
  const response = await apiClient.get('/users/me');
  return response.data;
}
