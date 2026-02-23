# TESTING STRATEGY
### Not a Bank — Version 2.0
### Quality Assurance Framework

---

## TESTING PHILOSOPHY

### The Testing Pyramid

```
         ┌─────────────┐
         │   E2E Tests  │  ← 9 critical flows, Playwright
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
        address.test.ts
        date.test.ts
      validation/
        schemas.test.ts
      mock/
        engine.test.ts
        addresses.test.ts
    store/
      slices/
        auth.test.ts
        transactions.test.ts
        contacts.test.ts
      selectors/
        finance.test.ts
    components/
      ui/
        Button.test.tsx
        CopyButton.test.tsx
        AmountDisplay.test.tsx
      domain/
        ContactSelector.test.tsx
        SendForm.test.tsx
```

---

## UNIT TEST SPECIFICATIONS

### 1. Formatting Tests

```typescript
// lib/formatting/currency.test.ts

describe('formatUSD', () => {
  test('formats standard amounts', () => {
    expect(formatUSD(1234.56)).toBe('$1,234.56')
    expect(formatUSD(0)).toBe('$0.00')
    expect(formatUSD(0.01)).toBe('$0.01')
  })
  
  test('always shows exactly 2 decimal places', () => {
    expect(formatUSD(100)).toBe('$100.00')
    expect(formatUSD(100.1)).toBe('$100.10')
    expect(formatUSD(100.999)).toBe('$101.00')  // Rounding
  })
  
  test('formats large amounts with separators', () => {
    expect(formatUSD(1000000)).toBe('$1,000,000.00')
    expect(formatUSD(9999.99)).toBe('$9,999.99')
  })
  
  test('handles negative amounts', () => {
    expect(formatUSD(-250)).toBe('-$250.00')
  })
})

describe('formatAmountDelta', () => {
  test('outbound uses minus sign', () => {
    expect(formatAmountDelta(250, 'out')).toBe('-$250.00')
  })
  
  test('inbound uses plus sign', () => {
    expect(formatAmountDelta(500, 'in')).toBe('+$500.00')
  })
})
```

### 2. Validation Tests

```typescript
// lib/validation/schemas.test.ts

describe('amountSchema', () => {
  test('accepts valid amounts', () => {
    expect(amountSchema.safeParse(100).success).toBe(true)
    expect(amountSchema.safeParse(0.01).success).toBe(true)
    expect(amountSchema.safeParse(999999).success).toBe(true)
  })
  
  test('rejects zero and negative', () => {
    expect(amountSchema.safeParse(0).success).toBe(false)
    expect(amountSchema.safeParse(-1).success).toBe(false)
  })
  
  test('rejects amounts exceeding maximum', () => {
    expect(amountSchema.safeParse(1_000_001).success).toBe(false)
  })
  
  test('rejects more than 2 decimal places', () => {
    expect(amountSchema.safeParse(1.001).success).toBe(false)
  })
})

describe('addressSchema', () => {
  test('accepts valid Ethereum addresses', () => {
    expect(addressSchema.safeParse('0x742d35Cc6634C0532925a3b8D4C9B97B7b8A2A3').success).toBe(true)
  })
  
  test('rejects invalid formats', () => {
    expect(addressSchema.safeParse('not-an-address').success).toBe(false)
    expect(addressSchema.safeParse('0x123').success).toBe(false)  // Too short
    expect(addressSchema.safeParse('742d35Cc6634C0532925a3b8D4C9B97B7b8A2A3').success).toBe(false)  // No 0x
  })
})
```

### 3. Store Slice Tests

```typescript
// tests/unit/store/slices/transactions.test.ts
import { createStore } from '@/tests/helpers/createStore'

describe('transactionsSlice', () => {
  test('optimistic send inserts transaction immediately', () => {
    const store = createStore()
    const payload = createMockSendPayload({ amount: 100 })
    
    store.getState().initiateSend(payload)
    
    const tx = store.getState().transactions[0]
    expect(tx.status).toBe('optimistic')
    expect(tx.amount).toBe(100)
    expect(tx.direction).toBe('outbound')
  })
  
  test('confirmed send updates transaction status', () => {
    const store = createStore()
    const payload = createMockSendPayload({ amount: 100 })
    
    store.getState().initiateSend(payload)
    const { optimisticId } = store.getState().sendState as { status: 'pending'; optimisticId: string }
    store.getState().confirmSend(optimisticId)
    
    const tx = store.getState().transactions[0]
    expect(tx.status).toBe('confirmed')
  })
  
  test('failed send removes optimistic transaction', () => {
    const store = createStore()
    const payload = createMockSendPayload({ amount: 100 })
    const initialCount = store.getState().transactions.length
    
    store.getState().initiateSend(payload)
    expect(store.getState().transactions.length).toBe(initialCount + 1)
    
    const { optimisticId } = store.getState().sendState as { status: 'pending'; optimisticId: string }
    store.getState().failSend(optimisticId, 'Network error')
    
    expect(store.getState().transactions.length).toBe(initialCount)
  })
  
  test('failed send does not affect balance', () => {
    const store = createStore({ balance: 1000 })
    
    store.getState().initiateSend(createMockSendPayload({ amount: 100 }))
    const { optimisticId } = store.getState().sendState as { status: 'pending'; optimisticId: string }
    store.getState().failSend(optimisticId, 'error')
    
    expect(selectNetWorth(store.getState())).toBe(1000)
  })
})
```

### 4. Private Mode Tests

```typescript
// tests/unit/components/domain/BalanceSummary.test.tsx

describe('BalanceSummary with private mode', () => {
  test('shows balance when private mode is off', () => {
    render(<BalanceSummary />, { storeState: { ui: { isPrivateMode: false } } })
    
    expect(screen.getByText('$1,250.00')).toBeVisible()
  })
  
  test('blurs balance when private mode is on', () => {
    render(<BalanceSummary />, { storeState: { ui: { isPrivateMode: true } } })
    
    const balanceEl = screen.getByTestId('balance-amount')
    expect(balanceEl).toHaveClass('blur-[8px]')
  })
  
  test('private mode does not hide labels', () => {
    render(<BalanceSummary />, { storeState: { ui: { isPrivateMode: true } } })
    
    expect(screen.getByText('Total balance')).toBeVisible()
  })
})
```

---

## PLAYWRIGHT E2E TESTS

### Flow 1: Login → Nickname Claim

```typescript
// e2e/flows/01-onboarding.spec.ts

test('complete onboarding: login and claim nickname', async ({ page }) => {
  await page.goto('/')
  
  // Should redirect to login
  await expect(page).toHaveURL('/login')
  
  // Enter passphrase
  await page.fill('[data-testid="passphrase-input"]', 'test-passphrase-123')
  await page.click('[data-testid="login-button"]')
  
  // Should be at nickname claim
  await expect(page).toHaveURL('/setup/nickname')
  await expect(page.getByRole('heading', { name: /choose your name/i })).toBeVisible()
  
  // Claim nickname
  await page.fill('[data-testid="nickname-input"]', 'alex')
  await page.waitForResponse('**/api/check-nickname*')  // Wait for availability check
  
  await expect(page.getByText('Available')).toBeVisible()
  await page.click('[data-testid="claim-nickname-button"]')
  
  // Should arrive at dashboard
  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText('alex')).toBeVisible()
})
```

### Flow 2: Generate Deposit Address

```typescript
// e2e/flows/02-receive.spec.ts

test('generate and display deposit address', async ({ page, loginAs }) => {
  await loginAs('fresh-user')  // User with no deposit address
  
  await page.goto('/receive')
  
  // No address yet — show generate CTA
  await expect(page.getByText('Generate your deposit address')).toBeVisible()
  await page.click('[data-testid="generate-address-button"]')
  
  // Character reveal animation completes (~800ms)
  await page.waitForTimeout(1000)
  
  // Address is now visible
  const addressEl = page.getByTestId('deposit-address')
  await expect(addressEl).toBeVisible()
  const address = await addressEl.textContent()
  expect(address).toMatch(/^0x[0-9a-fA-F]+/)
  
  // QR code is visible
  await expect(page.getByTestId('qr-code')).toBeVisible()
  
  // Copy works
  await page.click('[data-testid="copy-address-button"]')
  await expect(page.getByTestId('copy-address-button')).toContainText('Copied')
})
```

### Flow 3: Send to New Recipient (With Acknowledgment)

```typescript
// e2e/flows/03-send-new-recipient.spec.ts

test('send to new recipient requires acknowledgment', async ({ page, loginAs }) => {
  await loginAs('funded-user')
  await page.goto('/send')
  
  // Enter amount
  await page.fill('[data-testid="amount-input"]', '100')
  
  // Enter new (unknown) recipient
  await page.fill('[data-testid="recipient-input"]', '0x1234567890123456789012345678901234567890')
  await page.click('[data-testid="next-button"]')
  
  // New recipient warning MUST appear
  await expect(page.getByRole('heading', { name: /new recipient/i })).toBeVisible()
  await expect(page.getByText("You haven't sent to this address before")).toBeVisible()
  
  // Cannot proceed without acknowledgment
  const confirmButton = page.getByTestId('confirm-send-button')
  await expect(confirmButton).toBeDisabled()
  
  // Acknowledge
  await page.check('[data-testid="new-recipient-checkbox"]')
  await expect(confirmButton).toBeEnabled()
  
  // Complete send
  await confirmButton.click()
  
  // Optimistic state appears in activity
  await expect(page).toHaveURL('/dashboard')
  await expect(page.getByText('Sending')).toBeVisible()
})
```

### Flow 4: Send to Verified Contact (No Acknowledgment Required)

```typescript
// e2e/flows/04-send-verified.spec.ts

test('send to verified contact skips acknowledgment', async ({ page, loginAs }) => {
  await loginAs('funded-user')  // Has alice as verified contact
  await page.goto('/send')
  
  await page.fill('[data-testid="amount-input"]', '50')
  
  // Select verified contact
  await page.click('[data-testid="contact-alice"]')
  
  // Should see verification badge
  await expect(page.getByText('Verified')).toBeVisible()
  
  // No new-recipient warning
  await expect(page.getByRole('heading', { name: /new recipient/i })).not.toBeVisible()
  
  // Can proceed directly to review
  await page.click('[data-testid="next-button"]')
  await expect(page.getByText('Review your payment')).toBeVisible()
})
```

### Flow 5: Send Failure Recovery

```typescript
// e2e/flows/05-send-failure.spec.ts

test('handles send failure gracefully', async ({ page, loginAs, mockSendFailure }) => {
  await loginAs('funded-user')
  await mockSendFailure()  // Configure mock to fail next send
  
  await page.goto('/send')
  await page.fill('[data-testid="amount-input"]', '100')
  await page.click('[data-testid="contact-alice"]')
  await page.click('[data-testid="next-button"]')
  await page.click('[data-testid="confirm-send-button"]')
  
  // Error toast appears
  await expect(page.getByRole('alert')).toContainText('Your funds are safe')
  
  // Transaction shows failed state in activity
  await expect(page.getByText('Not sent')).toBeVisible()
  
  // Balance is unchanged
  const balance = await page.getByTestId('total-balance').textContent()
  expect(balance).toContain('$1,250.00')  // Initial balance restored
  
  // Retry is available
  await expect(page.getByRole('button', { name: /retry/i })).toBeVisible()
})
```

### Flow 6: Private Mode Toggle

```typescript
// e2e/flows/06-private-mode.spec.ts

test('private mode blurs all financial amounts', async ({ page, loginAs }) => {
  await loginAs('funded-user')
  await page.goto('/dashboard')
  
  // Balance visible initially
  const balanceEl = page.getByTestId('balance-amount')
  await expect(balanceEl).toBeVisible()
  
  // Enable private mode
  await page.click('[data-testid="private-mode-toggle"]')
  
  // Balance is blurred
  await expect(balanceEl).toHaveCSS('filter', /blur/)
  
  // Activity amounts are blurred
  const activityAmounts = page.getByTestId('activity-amount')
  for (const amt of await activityAmounts.all()) {
    await expect(amt).toHaveCSS('filter', /blur/)
  }
  
  // Disable private mode
  await page.click('[data-testid="private-mode-toggle"]')
  await expect(balanceEl).not.toHaveCSS('filter', /blur/)
})
```

### Flow 7: State Persistence Across Reload

```typescript
// e2e/flows/07-persistence.spec.ts

test('state persists after page reload', async ({ page, loginAs }) => {
  await loginAs('funded-user')
  
  // Record initial state
  const nickname = await page.getByTestId('user-nickname').textContent()
  const balance = await page.getByTestId('total-balance').textContent()
  
  // Reload page
  await page.reload()
  
  // State preserved
  await expect(page.getByTestId('user-nickname')).toHaveText(nickname!)
  await expect(page.getByTestId('total-balance')).toHaveText(balance!)
  
  // Should NOT redirect to login (session preserved)
  await expect(page).toHaveURL('/dashboard')
})
```

### Flow 8: No Horizontal Scroll at 375px

```typescript
// e2e/flows/08-responsive.spec.ts

test('no horizontal scroll on mobile', async ({ page }) => {
  await page.setViewportSize({ width: 375, height: 812 })
  await loginAs(page, 'funded-user')
  
  const routes = ['/dashboard', '/send', '/receive', '/activity', '/settings']
  
  for (const route of routes) {
    await page.goto(route)
    
    const scrollWidth = await page.evaluate(() => document.documentElement.scrollWidth)
    const clientWidth = await page.evaluate(() => document.documentElement.clientWidth)
    
    expect(scrollWidth).toBeLessThanOrEqual(clientWidth + 1)  // +1 for sub-pixel rendering
  }
})
```

### Flow 9: Accessibility — Keyboard Navigation

```typescript
// e2e/flows/09-accessibility.spec.ts

test('full send flow completable via keyboard only', async ({ page, loginAs }) => {
  await loginAs('funded-user')
  await page.goto('/send')
  
  // Tab to amount input (should be first focusable element)
  await page.keyboard.press('Tab')
  await expect(page.getByTestId('amount-input')).toBeFocused()
  
  await page.keyboard.type('100')
  await page.keyboard.press('Tab')
  
  // Tab to recipient input
  await expect(page.getByTestId('recipient-input')).toBeFocused()
  
  // Select from contacts with keyboard
  await page.keyboard.type('ali')
  await page.keyboard.press('ArrowDown')
  await page.keyboard.press('Enter')  // Select alice
  
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')  // Next button
  
  // Review screen — confirm with keyboard
  await page.keyboard.press('Tab')
  await page.keyboard.press('Enter')
  
  // Transaction initiated
  await expect(page.getByText('Sending')).toBeVisible()
})
```

---

## TEST UTILITIES

### Custom Render Helper

```typescript
// tests/helpers/render.tsx

export const renderWithStore = (
  ui: React.ReactElement,
  options?: { storeState?: Partial<RootState> }
) => {
  const store = createStore(options?.storeState)
  
  return {
    ...render(
      <StoreProvider store={store}>
        {ui}
      </StoreProvider>
    ),
    store,
  }
}
```

### Playwright Fixtures

```typescript
// e2e/fixtures.ts

export const test = base.extend<{
  loginAs: (preset: 'fresh-user' | 'funded-user' | 'no-contacts') => Promise<void>
  mockSendFailure: () => Promise<void>
}>({
  loginAs: async ({ page }, use) => {
    await use(async (preset) => {
      await page.goto('/login')
      await page.evaluate((p) => {
        localStorage.setItem('nab_state_v1', JSON.stringify(getPresetState(p)))
      }, preset)
      await page.goto('/dashboard')
    })
  },
  
  mockSendFailure: async ({ page }, use) => {
    await use(async () => {
      await page.evaluate(() => {
        window.__MOCK_SEND_FAILURE__ = true
      })
    })
  },
})
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
      
      - name: Coverage check
        run: npm run test:coverage-check  # Fail if below minimums
```
