// Safe no-op module to prevent build failures if imported for side effects
// This ensures Vercel builds do not break if an old import remains.
export function forceSupabaseProject(): void {}
export default forceSupabaseProject;
