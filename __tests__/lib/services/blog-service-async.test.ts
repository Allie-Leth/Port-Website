import {
  getAllPosts,
  getFeaturedPost,
  getPostsByTag,
  getRecentPosts,
  getPostBySlug,
  getAllTags,
  getPostsByDomain,
} from '@/lib/services/blog-service'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'

// Mock the ghost-service module
jest.mock('@/lib/services/ghost-service', () => ({
  fetchGhostPosts: jest.fn(),
  fetchGhostPostBySlug: jest.fn(),
}))

import {
  fetchGhostPosts,
  fetchGhostPostBySlug,
} from '@/lib/services/ghost-service'

const mockFetchGhostPosts = fetchGhostPosts as jest.MockedFunction<
  typeof fetchGhostPosts
>
const mockFetchGhostPostBySlug = fetchGhostPostBySlug as jest.MockedFunction<
  typeof fetchGhostPostBySlug
>

describe('Blog Service - Async Functions', () => {
  const mockPosts = [
    createMockBlogPost({
      id: '1',
      slug: 'first-post',
      title: 'First Post',
      date: '2024-01-15T10:00:00Z',
      featured: false,
      tags: ['React', 'Testing'],
      domain: 'Full-Stack',
    }),
    createMockBlogPost({
      id: '2',
      slug: 'featured-post',
      title: 'Featured Post',
      date: '2024-01-20T10:00:00Z',
      featured: true,
      tags: ['TypeScript'],
      domain: 'DevOps',
    }),
    createMockBlogPost({
      id: '3',
      slug: 'recent-post',
      title: 'Recent Post',
      date: '2024-01-25T10:00:00Z',
      featured: false,
      tags: ['React', 'DevOps'],
      domain: 'DevOps',
    }),
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockFetchGhostPosts.mockResolvedValue(mockPosts)
  })

  describe('getAllPosts', () => {
    it('fetches posts from Ghost and returns sorted by date', async () => {
      const posts = await getAllPosts()

      expect(mockFetchGhostPosts).toHaveBeenCalledTimes(1)
      expect(posts).toHaveLength(3)
      expect(posts[0].title).toBe('Recent Post')
      expect(posts[1].title).toBe('Featured Post')
      expect(posts[2].title).toBe('First Post')
    })

    it('returns empty array when no posts', async () => {
      mockFetchGhostPosts.mockResolvedValue([])

      const posts = await getAllPosts()

      expect(posts).toEqual([])
    })
  })

  describe('getFeaturedPost', () => {
    it('returns the featured post', async () => {
      const featured = await getFeaturedPost()

      expect(featured).not.toBeNull()
      expect(featured?.title).toBe('Featured Post')
      expect(featured?.featured).toBe(true)
    })

    it('returns null when no featured post exists', async () => {
      mockFetchGhostPosts.mockResolvedValue(
        mockPosts.map((p) => ({ ...p, featured: false }))
      )

      const featured = await getFeaturedPost()

      expect(featured).toBeNull()
    })
  })

  describe('getPostsByTag', () => {
    it('returns posts filtered by tag', async () => {
      const posts = await getPostsByTag('React')

      expect(posts).toHaveLength(2)
      expect(posts.every((p) => p.tags.includes('React'))).toBe(true)
    })

    it('returns empty array for non-existent tag', async () => {
      const posts = await getPostsByTag('NonExistent')

      expect(posts).toEqual([])
    })

    it('is case-insensitive', async () => {
      const posts = await getPostsByTag('react')

      expect(posts).toHaveLength(2)
    })
  })

  describe('getRecentPosts', () => {
    it('returns specified number of recent posts', async () => {
      const posts = await getRecentPosts(2)

      expect(posts).toHaveLength(2)
      expect(posts[0].title).toBe('Recent Post')
      expect(posts[1].title).toBe('Featured Post')
    })

    it('excludes featured posts when specified', async () => {
      const posts = await getRecentPosts(3, true)

      expect(posts).toHaveLength(2)
      expect(posts.every((p) => !p.featured)).toBe(true)
    })

    it('returns empty array for zero limit', async () => {
      const posts = await getRecentPosts(0)

      expect(posts).toEqual([])
    })
  })

  describe('getPostBySlug', () => {
    it('fetches single post by slug from Ghost', async () => {
      const mockPost = createMockBlogPost({ slug: 'test-slug', title: 'Test' })
      mockFetchGhostPostBySlug.mockResolvedValue(mockPost)

      const post = await getPostBySlug('test-slug')

      expect(mockFetchGhostPostBySlug).toHaveBeenCalledWith('test-slug')
      expect(post?.title).toBe('Test')
    })

    it('returns null for non-existent slug', async () => {
      mockFetchGhostPostBySlug.mockResolvedValue(null)

      const post = await getPostBySlug('non-existent')

      expect(post).toBeNull()
    })
  })

  describe('getAllTags', () => {
    it('returns unique sorted tags from all posts', async () => {
      const tags = await getAllTags()

      expect(tags).toContain('React')
      expect(tags).toContain('TypeScript')
      expect(tags).toContain('Testing')
      expect(tags).toContain('DevOps')
    })

    it('returns empty array when no posts', async () => {
      mockFetchGhostPosts.mockResolvedValue([])

      const tags = await getAllTags()

      expect(tags).toEqual([])
    })
  })

  describe('getPostsByDomain', () => {
    it('returns posts filtered by domain', async () => {
      const posts = await getPostsByDomain('DevOps')

      expect(posts).toHaveLength(2)
      expect(posts.every((p) => p.domain === 'DevOps')).toBe(true)
    })

    it('returns empty array for domain with no posts', async () => {
      const posts = await getPostsByDomain('Security')

      expect(posts).toEqual([])
    })

    it('returns posts sorted by date', async () => {
      const posts = await getPostsByDomain('DevOps')

      expect(posts[0].title).toBe('Recent Post')
      expect(posts[1].title).toBe('Featured Post')
    })
  })
})
