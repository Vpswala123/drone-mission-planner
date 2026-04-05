import { useState } from 'react';
import { AuthContext } from './auth-context';
import { AUTH_ENABLED, STORAGE_KEYS } from '../config';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const token = localStorage.getItem(STORAGE_KEYS.token);
    const storedUser = localStorage.getItem(STORAGE_KEYS.user);

    if (token && storedUser) {
      try {
        return JSON.parse(storedUser);
      } catch {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    }

    return null;
  });

  const login = (token, userData) => {
    localStorage.setItem(STORAGE_KEYS.token, token);
    localStorage.setItem(STORAGE_KEYS.user, JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem(STORAGE_KEYS.token);
    localStorage.removeItem(STORAGE_KEYS.user);
    setUser(null);
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: !!user,
    loading: false,
    authEnabled: AUTH_ENABLED,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
