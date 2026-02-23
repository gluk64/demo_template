import { createStore } from '@/store/testUtils'
import { selectNetWorth, selectRecentTransactions } from '@/store/selectors'
import { checkNicknameAvailability } from '@/lib/mock/resolution'

/**
 * Integration test: exercises the full onboarding flow at the store level.
 *
 * This simulates: login → check nickname → claim nickname → verify dashboard state
 *
 * The crash that created this test happened on the simplest possible flow.
 */

beforeEach(() => {
  jest.useFakeTimers()
})
afterEach(() => {
  jest.useRealTimers()
})

describe('onboarding flow: login → claim nickname → dashboard state', () => {
  it('full flow produces valid state for dashboard rendering', async () => {
    const store = createStore()

    // Step 1: Login
    const loginPromise = store.getState().login()
    jest.advanceTimersByTime(500)
    await loginPromise

    expect(store.getState().isAuthenticated).toBe(true)
    expect(store.getState().user).not.toBeNull()
    expect(store.getState().user?.nickname).toBeNull()

    // Step 2: Check nickname availability (simulates what the UI does)
    const checkPromise = checkNicknameAvailability('testuser')
    jest.advanceTimersByTime(500)
    const availability = await checkPromise

    expect(availability.available).toBe(true)

    // Step 3: Claim nickname
    const claimPromise = store.getState().claimNickname('testuser')
    jest.advanceTimersByTime(500)
    await claimPromise

    expect(store.getState().user?.nickname).toBe('testuser')

    // Step 4: Verify dashboard can render — all required selectors return valid data
    const state = store.getState()

    // Balance must be a finite number
    const netWorth = selectNetWorth(state)
    expect(typeof netWorth).toBe('number')
    expect(isFinite(netWorth)).toBe(true)
    expect(netWorth).toBe(12430)

    // Recent transactions must be an array
    const recentTxs = selectRecentTransactions(5)(state)
    expect(Array.isArray(recentTxs)).toBe(true)
    expect(recentTxs.length).toBeGreaterThan(0)

    // Each transaction must have required fields for dashboard rendering
    for (const tx of recentTxs) {
      expect(tx.id).toBeDefined()
      expect(tx.direction).toMatch(/^(inbound|outbound)$/)
      expect(typeof tx.amount).toBe('number')
      expect(typeof tx.initiatedAt).toBe('number')
      expect(tx.status).toBeDefined()
    }

    // Contacts must be available
    expect(Array.isArray(state.contacts)).toBe(true)

    // User must have all required fields
    expect(state.user?.id).toBeDefined()
    expect(state.user?.nickname).toBe('testuser')
  })

  it('dashboard state is valid even if user skips nickname', async () => {
    const store = createStore()

    // Login only, no nickname claim
    const loginPromise = store.getState().login()
    jest.advanceTimersByTime(500)
    await loginPromise

    const state = store.getState()

    // User exists but nickname is null
    expect(state.user).not.toBeNull()
    expect(state.user?.nickname).toBeNull()

    // Balance is still valid
    const netWorth = selectNetWorth(state)
    expect(netWorth).toBe(12430)

    // Transactions are still available
    const recentTxs = selectRecentTransactions(5)(state)
    expect(recentTxs.length).toBeGreaterThan(0)
  })

  it('login does not reset balances or seed data', async () => {
    const store = createStore()

    const balancesBefore = store.getState().balances
    const txsBefore = store.getState().transactions
    const contactsBefore = store.getState().contacts

    const loginPromise = store.getState().login()
    jest.advanceTimersByTime(500)
    await loginPromise

    // Login should only set auth state, not touch other slices
    expect(store.getState().balances).toEqual(balancesBefore)
    expect(store.getState().transactions).toEqual(txsBefore)
    expect(store.getState().contacts).toEqual(contactsBefore)
  })

  it('claimNickname does not reset balances or seed data', async () => {
    const store = createStore()

    const loginPromise = store.getState().login()
    jest.advanceTimersByTime(500)
    await loginPromise

    const balancesBefore = store.getState().balances
    const txsBefore = store.getState().transactions

    const claimPromise = store.getState().claimNickname('testuser')
    jest.advanceTimersByTime(500)
    await claimPromise

    expect(store.getState().balances).toEqual(balancesBefore)
    expect(store.getState().transactions).toEqual(txsBefore)
  })

  it('full flow then logout does not crash (browser reload handles cleanup)', async () => {
    const store = createStore()

    // Login + claim
    const loginPromise = store.getState().login()
    jest.advanceTimersByTime(500)
    await loginPromise
    const claimPromise = store.getState().claimNickname('testuser')
    jest.advanceTimersByTime(500)
    await claimPromise

    // Logout — in browser this clears localStorage/cookie and reloads the page.
    // In node test env (no window), it's a no-op. Store state is not reset
    // because the full page reload handles that by remounting the app.
    store.getState().logout()

    // Store state is unchanged in test env (no window = no-op)
    // In the real app, window.location.href = '/login' triggers a full reload
    expect(store.getState().isAuthenticated).toBe(true)
    expect(store.getState().user?.nickname).toBe('testuser')
    expect(store.getState().balances).toBeDefined()
  })
})
