// src/stores/auth.store.ts
import { create } from 'zustand';
import { supabase, getUser } from '../lib/supabase';
import type { ASpaceSession, AuthState } from '../types/auth';

interface AuthStore extends AuthState {
  initialize: () => Promise<void>;
  logout: () => Promise<void>;
}

function sessionFromSupabase(
  user: { id: string; email?: string },
  token: string
): ASpaceSession {
  return {
    userId: user.id,
    email: user.email ?? '',
    accessToken: token,
    expiresAt: 0,
    isAdmiral: false,
  };
}

const DEFAULT_LOCAL_SESSION: ASpaceSession = {
  userId: 'amadeus-admiral',
  email: 'amdkn@fleet.hq',
  accessToken: 'dev-token-amadeus',
  expiresAt: Date.now() + 86400000000,
  isAdmiral: true,
};

export const useAuthStore = create<AuthStore>((set) => ({
  session: DEFAULT_LOCAL_SESSION,
  loading: false,
  error: null,

  initialize: async () => {
    try {
      const sessionPromise = supabase.auth.getSession();
      const timeoutPromise = new Promise<{ data: { session: null } }>((resolve) =>
        setTimeout(() => resolve({ data: { session: null } }), 1000)
      );

      const res = (await Promise.race([sessionPromise, timeoutPromise])) as {
        data: { session: any };
      };

      const session = res?.data?.session;
      if (session && session.user) {
        set({
          session: sessionFromSupabase(session.user, session.access_token),
          loading: false,
        });
      } else {
        set({ session: DEFAULT_LOCAL_SESSION, loading: false });
      }
    } catch {
      set({ session: DEFAULT_LOCAL_SESSION, loading: false });
    }

    supabase.auth.onAuthStateChange((_event, newSession) => {
      if (newSession && newSession.user) {
        set({ session: sessionFromSupabase(newSession.user, newSession.access_token), loading: false });
      } else {
        set({ session: DEFAULT_LOCAL_SESSION, loading: false });
      }
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ session: DEFAULT_LOCAL_SESSION });
  },
}));
