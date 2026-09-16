import { useState, useEffect, useCallback } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { getSupabase, isSupabaseConfigured, verifySupabaseConnection, SupabaseConnectionStatus } from './supabase';

export interface UseSupabaseAuthReturn {
  user: User | null;
  session: Session | null;
  loading: boolean;
  isConfigured: boolean;
  error: string | null;
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>;
  signUp: (email: string, password: string, data?: Record<string, any>) => Promise<{ error: AuthError | null }>;
  signOut: () => Promise<{ error: AuthError | null }>;
  connectionStatus: SupabaseConnectionStatus | null;
  checkConnection: () => Promise<SupabaseConnectionStatus>;
}

export function useSupabaseAuth(): UseSupabaseAuthReturn {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [connectionStatus, setConnectionStatus] = useState<SupabaseConnectionStatus | null>(null);

  const configured = isSupabaseConfigured();

  const checkConnection = useCallback(async (): Promise<SupabaseConnectionStatus> => {
    const status = await verifySupabaseConnection();
    setConnectionStatus(status);
    return status;
  }, []);

  useEffect(() => {
    if (!configured) {
      setLoading(false);
      checkConnection();
      return;
    }

    const client = getSupabase();
    if (!client) {
      setLoading(false);
      return;
    }

    // Check initial active session
    client.auth.getSession().then(({ data: { session: currentSession }, error: sessionError }) => {
      if (sessionError) {
        setError(sessionError.message);
      } else {
        setSession(currentSession);
        setUser(currentSession?.user ?? null);
      }
      setLoading(false);
      checkConnection();
    }).catch((err) => {
      setError(err instanceof Error ? err.message : 'Failed to retrieve session');
      setLoading(false);
    });

    // Subscribe to auth state updates
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [configured, checkConnection]);

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    setError(null);
    const client = getSupabase();
    if (!client) {
      const err = new AuthError('Supabase client is not configured.');
      setError(err.message);
      return { error: err };
    }

    const { error: signInError } = await client.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      setError(signInError.message);
      return { error: signInError };
    }

    return { error: null };
  };

  const signUp = async (
    email: string,
    password: string,
    data?: Record<string, any>
  ): Promise<{ error: AuthError | null }> => {
    setError(null);
    const client = getSupabase();
    if (!client) {
      const err = new AuthError('Supabase client is not configured.');
      setError(err.message);
      return { error: err };
    }

    const { error: signUpError } = await client.auth.signUp({
      email,
      password,
      options: { data },
    });

    if (signUpError) {
      setError(signUpError.message);
      return { error: signUpError };
    }

    return { error: null };
  };

  const signOut = async (): Promise<{ error: AuthError | null }> => {
    setError(null);
    const client = getSupabase();
    if (!client) {
      return { error: null };
    }

    const { error: signOutError } = await client.auth.signOut();
    if (signOutError) {
      setError(signOutError.message);
      return { error: signOutError };
    }

    setUser(null);
    setSession(null);
    return { error: null };
  };

  return {
    user,
    session,
    loading,
    isConfigured: configured,
    error,
    signIn,
    signUp,
    signOut,
    connectionStatus,
    checkConnection,
  };
}
