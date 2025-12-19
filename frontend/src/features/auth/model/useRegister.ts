import { useState } from 'react';
import { register as apiRegister } from '../api/authApi';
import type { RegisterData } from '../api/authApi';
import type { User } from '@/entities/user';
import { setAuthUser } from '@/shared/model/auth-store';
import { extractApiErrorMessage } from '@/shared/api/error';

export function useRegister() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function register(data: RegisterData): Promise<User | null> {
    setIsLoading(true);
    setError(null);

    try {
      const user = await apiRegister(data);
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

  return { register, isLoading, error };
}
