// Centralized Supabase client (TECH-22)
import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};
// Fallbacks prevent hard crashes if envs aren’t injected yet (anon key is publishable)
const supabaseUrl = (env.VITE_SUPABASE_URL as string) || 'https://oemgqlxumfnstbjdiqmr.supabase.co';
const supabaseAnonKey = (env.VITE_SUPABASE_PUBLISHABLE_KEY as string) || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9lbWdxbHh1bWZuc3RiamRpcW1yIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTM4NTE1MjQsImV4cCI6MjA2OTQyNzUyNH0._XCqy43NyHrlSLKLgQ40FDBckF5Ljuzjrd4cBqV1MxU';

if (!env.VITE_SUPABASE_URL) {
  console.warn('[Supabase] VITE_SUPABASE_URL missing; using project-id fallback URL.');
}
if (!env.VITE_SUPABASE_PUBLISHABLE_KEY) {
  console.warn('[Supabase] VITE_SUPABASE_PUBLISHABLE_KEY missing; using embedded publishable anon key fallback.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
