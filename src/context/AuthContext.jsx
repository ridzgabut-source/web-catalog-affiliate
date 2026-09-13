import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { authApi } from '../api/authApi.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Initialize auth state on mount
  useEffect(() => {
    async function checkAuth() {
      try {
        const res = await authApi.getMe();
        if (res.success && res.data) {
          setUser(res.data);
        } else {
          setUser(null);
        }
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const login = useCallback(async (credentials) => {
    const res = await authApi.login(credentials);
    if (res.success && res.data?.user) {
      setUser(res.data.user);
    }
    return res;
  }, []);

  const logout = useCallback(async () => {
    await authApi.logout();
    setUser(null);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: Boolean(user),
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
