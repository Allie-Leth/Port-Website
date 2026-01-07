import { BlogService } from '@/lib/services/blog-service'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'

// Mock the fs module for testing
jest.mock('fs', () => ({
  promises: {
    readdir: jest.fn(),
    readFile: jest.fn(),
  },
}))

describe('BlogService - Post Operations', () => {
  const mockPosts = [
    createMockBlogPost({
      id: '1',
      slug: 'first-post',
      title: 'First Post',
      date: '2024-01-15',
      featured: false,
      tags: ['React', 'Testing'],
    }),
    createMockBlogPost({
      id: '2',
      slug: 'featured-post',
      title: 'Featured Post',
      date: '2024-01-20',
      featured: true,
      tags: ['TypeScript'],
    }),
    createMockBlogPost({
      id: '3',
      slug: 'recent-post',
      title: 'Recent Post',
      date: '2024-01-25',
      featured: false,
      tags: ['React', 'DevOps'],
    }),
  ]

  let service: BlogService

  beforeEach(() => {
    service = new BlogService(mockPosts)
  })

  describe('getAllPosts', () => {
    it('returns all blog posts', () => {
      const posts = service.getAllPosts()
      expect(posts).toHaveLength(3)
      // getAllPosts returns sorted posts, not original order
      const sortedMockPosts = [...mockPosts].sort(
        (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
      )
      expect(posts).toEqual(sortedMockPosts)
    })

    it('returns posts sorted by date (newest first)', () => {
      const posts = service.getAllPosts()
      expect(posts[0].title).toBe('Recent Post')
      expect(posts[1].title).toBe('Featured Post')
      expect(posts[2].title).toBe('First Post')
    })

    it('returns empty array when no posts exist', () => {
      ;(service as any).posts = []
      const posts = service.getAllPosts()
      expect(posts).toEqual([])
    })

    it('returns a new array instance', () => {
      const posts1 = service.getAllPosts()
      const posts2 = service.getAllPosts()
      expect(posts1).not.toBe(posts2)
      expect(posts1).toEqual(posts2)
    })
  })

  describe('getPostBySlug', () => {
    it('returns post matching the slug', () => {
      const post = service.getPostBySlug('featured-post')
      expect(post).toBeDefined()
      expect(post?.title).toBe('Featured Post')
      expect(post?.slug).toBe('featured-post')
    })

    it('returns null for non-existent slug', () => {
      const post = service.getPostBySlug('non-existent')
      expect(post).toBeNull()
    })

    it('handles empty slug gracefully', () => {
      const post = service.getPostBySlug('')
      expect(post).toBeNull()
    })

    it('is case-sensitive for slug matching', () => {
      const post = service.getPostBySlug('Featured-Post')
      expect(post).toBeNull()
    })
  })

  describe('getFeaturedPost', () => {
    it('returns the featured post', () => {
      const featured = service.getFeaturedPost()
      expect(featured).toBeDefined()
      expect(featured?.title).toBe('Featured Post')
      expect(featured?.featured).toBe(true)
    })

    it('returns null when no featured post exists', () => {
      ;(service as any).posts = mockPosts.map((p) => ({
        ...p,
        featured: false,
      }))
      const featured = service.getFeaturedPost()
      expect(featured).toBeNull()
    })

    it('returns first featured post when multiple exist', () => {
      ;(service as any).posts = [
        ...mockPosts,
        createMockBlogPost({
          id: '4',
          title: 'Second Featured',
          featured: true,
          date: '2024-01-30',
        }),
      ]
      const featured = service.getFeaturedPost()
      expect(featured?.title).toBe('Featured Post')
    })
  })

  describe('getRecentPosts', () => {
    it('returns specified number of recent posts', () => {
      const recent = service.getRecentPosts(2)
      expect(recent).toHaveLength(2)
      expect(recent[0].title).toBe('Recent Post')
      expect(recent[1].title).toBe('Featured Post')
    })

    it('returns all posts when limit exceeds total', () => {
      const recent = service.getRecentPosts(10)
      expect(recent).toHaveLength(3)
    })

    it('returns empty array when limit is 0', () => {
      const recent = service.getRecentPosts(0)
      expect(recent).toEqual([])
    })

    it('returns empty array for negative limit', () => {
      const recent = service.getRecentPosts(-1)
      expect(recent).toEqual([])
    })

    it('excludes featured post when specified', () => {
      const recent = service.getRecentPosts(3, true)
      expect(recent).toHaveLength(2)
      expect(recent.every((p) => !p.featured)).toBe(true)
    })

    it('returns posts sorted by date', () => {
      const recent = service.getRecentPosts(3)
      expect(recent[0].date > recent[1].date).toBe(true)
      expect(recent[1].date > recent[2].date).toBe(true)
    })
  })
})
