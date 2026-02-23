# ARCHITECTURE
### UISmoke — Version 1.0
### System Design and Component Responsibility Map

---

## OVERVIEW

This is a single-page Next.js application with App Router, fully self-contained with mocked data. There are no external services, API calls, or authentication providers. The architecture is designed for clarity, testability, and future extension.

---

## APP ROUTER LAYOUT

### Route Hierarchy

```
app/
  layout.tsx                    # Root layout: fonts, globals, providers

  (auth)/                       # Auth route group — no navigation chrome
    layout.tsx                  # Minimal centered layout
    login/
      page.tsx                  # Login screen
    setup/
      nickname/
        page.tsx                # Nickname claim (first-run only)

  (app)/                        # Main app route group — with navigation
    layout.tsx                  # Shell: sidebar (desktop) + bottom nav (mobile)
    dashboard/
      page.tsx                  # Main landing page
    [additional routes]/        # App-specific routes added here
```

### Route Guards

Authentication is enforced via Next.js middleware:

```typescript
// middleware.ts
export const middleware = (request: NextRequest) => {
  const isAuthenticated = request.cookies.get('uismoke_session')
  const isAuthRoute = request.nextUrl.pathname.startsWith('/login')

  if (!isAuthenticated && !isAuthRoute) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (isAuthenticated && isAuthRoute) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
}
```

---

## COMPONENT ARCHITECTURE

### Component Decision Tree

When creating a new component, ask these questions in order:

```
1. Does it need store data?
   YES → components/domain/
   NO  → components/ui/

2. Does it belong to a specific route?
   YES → consider inlining if < 30 lines
   NO  → extract to components/domain/ or components/ui/

3. Is it purely presentational with no domain logic?
   YES → components/ui/
   NO  → components/domain/

4. Is it part of the page layout/shell?
   YES → components/layout/
```

### Folder Responsibility Map

```
components/ui/
  Purpose: Pure presentational components
  Knows about: HTML, CSS classes, callbacks via props
  Forbidden: Store imports, domain types, business logic

  Seed kit includes:
    Button.tsx          — All button variants (primary, secondary, ghost, destructive)
    Input.tsx           — Text inputs with label, error, hint
    Card.tsx            — Surface container
    Badge.tsx           — Status indicators

  Add as needed:
    Modal.tsx           — Dialog container
    Toast.tsx           — Notification messages
    Tooltip.tsx         — Hover information
    Skeleton.tsx        — Loading placeholders
    CopyButton.tsx      — Copy-to-clipboard with animation

components/layout/
  Purpose: Application shell components
  Knows about: Navigation structure, route constants
  Connects to: Store (for active route, user display name)

  Seed kit includes:
    Sidebar.tsx         — Desktop navigation (240px, accepts nav items as props)
    BottomNav.tsx       — Mobile navigation (accepts nav items as props)

components/domain/
  Purpose: Business-aware components (created as the app is built)
  Knows about: Store selectors, domain types, business rules
  Renders: UI components with domain data
```

---

## STORE LAYERING

### State Slices

```
store/
  index.ts                # Combine slices, configure persist
  testUtils.ts            # Isolated store factory for tests

  slices/
    auth.ts               # isAuthenticated, user (seed kit provides this)
    ui.ts                 # isPrivateMode (seed kit provides this)
    [domain slices]/      # App-specific slices added here

  selectors/              # App-specific selectors added here
    [domain].ts           # Pure selector functions
```

### State Flow Diagram

```
User Interaction
      │
      ▼
Domain Component
      │ calls hook
      ▼
Custom Hook (hooks/)
      │ calls action
      ▼
Zustand Store Action
      │ updates state
      ▼
Zustand Selector
      │ recomputes
      ▼
Domain Component
      │ passes derived data
      ▼
UI Component
      │ renders
      ▼
User sees update
```

---

## MOCK LAYER ARCHITECTURE

### Deterministic Mock Engine

The mock layer simulates all async operations. It is:
- **Seedable:** Same seed always produces same results
- **Configurable:** Tests can override behavior (force failure, control timing)
- **Transparent:** Delays are realistic but not blocking in tests

```
lib/mock/
  engine.ts       # Core PRNG + generation methods (seed kit provides this)
  [domain].ts     # App-specific mock helpers added here
```

### Mock Interception Points

In tests, mock behavior is overridden at these points:

```typescript
beforeEach(() => {
  mockEngine.setSeed(42)             // Deterministic values
})
```

---

## PERSISTENCE ARCHITECTURE

### What Is Persisted

```typescript
// Persisted across sessions (via Zustand persist middleware):
auth: {
  isAuthenticated: boolean
  user: User | null
}
// + app-specific persisted state

// NOT persisted (always reset):
ui: {
  isPrivateMode: false  // Always start not private
}
// + app-specific transient UI state
```

### Schema Migration

Every schema change increments `STORAGE_VERSION`. Migration functions transform old schemas to new ones:

```typescript
const MIGRATIONS: Record<number, (old: unknown) => PersistedState> = {
  1: (old) => defaultState(),          // Fresh install or version 0 → 1
  2: (old) => addField(old, 'field'),  // Version 1 → 2 (future)
}
```

---

## PERFORMANCE ARCHITECTURE

### Render Optimization

- Zustand selectors are narrow — components subscribe only to the data they need
- `React.memo` on list items to prevent parent re-renders
- `useMemo` for expensive selectors (feed grouping, search)
- `useCallback` on all event handlers passed to child components
- Parameterized selectors must not create new closures per render (use pre-built versions)

### Bundle Optimization

- All heavy components (Framer Motion, QR code library) are dynamically imported
- Route-level code splitting via Next.js App Router (automatic)
- Font subsetting via `next/font` or `@fontsource` (Latin subset only)

### Animation Performance

- All Framer Motion animations use `transform` and `opacity` only (GPU-composited)
- `layoutId` for shared element transitions — avoids DOM duplication
- `will-change: transform` only on frequently animating elements

---

## TESTING ARCHITECTURE

### Test Environment Layers

```
Layer 1: Unit (Jest + Testing Library)
  → Isolated module testing
  → Custom render wrapper provides Zustand store
  → All randomness mocked via deterministic engine
  → No browser, no timers (fake timers where needed)

Layer 2: E2E (Playwright)
  → Full browser, real interactions
  → localStorage populated via page.evaluate() for test setup
  → Mock engine configured in browser context
```

### Test Utilities

```
tests/
  unit/
    lib/              # Tests for lib/ modules
    store/            # Tests for store slices and selectors
    components/       # Tests for UI and domain components
  e2e/
    helpers.ts        # Playwright helper (loginAs, etc.)
```
