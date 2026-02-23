# ARCHITECTURE
### Not a Bank — Version 2.0
### System Design and Component Responsibility Map

---

## OVERVIEW

Not a Bank is a single-page Next.js 14 application with App Router, fully self-contained with mocked data. There are no external services, API calls, or authentication providers. The architecture is designed for clarity, testability, and future extension.

---

## APP ROUTER LAYOUT

### Route Hierarchy

```
app/
  layout.tsx                    # Root layout: fonts, globals, providers
  
  (auth)/                       # Auth route group — no navigation chrome
    layout.tsx                  # Minimal centered layout
    login/
      page.tsx                  # Passphrase entry
    setup/
      nickname/
        page.tsx                # Nickname claim (first-run only)
  
  (app)/                        # Main app route group — with navigation
    layout.tsx                  # Shell: sidebar (desktop) + bottom nav (mobile)
    dashboard/
      page.tsx                  # Balance overview + recent activity
    send/
      page.tsx                  # Multi-step send flow
    receive/
      page.tsx                  # Address display + QR code
    activity/
      page.tsx                  # Full transaction history
    earn/
      page.tsx                  # Placeholder
    borrow/
      page.tsx                  # Placeholder
  
  settings/
    page.tsx                    # Account settings
```

### Route Guards

Authentication is enforced via Next.js middleware:

```typescript
// middleware.ts
export const middleware = (request: NextRequest) => {
  const isAuthenticated = request.cookies.get('nab_session')
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
  
  Files:
    Button.tsx          — All button variants
    Input.tsx           — Text, number inputs
    AmountInput.tsx     — Specialized for currency entry
    Card.tsx            — Surface container
    Badge.tsx           — Status indicators
    Modal.tsx           — Dialog container
    Toast.tsx           — Notification messages
    Tooltip.tsx         — Hover information
    Skeleton.tsx        — Loading placeholders
    CopyButton.tsx      — Copy-to-clipboard with animation
    AmountDisplay.tsx   — Formatted currency display (with private mode blur)
    ProgressRing.tsx    — Circular progress indicator
    AddressDisplay.tsx  — Truncated + full address display

components/layout/
  Purpose: Application shell components
  Knows about: Navigation structure, route constants
  Connects to: Store (for active route, user display name)
  
  Files:
    Sidebar.tsx         — Desktop navigation
    BottomNav.tsx       — Mobile navigation
    TopBar.tsx          — Mobile top bar (avatar, settings)
    PageShell.tsx       — Wrapper applying standard page padding

components/domain/
  Purpose: Business-aware components
  Knows about: Store selectors, domain types, business rules
  Renders: UI components with domain data
  
  Files:
    BalanceSummary.tsx      — Total balance with private mode
    ActivityFeed.tsx        — Transaction list container
    ActivityItem.tsx        — Single transaction row
    AddressCard.tsx         — Deposit address display + generate CTA
    ContactSelector.tsx     — Contact search + selection
    ContactItem.tsx         — Single contact row with verification status
    ContactWarning.tsx      — New recipient acknowledgment flow
    SendForm/               — Multi-step send flow (split into steps)
      index.tsx
      AmountStep.tsx
      RecipientStep.tsx
      ReviewStep.tsx
      ProcessingStep.tsx
    NicknameForm.tsx        — Nickname availability + claim
    TransactionStatus.tsx   — Single transaction status (with morph animation)
    PrivateToggle.tsx       — Private mode enable/disable
```

---

## STORE LAYERING

### State Slices

```
store/
  index.ts                # Combine slices, configure persist + devtools
  
  slices/
    auth.ts               # isAuthenticated, user, nickname, sessionId
    balance.ts            # Token balances, lastUpdatedAt
    contacts.ts           # Contact list, CRUD operations
    transactions.ts       # Transaction list, send state, pending operations
    deposit.ts            # Deposit addresses, generation state
    ui.ts                 # isPrivateMode, modals, toast, send wizard state
  
  selectors/
    finance.ts            # netWorth, formattedBalance, available balance
    activity.ts           # Recent activity feed, grouped by date
    contacts.ts           # Verified contacts, search results
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
  engine.ts       # Core PRNG + generation methods
  prng.ts         # Mulberry32 PRNG implementation
  addresses.ts    # Deterministic address generation
  contacts.ts     # Mock contact data generation
  transactions.ts # Send simulation, deposit simulation
  delays.ts       # Realistic delay constants + helpers
  seedData.ts     # Initial application state
```

### Mock Interception Points

In tests, mock behavior is overridden at these points:

```typescript
// Override for tests — never in production code
beforeEach(() => {
  mockEngine.setMode('test')         // Eliminates delays
  mockEngine.setSeed(42)             // Deterministic values
  mockEngine.setResult('success')    // Force send success
})
```

---

## PERSISTENCE ARCHITECTURE

### What Is Persisted

```typescript
// Persisted across sessions:
auth: {
  isAuthenticated: boolean
  user: User | null
}
contacts: { items: Contact[] }
transactions: { transactions: Transaction[] }
deposit: { addresses: DepositAddress[] }
settings: { /* user preferences */ }

// NOT persisted (always reset):
ui: {
  isPrivateMode: false  // Always start not private
  modals: {}            // Always closed
  toast: null           // No persistent toasts
  send: {}              // Send wizard resets
}
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
- `React.memo` on list items (ActivityItem, ContactItem) to prevent parent re-renders
- `useMemo` for expensive selectors (activity feed grouping, contact search)
- `useCallback` on all event handlers passed to child components

### Bundle Optimization

- All heavy components (Framer Motion, QR code library) are dynamically imported
- Route-level code splitting via Next.js App Router (automatic)
- Font subsetting via `next/font` (Latin subset only)

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
  → Visual regression via screenshot comparison
```

### Test Utilities

```
tests/
  helpers/
    createStore.ts      # Create test Zustand store with preset state
    render.tsx          # Custom render with store provider
    presets.ts          # Common store state presets (funded-user, etc.)
    
e2e/
  fixtures.ts           # Playwright fixtures (loginAs, mockSendFailure)
  helpers/
    navigation.ts       # Common navigation helpers
    assertions.ts       # Custom assertion helpers (checkNoHorizontalScroll)
```
