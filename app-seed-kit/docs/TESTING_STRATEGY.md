# TESTING STRATEGY
### [APP_NAME] — Version 1.0
### Quality Assurance Framework

---

## TESTING PHILOSOPHY

### The Testing Pyramid

```
         ┌─────────────┐
         │   E2E Tests  │  ← Critical flows, Playwright
         │  (10% time)  │    Slow, expensive, high confidence
         └──────┬───────┘
    ┌───────────┴───────────┐
    │   Integration Tests    │  ← Store + component interaction
    │     (20% time)         │    Medium speed, domain coverage
    └───────────┬────────────┘
  ┌─────────────┴─────────────────┐
  │        Unit Tests              │  ← lib, store slices, utilities
  │         (70% time)             │    Fast, isolated, comprehensive
  └────────────────────────────────┘
```

### Testing Principles

**Test behavior, not implementation.** Tests should describe *what* the system does, not *how* it does it. If a refactor breaks tests without changing behavior, the tests are wrong.

**The Three Failure Modes to Test:**
1. Happy path — everything works as expected
2. Error path — system handles failure gracefully
3. Edge cases — boundary conditions behave correctly

**Deterministic by default.** All tests use the seeded mock engine. Tests that pass randomly are not tests.

---

## UNIT TESTS

### Coverage Targets

| Module | Minimum coverage |
|--------|-----------------|
| `lib/formatting/*` | 100% |
| `lib/validation/*` | 100% |
| `lib/mock/engine.ts` | 95% |
| `store/slices/*` | 90% |
| `store/selectors/*` | 95% |
| `components/ui/*` | 80% |
| `components/domain/*` | 75% |

### Test File Organization

```
tests/
  unit/
    lib/
      formatting/
        currency.test.ts
      mock/
        engine.test.ts
    store/
      slices/
        auth.test.ts
      selectors/
        [domain].test.ts
    components/
      ui/
        Button.test.tsx
      domain/
        [domain].test.tsx
```

---

## UNIT TEST PATTERNS

### Formatting Tests

```typescript
describe('formatUSD', () => {
  test('formats standard amounts', () => {
    expect(formatUSD(1234.56)).toBe('$1,234.56')
  })

  test('always shows exactly 2 decimal places', () => {
    expect(formatUSD(100)).toBe('$100.00')
    expect(formatUSD(100.999)).toBe('$101.00')
  })

  test('formats large amounts with separators', () => {
    expect(formatUSD(1000000)).toBe('$1,000,000.00')
  })
})
```

### Store Slice Tests

```typescript
import { createStore } from '@/store/testUtils'

describe('mySlice', () => {
  test('action produces expected state change', () => {
    const store = createStore()
    store.getState().myAction(payload)

    expect(store.getState().myField).toBe(expectedValue)
  })

  test('action handles edge case', () => {
    const store = createStore()
    // ... test edge case
  })
})
```

### Private Mode Tests

```typescript
describe('Component with private mode', () => {
  test('shows values when private mode is off', () => {
    // render with isPrivateMode: false
    // expect values to be visible
  })

  test('blurs values when private mode is on', () => {
    // render with isPrivateMode: true
    // expect values to have blur class
  })

  test('private mode does not hide labels', () => {
    // labels remain visible even in private mode
  })
})
```

---

## PLAYWRIGHT E2E TESTS

### Critical Flow Patterns

These patterns show how to structure E2E tests. Each app defines its specific flows.

#### Login / Onboarding Flow
```typescript
test('complete onboarding', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL('/login')
  await page.click('[data-testid="login-button"]')
  await expect(page).toHaveURL('/dashboard')
})
```

#### Core Action Flow
```typescript
test('complete primary action', async ({ page }) => {
  await loginAs(page, 'testuser')
  // ... perform the action
  // ... verify result
})
```

#### Failure Recovery Flow
```typescript
test('handles failure gracefully', async ({ page }) => {
  // ... trigger action that fails
  // ... verify error message contains reassurance
  // ... verify state is rolled back
})
```

#### Private Mode Flow
```typescript
test('private mode blurs sensitive values', async ({ page }) => {
  await loginAs(page, 'testuser')
  // ... enable private mode
  // ... verify values are blurred
  // ... disable private mode
  // ... verify values are visible
})
```

#### Persistence Flow
```typescript
test('state persists after page reload', async ({ page }) => {
  await loginAs(page, 'testuser')
  // ... record state
  await page.reload()
  // ... verify state preserved
})
```

#### Responsive Flow
```typescript
test('no horizontal scroll on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  // ... navigate to each route
  // ... verify no horizontal scroll
})
```

---

## TEST UTILITIES

### Store Test Helper

```typescript
// src/store/testUtils.ts
import { createStore as zustandCreateStore } from 'zustand'

export const createStore = () =>
  zustandCreateStore<RootState>()((...a) => ({
    ...createAuthSlice(...a),
    ...createUISlice(...a),
    // ... app-specific slices
  }))
```

### Playwright Helper

```typescript
// tests/e2e/helpers.ts
export const loginAs = async (page: Page, nickname: string): Promise<void> => {
  await page.goto('/login')
  await page.evaluate((nick) => {
    document.cookie = '[app]_session=1; path=/'
    localStorage.setItem('[app]_v1', JSON.stringify({
      state: {
        isAuthenticated: true,
        user: { id: 'user-demo-001', nickname: nick, email: 'user@example.com', createdAt: Date.now() },
      },
      version: 1,
    }))
  }, nickname)
  await page.goto('/dashboard')
}
```

---

## CI CONFIGURATION

```yaml
# .github/workflows/quality.yml

name: Quality Gate

on: [push, pull_request]

jobs:
  quality:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with: { node-version: '20' }

      - name: Install
        run: npm ci

      - name: TypeScript check
        run: npx tsc --noEmit

      - name: Lint
        run: npm run lint

      - name: Token lint (no raw hex)
        run: npm run lint:tokens

      - name: Unit tests
        run: npm test -- --coverage

      - name: Build
        run: npm run build

      - name: E2E tests
        run: npx playwright install && npm run e2e
```
