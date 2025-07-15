
# Carbon Companion AI — Integration Guide for CarbonConstruct

This module provides Claude-powered Scope 3 intelligence tools for the CarbonConstruct platform. It includes smart wizards, calculators, dashboards, and emissions reporting logic aligned with GHG Protocol Scope 3 guidelines.

---

## 📂 Directory Structure

Place the contents of `src/home101/claude` into the same path in your main app.

```
src/
└── home101/
    └── claude/
        ├── App.tsx
        ├── DataCollectionWizard.tsx
        ├── EmissionsCalculator.tsx
        ├── Scope3Dashboard.tsx
        ├── AdvancedReporting.tsx
        ├── SupplierPortal.tsx
        ├── schema.ts
        ├── db.ts
        ├── useTheme.tsx
        └── Navigation.tsx
```

---

## ⚙️ Installation

### 1. **Install Dependencies**
```bash
npm install
```

If using `package.json` from this module, merge it with your root package.json:
```jsonc
// Merge dependencies like:
"drizzle-orm": "^0.x.x",
"zod": "^3.x.x",
"tailwindcss": "^3.x.x",
"@supabase/supabase-js": "^2.x.x"
```

Also merge `tailwind.config.ts`, `vite.config2.ts`, and `tsconfig2.json` with your root config files.

---

### 2. **Supabase Setup**
Ensure your Supabase project has tables and fields matching `schema.ts` and `db.ts`.

You can use Drizzle or Supabase CLI to apply migrations.

---

### 3. **Routing**
Add routes for:
```tsx
// Example routes
<Route path="/claude/wizard" element={<DataCollectionWizard />} />
<Route path="/claude/dashboard" element={<Scope3Dashboard />} />
<Route path="/claude/calculate" element={<EmissionsCalculator />} />
```

---

## 🧠 Features Overview

| File | Function |
|------|----------|
| `DataCollectionWizard.tsx` | Smart intake UI for emissions inputs |
| `EmissionsCalculator.tsx` | Scope 1/2/3 emissions breakdown using Claude |
| `Scope3Dashboard.tsx` | Interactive emissions summaries |
| `AdvancedReporting.tsx` | Exportable reporting UI |
| `SupplierPortal.tsx` | Placeholder for supplier-specific flows |
| `schema.ts` / `db.ts` | Supabase + Drizzle integration schemas |
| `App.tsx` / `Navigation.tsx` | Basic layout for local mounting |

---

## 📄 Documentation

Refer to the contents in `docs/claude-companion/` for full guidance:
- `Complete Implementation Guide.md`
- `Integration Guide.md`
- `Scope 3 Emissions Research - GHG Protocol.md`
- `Carbon Companion API Documentation.md`

---

## ✅ To Do (Optional)

- Integrate Claude/Anthropic SDK directly if not yet connected
- Wrap the assistant in your existing auth flow
- Enable live chat / query analysis from Scope 3 values

---

## 🧠 Claude Compatibility

Designed to be used with Claude (via edge functions or API relay). Claude logic can be added to:
- `EmissionsCalculator.tsx` as async logic
- Future `ClaudeAgent.ts` or `ClaudeHelper.ts` to centralize assistant calls

---

## 🤝 Maintainer

This module was originally developed by Manus and enhanced by the CarbonConstruct team. For integration issues, contact `stvnjnkns@carbonconstruct.net`.
