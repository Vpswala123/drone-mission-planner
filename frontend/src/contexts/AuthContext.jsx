import { useState } from 'react';
import { AuthContext } from './auth-context';
import { AUTH_ENABLED, STORAGE_KEYS } from '../config';

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (!AUTH_ENABLED) {
      return {
        id: 'guest-user',
        name: 'Guest Pilot',
        email: 'guest@local.demo',
      };
    }

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
    setUser(
      AUTH_ENABLED
        ? null
        : {
            id: 'guest-user',
            name: 'Guest Pilot',
            email: 'guest@local.demo',
          }
    );
  };

  const value = {
    user,
    login,
    logout,
    isAuthenticated: AUTH_ENABLED ? !!user : true,
    loading: false,
    authEnabled: AUTH_ENABLED,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}
