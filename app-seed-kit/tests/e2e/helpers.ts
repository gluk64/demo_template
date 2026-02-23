import type { Page } from '@playwright/test'

/**
 * Playwright helper to log in as a user by setting localStorage and cookies.
 * Adapt this to your app's store shape and session cookie.
 */
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
