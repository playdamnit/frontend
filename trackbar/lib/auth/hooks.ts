import { useEffect, useState } from 'react';
import { authAdapter, AuthUser } from './auth-adapter';

export function useAuth() {
  const [user, setUser] = useState<AuthUser | null | undefined>(undefined);

  useEffect(() => {
    // Get initial state
    authAdapter.getCurrentUser().then(setUser);

    // Subscribe to changes
    return authAdapter.subscribe((newUser) => {
      setUser(newUser);
    });
  }, []);

  return {
    user,
    isLoading: user === undefined,
    isAuthenticated: !!user,
  };
}
