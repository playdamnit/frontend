import { useState, useEffect } from 'react';
import { authAdapter, AuthUser } from '@/lib/auth/auth-adapter';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial user state
    authAdapter.getCurrentUser().then(setUser).finally(() => setLoading(false));

    // Subscribe to changes
    const unsubscribe = authAdapter.subscribe((user) => {
      setUser(user);
    });

    return unsubscribe;
  }, []);

  return {
    user,
    loading,
    signOut: () => authAdapter.signOut(),
  };
}
