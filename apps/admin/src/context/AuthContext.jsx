import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { get, post } from '../lib/api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const data = await get('/api/me');
      setUser(data.user);
    } catch (error) {
      if (error.status !== 401) {
        console.error(error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUser();
  }, []);

  const login = async (password) => {
    const data = await post('/api/login', { password });
    setUser(data.user);
    return data.user;
  };

  const logout = async () => {
    await post('/api/logout', {});
    setUser(null);
  };

  const value = useMemo(() => ({ user, loading, login, logout, refreshUser }), [user, loading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth must be used inside AuthProvider');
  }

  return context;
}
