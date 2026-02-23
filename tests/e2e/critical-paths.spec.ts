import { test, expect } from '@playwright/test'
import { loginAs } from './helpers'

test('onboarding: login → nickname → addresses → send-from → dashboard renders', async ({ page }) => {
  await page.goto('/login')
  await page.click('[data-testid="google-login-button"]')
  await page.waitForURL('/setup/nickname')
  await page.fill('[data-testid="nickname-input"]', 'testuser')
  await page.waitForSelector('text=Available')
  await page.click('[data-testid="claim-nickname-button"]')
  await page.waitForURL('/setup/addresses')
  await page.click('[data-testid="continue-button"]')
  await page.waitForURL('/setup/send-from')
  await page.click('[data-testid="get-started-button"]')
  await page.waitForURL('/dashboard')
  await expect(page.locator('[data-testid="balance-amount"]')).toBeVisible()
})

test('send: full flow updates balance and activity feed', async ({ page }) => {
  await loginAs(page, 'testuser')
  await page.click('[data-testid="send-button"]')
  // Step 1: from — click Continue to advance to recipient
  await page.click('text=Continue')
  // Step 2: recipient — open contact picker, select alice (auto-advances to amount)
  await page.click('[data-testid="contact-picker-button"]')
  await page.click('text=alice')
  // Step 3: amount
  await page.fill('[data-testid="amount-input"]', '100')
  await page.click('text=Continue')
  // Step 4: review
  await page.click('[data-testid="confirm-send"]')
  await page.waitForURL('/dashboard')
  await expect(page.locator('[data-testid="balance-amount"]')).toContainText('12,330')
})

test('persistence: reload preserves balance and nickname', async ({ page }) => {
  await loginAs(page, 'testuser')
  await page.reload()
  await expect(page.locator('[data-testid="balance-amount"]')).toBeVisible()
  await expect(page.locator('text=testuser')).toBeVisible()
})

test('sign out: clears state and redirects to login', async ({ page }) => {
  await loginAs(page, 'testuser')
  await page.goto('/settings')
  await page.click('[data-testid="sign-out-button"]')
  await page.click('text=Confirm')
  await page.waitForURL('/login', { waitUntil: 'networkidle' })
  await page.goto('/dashboard')
  await expect(page).toHaveURL('/login')
})

test('sign out: clears state so next login requires nickname claim', async ({ page }) => {
  await loginAs(page, 'alex')
  await page.goto('/settings')
  await page.click('[data-testid="sign-out-button"]')
  await page.click('text=Confirm')
  await page.waitForURL('/login', { waitUntil: 'networkidle' })
  await page.click('[data-testid="google-login-button"]')
  await page.waitForURL('/setup/nickname')
  await expect(page.locator('[data-testid="nickname-input"]')).toHaveValue('')
})

test('real UI login flow: login → nickname → addresses → send-from → dashboard → logout → login again', async ({ page }) => {
  // Start completely clean
  await page.context().clearCookies()
  await page.evaluate(() => localStorage.clear())

  // First login
  await page.goto('/login')
  await page.click('[data-testid="google-login-button"]')
  await page.waitForURL('/setup/nickname')
  await page.fill('[data-testid="nickname-input"]', 'testuser')
  await page.waitForSelector('text=Available')
  await page.click('[data-testid="claim-nickname-button"]')
  await page.waitForURL('/setup/addresses')
  await page.click('[data-testid="continue-button"]')
  await page.waitForURL('/setup/send-from')
  await page.click('[data-testid="get-started-button"]')
  await page.waitForURL('/dashboard')
  await expect(page.locator('[data-testid="balance-amount"]')).toBeVisible()

  // Sign out
  await page.goto('/settings')
  await page.click('[data-testid="sign-out-button"]')
  await page.click('text=Confirm')
  await page.waitForURL('/login', { waitUntil: 'networkidle' })

  // Second login — must not get stuck
  await page.click('[data-testid="google-login-button"]')
  await page.waitForURL('/setup/nickname')
  await page.fill('[data-testid="nickname-input"]', 'testuser2')
  await page.waitForSelector('text=Available')
  await page.click('[data-testid="claim-nickname-button"]')
  await page.waitForURL('/setup/addresses')
  await page.click('[data-testid="continue-button"]')
  await page.waitForURL('/setup/send-from')
  await page.click('[data-testid="get-started-button"]')
  await page.waitForURL('/dashboard')
  await expect(page.locator('[data-testid="balance-amount"]')).toBeVisible()
})

test('logout → login → nickname flow completes without hanging', async ({ page }) => {
  // Start clean
  await page.context().clearCookies()
  await page.evaluate(() => localStorage.clear())

  // First full login
  await page.goto('/login')
  await page.click('[data-testid="google-login-button"]')
  await page.waitForURL('/setup/nickname', { timeout: 5000 })
  await page.fill('[data-testid="nickname-input"]', 'e2euser')
  await page.waitForSelector('text=Available', { timeout: 3000 })
  await page.click('[data-testid="claim-nickname-button"]')
  await page.waitForURL(/\/(setup\/addresses|dashboard)/, { timeout: 5000 })

  // Navigate to sign out (skip remaining onboarding if shown)
  await page.goto('/settings')
  await page.click('[data-testid="sign-out-button"]')
  await page.click('text=Confirm')
  await page.waitForURL('/login', { timeout: 5000, waitUntil: 'networkidle' })

  // CRITICAL: click login again — this is where the hang occurred
  const loginButton = page.locator('[data-testid="google-login-button"]')
  await expect(loginButton).toBeEnabled({ timeout: 2000 })
  await loginButton.click()

  // Must navigate away from /login within 5 seconds — if it hangs, this fails
  await page.waitForURL('/setup/nickname', { timeout: 5000 })

  // Confirm the page is interactive — input must be focusable
  await expect(page.locator('[data-testid="nickname-input"]')).toBeVisible({ timeout: 2000 })
  await expect(page.locator('[data-testid="nickname-input"]')).toBeEditable()
})
