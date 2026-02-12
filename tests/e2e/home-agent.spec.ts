import { expect, test } from '@playwright/test'

test('home-agent page renders centered assistant and supports key interactions', async ({ page }) => {
  await page.goto('/home')

  await expect(page.locator('[data-testid="home-agent-page"]')).toBeVisible()
  const assistantScope = page.locator('[data-testid="home-agent-assistant"]')
  const assistantInput = assistantScope.locator('textarea')
  await expect(assistantInput).toBeVisible()

  const firstSuggestion = page.locator('[data-testid="home-agent-suggestion"]').first()
  await firstSuggestion.click()
  await expect(assistantInput).not.toHaveValue('')

  await assistantScope.locator('.extract-btn').click()
  await expect(assistantScope.locator('.result-block')).toBeVisible()

  const bottomNavItems = page.locator('[data-testid="home-agent-nav"] .bottom-item')
  await expect(bottomNavItems).toHaveCount(5)

  await bottomNavItems.nth(0).click()
  await expect(page).toHaveURL(/\/$/)

  await page.goto('/home')
  await bottomNavItems.nth(4).click()
  await expect(page).toHaveURL(/profile/)

  await page.goto('/home')
  await bottomNavItems.nth(3).click()
  await expect(page).toHaveURL(/auth|find-project/)
})
