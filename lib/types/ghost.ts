/**
 * Ghost Content API response types
 * @see https://ghost.org/docs/content-api/
 */

/**
 * Ghost tag structure from Content API
 */
export interface GhostTag {
  id: string
  name: string
  slug: string
  description?: string | null
  visibility: 'public' | 'internal'
}

/**
 * Ghost author structure from Content API
 */
export interface GhostAuthor {
  id: string
  name: string
  slug: string
  profile_image?: string | null
  bio?: string | null
}

/**
 * Ghost post structure from Content API
 */
export interface GhostPost {
  id: string
  uuid: string
  slug: string
  title: string
  html: string
  excerpt?: string
  custom_excerpt?: string | null
  feature_image?: string | null
  featured: boolean
  published_at: string
  updated_at: string
  created_at: string
  reading_time: number
  tags?: GhostTag[]
  authors?: GhostAuthor[]
}

/**
 * Ghost Content API pagination metadata
 */
export interface GhostPagination {
  page: number
  limit: number
  pages: number
  total: number
  next: number | null
  prev: number | null
}

/**
 * Ghost Content API response wrapper for posts
 */
export interface GhostPostsResponse {
  posts: GhostPost[]
  meta: {
    pagination: GhostPagination
  }
}

/**
 * Ghost Content API response wrapper for single post
 */
export interface GhostSinglePostResponse {
  posts: GhostPost[]
}

/**
 * Ghost API error response
 */
export interface GhostError {
  message: string
  errorType: string
}

/**
 * Ghost API error wrapper
 */
export interface GhostErrorResponse {
  errors: GhostError[]
}
