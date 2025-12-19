import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { User } from '@/entities/user';
import { getCurrentUser, logout as apiLogout } from '@/features/auth';
import { subscribeAuth, setAuthUser, getAuthUser } from '@/shared/model/auth-store';

interface AuthContextValue {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  setUser: (user: User | null) => void;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => getAuthUser());
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeAuth((value) => setUser(value));

    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
        setAuthUser(currentUser);
      } catch {
        setUser(null);
        setAuthUser(null);
      } finally {
        setIsLoading(false);
      }
    }

    loadUser();

    return () => {
      unsubscribe();
    };
  }, []);

  async function logout() {
    await apiLogout();
    setUser(null);
    setAuthUser(null);
  }

  const value: AuthContextValue = {
    user,
    isLoading,
    isAuthenticated: !!user,
    setUser,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
}
