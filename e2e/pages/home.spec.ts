import { test, expect, navigateAndWait } from '../fixtures/test-utils'

test.describe('Home Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/')
  })

  test('displays hero section with name', async ({ page }) => {
    await expect(page.getByText('Alison Alva')).toBeVisible()
  })

  test('displays rotating taglines', async ({ page }) => {
    await expect(page.getByTestId('taglines-container')).toBeVisible()
  })

  test('has navigation to blog', async ({ page }) => {
    await page.getByRole('link', { name: 'Blog' }).click()
    await expect(page).toHaveURL(/\/blog/)
  })

  test('has navigation to about', async ({ page }) => {
    await page.getByRole('link', { name: 'About' }).click()
    await expect(page).toHaveURL(/\/about/)
  })

  test('displays blog preview cards', async ({ page }) => {
    await expect(page.getByText('latest.blog')).toBeVisible()
  })
})
