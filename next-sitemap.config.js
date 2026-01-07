/** @type {import('next-sitemap').IConfig} */
module.exports = {
  // Base URL for all sitemap entries - reads from env at build time
  siteUrl: process.env.SITE_URL || 'https://scopecreep.productions',

  // Generate robots.txt alongside sitemap
  generateRobotsTxt: true,

  // Don't create index sitemap (only needed for large sites with 50k+ URLs)
  generateIndexSitemap: false,

  // Exclude API routes from sitemap
  exclude: ['/api/*'],

  // Robots.txt configuration
  robotsTxtOptions: {
    policies: [{ userAgent: '*', allow: '/' }],
  },

  // Fetch dynamic blog posts from Ghost CMS for sitemap
  additionalPaths: async (config) => {
    const ghostUrl = process.env.GHOST_URL
    const ghostKey = process.env.GHOST_API_KEY

    if (!ghostUrl || !ghostKey) {
      console.warn('Ghost API not configured, skipping dynamic sitemap entries')
      return []
    }

    try {
      const response = await fetch(
        `${ghostUrl}/ghost/api/content/posts/?key=${ghostKey}&limit=all&fields=slug,updated_at,published_at`
      )

      if (!response.ok) {
        console.warn('Failed to fetch Ghost posts for sitemap')
        return []
      }

      const data = await response.json()
      const posts = data.posts || []

      return posts.map((post) => ({
        loc: `/blog/${post.slug}`,
        lastmod: post.updated_at || post.published_at,
        changefreq: 'weekly',
        priority: 0.8,
      }))
    } catch (error) {
      console.warn('Error fetching Ghost posts for sitemap:', error)
      return []
    }
  },

  // Custom priority for different pages
  transform: async (config, path) => {
    const priorities = {
      '/': 1.0,
      '/blog': 0.9,
      '/about': 0.8,
      '/hire': 0.8,
      '/contact': 0.7,
    }

    return {
      loc: path,
      changefreq: path.startsWith('/blog/') ? 'weekly' : 'monthly',
      priority: priorities[path] || 0.7,
      lastmod: config.autoLastmod ? new Date().toISOString() : undefined,
    }
  },
}
