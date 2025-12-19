import { useState } from 'react';
import { login as apiLogin } from '../api/authApi';
import type { LoginData } from '../api/authApi';
import type { User } from '@/entities/user';
import { setAuthUser } from '@/shared/model/auth-store';
import { extractApiErrorMessage } from '@/shared/api/error';

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function login(data: LoginData): Promise<User | null> {
    setIsLoading(true);
    setError(null);

    try {
      const user = await apiLogin(data);
      setAuthUser(user);
      return user;
    } catch (err: unknown) {
      const message = extractApiErrorMessage(err);
      setError(message);
      return null;
    } finally {
      setIsLoading(false);
    }
  }

  return { login, isLoading, error };
}
