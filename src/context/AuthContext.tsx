import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { User, Session, AuthError } from '@supabase/supabase-js';
import { getSupabase, isSupabaseConfigured } from '../lib/supabase';
import { UserRole } from '../types';

export interface UserProfile {
  id: string;
  role: UserRole | string;
  full_name?: string | null;
  email?: string | null;
  avatar_url?: string | null;
  created_at?: string;
  updated_at?: string;
}

export interface AuthContextType {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  role: UserRole | null;
  loading: boolean;
  authLoading: boolean;
  profileLoading: boolean;
  isConfigured: boolean;
  error: string | null;
  profileError: string | null;
  signIn: (email: string, password: string) => Promise<{
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    error: AuthError | Error | null;
  }>;
  signUp: (
    email: string,
    password: string,
    options: { role: UserRole; fullName?: string }
  ) => Promise<{
    user: User | null;
    session: Session | null;
    profile: UserProfile | null;
    error: AuthError | Error | null;
  }>;
  signOut: () => Promise<{ error: AuthError | Error | null }>;
  refreshProfile: () => Promise<UserProfile | null>;
  createProfileIfMissing: (params: { role: UserRole; fullName?: string }) => Promise<{
    profile: UserProfile | null;
    error: Error | null;
  }>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const VALID_ROLES: UserRole[] = ['student', 'teacher', 'parent', 'admin'];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [role, setRole] = useState<UserRole | null>(null);

  const [authLoading, setAuthLoading] = useState<boolean>(true);
  const [profileLoading, setProfileLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [profileError, setProfileError] = useState<string | null>(null);

  const configured = isSupabaseConfigured();

  // Helper to fetch profile from the existing "profiles" table using profiles.id = auth.users.id
  const fetchProfile = useCallback(async (userId: string): Promise<UserProfile | null> => {
    setProfileLoading(true);
    setProfileError(null);
    const client = getSupabase();
    if (!client) {
      setProfileLoading(false);
      return null;
    }

    try {
      const { data, error: fetchErr } = await client
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .maybeSingle();

      if (fetchErr) {
        console.warn('Profile fetch error from Supabase:', fetchErr.message);
        setProfileError(fetchErr.message);
        setProfile(null);
        setRole(null);
        return null;
      }

      if (data) {
        const userProf = data as UserProfile;
        setProfile(userProf);
        // Role validation
        if (VALID_ROLES.includes(userProf.role as UserRole)) {
          setRole(userProf.role as UserRole);
          setProfileError(null);
        } else {
          setRole(null);
          setProfileError(`Invalid or unrecognized role "${userProf.role}" in profile.`);
        }
        return userProf;
      } else {
        // Profile does not exist yet (e.g. trigger didn't fire or pending setup)
        setProfile(null);
        setRole(null);
        return null;
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to load user profile';
      setProfileError(msg);
      setProfile(null);
      setRole(null);
      return null;
    } finally {
      setProfileLoading(false);
    }
  }, []);

  // Safe manual reload of profile
  const refreshProfile = useCallback(async (): Promise<UserProfile | null> => {
    if (!user) return null;
    return await fetchProfile(user.id);
  }, [user, fetchProfile]);

  // Safe profile creation if database trigger was not configured
  const createProfileIfMissing = useCallback(
    async (params: { role: UserRole; fullName?: string }): Promise<{
      profile: UserProfile | null;
      error: Error | null;
    }> => {
      setProfileError(null);
      if (!user) {
        const err = new Error('Cannot create profile: User is not authenticated.');
        setProfileError(err.message);
        return { profile: null, error: err };
      }

      // Security requirement: Normal user cannot grant themselves admin privileges via frontend code
      if (params.role === 'admin') {
        const secErr = new Error('Security Restriction: Admin role cannot be self-assigned. Contact your system administrator.');
        setProfileError(secErr.message);
        return { profile: null, error: secErr };
      }

      const client = getSupabase();
      if (!client) {
        const err = new Error('Supabase client is not configured.');
        setProfileError(err.message);
        return { profile: null, error: err };
      }

      try {
        setProfileLoading(true);
        // Insert into existing profiles table: profiles.id = auth.users.id
        const { data, error: insertErr } = await client
          .from('profiles')
          .insert({
            id: user.id,
            role: params.role,
            full_name: params.fullName || user.user_metadata?.full_name || '',
            email: user.email || '',
          })
          .select()
          .maybeSingle();

        if (insertErr) {
          setProfileError(insertErr.message);
          return { profile: null, error: insertErr };
        }

        if (data) {
          const newProfile = data as UserProfile;
          setProfile(newProfile);
          if (VALID_ROLES.includes(newProfile.role as UserRole)) {
            setRole(newProfile.role as UserRole);
          }
          return { profile: newProfile, error: null };
        }

        // If data was null (e.g. RLS policy blocked returning representation), attempt immediate fetch
        const fetched = await fetchProfile(user.id);
        return { profile: fetched, error: null };
      } catch (err: unknown) {
        const e = err instanceof Error ? err : new Error('Failed to create profile record.');
        setProfileError(e.message);
        return { profile: null, error: e };
      } finally {
        setProfileLoading(false);
      }
    },
    [user, fetchProfile]
  );

  useEffect(() => {
    if (!configured) {
      setAuthLoading(false);
      return;
    }

    const client = getSupabase();
    if (!client) {
      setAuthLoading(false);
      return;
    }

    let isMounted = true;

    // 1. Session Restoration: Check active session on initial mount
    client.auth.getSession()
      .then(async ({ data: { session: initialSession }, error: sessionError }) => {
        if (!isMounted) return;
        if (sessionError) {
          setError(sessionError.message);
          setAuthLoading(false);
        } else {
          setSession(initialSession);
          setUser(initialSession?.user ?? null);
          setAuthLoading(false);

          if (initialSession?.user) {
            await fetchProfile(initialSession.user.id);
          }
        }
      })
      .catch((err) => {
        if (!isMounted) return;
        setError(err instanceof Error ? err.message : 'Failed to restore Supabase auth session');
        setAuthLoading(false);
      });

    // 2. Auth State Change Listener: Listen to real-time events
    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, newSession) => {
      if (!isMounted) return;
      setSession(newSession);
      setUser(newSession?.user ?? null);
      setAuthLoading(false);

      if (event === 'SIGNED_OUT' || !newSession?.user) {
        setProfile(null);
        setRole(null);
        setProfileError(null);
      } else if (newSession?.user) {
        // Load profile for authenticated user
        await fetchProfile(newSession.user.id);
      }
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, [configured, fetchProfile]);

  // Real Supabase Email/Password Sign In
  const signIn = useCallback(
    async (email: string, password: string) => {
      setError(null);
      setProfileError(null);
      const client = getSupabase();
      if (!client) {
        const authErr = new AuthError('Supabase client is not configured.');
        setError(authErr.message);
        return { user: null, session: null, profile: null, error: authErr };
      }

      try {
        const { data, error: signInError } = await client.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (signInError) {
          setError(signInError.message);
          return { user: null, session: null, profile: null, error: signInError };
        }

        setUser(data.user);
        setSession(data.session);

        let prof: UserProfile | null = null;
        if (data.user) {
          prof = await fetchProfile(data.user.id);
        }

        return { user: data.user, session: data.session, profile: prof, error: null };
      } catch (err: unknown) {
        const authErr =
          err instanceof AuthError ? err : new AuthError(err instanceof Error ? err.message : 'Sign in failed');
        setError(authErr.message);
        return { user: null, session: null, profile: null, error: authErr };
      }
    },
    [fetchProfile]
  );

  // Real Supabase Email/Password Sign Up with Role Support
  const signUp = useCallback(
    async (email: string, password: string, options: { role: UserRole; fullName?: string }) => {
      setError(null);
      setProfileError(null);

      // Security requirement: Normal user cannot give themselves admin privileges through frontend code
      if (options.role === 'admin') {
        const secErr = new Error(
          'Security Restriction: Institution Admin accounts cannot be self-provisioned via public signup. Please contact your organization administrator for an administrative invitation.'
        );
        setError(secErr.message);
        return { user: null, session: null, profile: null, error: secErr };
      }

      const client = getSupabase();
      if (!client) {
        const authErr = new AuthError('Supabase client is not configured.');
        setError(authErr.message);
        return { user: null, session: null, profile: null, error: authErr };
      }

      try {
        const { data, error: signUpError } = await client.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              role: options.role,
              full_name: options.fullName || '',
            },
          },
        });

        if (signUpError) {
          setError(signUpError.message);
          return { user: null, session: null, profile: null, error: signUpError };
        }

        if (data.session) {
          setSession(data.session);
        }
        if (data.user) {
          setUser(data.user);
        }

        let prof: UserProfile | null = null;
        if (data.user) {
          // Attempt to load profile created by database trigger
          prof = await fetchProfile(data.user.id);

          // If database trigger was not active and user has session, attempt safe creation
          if (!prof && data.session) {
            const { profile: createdProf } = await createProfileIfMissing({
              role: options.role,
              fullName: options.fullName,
            });
            prof = createdProf;
          }
        }

        return { user: data.user, session: data.session, profile: prof, error: null };
      } catch (err: unknown) {
        const authErr =
          err instanceof AuthError ? err : new AuthError(err instanceof Error ? err.message : 'Sign up failed');
        setError(authErr.message);
        return { user: null, session: null, profile: null, error: authErr };
      }
    },
    [fetchProfile, createProfileIfMissing]
  );

  // Real Supabase Sign Out: clears all auth and profile state
  const signOut = useCallback(async () => {
    setError(null);
    setProfileError(null);
    const client = getSupabase();
    if (!client) {
      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      return { error: null };
    }

    try {
      const { error: signOutError } = await client.auth.signOut();
      if (signOutError) {
        setError(signOutError.message);
        return { error: signOutError };
      }

      setUser(null);
      setSession(null);
      setProfile(null);
      setRole(null);
      return { error: null };
    } catch (err: unknown) {
      const authErr =
        err instanceof AuthError ? err : new AuthError(err instanceof Error ? err.message : 'Sign out failed');
      setError(authErr.message);
      return { error: authErr };
    }
  }, []);

  const clearError = useCallback(() => {
    setError(null);
    setProfileError(null);
  }, []);

  const combinedLoading = authLoading || (Boolean(user) && profileLoading);

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        profile,
        role,
        loading: combinedLoading,
        authLoading,
        profileLoading,
        isConfigured: configured,
        error,
        profileError,
        signIn,
        signUp,
        signOut,
        refreshProfile,
        createProfileIfMissing,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
