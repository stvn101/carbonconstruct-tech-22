// Force the app to use the hkgry Supabase project, overriding any accidental fallbacks
// This runs at startup and ensures the generated client picks the correct project
(function forceSupabaseProject() {
  try {
    if (typeof window === 'undefined') return;

    const HKGRY_URL = 'https://hkgryypdqiyigoztvran.supabase.co';
    const HKGRY_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhrZ3J5eXBkcWl5aWdvenR2cmFuIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQ5MDY4ODYsImV4cCI6MjA3MDQ4Mjg4Nn0.kYBkBkZcdZpK9r-KWDKRAMzrONa0BkECtdYhfdpFOuU';

    const curUrl = localStorage.getItem('cc_supabase_url');
    const curAnon = localStorage.getItem('cc_supabase_anon');

    const needsUrlUpdate = !curUrl || curUrl !== HKGRY_URL;
    const needsAnonUpdate = !curAnon || curAnon !== HKGRY_ANON;

    if (needsUrlUpdate) {
      localStorage.setItem('cc_supabase_url', HKGRY_URL);
    }
    if (needsAnonUpdate) {
      localStorage.setItem('cc_supabase_anon', HKGRY_ANON);
    }

    if (needsUrlUpdate || needsAnonUpdate) {
      // eslint-disable-next-line no-console
      console.info('[Supabase] Project forced to hkgry (localStorage overrides set).');
    }
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn('[Supabase] Failed to set hkgry overrides', e);
  }
})();
