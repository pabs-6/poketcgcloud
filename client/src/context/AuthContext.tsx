import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';
import { apiClient } from '@/services/apiClient';
import { authApi } from '@/services/api';
import type { User } from '@/types';

interface AuthContextValue {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  loginWithGoogle: (credential: string) => Promise<void>;
  register: (email: string, password: string, username: string) => Promise<void>;
  updateProfile: (data: { username?: string; avatar?: string | null }) => Promise<User>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = apiClient.getToken();
    if (token) {
      authApi
        .me()
        .then(setUser)
        .catch(() => apiClient.setToken(null))
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = useCallback(async (email: string, password: string) => {
    const { user, token } = await authApi.login({ email, password });
    apiClient.setToken(token);
    setUser(user);
  }, []);

  const loginWithGoogle = useCallback(async (credential: string) => {
    const { user, token } = await authApi.googleLogin(credential);
    apiClient.setToken(token);
    setUser(user);
  }, []);

  const register = useCallback(async (email: string, password: string, username: string) => {
    const { user, token } = await authApi.register({ email, password, username });
    apiClient.setToken(token);
    setUser(user);
  }, []);

  const updateProfile = useCallback(async (data: { username?: string; avatar?: string | null }) => {
    const updated = await authApi.updateProfile(data);
    setUser(updated);
    return updated;
  }, []);

  const logout = useCallback(() => {
    apiClient.setToken(null);
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithGoogle, register, updateProfile, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
