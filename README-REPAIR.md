# Repair Notes

This repository uses the hkgry Supabase project.

## Health Check

- `GET /api/health` verifies environment variables and the Supabase connection.

## EPD Wizard

- The EPD creation wizard auto-saves drafts to `localStorage` and clears the draft after a successful save.
- When `VITE_DEV_MOCK_SAVE=1` is set, the wizard skips network calls for development and testing.

## Setup

```sh
npm install
npm run build
npm run dev
```
