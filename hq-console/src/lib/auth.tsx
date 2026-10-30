import React, { createContext, useContext, useState, useEffect } from 'react';
import { apiLogin, UserAccount } from './api';

interface AuthUser {
  email: string;
  role: UserAccount['role'];
  name: string | null;
  facility: string | null;
}

interface AuthContextType {
  token: string | null;
  user: AuthUser | null;
  login: (email: string, pw: string) => Promise<{ ok: boolean; error?: string }>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const TOKEN_KEY = 'nia_hq_auth_token';
const USER_KEY = 'nia_hq_auth_user';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null);
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    try {
      const savedToken = localStorage.getItem(TOKEN_KEY);
      const savedUser = localStorage.getItem(USER_KEY);
      if (savedToken && savedUser) {
        setToken(savedToken);
        setUser(JSON.parse(savedUser));
      }
    } catch {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(USER_KEY);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const login = async (email: string, pw: string) => {
    try {
      const res = await apiLogin(email, pw);
      if (res.ok && res.token && res.role) {
        const authUser: AuthUser = {
          email: res.email || email,
          role: res.role,
          name: res.name || null,
          facility: res.facility || null,
        };
        setToken(res.token);
        setUser(authUser);
        localStorage.setItem(TOKEN_KEY, res.token);
        localStorage.setItem(USER_KEY, JSON.stringify(authUser));
        return { ok: true };
      }
      return { ok: false, error: res.error || 'Invalid credentials' };
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : 'Login failed';
      return { ok: false, error: message };
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  };

  return (
    <AuthContext.Provider value={{ token, user, login, logout, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
