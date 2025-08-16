import { createClient } from '@supabase/supabase-js';

// Get environment variables - works for both Vite and Next.js
// Think of this like checking which power source is available
const getEnvVar = (name: string): string => {
  // Check Vite environment variables (import.meta.env)
  if (typeof import.meta !== 'undefined' && import.meta.env) {
    const viteValue = import.meta.env[`VITE_${name}`];
    if (viteValue) return viteValue;
  }
  
  // Check Next.js environment variables (process.env)
  if (typeof process !== 'undefined' && process.env) {
    const nextValue = process.env[`NEXT_PUBLIC_${name}`];
    if (nextValue) return nextValue;
    
    // Also check for Vite-style in process.env (some setups use this)
    const viteValue = process.env[`VITE_${name}`];
    if (viteValue) return viteValue;
  }
  
  return '';
};

// Get the required Supabase configuration
const url = getEnvVar('SUPABASE_URL');
const anon = getEnvVar('SUPABASE_ANON_KEY');
const serviceRole = getEnvVar('SUPABASE_SERVICE_ROLE_KEY'); // Optional for admin operations

// Validate that we have the essential configuration
// Like checking you have the right drill bits before starting
if (!url || !anon) {
  console.error('❌ Missing Supabase configuration!');
  console.error('URL:', url ? '✅ Found' : '❌ Missing');
  console.error('ANON KEY:', anon ? '✅ Found' : '❌ Missing');
  console.error('');
  console.error('🔧 To fix this, create a .env file with:');
  console.error('VITE_SUPABASE_URL=your_supabase_url_here');
  console.error('VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here');
  console.error('');
  console.error('Or if using Next.js:');
  console.error('NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here');
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here');
  
  throw new Error('Supabase configuration missing. Check your environment variables.');
}

// Create the main Supabase client (for regular app operations)
export const supabase = createClient(url, anon);

// Create admin client only if service role key is available
// This is like having a master key - only create it if you have the key
export const adminSupabase = serviceRole 
  ? createClient(url, serviceRole, { 
      auth: { 
        persistSession: false // Admin operations don't need user sessions
      }
    })
  : null; // If no service role key, don't create admin client

// Export a helper function to check if admin operations are available
export const hasAdminAccess = (): boolean => {
  return adminSupabase !== null;
};

// For debugging - you can remove this in production
if (process.env.NODE_ENV === 'development') {
  console.log('🔌 Supabase client initialized successfully');
  console.log('📍 URL:', url.substring(0, 30) + '...');
  console.log('🔑 Admin access:', hasAdminAccess() ? 'Available' : 'Not configured');
}
