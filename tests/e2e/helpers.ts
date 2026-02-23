import type { Page } from '@playwright/test'

export const loginAs = async (page: Page, nickname: string): Promise<void> => {
  await page.goto('/login')
  await page.evaluate(() => {
    document.cookie = 'nab_session=1; path=/'
    localStorage.setItem('nab_v1', JSON.stringify({
      state: {
        isAuthenticated: true,
        user: { id: 'user-demo-001', nickname, email: 'vitalik@gmail.com', depositAddress: null, hasCompletedOnboarding: true, createdAt: Date.now() },
        balances: {
          USDC: { symbol: 'USDC', amount: 10430, usdValue: 10430 },
          USDT: { symbol: 'USDT', amount: 2000, usdValue: 2000 },
        },
        contacts: [],
        transactions: [],
        depositAddresses: [],
      },
      version: 1,
    }))
  })
  await page.goto('/dashboard')
}
