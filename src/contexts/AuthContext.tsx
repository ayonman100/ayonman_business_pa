import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { supabase } from '../lib/supabase';
import { Session, User as SupabaseUser } from '@supabase/supabase-js';

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
  updateProfile: (updates: Partial<User>) => Promise<void>;
  isAuthenticated: boolean;
  error: string | null;
  success: string | null;
  clearError: () => void;
  clearSuccess: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const transformUser = (supabaseUser: SupabaseUser): User => {
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

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    
    const getInitialSession = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          setError(error.message);
        } else if (data.session && mounted) {
          setSession(data.session);
          setUser(transformUser(data.session.user));
        }
      } catch {
        setError('Failed to initialize session');
      } finally {
        if (mounted) setLoading(false);
      }
    };
    
    getInitialSession();

    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_, session) => {
        if (!mounted) return;
        
        if (session) {
          setSession(session);
          setUser(transformUser(session.user));
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

  const updateProfile = async (updates: Partial<User>) => {
    try {
      setLoading(true);
      setError(null);
      
      if (!user) throw new Error('No user to update');

      const { error } = await supabase.auth.updateUser({
        data: updates
      });

      if (error) throw error;
      
      setSuccess('Profile updated successfully');
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

// Export hook separately to fix fast refresh warning
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};