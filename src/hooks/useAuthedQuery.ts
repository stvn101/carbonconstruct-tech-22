import { useQuery, UseQueryOptions, UseQueryResult } from '@tanstack/react-query';
import { useAuth } from '@/contexts/auth/AuthProvider';
import { supabase } from '@/integrations/supabase/client';

/**
 * Custom hook that automatically handles authentication for Supabase queries
 * Prevents 401 errors by only running queries when user is authenticated
 */
export function useAuthedQuery<TData = unknown, TError = Error>(
  options: {
    queryKey: readonly unknown[];
    queryFn: () => Promise<TData>;
    fallbackData?: TData;
    enabled?: boolean;
  } & Omit<UseQueryOptions<TData, TError>, 'queryKey' | 'queryFn' | 'enabled'>
): UseQueryResult<TData, TError> {
  const { user } = useAuth();
  const { queryKey, queryFn, fallbackData, enabled = true, ...restOptions } = options;

  return useQuery({
    queryKey,
    queryFn: async () => {
      // Double-check auth before query execution
      const { data: { user: currentUser } } = await supabase.auth.getUser();
      if (!currentUser) {
        console.warn(`Query ${queryKey.join('-')} skipped: no authenticated user`);
        return fallbackData || ([] as unknown as TData);
      }
      return queryFn();
    },
    enabled: !!user && enabled, // Only run when user exists AND enabled is true
    ...restOptions,
  });
}

/**
 * Specialized hook for Supabase table queries with built-in auth checking
 */
export function useAuthedSupabaseQuery<TData = unknown>(
  options: {
    queryKey: readonly unknown[];
    table: string;
    query: (supabase: typeof import('@/integrations/supabase/client').supabase) => Promise<{ data: TData | null; error: any }>;
    fallbackData?: TData;
    enabled?: boolean;
  } & Omit<UseQueryOptions<TData, Error>, 'queryKey' | 'queryFn' | 'enabled'>
) {
  return useAuthedQuery({
    ...options,
    queryFn: async () => {
      const { data, error } = await options.query(supabase);
      if (error) {
        console.error(`Supabase query error on ${options.table}:`, error);
        throw new Error(error.message);
      }
      return data || options.fallbackData || ([] as unknown as TData);
    },
  });
}