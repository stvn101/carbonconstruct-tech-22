
import { supabase } from "@/integrations/supabase/client";

export interface SendEmailParams {
  to: string;
  subject: string;
  html: string;
  from?: string;
}

// Force hkgry project usage to avoid accidental fallback to any other project
const HKG_URL = 'https://hkgryypdqiyigoztvran.supabase.co';
const HKG_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZ3J5eXBkcWl5aWdvenR2cmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MDY4ODYsImV4cCI6MjA3MDQ4Mjg4Nn0.kYBkBkZcdZpK9r-KWDKRAMzrONa0BkECtdYhfdpFOuU';

const getPreferredSupabase = () => {
  const lsUrl = typeof window !== 'undefined' ? localStorage.getItem('cc_supabase_url') : null;
  const lsAnon = typeof window !== 'undefined' ? localStorage.getItem('cc_supabase_anon') : null;
  return { url: lsUrl || HKG_URL, anon: lsAnon || HKG_ANON };
};

export const sendEmail = async (params: SendEmailParams) => {
  try {
    const { data, error } = await supabase.functions.invoke('send-email', {
      body: params,
    });

    if (error) throw error;
    return data;
  } catch (error) {
    // Fallback: call the hkgry function endpoint directly to avoid project mismatch
    const { url, anon } = getPreferredSupabase();
    console.warn('[sendEmail] invoke failed, retrying via direct fetch to', url);
    try {
      const resp = await fetch(`${url}/functions/v1/send-email`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          apikey: anon,
          Authorization: `Bearer ${anon}`,
        },
        body: JSON.stringify(params),
      });

      if (!resp.ok) {
        const text = await resp.text();
        throw new Error(`send-email fetch failed ${resp.status}: ${text}`);
      }
      return await resp.json();
    } catch (fallbackErr) {
      console.error('Error sending email (fallback):', fallbackErr);
      throw fallbackErr;
    }
  }
};
