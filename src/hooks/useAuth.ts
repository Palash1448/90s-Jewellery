import { useState, useEffect } from 'react';
import { subscribeToAuthChanges, type AdminUser, logoutAdmin } from '../firebase/auth';

export function useAuth() {
  const [user, setUser] = useState<AdminUser | null>(() => {
    const local = localStorage.getItem('kj_admin_mock_session');
    if (local) {
      try {
        return JSON.parse(local);
      } catch {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const unsubscribe = subscribeToAuthChanges((adminUser) => {
      setUser(adminUser);
      setLoading(false);
    });

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  const logout = async () => {
    await logoutAdmin();
    setUser(null);
  };

  return {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    loading,
    logout,
  };
}
