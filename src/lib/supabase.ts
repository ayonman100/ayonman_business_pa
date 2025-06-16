import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true
  }
})

// OAuth provider configurations
export const oauthProviders = {
  google: {
    name: 'Google',
    provider: 'google' as const,
    scopes: 'openid profile email'
  },
  github: {
    name: 'GitHub', 
    provider: 'github' as const,
    scopes: 'user:email'
  },
  microsoft: {
    name: 'Microsoft',
    provider: 'azure' as const,
    scopes: 'openid profile email'
  },
  apple: {
    name: 'Apple',
    provider: 'apple' as const,
    scopes: 'name email'
  }
} as const

export type OAuthProvider = keyof typeof oauthProviders