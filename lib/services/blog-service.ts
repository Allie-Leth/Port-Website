import { BlogPost, TechnicalDomain } from '@/lib/types/blog'
import {
  fetchGhostPosts,
  fetchGhostPostBySlug,
} from '@/lib/services/ghost-service'

/**
 * Service class for managing blog posts from Ghost CMS
 */
export class BlogService {
  private posts: BlogPost[]

  constructor(posts: BlogPost[]) {
    this.posts = posts.map((post) => ({ ...post }))
  }

  /**
   * Get all posts sorted by date (newest first)
   */
  getAllPosts(): BlogPost[] {
    return this.posts
      .map((post) => ({ ...post }))
      .sort((a, b) => {
        return new Date(b.date).getTime() - new Date(a.date).getTime()
      })
  }

  /**
   * Get the featured post
   */
  getFeaturedPost(): BlogPost | null {
    return this.posts.find((post) => post.featured) || null
  }

  /**
   * Get posts by tag (case-insensitive)
   */
  getPostsByTag(tag: string): BlogPost[] {
    const trimmedTag = tag.trim()
    if (!trimmedTag) {
      return []
    }

    const lowercaseTag = trimmedTag.toLowerCase()
    const filtered = this.posts.filter((post) =>
      post.tags.some((t) => t.toLowerCase() === lowercaseTag)
    )

    return filtered.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }

  /**
   * Get N most recent posts
   * @param limit Number of posts to return
   * @param excludeFeatured Whether to exclude featured posts
   */
  getRecentPosts(limit: number, excludeFeatured = false): BlogPost[] {
    if (limit <= 0) {
      return []
    }

    let posts = this.getAllPosts()

    if (excludeFeatured) {
      posts = posts.filter((post) => !post.featured)
    }

    return posts.slice(0, limit)
  }

  /**
   * Get a post by its slug
   */
  getPostBySlug(slug: string): BlogPost | null {
    if (!slug) {
      return null
    }
    return this.posts.find((post) => post.slug === slug) || null
  }

  /**
   * Get all unique tags sorted alphabetically
   */
  getAllTags(): string[] {
    const tagSet = new Set<string>()
    this.posts.forEach((post) => {
      post.tags.forEach((tag) => tagSet.add(tag))
    })
    return Array.from(tagSet).sort()
  }

  /**
   * Get posts by domain
   */
  getPostsByDomain(domain: TechnicalDomain): BlogPost[] {
    const filtered = this.posts.filter((post) => post.domain === domain)

    return filtered.sort((a, b) => {
      return new Date(b.date).getTime() - new Date(a.date).getTime()
    })
  }
}

/**
 * Fetches all posts from Ghost CMS
 */
export async function getAllPosts(): Promise<BlogPost[]> {
  const posts = await fetchGhostPosts()
  const service = new BlogService(posts)
  return service.getAllPosts()
}

/**
 * Fetches the featured post from Ghost CMS
 */
export async function getFeaturedPost(): Promise<BlogPost | null> {
  const posts = await fetchGhostPosts()
  const service = new BlogService(posts)
  return service.getFeaturedPost()
}

/**
 * Fetches posts by tag from Ghost CMS
 */
export async function getPostsByTag(tag: string): Promise<BlogPost[]> {
  const posts = await fetchGhostPosts()
  const service = new BlogService(posts)
  return service.getPostsByTag(tag)
}

/**
 * Fetches recent posts from Ghost CMS
 */
export async function getRecentPosts(
  limit: number,
  excludeFeatured = false
): Promise<BlogPost[]> {
  const posts = await fetchGhostPosts()
  const service = new BlogService(posts)
  return service.getRecentPosts(limit, excludeFeatured)
}

/**
 * Fetches a post by slug from Ghost CMS
 */
export async function getPostBySlug(slug: string): Promise<BlogPost | null> {
  return fetchGhostPostBySlug(slug)
}

/**
 * Fetches all unique tags from Ghost CMS
 */
export async function getAllTags(): Promise<string[]> {
  const posts = await fetchGhostPosts()
  const service = new BlogService(posts)
  return service.getAllTags()
}

/**
 * Fetches posts by domain from Ghost CMS
 */
export async function getPostsByDomain(
  domain: TechnicalDomain
): Promise<BlogPost[]> {
  const posts = await fetchGhostPosts()
  const service = new BlogService(posts)
  return service.getPostsByDomain(domain)
}
