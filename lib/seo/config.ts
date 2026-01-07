/**
 * Centralized SEO configuration
 * All SEO values are managed here to avoid hardcoded URLs across the codebase
 */

/**
 * SEO configuration object
 * Uses functions for dynamic values (env vars) and static values for constants
 */
export const seoConfig = {
  /**
   * Get the site URL dynamically from environment
   * @returns The site URL from SITE_URL env var, or fallback
   */
  getSiteUrl: (): string => {
    const url = process.env.SITE_URL
    return url && url.trim() !== '' ? url : 'https://scopecreep.productions'
  },

  /** Site name used in title templates and OG tags */
  siteName: 'Scope Creep Productions',

  /** Default page title when no specific title is set */
  defaultTitle: 'Alison Alva - Scope Creep Productions',

  /** Default meta description for the site */
  defaultDescription:
    'Personal portfolio showcasing embedded, distributed, GitLab projects, and technical blog posts',

  /** Author information for structured data */
  author: {
    name: 'Alison Alva',
  },

  /** Social profile URLs for SocialProfileJsonLd */
  social: {
    github: 'https://github.com/Allie-Leth',
    gitlab: 'https://gitlab.scopecreep.productions/leth',
  },

  /** Open Graph default configuration */
  openGraph: {
    type: 'website' as const,
    locale: 'en_US',
  },
}
