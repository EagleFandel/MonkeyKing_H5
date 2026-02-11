import { expect, test } from '@playwright/test'

test('tutor flow with auth redirect and payment success', async ({ page }) => {
  await page.goto('/find-tutor')
  await expect(page).toHaveURL(/auth/)

  await page.locator('input').nth(0).fill('Parent User')
  await page.locator('input').nth(1).fill('440100199901019999')
  await page.locator('input').nth(2).fill('selfie-pass-token')
  await page.getByRole('button', { name: '提交认证' }).click()

  await expect(page).toHaveURL(/find-tutor/)

  await page.locator('input[placeholder="如：初二"]').fill('初二')
  await page
    .locator('input[placeholder="如：数学, 英语"]')
    .fill('数学,英语')
  await page
    .locator('input[placeholder="如：每周一三五 18:00-20:00"]')
    .fill('每周一三五 18:00-20:00')
  await page.locator('input[type="number"]').first().fill('120')
  await page.locator('input[placeholder="如：线上 / 徐汇区"]').fill('线上')

  await page.getByRole('button', { name: '智能匹配家教' }).click()
  await expect(page.locator('.candidate-card')).toHaveCount(1)

  await page.locator('.candidate-card .primary').first().click()
  await expect(page).toHaveURL(/payment/)

  await page.locator('.payment-sheet .primary').click()
  await expect(page.locator('article.section-card .status.status-paid')).toBeVisible()
})

