/**
 * SEO Configuration Tests
 * Tests for centralized SEO configuration
 */

describe('seoConfig', () => {
  // Store original env
  const originalEnv = process.env

  beforeEach(() => {
    // Reset env before each test
    jest.resetModules()
    process.env = { ...originalEnv }
  })

  afterAll(() => {
    // Restore original env
    process.env = originalEnv
  })

  describe('getSiteUrl', () => {
    it('returns SITE_URL from environment when set', async () => {
      process.env.SITE_URL = 'https://custom-site.com'
      const { seoConfig } = await import('@/lib/seo/config')

      expect(seoConfig.getSiteUrl()).toBe('https://custom-site.com')
    })

    it('returns fallback URL when SITE_URL is not set', async () => {
      delete process.env.SITE_URL
      const { seoConfig } = await import('@/lib/seo/config')

      expect(seoConfig.getSiteUrl()).toBe('https://scopecreep.productions')
    })

    it('returns fallback URL when SITE_URL is empty string', async () => {
      process.env.SITE_URL = ''
      const { seoConfig } = await import('@/lib/seo/config')

      expect(seoConfig.getSiteUrl()).toBe('https://scopecreep.productions')
    })
  })

  describe('siteName', () => {
    it('returns the site name', async () => {
      const { seoConfig } = await import('@/lib/seo/config')

      expect(seoConfig.siteName).toBe('Scope Creep Productions')
    })
  })

  describe('defaultTitle', () => {
    it('returns the default page title', async () => {
      const { seoConfig } = await import('@/lib/seo/config')

      expect(seoConfig.defaultTitle).toBe(
        'Alison Alva - Scope Creep Productions'
      )
    })
  })

  describe('defaultDescription', () => {
    it('returns the default meta description', async () => {
      const { seoConfig } = await import('@/lib/seo/config')

      expect(seoConfig.defaultDescription).toContain('portfolio')
    })
  })

  describe('author', () => {
    it('contains author name', async () => {
      const { seoConfig } = await import('@/lib/seo/config')

      expect(seoConfig.author.name).toBe('Alison Alva')
    })
  })

  describe('social', () => {
    it('contains GitHub profile URL', async () => {
      const { seoConfig } = await import('@/lib/seo/config')

      expect(seoConfig.social.github).toContain('github.com')
    })

    it('contains GitLab profile URL', async () => {
      const { seoConfig } = await import('@/lib/seo/config')

      expect(seoConfig.social.gitlab).toContain('gitlab')
    })
  })

  describe('openGraph', () => {
    it('has website type for default', async () => {
      const { seoConfig } = await import('@/lib/seo/config')

      expect(seoConfig.openGraph.type).toBe('website')
    })

    it('has en_US locale', async () => {
      const { seoConfig } = await import('@/lib/seo/config')

      expect(seoConfig.openGraph.locale).toBe('en_US')
    })
  })
})
