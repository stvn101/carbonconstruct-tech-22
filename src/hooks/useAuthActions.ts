// src/hooks/useAuthActions.ts

import { useCallback } from 'react';
import { supabase } from '@/lib/supabaseClient';
import {
  handleAuthError,
  validatePassword,
  checkRateLimit,
  sanitizeInput,
  validateRedirectUrl,
} from '@/utils/authHelpers';

export const useAuthActions = () => {
  const signUp = useCallback(
    async (email: string, password: string, redirectUrl?: string) => {
      const cleanedEmail = sanitizeInput(email);
      const cleanedPassword = sanitizeInput(password);
      const redirectTo = validateRedirectUrl(redirectUrl);

      const passwordValidation = validatePassword(cleanedPassword);
      if (!passwordValidation.valid) {
        throw new Error(passwordValidation.message);
      }

      const allowed = await checkRateLimit(`signup-${cleanedEmail}`);
      if (!allowed) {
        throw new Error('Too many signup attempts. Please try again later.');
      }

      const { data, error } = await supabase.auth.signUp({
        email: cleanedEmail,
        password: cleanedPassword,
        options: {
          emailRedirectTo: redirectTo,
        },
      });

      if (error) {
        throw new Error(handleAuthError(error));
      }

      return data;
    },
    []
  );

  const signIn = useCallback(async (email: string, password: string) => {
    const cleanedEmail = sanitizeInput(email);
    const cleanedPassword = sanitizeInput(password);

    const allowed = await checkRateLimit(`login-${cleanedEmail}`);
    if (!allowed) {
      throw new Error('Too many login attempts. Please try again later.');
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: cleanedEmail,
      password: cleanedPassword,
    });

    if (error) {
      throw new Error(handleAuthError(error));
    }

    return data;
  }, []);

  const signOut = useCallback(async () => {
    const { error } = await supabase.auth.signOut();
    if (error) {
      throw new Error(handleAuthError(error));
    }
  }, []);

  const resetPassword = useCallback(async (email: string) => {
    const cleanedEmail = sanitizeInput(email);

    const { error } = await supabase.auth.resetPasswordForEmail(cleanedEmail);
    if (error) {
      throw new Error(handleAuthError(error));
    }
  }, []);

  return {
    signUp,
    signIn,
    signOut,
    resetPassword,
  };
};
