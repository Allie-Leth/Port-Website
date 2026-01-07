import { test, expect, navigateAndWait } from '../fixtures/test-utils'

test.describe('Blog Post Page', () => {
  test('returns 404 for non-existent post', async ({ page }) => {
    const response = await page.goto('/blog/non-existent-slug-12345')
    expect(response?.status()).toBe(404)
  })

  test('navigates from blog listing to post', async ({ page }) => {
    await navigateAndWait(page, '/blog')
    // Find blog post links (exclude the /blog page itself)
    const postLinks = page.locator('a[href^="/blog/"]').filter({
      hasNot: page.locator('[href="/blog"]'),
    })
    const firstPost = postLinks.first()
    if ((await firstPost.count()) > 0) {
      const href = await firstPost.getAttribute('href')
      await firstPost.click()
      await expect(page).toHaveURL(
        new RegExp(href!.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'))
      )
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible()
    }
  })
})
