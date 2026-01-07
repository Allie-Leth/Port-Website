/**
 * Ghost CMS Content API service
 * Fetches blog posts from Ghost and maps them to BlogPost interface
 */

import { BlogPost, TechnicalDomain, calculateReadTime } from '@/lib/types/blog'
import {
  GhostPost,
  GhostPostsResponse,
  GhostSinglePostResponse,
  GhostTag,
} from '@/lib/types/ghost'

/**
 * Valid technical domains for categorization
 */
const VALID_DOMAINS: TechnicalDomain[] = [
  'Firmware',
  'DevOps',
  'Security',
  'Full-Stack',
  'Projects',
]

/**
 * Ghost API configuration from environment
 */
function getGhostConfig(): { url: string; apiKey: string } {
  const url = process.env.GHOST_URL
  const apiKey = process.env.GHOST_API_KEY

  if (!url || !apiKey) {
    throw new Error(
      'Ghost API configuration missing. Set GHOST_URL and GHOST_API_KEY environment variables.'
    )
  }

  return { url: url.replace(/\/$/, ''), apiKey }
}

/**
 * Extracts the technical domain from Ghost tags
 * Looks for tags matching valid domains (case-insensitive)
 */
export function extractDomainFromTags(tags: GhostTag[]): TechnicalDomain {
  for (const tag of tags) {
    const normalizedName = tag.name.trim()
    const matchedDomain = VALID_DOMAINS.find(
      (domain) => domain.toLowerCase() === normalizedName.toLowerCase()
    )
    if (matchedDomain) {
      return matchedDomain
    }
  }
  return 'Projects' // Default domain
}

/**
 * Extracts regular tags from Ghost tags, excluding domain tags
 */
export function extractTagsFromGhost(ghostTags: GhostTag[]): string[] {
  return ghostTags
    .filter((tag) => {
      const normalizedName = tag.name.trim().toLowerCase()
      return !VALID_DOMAINS.some(
        (domain) => domain.toLowerCase() === normalizedName
      )
    })
    .map((tag) => tag.name)
}

/**
 * Maps a Ghost post to the BlogPost interface
 */
export function mapGhostPostToBlogPost(ghostPost: GhostPost): BlogPost {
  const tags = ghostPost.tags || []
  const authors = ghostPost.authors || []
  const primaryAuthor = authors[0]?.name || 'Unknown'

  // Use custom_excerpt if available, otherwise use excerpt, or generate from HTML
  let excerpt = ghostPost.custom_excerpt || ghostPost.excerpt || ''
  if (!excerpt && ghostPost.html) {
    // Strip HTML and take first 200 characters
    const textContent = ghostPost.html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim()
    excerpt =
      textContent.length > 200 ? textContent.slice(0, 197) + '...' : textContent
  }

  return {
    id: ghostPost.id,
    slug: ghostPost.slug,
    title: ghostPost.title,
    excerpt,
    content: ghostPost.html,
    date: ghostPost.published_at,
    author: primaryAuthor,
    tags: extractTagsFromGhost(tags),
    domain: extractDomainFromTags(tags),
    readTime: ghostPost.reading_time || calculateReadTime(ghostPost.html),
    featured: ghostPost.featured,
    imageUrl: ghostPost.feature_image || undefined,
  }
}

/**
 * Fetches all published posts from Ghost Content API
 */
export async function fetchGhostPosts(): Promise<BlogPost[]> {
  const { url, apiKey } = getGhostConfig()

  const apiUrl = new URL(`${url}/ghost/api/content/posts/`)
  apiUrl.searchParams.set('key', apiKey)
  apiUrl.searchParams.set('include', 'tags,authors')
  apiUrl.searchParams.set('limit', 'all')

  const response = await fetch(apiUrl.toString(), {
    next: { revalidate: 300 }, // Revalidate every 5 minutes
  })

  if (!response.ok) {
    throw new Error(
      `Ghost API error: ${response.status} ${response.statusText}`
    )
  }

  // Check content type to detect auth redirects (returns HTML instead of JSON)
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    console.warn(
      'Ghost API returned non-JSON response (possibly auth redirect). ' +
        'Ensure GHOST_URL points to internal cluster URL when deployed.'
    )
    return []
  }

  const data: GhostPostsResponse = await response.json()
  return data.posts.map(mapGhostPostToBlogPost)
}

/**
 * Fetches a single post by slug from Ghost Content API
 */
export async function fetchGhostPostBySlug(
  slug: string
): Promise<BlogPost | null> {
  const { url, apiKey } = getGhostConfig()

  const apiUrl = new URL(`${url}/ghost/api/content/posts/slug/${slug}/`)
  apiUrl.searchParams.set('key', apiKey)
  apiUrl.searchParams.set('include', 'tags,authors')

  const response = await fetch(apiUrl.toString(), {
    next: { revalidate: 300 },
  })

  if (response.status === 404) {
    return null
  }

  if (!response.ok) {
    throw new Error(
      `Ghost API error: ${response.status} ${response.statusText}`
    )
  }

  // Check content type to detect auth redirects
  const contentType = response.headers.get('content-type') || ''
  if (!contentType.includes('application/json')) {
    console.warn(
      'Ghost API returned non-JSON response (possibly auth redirect). ' +
        'Ensure GHOST_URL points to internal cluster URL when deployed.'
    )
    return null
  }

  const data: GhostSinglePostResponse = await response.json()
  if (!data.posts || data.posts.length === 0) {
    return null
  }

  return mapGhostPostToBlogPost(data.posts[0])
}

/**
 * Checks if Ghost API is configured and available
 */
export function isGhostConfigured(): boolean {
  return !!(process.env.GHOST_URL && process.env.GHOST_API_KEY)
}
