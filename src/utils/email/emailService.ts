// [CHANGED] src/utils/email/emailService.ts
import { supabase } from '@/integrations/supabase/client';

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string; // optional override
}

// Read sender defaults from env (set in .env.local / Vercel)
const FROM_DEFAULT = (import.meta as any)?.env?.VITE_RESEND_FROM as
  | string
  | undefined;

/**
 * Send an email via the Supabase Edge Function `send-email`.
 * - Single path, env-only. No URL/key fallbacks, no localStorage overrides.
 * - Fails fast with a clear error if the function call fails.
 */
export async function sendEmail(params: SendEmailParams) {
  const body = { ...params, from: params.from ?? FROM_DEFAULT };

  const { data, error } = await supabase.functions.invoke('send-email', {
    body,
  });

  if (error) {
    // Surface a concise, actionable error
    throw new Error(
      `[sendEmail] functions.invoke('send-email') failed: ${error.message ?? String(
        error
      )}`
    );
  }
  return data;
}
