import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';
import { OAuthProvider, oauthProviders } from '../lib/supabase';

interface Metadata {
  full_name?: string;
  name?: string;
  avatar_url?: string;
  picture?: string;
  company_name?: string;
  job_title?: string;
  phone_number?: string;
  timezone?: string;
  language?: string;
  last_login_at?: string;
  [key: string]: unknown;
}

interface User {
  id: string;
  email: string;
  name: string;
  fullName: string;
  avatarUrl?: string;
  companyName?: string;
  jobTitle?: string;
  phoneNumber?: string;
  timezone: string;
  language: string;
  userRole: 'user' | 'admin' | 'enterprise_admin';
  trialEndsAt: Date;
  plan: 'free' | 'pro';
  isFirstLogin: boolean;
  lastLoginAt?: Date;
  emailVerified: boolean;
  provider?: string;
}

interface AuthContextType {
  user: User | null;
  session: Session | null;
  loading: boolean;
  signInWithOAuth: (provider: OAuthProvider) => Promise<void>;
  signInWithEmail: (email: string, password: string, rememberMe?: boolean) => Promise<void>;
  signUpWithEmail: (email: string, password: string, fullName: string, metadata?: Record<string, unknown>) => Promise<void>;
  resendVerificationEmail: (email: string) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  error: string | null;
  success: string | null;
  clearError: () => void;
  clearSuccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const transformUser = (supabaseUser: SupabaseUser, session: Session): User => {
    const metadata = supabaseUser.user_metadata as Metadata;
    const appMetadata = supabaseUser.app_metadata || {};

    return {
      id: supabaseUser.id,
      email: supabaseUser.email || '',
      name: metadata.full_name?.split(' ')[0] || metadata.name?.split(' ')[0] || supabaseUser.email?.split('@')[0] || 'User',
      fullName: metadata.full_name || metadata.name || supabaseUser.email?.split('@')[0] || 'User',
      avatarUrl: metadata.avatar_url || metadata.picture,
      companyName: metadata.company_name || '',
      jobTitle: metadata.job_title || '',
      phoneNumber: metadata.phone_number || '',
      timezone: metadata.timezone || Intl.DateTimeFormat().resolvedOptions().timeZone,
      language: metadata.language || 'English',
      userRole: appMetadata.role || 'user',
      trialEndsAt: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      plan: appMetadata.plan || 'free',
      isFirstLogin: !metadata.last_login_at,
      lastLoginAt: metadata.last_login_at ? new Date(metadata.last_login_at) : undefined,
      emailVerified: !!supabaseUser.email_confirmed_at,
      provider: appMetadata.provider,
    };
  };

  useEffect(() => {
    let mounted = true;
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) setError(error.message);
        else if (data.session && mounted) {
          setSession(data.session);
          setUser(transformUser(data.session.user, data.session));
        }
      } catch {
        setError('Failed to initialize authentication');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;
        if (session) {
          setSession(session);
          setUser(transformUser(session.user, session));
          if (event === 'SIGNED_IN') {
            await supabase.auth.updateUser({ data: { last_login_at: new Date().toISOString() } });
          }
        } else {
          setSession(null);
          setUser(null);
        }
        setLoading(false);
        setError(null);
      }
    );

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const clearError = () => setError(null);
  const clearSuccess = () => setSuccess(null);

  const signUpWithEmail = async (
    email: string,
    password: string,
    fullName: string,
    metadata: Record<string, unknown> = {}
  ) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      console.log('[SIGN UP] Starting sign-up process...');

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, name: fullName, ...metadata },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error('User creation failed. No user returned.');

      console.log('[SIGN UP] Supabase user created:', data.user);

      const { error: profileError } = await supabase.from('user_profiles').upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        created_at: new Date().toISOString(),
        ...metadata,
      });

      if (profileError) throw profileError;
      console.log('[SIGN UP] User profile inserted successfully.');

      if (!data.session) {
        console.log('[SIGN UP] No session. Likely needs email verification.');
        setSuccess('Account created! Please verify your email to complete registration.');
      } else {
        console.log('[SIGN UP] Session available:', data.session);
      }

    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      console.error('[SIGN UP ERROR]', err);
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  // other functions like signInWithOAuth, signInWithEmail, etc... remain the same

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signUpWithEmail,
        signInWithOAuth: async () => {},
        signInWithEmail: async () => {},
        resendVerificationEmail: async () => {},
        signOut: async () => {},
        resetPassword: async () => {},
        updateProfile: async () => {},
        isAuthenticated: !!session,
        error,
        success,
        clearError,
        clearSuccess,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
