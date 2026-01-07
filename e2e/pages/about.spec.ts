import { test, expect, navigateAndWait } from '../fixtures/test-utils'

test.describe('About Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/about')
  })

  test('displays page heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'About', level: 1 })
    ).toBeVisible()
  })

  test('displays introduction', async ({ page }) => {
    await expect(page.getByText(/I'm Alison/i)).toBeVisible()
  })
})
