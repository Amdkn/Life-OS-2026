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

export const useAuthStore = create<AuthStore>((set) => ({
  session: null,
  loading: true,
  error: null,

  initialize: async () => {
    set({ loading: true });

    const { data: { session } } = await supabase.auth.getSession();
    if (session && session.user) {
      set({
        session: sessionFromSupabase(session.user, session.access_token),
        loading: false,
      });
    } else {
      set({ session: null, loading: false });
    }

    supabase.auth.onAuthStateChange((_event, newSession) => {
      if (newSession && newSession.user) {
        set({ session: sessionFromSupabase(newSession.user, newSession.access_token) });
      } else {
        set({ session: null });
      }
    });
  },

  logout: async () => {
    await supabase.auth.signOut();
    set({ session: null });
  },
}));
