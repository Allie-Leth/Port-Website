import { BlogService } from '@/lib/services/blog-service'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'

describe('BlogService - Filtering Operations', () => {
  const mockPosts = [
    createMockBlogPost({
      id: '1',
      title: 'React Hooks Guide',
      tags: ['React', 'JavaScript', 'Hooks'],
      date: '2024-01-10',
    }),
    createMockBlogPost({
      id: '2',
      title: 'TypeScript Best Practices',
      tags: ['TypeScript', 'JavaScript'],
      date: '2024-01-15',
    }),
    createMockBlogPost({
      id: '3',
      title: 'Docker Deployment',
      tags: ['Docker', 'DevOps', 'Kubernetes'],
      date: '2024-01-20',
    }),
    createMockBlogPost({
      id: '4',
      title: 'Security Scanning',
      tags: ['Security', 'DevOps'],
      date: '2024-01-25',
    }),
    createMockBlogPost({
      id: '5',
      title: 'Embedded Systems',
      tags: ['Firmware', 'C++'],
      date: '2024-01-30',
    }),
  ]

  let service: BlogService

  beforeEach(() => {
    service = new BlogService(mockPosts)
  })

  describe('getPostsByTag', () => {
    it('returns posts with specified tag', () => {
      const posts = service.getPostsByTag('JavaScript')
      expect(posts).toHaveLength(2)
      expect(posts.every((p) => p.tags.includes('JavaScript'))).toBe(true)
    })

    it('returns empty array for non-existent tag', () => {
      const posts = service.getPostsByTag('NonExistentTag')
      expect(posts).toEqual([])
    })

    it('is case-insensitive for tag matching', () => {
      const posts = service.getPostsByTag('javascript')
      expect(posts).toHaveLength(2)
      expect(
        posts.every((p) => p.tags.some((t) => t.toLowerCase() === 'javascript'))
      ).toBe(true)
    })

    it('returns posts sorted by date (newest first)', () => {
      const posts = service.getPostsByTag('DevOps')
      expect(posts).toHaveLength(2)
      expect(posts[0].title).toBe('Security Scanning') // Jan 25
      expect(posts[1].title).toBe('Docker Deployment') // Jan 20
    })

    it('handles empty tag string', () => {
      const posts = service.getPostsByTag('')
      expect(posts).toEqual([])
    })

    it('handles whitespace-only tag', () => {
      const posts = service.getPostsByTag('   ')
      expect(posts).toEqual([])
    })

    it('finds posts with tag in any position', () => {
      const posts = service.getPostsByTag('Hooks')
      expect(posts).toHaveLength(1)
      expect(posts[0].title).toBe('React Hooks Guide')
    })

    it('trims whitespace from tag', () => {
      const posts = service.getPostsByTag('  JavaScript  ')
      expect(posts).toHaveLength(2)
    })
  })

  describe('getAllTags', () => {
    it('returns all unique tags', () => {
      const tags = service.getAllTags()
      expect(tags).toContain('React')
      expect(tags).toContain('JavaScript')
      expect(tags).toContain('TypeScript')
      expect(tags).toContain('Docker')
      expect(tags).toContain('DevOps')
      expect(tags).toContain('Kubernetes')
      expect(tags).toContain('Security')
      expect(tags).toContain('Firmware')
      expect(tags).toContain('C++')
      expect(tags).toContain('Hooks')
    })

    it('returns unique tags without duplicates', () => {
      const tags = service.getAllTags()
      const uniqueTags = [...new Set(tags)]
      expect(tags).toEqual(uniqueTags)
    })

    it('returns sorted tags alphabetically', () => {
      const tags = service.getAllTags()
      const sortedTags = [...tags].sort()
      expect(tags).toEqual(sortedTags)
    })

    it('returns empty array when no posts exist', () => {
      const emptyService = new BlogService([])
      const tags = emptyService.getAllTags()
      expect(tags).toEqual([])
    })

    it('handles posts with no tags', () => {
      const postsWithEmptyTags = [
        createMockBlogPost({ tags: [] }),
        createMockBlogPost({ tags: ['OnlyTag'] }),
      ]
      const service = new BlogService(postsWithEmptyTags)
      const tags = service.getAllTags()
      expect(tags).toEqual(['OnlyTag'])
    })
  })

  describe('getPostsByDomain', () => {
    const domainPosts = [
      createMockBlogPost({
        id: '1',
        title: 'Firmware Post 1',
        domain: 'Firmware',
        date: '2024-01-10',
      }),
      createMockBlogPost({
        id: '2',
        title: 'DevOps Post 1',
        domain: 'DevOps',
        date: '2024-01-15',
      }),
      createMockBlogPost({
        id: '3',
        title: 'Firmware Post 2',
        domain: 'Firmware',
        date: '2024-01-20',
      }),
      createMockBlogPost({
        id: '4',
        title: 'Full-Stack Post 1',
        domain: 'Full-Stack',
        date: '2024-01-25',
      }),
    ]

    let domainService: BlogService

    beforeEach(() => {
      domainService = new BlogService(domainPosts)
    })

    it('returns posts with specified domain', () => {
      const posts = domainService.getPostsByDomain('Firmware')
      expect(posts).toHaveLength(2)
      expect(posts.every((p) => p.domain === 'Firmware')).toBe(true)
    })

    it('returns empty array for domain with no posts', () => {
      const posts = domainService.getPostsByDomain('Security')
      expect(posts).toEqual([])
    })

    it('returns posts sorted by date (newest first)', () => {
      const posts = domainService.getPostsByDomain('Firmware')
      expect(posts).toHaveLength(2)
      expect(posts[0].title).toBe('Firmware Post 2') // Jan 20
      expect(posts[1].title).toBe('Firmware Post 1') // Jan 10
    })

    it('handles Full-Stack domain correctly', () => {
      const posts = domainService.getPostsByDomain('Full-Stack')
      expect(posts).toHaveLength(1)
      expect(posts[0].domain).toBe('Full-Stack')
    })
  })

  describe('Tag Filtering at Scale', () => {
    it.each([100, 500, 1000])(
      'filters %i posts with common tag correctly',
      (size) => {
        const posts = Array.from({ length: size }, (_, i) =>
          createMockBlogPost({
            id: `${i}`,
            tags: [`Tag${i}`, 'Common', `Group${i % 10}`],
          })
        )

        const service = new BlogService(posts)
        const filtered = service.getPostsByTag('Common')

        expect(filtered).toHaveLength(size)
      }
    )

    it('maintains sort order after filtering', () => {
      const posts = service.getPostsByTag('JavaScript')

      // Check that dates are in descending order
      for (let i = 0; i < posts.length - 1; i++) {
        const date1 = new Date(posts[i].date).getTime()
        const date2 = new Date(posts[i + 1].date).getTime()
        expect(date1).toBeGreaterThanOrEqual(date2)
      }
    })
  })

  describe('Edge Cases', () => {
    it('handles special characters in tags', () => {
      const specialPosts = [createMockBlogPost({ tags: ['C++', 'C#', '.NET'] })]
      const service = new BlogService(specialPosts)

      const tags = service.getAllTags()
      expect(tags).toContain('C++')
      expect(tags).toContain('C#')
      expect(tags).toContain('.NET')

      const cppPosts = service.getPostsByTag('C++')
      expect(cppPosts).toHaveLength(1)
    })

    it('handles very long tag names', () => {
      const longTag = 'ThisIsAVeryLongTagNameThatShouldStillWork'
      const postsWithLongTags = [createMockBlogPost({ tags: [longTag] })]
      const service = new BlogService(postsWithLongTags)

      const posts = service.getPostsByTag(longTag)
      expect(posts).toHaveLength(1)
    })

    it('handles unicode characters in tags', () => {
      const unicodePosts = [
        createMockBlogPost({ tags: ['日本語', 'Español', '🚀'] }),
      ]
      const service = new BlogService(unicodePosts)

      const tags = service.getAllTags()
      expect(tags).toContain('日本語')
      expect(tags).toContain('Español')
      expect(tags).toContain('🚀')
    })
  })
})
