tech22-fix-supabase-routing

// Centralized Supabase client (TECH-22)
import { createClient } from '@supabase/supabase-js';

const env = (import.meta as any).env || {};

// Allow runtime overrides via localStorage to unblock env submission issues
const lsUrl = typeof window !== 'undefined' ? localStorage.getItem('cc_supabase_url') : null;
const lsAnon = typeof window !== 'undefined' ? localStorage.getItem('cc_supabase_anon') : null;

// Support both Vite and Next-style public envs
const publicUrl = (env.VITE_SUPABASE_URL as string) || (env.NEXT_PUBLIC_SUPABASE_URL as string) || '';
const publicAnon = (env.VITE_SUPABASE_PUBLISHABLE_KEY as string) || (env.VITE_SUPABASE_ANON_KEY as string) || '';

// Safe fallbacks (publishable anon key only) - hkgryypdqiyigoztvran project
const fallbackUrl = 'https://hkgryypdqiyigoztvran.supabase.co';
const fallbackAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZ3J5eXBkcWl5aWdvenR2cmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MDY4ODYsImV4cCI6MjA3MDQ4Mjg4Nn0.kYBkBkZcdZpK9r-KWDKRAMzrONa0BkECtdYhfdpFOuU';

const supabaseUrl = (lsUrl || publicUrl || fallbackUrl) as string;
const supabaseAnonKey = (lsAnon || publicAnon || fallbackAnon) as string;

if (!publicUrl) {
  console.warn('[Supabase] Public URL missing; using', lsUrl ? 'localStorage override' : 'fallback URL');
}
if (!publicAnon) {
  console.warn('[Supabase] Public anon key missing; using', lsAnon ? 'localStorage override' : 'embedded publishable anon key fallback');
}
if (lsUrl || lsAnon) {
  console.info('[Supabase] Using localStorage overrides. Clear with localStorage.removeItem("cc_supabase_url") / removeItem("cc_supabase_anon").');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
});
main
