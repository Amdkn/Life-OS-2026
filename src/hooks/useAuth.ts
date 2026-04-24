// src/hooks/useAuth.ts
import { supabase } from '../lib/supabase';
import { useAuthStore } from '../stores/auth.store';

export function useAuth() {
  const { session, loading, error, logout } = useAuthStore();
  
  const signUp = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({ email, password });
    if (error) throw error;
    return data;
  };

  const signIn = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  return {
    session,
    loading,
    error,
    isAuthenticated: !!session,
    userId: session?.userId ?? null,
    email: session?.email ?? null,
    logout,
    signUp,
    signIn
  };
}

export function useUserId(): string | null {
  return useAuthStore((s) => s.session?.userId ?? null);
}
