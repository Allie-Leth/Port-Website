import {
  test,
  expect,
  navigateAndWait,
  setMobileViewport,
  setDesktopViewport,
} from '../fixtures/test-utils'

test.describe('Blog Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/blog')
  })

  test('displays page heading', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Blog', level: 1 })
    ).toBeVisible()
  })

  test.describe('Desktop', () => {
    test.beforeEach(async ({ page }) => {
      await setDesktopViewport(page)
    })

    test('shows desktop filter sidebar', async ({ page }) => {
      await expect(page.getByTestId('desktop-filter')).toBeVisible()
    })

    test('filters by domain', async ({ page }) => {
      const devopsBtn = page.getByRole('button', { name: /DevOps/i })
      if (await devopsBtn.isVisible()) {
        await devopsBtn.click()
        // Filter updates aria-pressed state
        await expect(devopsBtn).toHaveAttribute('aria-pressed', 'true')
      }
    })
  })

  test.describe('Mobile', () => {
    test.beforeEach(async ({ page }) => {
      await setMobileViewport(page)
      await page.reload()
    })

    test('shows mobile filter dropdown', async ({ page }) => {
      await expect(page.getByTestId('mobile-filter')).toBeVisible()
    })

    test('hides desktop filter', async ({ page }) => {
      await expect(page.getByTestId('desktop-filter')).not.toBeVisible()
    })
  })
})
