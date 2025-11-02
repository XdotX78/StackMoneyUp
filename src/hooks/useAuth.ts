/**
 * Custom React hook for authentication state management
 * Based on best practices from Next.js + Supabase examples
 */

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import type { User, Session } from '@supabase/supabase-js';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

export function useAuth() {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null,
  });
  const router = useRouter();

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session }, error }) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: error ? new Error(error.message) : null,
      });
    });

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      setState({
        user: session?.user ?? null,
        session,
        loading: false,
        error: null,
      });

      // Handle specific events
      if (_event === 'SIGNED_OUT') {
        router.refresh();
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return {
    ...state,
    signOut: async () => {
      const { error } = await supabase.auth.signOut();
      if (error) {
        setState((prev) => ({ ...prev, error: new Error(error.message) }));
        throw error;
      }
    },
    refreshSession: async () => {
      const { data: { session }, error } = await supabase.auth.refreshSession();
      if (error) {
        setState((prev) => ({ ...prev, error: new Error(error.message) }));
        return null;
      }
      setState((prev) => ({
        ...prev,
        user: session?.user ?? null,
        session,
      }));
      return session;
    },
  };
}

