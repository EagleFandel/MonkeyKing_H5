import { expect, test } from '@playwright/test'

test('project flow with auth redirect and payment success', async ({ page }) => {
  await page.goto('/find-project')
  await expect(page).toHaveURL(/auth/)

  await page.locator('input').nth(0).fill('Audit User')
  await page.locator('input').nth(1).fill('440100200001018888')
  await page.locator('input').nth(2).fill('selfie-pass-token')
  await page.getByRole('button', { name: '提交认证' }).click()

  await expect(page).toHaveURL(/find-project/)

  await page.locator('input[placeholder="如：电商小程序"]').fill('ecommerce miniapp')
  await page
    .locator('input[placeholder="如：Vue3, Node.js, AI"]')
    .fill('vue3,nodejs')
  await page.locator('input[type="number"]').nth(0).fill('3000')
  await page.locator('input[type="number"]').nth(1).fill('8000')
  await page.locator('input[type="date"]').nth(0).fill('2026-03-01')
  await page.locator('input[type="date"]').nth(1).fill('2026-05-01')
  await page
    .locator('input[placeholder="如：注重协作、责任心强"]')
    .fill('协作,责任心')

  await page
    .locator('textarea[placeholder="描述核心目标、里程碑与交付边界"]')
    .fill('deliver shopping and order process')

  await page.getByRole('button', { name: '生成项目报告' }).click()
  await expect(page.getByRole('heading', { name: '项目报告' })).toBeVisible()

  await page.getByRole('button', { name: '智能匹配开发者' }).click()
  await expect(page.locator('.candidate-card')).toHaveCount(1)

  await page.locator('.candidate-card .primary').first().click()
  await expect(page).toHaveURL(/payment/)

  await page.locator('.payment-sheet .primary').click()
  await expect(page.locator('article.section-card .status.status-paid')).toBeVisible()
})

