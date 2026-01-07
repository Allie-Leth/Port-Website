/**
 * Technical domain categories for blog posts
 */
export type TechnicalDomain =
  | 'Firmware'
  | 'DevOps'
  | 'Security'
  | 'Full-Stack'
  | 'Projects'

/**
 * Blog post data structure
 */
export interface BlogPost {
  id: string
  slug: string
  title: string
  excerpt: string
  /** Short summary for hire page preview (falls back to excerpt if not provided) */
  summary?: string
  content: string
  date: string // ISO 8601 format
  author: string
  tags: string[]
  domain: TechnicalDomain
  readTime: number // in minutes
  featured: boolean
  imageUrl?: string
  /** Optional URL to related repo, project, or resource */
  relatedUrl?: string
}

/**
 * Type guard to check if an object is a valid BlogPost
 */
export function isBlogPost(obj: unknown): obj is BlogPost {
  if (!obj || typeof obj !== 'object') {
    return false
  }

  const post = obj as Record<string, unknown>

  // Check required string fields
  const stringFields = [
    'id',
    'slug',
    'title',
    'excerpt',
    'content',
    'date',
    'author',
  ]
  for (const field of stringFields) {
    if (typeof post[field] !== 'string') {
      return false
    }
  }

  // Check domain is a valid TechnicalDomain
  const validDomains = [
    'Firmware',
    'DevOps',
    'Security',
    'Full-Stack',
    'Projects',
  ]
  if (!validDomains.includes(post.domain as string)) {
    return false
  }

  // Check tags is an array
  if (!Array.isArray(post.tags)) {
    return false
  }

  // Check all tags are strings
  if (!post.tags.every((tag: unknown) => typeof tag === 'string')) {
    return false
  }

  // Check readTime is a number
  if (typeof post.readTime !== 'number') {
    return false
  }

  // Check featured is a boolean
  if (typeof post.featured !== 'boolean') {
    return false
  }

  // Check optional imageUrl if present
  if (post.imageUrl !== undefined && typeof post.imageUrl !== 'string') {
    return false
  }

  // Check optional summary if present
  if (post.summary !== undefined && typeof post.summary !== 'string') {
    return false
  }

  // Check optional relatedUrl if present
  if (post.relatedUrl !== undefined && typeof post.relatedUrl !== 'string') {
    return false
  }

  return true
}

/**
 * Validates a BlogPost and returns an array of error messages
 */
export function validateBlogPost(post: BlogPost): string[] {
  const errors: string[] = []

  // Validate required string fields are not empty
  if (!post.id.trim()) {
    errors.push('ID cannot be empty')
  }

  if (!post.title.trim()) {
    errors.push('Title cannot be empty')
  }

  if (!post.author.trim()) {
    errors.push('Author cannot be empty')
  }

  // Validate slug format (URL-friendly)
  if (!/^[a-z0-9-]+$/.test(post.slug)) {
    errors.push('Slug must be URL-friendly')
  }

  // Validate date format
  const dateRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(Z|[+-]\d{2}:\d{2})$/
  if (!dateRegex.test(post.date)) {
    const date = new Date(post.date)
    if (isNaN(date.getTime())) {
      errors.push('Invalid date format')
    }
  }

  // Validate read time
  if (post.readTime < 0) {
    errors.push('Read time must be positive')
  }

  // Validate tags
  const hasEmptyTags = post.tags.some((tag) => !tag.trim())
  if (hasEmptyTags) {
    errors.push('Tags cannot be empty strings')
  }

  // Check for duplicate tags (case-insensitive)
  const lowercaseTags = post.tags.map((tag) => tag.toLowerCase())
  const uniqueTags = new Set(lowercaseTags)
  if (uniqueTags.size !== post.tags.length) {
    errors.push('Duplicate tags found')
  }

  return errors
}

/**
 * Calculates estimated read time for content
 * @param content - The blog post content (can include HTML/Markdown)
 * @returns Read time in minutes
 */
export function calculateReadTime(content: string): number {
  if (!content.trim()) {
    return 0
  }

  // Strip HTML tags
  let text = content.replace(/<[^>]*>/g, '')

  // Strip markdown formatting (basic)
  text = text
    .replace(/#{1,6}\s/g, '') // Headers
    .replace(/\*\*([^*]+)\*\*/g, '$1') // Bold
    .replace(/\*([^*]+)\*/g, '$1') // Italic
    .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1') // Links
    .replace(/```[^`]*```/g, (match) => {
      // Code blocks count but at 50% rate
      const words = match.split(/\s+/).length
      return 'word '.repeat(Math.floor(words / 2))
    })
    .replace(/`([^`]+)`/g, '$1') // Inline code

  // Count words
  const words = text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0)
  const wordCount = words.length

  // Calculate read time (200 words per minute average)
  const readTime = Math.ceil(wordCount / 200)

  // Minimum 1 minute for very short content
  if (wordCount > 0 && readTime === 0) {
    return 1
  }

  return readTime
}
