# Repair Summary

- synchronized dependencies via `npm install`.
- `npm run build` passes with zero TypeScript errors.
- development server runs on [http://localhost:3000](http://localhost:3000).
- all Supabase references point to project `hkgryypdqiyigoztvran`.
- `/api/health` endpoint returns `{ ok: true, supabase: "configured" }`.
- `EPDWizard` auto-saves drafts with debounce, clears local drafts after save, and honors `VITE_DEV_MOCK_SAVE`.
- added unit test verifying draft clearance in mock mode.
