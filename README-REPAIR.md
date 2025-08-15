# Repair Summary

- Synchronized dependencies via `npm install`.
- `npm run build` passes with zero TypeScript errors.
- Development server runs on **http://localhost:3000**.
- Supabase references point to project `hkgryypdqiyigoztvran`.
- `/api/health` endpoint returns `{ ok: true, supabase: "configured" }`.
- EPDWizard: debounced autosave; clears local drafts after mock save; honors `VITE_DEV_MOCK_SAVE`.
- Added unit test verifying draft clearance in mock mode.

# Repair Notes

## EPD Wizard Autosave
- Debounced autosave; mock-save clears draft after completion.
- After mock save completes, local draft is removed to prevent stale resumes.

## Health Check
- Endpoint: `GET /api/health`
- Returns `200 OK` with `{ status: "ok" }` when the app is healthy.

## Dev Defaults
- Run: `npm run dev` (serves on **http://localhost:3000**)

## Setup
```sh
npm install
npm run build
npm run dev
