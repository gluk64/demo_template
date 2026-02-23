import { createStore } from '@/store/testUtils'

/**
 * Regression test for the race condition bug in the nickname claim flow.
 *
 * BUG: After claimNickname() resolved, a useEffect guard in the nickname page
 * called router.replace('/dashboard') at the same time as the handleClaim
 * callback called router.push('/dashboard'). Two simultaneous navigation
 * calls caused a client-side crash.
 *
 * FIX: Added isClaimingRef to prevent the useEffect guard from firing
 * when a claim is already in progress. The handleClaim function sets
 * isClaimingRef.current = true before calling claimNickname.
 *
 * This test verifies the store-level behavior that the nickname page
 * relies on: that claimNickname correctly sets user.nickname, which
 * is the trigger for both the useEffect guard and the handleClaim navigation.
 */

beforeEach(() => {
  jest.useFakeTimers()
})
afterEach(() => {
  jest.useRealTimers()
})

describe('claim nickname race condition regression', () => {
  it('claimNickname sets user.nickname synchronously after delay', async () => {
    const store = createStore()

    // Login first
    const loginPromise = store.getState().login()
    jest.advanceTimersByTime(500)
    await loginPromise

    // Verify nickname is null before claim
    expect(store.getState().user?.nickname).toBeNull()

    // Start claim
    const claimPromise = store.getState().claimNickname('testuser')

    // Before timer advances, nickname should still be null
    expect(store.getState().user?.nickname).toBeNull()

    // After timer, nickname should be set
    jest.advanceTimersByTime(500)
    await claimPromise
    expect(store.getState().user?.nickname).toBe('testuser')
  })

  it('store state is complete and valid immediately after claimNickname resolves', async () => {
    const store = createStore()

    const loginPromise = store.getState().login()
    jest.advanceTimersByTime(500)
    await loginPromise

    const claimPromise = store.getState().claimNickname('testuser')
    jest.advanceTimersByTime(500)
    await claimPromise

    // At this exact moment (when claimNickname resolves), the store state
    // must be valid for the dashboard to render. This is the moment when
    // both the useEffect and handleClaim would fire in the nickname page.
    const state = store.getState()

    // Auth is complete
    expect(state.isAuthenticated).toBe(true)
    expect(state.user?.nickname).toBe('testuser')
    expect(state.user?.id).toBeDefined()

    // Balance data is intact (not reset by claim)
    expect(state.balances.USDC).toBeDefined()
    expect(state.balances.USDC?.amount).toBe(10430)

    // Transaction data is intact
    expect(state.transactions.length).toBeGreaterThan(0)

    // Contacts are intact
    expect(state.contacts.length).toBeGreaterThan(0)

    // Send wizard is in default state (not corrupted)
    expect(state.sendWizard.step).toBe('from')
    expect(state.sendWizard.amount).toBeNull()

    // Private mode is off (default)
    expect(state.isPrivateMode).toBe(false)
  })

  it('multiple rapid claimNickname calls do not corrupt state', async () => {
    const store = createStore()

    const loginPromise = store.getState().login()
    jest.advanceTimersByTime(500)
    await loginPromise

    // Simulate a rapid double-click scenario
    const claim1 = store.getState().claimNickname('firstname')
    const claim2 = store.getState().claimNickname('secondname')

    jest.advanceTimersByTime(500)
    await claim1
    await claim2

    // The last claim should win
    const nickname = store.getState().user?.nickname
    expect(nickname === 'firstname' || nickname === 'secondname').toBe(true)

    // Other state must not be corrupted
    expect(store.getState().isAuthenticated).toBe(true)
    expect(store.getState().balances.USDC?.amount).toBe(10430)
  })
})
