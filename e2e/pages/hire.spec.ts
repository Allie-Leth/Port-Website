import { test, expect, navigateAndWait } from '../fixtures/test-utils'

test.describe('Hire Page', () => {
  test.beforeEach(async ({ page }) => {
    await navigateAndWait(page, '/hire')
  })

  test('displays hero section', async ({ page }) => {
    await expect(
      page.getByRole('heading', { name: 'Alison Alva', level: 1 })
    ).toBeVisible()
  })

  test('displays stack diagram', async ({ page }) => {
    await expect(page.getByTestId('stack-diagram')).toBeVisible()
  })

  test('displays project buttons', async ({ page }) => {
    await page.waitForSelector('button', { timeout: 10000 })
    const projectBtns = page
      .locator('button')
      .filter({ hasText: /portfolio|k3s|iot/i })
    await expect(projectBtns.first()).toBeVisible({ timeout: 10000 })
  })

  test('projects are selectable', async ({ page }) => {
    // Wait for stack diagram to load with projects
    await page.waitForSelector('[aria-pressed]', { timeout: 10000 })
    // Verify there's at least one selected project
    await expect(
      page.locator('button[aria-pressed="true"]').first()
    ).toBeVisible()
  })

  test('displays CTA buttons', async ({ page }) => {
    await expect(page.getByRole('link', { name: /contact me/i })).toBeVisible()
  })
})
