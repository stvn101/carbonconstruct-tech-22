// [CHANGED] src/integrations/supabase/client.ts
// Canonical Supabase client with enhanced diagnostics
import { createClient } from '@supabase/supabase-js';

type Env = {
  VITE_SUPABASE_URL?: string;
  VITE_SUPABASE_PUBLISHABLE_KEY?: string;
  VITE_SUPABASE_ANON_KEY?: string;
};

// Diagnostic logging for environment variables
const env = import.meta.env as unknown as Env;
const VITE_SUPABASE_URL = env.VITE_SUPABASE_URL;
const VITE_SUPABASE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY || env.VITE_SUPABASE_ANON_KEY;

// Enhanced diagnostic logging
console.log('[Supabase Client] Environment check:', {
  hasUrl: !!VITE_SUPABASE_URL,
  hasPublishableKey: !!env.VITE_SUPABASE_PUBLISHABLE_KEY,
  hasAnonKey: !!env.VITE_SUPABASE_ANON_KEY,
  urlMasked: VITE_SUPABASE_URL ? `${VITE_SUPABASE_URL.slice(0, 20)}...` : 'MISSING',
  keyMasked: VITE_SUPABASE_KEY ? `${VITE_SUPABASE_KEY.slice(0, 20)}...` : 'MISSING',
  envKeys: Object.keys(import.meta.env).filter(key => key.includes('SUPABASE'))
});

// Create supabase client with graceful fallback
let supabaseClient: any;

if (!VITE_SUPABASE_URL || !VITE_SUPABASE_KEY) {
  console.error('[Supabase Client] Missing environment variables. App will show connection error.');
  
  // Create a dummy client that will show connection errors instead of crashing
  supabaseClient = {
    auth: {
      signUp: () => Promise.reject(new Error('Supabase not configured')),
      signInWithPassword: () => Promise.reject(new Error('Supabase not configured')),
      signOut: () => Promise.reject(new Error('Supabase not configured')),
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe: () => {} } } })
    },
    from: () => ({
      select: () => Promise.reject(new Error('Supabase not configured')),
      insert: () => Promise.reject(new Error('Supabase not configured')),
      update: () => Promise.reject(new Error('Supabase not configured')),
      delete: () => Promise.reject(new Error('Supabase not configured'))
    })
  };
} else {
  console.log('[Supabase Client] Successfully configured');
  supabaseClient = createClient(VITE_SUPABASE_URL, VITE_SUPABASE_KEY, {
    auth: { persistSession: true, autoRefreshToken: true },
  });
}

export const supabase = supabaseClient;
