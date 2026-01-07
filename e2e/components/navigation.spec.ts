import { test, expect, navigateAndWait } from '../fixtures/test-utils'

test.describe('Navigation', () => {
  test('can navigate through all pages', async ({ page }) => {
    await navigateAndWait(page, '/')
    await expect(page).toHaveURL('/')

    // Click Blog link and wait for navigation
    await page.getByRole('link', { name: 'Blog' }).click()
    await page.waitForURL(/\/blog/)
    await expect(page).toHaveURL(/\/blog/)

    await navigateAndWait(page, '/about')
    await expect(page).toHaveURL('/about')

    await navigateAndWait(page, '/contact')
    await expect(page).toHaveURL('/contact')

    await navigateAndWait(page, '/hire')
    await expect(page).toHaveURL('/hire')
  })
})
