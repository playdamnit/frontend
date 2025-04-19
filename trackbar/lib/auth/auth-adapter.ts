import { createClient } from '@/utils/supabase/client';

export interface AuthUser {
  id: string;
  email?: string;
  username?: string;
  fullName?: string;
  avatarUrl?: string;
}

class AuthAdapter {
  private static instance: AuthAdapter;
  private supabase = createClient();
  private listeners: Set<(user: AuthUser | null) => void> = new Set();
  private cachedUser: AuthUser | null | undefined;
  private fetchPromise: Promise<AuthUser | null> | null = null;

  private constructor() {
    // Initialize auth state listener
    this.supabase.auth.onAuthStateChange((event, session) => {
      if (session) {
        const user: AuthUser = {
          id: session.user.id,
          email: session.user.email ?? undefined,
          username: session.user.user_metadata.username,
          fullName: session.user.user_metadata.full_name,
          avatarUrl: session.user.user_metadata.avatar_url,
        };
        this.cachedUser = user;
        this.notifyListeners(user);
      } else {
        this.cachedUser = null;
        this.notifyListeners(null);
      }
    });
  }

  public static getInstance(): AuthAdapter {
    if (!AuthAdapter.instance) {
      AuthAdapter.instance = new AuthAdapter();
    }
    return AuthAdapter.instance;
  }

  async getCurrentUser(): Promise<AuthUser | null> {
    // Return cached user if available
    if (this.cachedUser !== undefined) {
      return this.cachedUser;
    }

    // If there's already a fetch in progress, return its promise
    if (this.fetchPromise) {
      return this.fetchPromise;
    }

    // Create new fetch promise
    this.fetchPromise = (async () => {
      try {
        const { data: { user } } = await this.supabase.auth.getUser();
        if (!user) {
          this.cachedUser = null;
          return null;
        }

        const authUser: AuthUser = {
          id: user.id,
          email: user.email ?? undefined,
          username: user.user_metadata.username,
          fullName: user.user_metadata.full_name,
          avatarUrl: user.user_metadata.avatar_url,
        };
        this.cachedUser = authUser;
        return authUser;
      } finally {
        this.fetchPromise = null;
      }
    })();

    return this.fetchPromise;
  }

  subscribe(callback: (user: AuthUser | null) => void) {
    this.listeners.add(callback);
    // Return unsubscribe function
    return () => this.listeners.delete(callback);
  }

  private notifyListeners(user: AuthUser | null) {
    this.listeners.forEach(listener => listener(user));
  }

  async signOut() {
    this.cachedUser = null;
    await this.supabase.auth.signOut();
  }
}

export const authAdapter = AuthAdapter.getInstance();
