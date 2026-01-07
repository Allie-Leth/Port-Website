import { test, expect, navigateAndWait } from '../fixtures/test-utils'

test.describe('Contact Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/contact')
  })

  test('displays email link', async ({ page }) => {
    const emailLink = page.getByRole('link', { name: /email/i })
    await expect(emailLink).toBeVisible()
    await expect(emailLink).toHaveAttribute('href', /^mailto:/)
  })

  test('displays GitHub link', async ({ page }) => {
    const ghLink = page.getByRole('link', { name: /github/i })
    await expect(ghLink).toBeVisible()
    await expect(ghLink).toHaveAttribute('target', '_blank')
  })

  test('displays GitLab link', async ({ page }) => {
    const glLink = page.getByRole('link', { name: /gitlab/i })
    await expect(glLink).toBeVisible()
    await expect(glLink).toHaveAttribute('target', '_blank')
  })
})
