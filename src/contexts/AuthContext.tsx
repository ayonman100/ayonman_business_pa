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

  const signInWithOAuth = async (provider: OAuthProvider) => {
    try {
      setLoading(true);
      setError(null);
      const config = oauthProviders[provider];
      const redirectTo = `${window.location.origin}/auth/callback`;
      const { error } = await supabase.auth.signInWithOAuth({
        provider: config.provider,
        options: {
          redirectTo,
          scopes: config.scopes,
          queryParams: { access_type: 'offline', prompt: 'consent' },
        },
      });
      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'OAuth sign in failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      if (!data.user?.email_confirmed_at) throw new Error('Please verify your email before signing in');
      if (rememberMe) {
        localStorage.setItem('ayonman_remember_me', 'true');
        localStorage.setItem('ayonman_user_email', email);
      } else {
        localStorage.removeItem('ayonman_remember_me');
        localStorage.removeItem('ayonman_user_email');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign in failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (email: string, password: string, fullName: string, metadata: Record<string, unknown> = {}) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName, name: fullName, ...metadata },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) throw error;
      if (!data.user) throw new Error('Failed to create user account');

      // ✅ Insert user into your custom `users` table
      const { error: insertError } = await supabase.from('users').upsert({
        id: data.user.id,
        email: data.user.email,
        full_name: fullName,
        created_at: new Date().toISOString(),
        ...metadata,
      });

      if (insertError) throw insertError;

      if (!data.session) {
        setSuccess('Account created! Please check your email and confirm it to complete your registration.');
      }
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign up failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const resendVerificationEmail = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email,
        options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
      });
      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to resend verification email';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      localStorage.removeItem('ayonman_remember_me');
      localStorage.removeItem('ayonman_user_email');
      setUser(null);
      setSession(null);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Sign out failed';
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/auth/reset-password`,
      });
      if (error) throw error;
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Password reset failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      const { error } = await supabase.auth.updateUser({ data: updates });
      if (error) throw error;
      if (user) setUser({ ...user, ...updates });
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Profile update failed';
      setError(message);
      throw new Error(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        session,
        loading,
        signInWithOAuth,
        signInWithEmail,
        signUpWithEmail,
        resendVerificationEmail,
        signOut,
        resetPassword,
        updateProfile,
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
