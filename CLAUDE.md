# CLAUDE.md — App Seed Kit (Bootstrap Phase)

> **This repository is a template.** It is not a runnable application yet. The `app-seed-kit/` directory contains the full project scaffold that needs to be expanded to the repository root.

---

## What To Do

When the user describes the application they want to create, you must **bootstrap the project** from the seed kit template.

### Step 1 — Infer the Placeholders

From the user's description, determine three values:

| Placeholder | What it is | Example |
|---|---|---|
| `[APP_NAME]` | Display name of the app | `SendMoney` |
| `[app]` | Lowercase slug (used in storage keys, cookies) | `sendmoney` |
| `[one-line description]` | Short product description | `Send money to anyone by email` |

If any value is ambiguous, ask. Do not guess.

### Step 2 — Scaffold

1. Copy **all** contents of `app-seed-kit/` to the repository root (overwriting this CLAUDE.md with the project's CLAUDE.md from the template)
2. Replace all three placeholders across every file. Files containing placeholders:
   - `CLAUDE.md` — project title and description
   - `src/lib/constants.ts` — APP_NAME, STORAGE_KEY, SESSION_COOKIE
   - `src/middleware.ts` — session cookie name
   - `src/app/layout.tsx` — page title and meta description
   - `src/app/(auth)/login/page.tsx` — login screen heading and subtext, session cookie
   - `src/app/(app)/dashboard/page.tsx` — welcome message
   - `src/store/index.ts` — persist storage key
   - `src/store/slices/auth.ts` — storage key and cookie name
   - `src/components/layout/Sidebar.tsx` — default app name prop
   - `tests/e2e/helpers.ts` — session cookie and storage key
   - `docs/*.md` — all doc headers
3. Delete the `app-seed-kit/` directory
4. Run `npm install`
5. Run `npm run quality` to verify everything works

### Step 3 — Confirm

Tell the user the project is ready and suggest they enter plan mode to start designing their first feature.

---

## Important

- Do **not** modify the template's architecture, components, or patterns during bootstrap. Just move files and replace placeholders.
- The project's `CLAUDE.md` (inside `app-seed-kit/`) contains all development instructions, permanent rules, and plan mode guidance. After bootstrap, it becomes the root `CLAUDE.md` and governs all subsequent work.
