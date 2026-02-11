import { expect, test } from '@playwright/test'

test('jobs flow with profile generation and apply', async ({ page }) => {
  await page.goto('/discover-jobs')
  await expect(page).toHaveURL(/auth/)

  await page.locator('input').nth(0).fill('Student Job User')
  await page.locator('input').nth(1).fill('440100199701011111')
  await page.locator('input').nth(2).fill('selfie-pass-token')
  await page.getByRole('button', { name: '提交认证' }).click()

  await expect(page).toHaveURL(/discover-jobs/)

  await page
    .locator('input[placeholder="如：平面设计, 视频剪辑, 编程"]')
    .fill('平面设计,视频剪辑')
  await page.locator('input[placeholder="如：中级"]').fill('中级')
  await page.locator('input[placeholder="如：每周 20 小时"]').fill('每周20小时')
  await page.locator('input[placeholder="如：30 元/小时"]').fill('30 元/小时')
  await page.locator('input[placeholder="如：海报设计, 品牌视觉"]').fill('海报设计,品牌视觉')
  await page
    .locator('textarea[placeholder="填写过往经验、项目成果与个人优势"]')
    .fill('有半年校园宣传设计经验，沟通和交付稳定。')

  await page.getByRole('button', { name: '生成人才画像' }).click()

  await page.getByRole('button', { name: '智能推荐岗位' }).click()
  await expect(page.locator('.candidate-card')).toHaveCount(1)

  await page.locator('.candidate-card .primary').first().click()
})
