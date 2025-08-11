/**
 * Supabase connection utilities with improved reliability
 */
import { isOffline } from '@/utils/errorHandling/networkChecker';

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const SUPABASE_ANON_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || '';

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
