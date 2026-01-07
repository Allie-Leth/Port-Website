import { BlogService } from '@/lib/services/blog-service'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'

describe('BlogService - Loading and State Management', () => {
  describe('Constructor and Initialization', () => {
    it('initializes with provided posts', () => {
      const mockPosts = [
        createMockBlogPost({ title: 'Post 1' }),
        createMockBlogPost({ title: 'Post 2' }),
      ]

      const service = new BlogService(mockPosts)
      const posts = service.getAllPosts()

      expect(posts).toHaveLength(2)
    })

    it('creates deep copy of posts to prevent external mutations', () => {
      const mockPosts = [createMockBlogPost({ title: 'Original' })]

      const service = new BlogService(mockPosts)

      // Mutate original array
      mockPosts[0].title = 'Modified'

      const posts = service.getAllPosts()
      expect(posts[0].title).toBe('Original')
    })

    it('handles empty posts array', () => {
      const service = new BlogService([])
      const posts = service.getAllPosts()

      expect(posts).toEqual([])
    })
  })

  describe('State Immutability', () => {
    it('getAllPosts returns new array instance each time', () => {
      const mockPosts = [createMockBlogPost({ title: 'Post 1' })]

      const service = new BlogService(mockPosts)
      const posts1 = service.getAllPosts()
      const posts2 = service.getAllPosts()

      expect(posts1).not.toBe(posts2)
      expect(posts1).toEqual(posts2)
    })

    it('prevents modification of internal posts through returned array', () => {
      const mockPosts = [createMockBlogPost({ title: 'Original' })]

      const service = new BlogService(mockPosts)
      const posts = service.getAllPosts()

      // Try to modify returned post
      posts[0].title = 'Modified'

      // Check that internal state is unchanged
      const freshPosts = service.getAllPosts()
      expect(freshPosts[0].title).toBe('Original')
    })

    it('maintains consistent state across multiple method calls', () => {
      const mockPosts = [
        createMockBlogPost({
          title: 'Featured Post',
          featured: true,
          tags: ['React'],
        }),
        createMockBlogPost({
          title: 'Regular Post',
          featured: false,
          tags: ['React'],
        }),
      ]

      const service = new BlogService(mockPosts)

      // Call different methods
      const allPosts = service.getAllPosts()
      const featured = service.getFeaturedPost()
      const byTag = service.getPostsByTag('React')

      // All should reference the same data
      expect(allPosts).toHaveLength(2)
      expect(featured?.title).toBe('Featured Post')
      expect(byTag).toHaveLength(2)
    })
  })

  describe('Operations at Scale', () => {
    it.each([100, 500, 1000])('retrieves all %i posts correctly', (size) => {
      const posts = Array.from({ length: size }, (_, i) =>
        createMockBlogPost({
          id: `${i}`,
          title: `Post ${i}`,
          tags: i % 2 === 0 ? ['Even'] : ['Odd'],
        })
      )

      const service = new BlogService(posts)
      const allPosts = service.getAllPosts()

      expect(allPosts).toHaveLength(size)
    })

    it.each([100, 500, 1000])('filters %i posts by tag correctly', (size) => {
      const posts = Array.from({ length: size }, (_, i) =>
        createMockBlogPost({
          id: `${i}`,
          title: `Post ${i}`,
          tags: i % 3 === 0 ? ['Special'] : ['Regular'],
        })
      )

      const service = new BlogService(posts)
      const filtered = service.getPostsByTag('Special')

      // Every 3rd post (i % 3 === 0) has 'Special' tag
      const expectedCount = Math.ceil(size / 3)
      expect(filtered).toHaveLength(expectedCount)
    })
  })
})
