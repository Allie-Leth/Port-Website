import { BlogPost, TechnicalDomain } from '../../lib/types/blog'

/**
 * Create a test blog post with default values
 */
export function createTestBlogPost(overrides?: Partial<BlogPost>): BlogPost {
  return {
    id: 'test-1',
    slug: 'test-post',
    title: 'Test Post',
    excerpt: 'Test excerpt',
    content: 'Test content',
    date: '2024-01-01T00:00:00Z',
    author: 'Test Author',
    tags: ['Test'],
    domain: 'DevOps' as TechnicalDomain,
    readTime: 5,
    featured: false,
    ...overrides,
  }
}

/**
 * Create multiple test blog posts
 */
export function createTestBlogPosts(
  count: number,
  overrides?: Partial<BlogPost>[]
): BlogPost[] {
  return Array.from({ length: count }, (_, i) =>
    createTestBlogPost({
      id: `test-${i + 1}`,
      slug: `test-post-${i + 1}`,
      title: `Test Post ${i + 1}`,
      ...(overrides?.[i] || {}),
    })
  )
}
