import { createStore } from '@/store/testUtils'

// Use fake timers so mockDelay resolves instantly
beforeEach(() => {
  jest.useFakeTimers()
})
afterEach(() => {
  jest.useRealTimers()
})

describe('auth slice', () => {
  describe('initial state', () => {
    it('starts unauthenticated with no user', () => {
      const store = createStore()
      expect(store.getState().isAuthenticated).toBe(false)
      expect(store.getState().user).toBeNull()
    })
  })

  describe('login', () => {
    it('sets isAuthenticated to true after login', async () => {
      const store = createStore()
      const loginPromise = store.getState().login()
      jest.advanceTimersByTime(500)
      await loginPromise

      expect(store.getState().isAuthenticated).toBe(true)
    })

    it('creates a user with null nickname after login', async () => {
      const store = createStore()
      const loginPromise = store.getState().login()
      jest.advanceTimersByTime(500)
      await loginPromise

      const user = store.getState().user
      expect(user).not.toBeNull()
      expect(user?.id).toBe('user-demo-001')
      expect(user?.nickname).toBeNull()
      expect(user?.depositAddress).toBeNull()
      expect(user?.hasCompletedOnboarding).toBe(false)
      expect(user?.createdAt).toBeGreaterThan(0)
    })
  })

  describe('claimNickname', () => {
    it('sets the nickname on the user after claim', async () => {
      const store = createStore()

      // Login first
      const loginPromise = store.getState().login()
      jest.advanceTimersByTime(500)
      await loginPromise

      // Then claim
      const claimPromise = store.getState().claimNickname('testuser')
      jest.advanceTimersByTime(500)
      await claimPromise

      expect(store.getState().user?.nickname).toBe('testuser')
    })

    it('preserves other user fields when claiming nickname', async () => {
      const store = createStore()

      const loginPromise = store.getState().login()
      jest.advanceTimersByTime(500)
      await loginPromise

      const userBeforeClaim = store.getState().user
      expect(userBeforeClaim).not.toBeNull()

      const claimPromise = store.getState().claimNickname('testuser')
      jest.advanceTimersByTime(500)
      await claimPromise

      const userAfterClaim = store.getState().user
      expect(userAfterClaim?.id).toBe(userBeforeClaim?.id)
      expect(userAfterClaim?.createdAt).toBe(userBeforeClaim?.createdAt)
      expect(userAfterClaim?.depositAddress).toBe(userBeforeClaim?.depositAddress)
    })

    it('sets user to null if called before login (no user)', async () => {
      const store = createStore()
      // claimNickname without login — user is null
      const claimPromise = store.getState().claimNickname('testuser')
      jest.advanceTimersByTime(500)
      await claimPromise

      // The slice code: state.user ? { ...state.user, nickname } : null
      expect(store.getState().user).toBeNull()
    })

    it('does not affect authentication status', async () => {
      const store = createStore()

      const loginPromise = store.getState().login()
      jest.advanceTimersByTime(500)
      await loginPromise

      expect(store.getState().isAuthenticated).toBe(true)

      const claimPromise = store.getState().claimNickname('testuser')
      jest.advanceTimersByTime(500)
      await claimPromise

      expect(store.getState().isAuthenticated).toBe(true)
    })

    it('does not affect balances or transactions', async () => {
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
  })

  describe('updateNickname', () => {
    it('updates the nickname on the user', async () => {
      const store = createStore()
      const loginPromise = store.getState().login()
      jest.advanceTimersByTime(500)
      await loginPromise

      const claimPromise = store.getState().claimNickname('oldname')
      jest.advanceTimersByTime(500)
      await claimPromise

      expect(store.getState().user?.nickname).toBe('oldname')
      store.getState().updateNickname('newname')
      expect(store.getState().user?.nickname).toBe('newname')
    })

    it('preserves other user fields when updating nickname', async () => {
      const store = createStore()
      const loginPromise = store.getState().login()
      jest.advanceTimersByTime(500)
      await loginPromise

      const claimPromise = store.getState().claimNickname('oldname')
      jest.advanceTimersByTime(500)
      await claimPromise

      const userBefore = store.getState().user
      store.getState().updateNickname('newname')
      const userAfter = store.getState().user

      expect(userAfter?.id).toBe(userBefore?.id)
      expect(userAfter?.email).toBe(userBefore?.email)
      expect(userAfter?.createdAt).toBe(userBefore?.createdAt)
      expect(userAfter?.hasCompletedOnboarding).toBe(userBefore?.hasCompletedOnboarding)
    })

    it('does nothing if no user is logged in', () => {
      const store = createStore()
      store.getState().updateNickname('test')
      expect(store.getState().user).toBeNull()
    })
  })

  describe('completeOnboarding', () => {
    it('sets hasCompletedOnboarding to true', async () => {
      const store = createStore()
      const loginPromise = store.getState().login()
      jest.advanceTimersByTime(500)
      await loginPromise

      expect(store.getState().user?.hasCompletedOnboarding).toBe(false)
      store.getState().completeOnboarding()
      expect(store.getState().user?.hasCompletedOnboarding).toBe(true)
    })

    it('does nothing if no user is logged in', () => {
      const store = createStore()
      store.getState().completeOnboarding()
      expect(store.getState().user).toBeNull()
    })
  })

  describe('logout', () => {
    const mockRemoveItem = jest.fn()
    let mockHref = ''

    beforeEach(() => {
      mockHref = ''
      // Set up browser globals for node test environment
      const mockLocation = {} as Location
      Object.defineProperty(mockLocation, 'href', {
        get: () => mockHref,
        set: (val: string) => { mockHref = val },
        configurable: true,
      })
      Object.defineProperty(global, 'window', {
        value: { location: mockLocation },
        writable: true,
        configurable: true,
      })
      Object.defineProperty(global, 'localStorage', {
        value: { removeItem: mockRemoveItem },
        writable: true,
        configurable: true,
      })
      Object.defineProperty(global, 'document', {
        value: { cookie: '' },
        writable: true,
        configurable: true,
      })
    })

    afterEach(() => {
      mockRemoveItem.mockClear()
      // Clean up global mocks
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (global as Record<string, unknown>).window
      // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
      delete (global as Record<string, unknown>).localStorage
    })

    it('clears localStorage persistence key', () => {
      const store = createStore()
      store.getState().logout()
      expect(mockRemoveItem).toHaveBeenCalledWith('nab_v1')
    })

    it('clears the session cookie', () => {
      const store = createStore()
      store.getState().logout()
      expect(document.cookie).toContain('nab_session=')
      expect(document.cookie).toContain('max-age=0')
    })

    it('redirects to /login via full page reload', () => {
      const store = createStore()
      store.getState().logout()
      expect(mockHref).toBe('/login')
    })
  })
})
