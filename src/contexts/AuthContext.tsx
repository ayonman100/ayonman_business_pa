import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User as SupabaseUser, AuthError } from '@supabase/supabase-js';
import { OAuthProvider, oauthProviders } from '../lib/supabase';

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
  signUpWithEmail: (email: string, password: string, fullName: string, metadata?: any) => Promise<void>;
  signOut: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  error: string | null;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Convert Supabase user to our User interface
  const transformUser = (supabaseUser: SupabaseUser, session: Session): User => {
    const metadata = supabaseUser.user_metadata || {};
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
      emailVerified: supabaseUser.email_confirmed_at !== null,
      provider: appMetadata.provider
    };
  };

  // Initialize auth state
  useEffect(() => {
    let mounted = true;

    // Get initial session
    const getInitialSession = async () => {
      try {
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          setError(error.message);
        } else if (session && mounted) {
          setSession(session);
          setUser(transformUser(session.user, session));
        }
      } catch (err) {
        console.error('Auth initialization error:', err);
        setError('Failed to initialize authentication');
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    getInitialSession();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (!mounted) return;

        console.log('Auth state changed:', event, session?.user?.email);

        if (session) {
          setSession(session);
          setUser(transformUser(session.user, session));
          
          // Update last login timestamp
          if (event === 'SIGNED_IN') {
            await supabase.auth.updateUser({
              data: { last_login_at: new Date().toISOString() }
            });
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
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          },
        },
      });

      if (error) {
        throw error;
      }
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'OAuth sign in failed';
      setError(errorMessage);
      console.error('OAuth sign in error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signInWithEmail = async (email: string, password: string, rememberMe = false) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (!data.user?.email_confirmed_at) {
        throw new Error('Please verify your email address before signing in');
      }

      // Handle remember me functionality
      if (rememberMe) {
        localStorage.setItem('ayonman_remember_me', 'true');
        localStorage.setItem('ayonman_user_email', email);
      } else {
        localStorage.removeItem('ayonman_remember_me');
        localStorage.removeItem('ayonman_user_email');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign in failed';
      setError(errorMessage);
      console.error('Email sign in error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signUpWithEmail = async (
    email: string, 
    password: string, 
    fullName: string, 
    metadata: any = {}
  ) => {
    try {
      setLoading(true);
      setError(null);

      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
            name: fullName,
            ...metadata,
          },
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

      if (error) {
        throw error;
      }

      if (!data.user) {
        throw new Error('Failed to create user account');
      }

      // If email confirmation is required
      if (!data.session) {
        setError('Please check your email and click the confirmation link to complete your registration');
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign up failed';
      setError(errorMessage);
      console.error('Email sign up error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.signOut();
      
      if (error) {
        throw error;
      }

      // Clear local storage
      localStorage.removeItem('ayonman_remember_me');
      localStorage.removeItem('ayonman_user_email');
      
      setUser(null);
      setSession(null);

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Sign out failed';
      setError(errorMessage);
      console.error('Sign out error:', err);
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

      if (error) {
        throw error;
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Password reset failed';
      setError(errorMessage);
      console.error('Password reset error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);

      const { error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) {
        throw error;
      }

      // Update local user state
      if (user) {
        setUser({ ...user, ...updates });
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Profile update failed';
      setError(errorMessage);
      console.error('Profile update error:', err);
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    session,
    loading,
    signInWithOAuth,
    signInWithEmail,
    signUpWithEmail,
    signOut,
    resetPassword,
    updateProfile,
    isAuthenticated: !!session,
    error,
    clearError,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};