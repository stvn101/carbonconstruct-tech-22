/**
 * Supabase connection utilities with improved reliability
 */
import { isOffline } from '@/utils/errorHandling/networkChecker';

const env = (import.meta as any).env || {};
const lsUrl = typeof window !== 'undefined' ? localStorage.getItem('cc_supabase_url') : null;
const lsAnon = typeof window !== 'undefined' ? localStorage.getItem('cc_supabase_anon') : null;

const SUPABASE_URL = (lsUrl || env.VITE_SUPABASE_URL || env.NEXT_PUBLIC_SUPABASE_URL || '') as string;
const SUPABASE_ANON_KEY = (lsAnon || env.VITE_SUPABASE_PUBLISHABLE_KEY || env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '') as string;

export const checkSupabaseConnection = async (): Promise<boolean> => {
  if (isOffline()) return false;

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        apikey: SUPABASE_ANON_KEY,
      },
      cache: 'no-store',
      signal: AbortSignal.timeout(8000),
    });
    return response.ok;
  } catch (error) {
    console.error('Supabase connection check failed', error);
    return false;
  }
};

export const pingSupabaseConnection = async (): Promise<boolean> => {
  if (isOffline()) return false;

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000);
    const response = await fetch(`${SUPABASE_URL}/rest/v1/`, {
      method: 'HEAD',
      headers: {
        apikey: SUPABASE_ANON_KEY,
      },
      cache: 'no-store',
      signal: controller.signal,
    });
    clearTimeout(timeoutId);
    return response.ok;
  } catch (error) {
    console.error('Supabase ping connection failed', error);
    return false;
  }
};

// Added to satisfy imports expecting a retry helper
export const checkSupabaseConnectionWithRetry = async (
  maxRetries = 3,
  baseDelayMs = 1000
): Promise<boolean> => {
  if (isOffline()) return false;

  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    const ok = await checkSupabaseConnection();
    if (ok) return true;

    // Final attempt failed
    if (attempt === maxRetries) break;

    // Exponential backoff with jitter
    const delay = baseDelayMs * Math.pow(2, attempt) + Math.floor(Math.random() * 200);
    await new Promise((res) => setTimeout(res, delay));
  }

  return false;
};
