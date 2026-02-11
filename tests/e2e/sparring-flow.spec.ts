import { expect, test } from '@playwright/test'

test('sparring flow with auth redirect and booking payment', async ({ page }) => {
  await page.goto('/find-sparring')
  await expect(page).toHaveURL(/auth/)

  await page.locator('input').nth(0).fill('Student User')
  await page.locator('input').nth(1).fill('440100199801018888')
  await page.locator('input').nth(2).fill('selfie-pass-token')
  await page.getByRole('button', { name: '提交认证' }).click()

  await expect(page).toHaveURL(/find-sparring/)

  await page
    .locator('input[placeholder="默认网球，可改为羽毛球等"]')
    .fill('网球')
  await page
    .locator('input[placeholder="如：每周六 14:00-16:00"]')
    .fill('每周六 14:00-16:00')
  await page.locator('input[placeholder="如：XX大学网球场"]').fill('XX大学网球场')
  await page.locator('input[type="number"]').first().fill('100')
  await page
    .locator('textarea[placeholder="如：提升发球、截击和实战能力"]')
    .fill('提升发球与截击')

  await page.getByRole('button', { name: '智能匹配陪练' }).click()
  await expect(page.locator('.candidate-card')).toHaveCount(1)

  await page.locator('.candidate-card .primary').first().click()
  await expect(page).toHaveURL(/payment/)

  await page.locator('.payment-sheet .primary').click()
  await expect(page.locator('article.section-card .status.status-paid')).toBeVisible()
})

