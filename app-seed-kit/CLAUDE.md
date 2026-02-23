# [APP_NAME]

[one-line description]. Fully mocked MVP — no external services, no real auth, no API calls.

**Stack:** Next.js (App Router) · TypeScript strict · Tailwind CSS · Zustand · Framer Motion · Jest · Playwright

---

## Architecture

Four layers with one-way dependencies:

```
app/(app|auth)/     Pages — composition only, no logic, render domain components
components/domain/  Domain components — store-connected, business-aware
components/ui/      UI components — pure presentation, no store imports
components/layout/  Shell — Sidebar (desktop) + BottomNav (mobile)
store/slices/       State + actions (Zustand). No React imports.
lib/                Pure functions — formatting, validation, mock engine
```

**Dependency direction:** pages → domain → ui, domain → store → lib. Never reversed.

---

## Code Rules

- No `any` type — ever.
- No `Math.random()` outside `lib/mock/engine.ts`. Use the seeded mock engine.
- No raw hex colors in component files. Use Tailwind token classes (`bg-bg-surface`, `text-text-primary`).
- No inline `style={{}}` objects. Use Tailwind classes.
- No nested ternaries. Use if/else or early returns.
- Explicit return types on all exported functions.
- TypeScript strict mode (`strict: true`, `noUncheckedIndexedAccess: true`).
- Prefer `type` over `interface` for data shapes.

---

## UX & Style

Read these docs and apply them as you build — they are the quality bar:

- **`docs/UX_GUIDELINES.md`** — Design philosophy, interaction patterns, copy standards, responsive design, accessibility
- **`docs/UX_ENFORCEMENT_RULES.md`** — Machine-enforceable rules (screen discipline, typography, color, spacing, motion, interaction, empty states)
- **`docs/MOTION_SPEC.md`** — Animation system: timing, easing, full animation catalog with Framer Motion code
- **`docs/STYLE_GUIDE.md`** — Visual reference (color tokens, typography, component specs, animation snippets)

Key rules to internalize:
- One primary CTA per screen. All others secondary or ghost.
- 44px minimum touch targets on all interactive elements
- Error messages: [what happened] + [reassurance] + [what to do]. Never blame the user.
- Empty states are invitations, not apologies
- All Framer Motion animations have `useReducedMotion` fallback
- No emoji, no neon, no gradients, no glow — dark-first always
- Optimistic updates: UI changes within 50ms of user action
- Copy must pass the clarity test: would a 12-year-old understand it?

**After building any UI**, run the **ux-reviewer** agent (`.claude/agents/ux-reviewer.md`) to audit compliance.

---

## Testing

- **Jest** for unit tests. **Playwright** for E2E flows.
- Test behavior, not implementation. If a refactor breaks tests without changing behavior, the tests are wrong.
- All tests use the seeded mock engine. No test should pass randomly.
- Use `data-testid` on interactive and key display elements (kebab-case: `balance-amount`, `send-button`).
- No coverage targets — write tests where they add value.

---

## Common Patterns

### Store Access
```typescript
import { useStore } from '@/store'
const user = useStore((s) => s.user)
```

### Mock Engine
```typescript
import { mockDelay, DELAYS, randomDelay } from '@/lib/mock/engine'
await randomDelay(DELAYS.action.min, DELAYS.action.max)
```

### Page Animation
```typescript
const pageVariants = {
  initial: { opacity: 0, y: 8 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -4 },
}
const pageTransition = { duration: 0.22, ease: [0.0, 0.0, 0.2, 1] }
```

### Error Messages
```typescript
// Always: [What happened] + [Reassurance] + [What to do]
"That didn't go through. Your data is safe — try again."
"That doesn't look right. Double-check and try again."
```

### Store Test Helper
```typescript
import { createStore } from '@/store/testUtils'
const store = createStore()
store.getState().someAction(payload)
expect(store.getState().someField).toBe(expected)
```

### E2E Login Helper
```typescript
import { loginAs } from '../e2e/helpers'
await loginAs(page, 'testuser')
```

---

## New Files

| What                | Where                                  | Rule                                            |
|---------------------|----------------------------------------|-------------------------------------------------|
| UI component        | `components/ui/Name.tsx`               | Pure presentation, no store imports              |
| Domain component    | `components/domain/Name.tsx`           | Store-connected, passes data to UI components    |
| Page                | `app/(app)/route/page.tsx`             | Composition only — renders domain components     |
| Store slice         | `store/slices/name.ts`                 | `StateCreator` pattern, no React imports         |
| Lib module          | `lib/category/name.ts`                 | Pure functions, explicit return types            |
| Unit test           | `tests/unit/.../name.test.ts(x)`       | Mirrors source structure                         |
| E2E test            | `tests/e2e/name.spec.ts`              | Uses `loginAs` helper                            |

---

## Commands

```bash
npm run dev          # Dev server
npm run build        # Production build
npm run quality      # All checks: type-check + lint + test
npm test             # Jest unit tests
npm run e2e          # Playwright E2E
npm run lint         # ESLint
npm run lint:fix     # ESLint autofix
npm run format       # Prettier
```

---

## Key Paths

```
src/styles/tokens.css      Design tokens (CSS custom properties)
tailwind.config.ts         Tailwind — extends with token-mapped colors
src/lib/mock/engine.ts     Seedable PRNG + delay simulation
src/store/index.ts         Zustand store root
src/types/index.ts         Shared type definitions
src/lib/constants.ts       App name, storage key, session cookie
docs/                      UX_GUIDELINES, UX_ENFORCEMENT_RULES, MOTION_SPEC, STYLE_GUIDE
.claude/agents/            ux-reviewer (run after UI changes)
```
