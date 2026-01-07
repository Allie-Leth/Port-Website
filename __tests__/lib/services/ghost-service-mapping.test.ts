import {
  extractDomainFromTags,
  extractTagsFromGhost,
  mapGhostPostToBlogPost,
} from '@/lib/services/ghost-service'
import {
  createMockGhostPost,
  createMockGhostTag,
  createMockGhostAuthor,
  mockGhostPostWithDomain,
  mockGhostPostWithoutDomain,
  mockGhostPostWithCustomExcerpt,
  mockGhostPostMinimal,
} from '@/__tests__/fixtures/ghost-posts'

describe('Ghost Service - Mapping Functions', () => {
  describe('extractDomainFromTags', () => {
    it('extracts DevOps domain from tags', () => {
      const tags = [
        createMockGhostTag({ name: 'DevOps', slug: 'devops' }),
        createMockGhostTag({ name: 'Kubernetes', slug: 'kubernetes' }),
      ]
      expect(extractDomainFromTags(tags)).toBe('DevOps')
    })

    it('extracts Firmware domain from tags', () => {
      const tags = [createMockGhostTag({ name: 'Firmware', slug: 'firmware' })]
      expect(extractDomainFromTags(tags)).toBe('Firmware')
    })

    it('extracts Security domain from tags', () => {
      const tags = [createMockGhostTag({ name: 'Security', slug: 'security' })]
      expect(extractDomainFromTags(tags)).toBe('Security')
    })

    it('extracts Full-Stack domain from tags', () => {
      const tags = [
        createMockGhostTag({ name: 'Full-Stack', slug: 'full-stack' }),
      ]
      expect(extractDomainFromTags(tags)).toBe('Full-Stack')
    })

    it('extracts Projects domain from tags', () => {
      const tags = [createMockGhostTag({ name: 'Projects', slug: 'projects' })]
      expect(extractDomainFromTags(tags)).toBe('Projects')
    })

    it('is case-insensitive for domain matching', () => {
      const tags = [createMockGhostTag({ name: 'devops', slug: 'devops' })]
      expect(extractDomainFromTags(tags)).toBe('DevOps')
    })

    it('returns Projects as default when no domain tag found', () => {
      const tags = [createMockGhostTag({ name: 'Random', slug: 'random' })]
      expect(extractDomainFromTags(tags)).toBe('Projects')
    })

    it('returns Projects for empty tags array', () => {
      expect(extractDomainFromTags([])).toBe('Projects')
    })

    it('returns first matching domain when multiple exist', () => {
      const tags = [
        createMockGhostTag({ name: 'DevOps', slug: 'devops' }),
        createMockGhostTag({ name: 'Security', slug: 'security' }),
      ]
      expect(extractDomainFromTags(tags)).toBe('DevOps')
    })
  })

  describe('extractTagsFromGhost', () => {
    it('extracts non-domain tags', () => {
      const tags = [
        createMockGhostTag({ name: 'DevOps', slug: 'devops' }),
        createMockGhostTag({ name: 'Kubernetes', slug: 'kubernetes' }),
        createMockGhostTag({ name: 'Docker', slug: 'docker' }),
      ]
      const result = extractTagsFromGhost(tags)
      expect(result).toEqual(['Kubernetes', 'Docker'])
    })

    it('excludes all domain tags', () => {
      const tags = [
        createMockGhostTag({ name: 'DevOps', slug: 'devops' }),
        createMockGhostTag({ name: 'Firmware', slug: 'firmware' }),
        createMockGhostTag({ name: 'Security', slug: 'security' }),
        createMockGhostTag({ name: 'Full-Stack', slug: 'full-stack' }),
        createMockGhostTag({ name: 'Projects', slug: 'projects' }),
        createMockGhostTag({ name: 'Jest', slug: 'jest' }),
      ]
      const result = extractTagsFromGhost(tags)
      expect(result).toEqual(['Jest'])
    })

    it('is case-insensitive when excluding domains', () => {
      const tags = [
        createMockGhostTag({ name: 'devops', slug: 'devops' }),
        createMockGhostTag({ name: 'Testing', slug: 'testing' }),
      ]
      const result = extractTagsFromGhost(tags)
      expect(result).toEqual(['Testing'])
    })

    it('returns empty array when all tags are domains', () => {
      const tags = [createMockGhostTag({ name: 'DevOps', slug: 'devops' })]
      expect(extractTagsFromGhost(tags)).toEqual([])
    })

    it('returns empty array for empty input', () => {
      expect(extractTagsFromGhost([])).toEqual([])
    })

    it('preserves tag names exactly as provided', () => {
      const tags = [
        createMockGhostTag({ name: 'CI/CD', slug: 'ci-cd' }),
        createMockGhostTag({ name: 'TypeScript', slug: 'typescript' }),
      ]
      const result = extractTagsFromGhost(tags)
      expect(result).toEqual(['CI/CD', 'TypeScript'])
    })
  })

  describe('mapGhostPostToBlogPost', () => {
    it('maps basic Ghost post to BlogPost', () => {
      const ghostPost = createMockGhostPost()
      const blogPost = mapGhostPostToBlogPost(ghostPost)

      expect(blogPost.id).toBe(ghostPost.id)
      expect(blogPost.slug).toBe(ghostPost.slug)
      expect(blogPost.title).toBe(ghostPost.title)
      expect(blogPost.content).toBe(ghostPost.html)
      expect(blogPost.date).toBe(ghostPost.published_at)
      expect(blogPost.featured).toBe(ghostPost.featured)
    })

    it('extracts author name from Ghost authors', () => {
      const ghostPost = createMockGhostPost({
        authors: [createMockGhostAuthor({ name: 'John Doe' })],
      })
      const blogPost = mapGhostPostToBlogPost(ghostPost)
      expect(blogPost.author).toBe('John Doe')
    })

    it('uses Unknown author when no authors provided', () => {
      const blogPost = mapGhostPostToBlogPost(mockGhostPostMinimal)
      expect(blogPost.author).toBe('Unknown')
    })

    it('uses custom_excerpt over excerpt when available', () => {
      const blogPost = mapGhostPostToBlogPost(mockGhostPostWithCustomExcerpt)
      expect(blogPost.excerpt).toBe('This is a custom excerpt set in Ghost.')
    })

    it('falls back to excerpt when no custom_excerpt', () => {
      const ghostPost = createMockGhostPost({
        custom_excerpt: null,
        excerpt: 'Auto-generated excerpt',
      })
      const blogPost = mapGhostPostToBlogPost(ghostPost)
      expect(blogPost.excerpt).toBe('Auto-generated excerpt')
    })

    it('generates excerpt from HTML when neither excerpt available', () => {
      const ghostPost = createMockGhostPost({
        custom_excerpt: null,
        excerpt: undefined,
        html: '<p>This is the content that should become the excerpt.</p>',
      })
      const blogPost = mapGhostPostToBlogPost(ghostPost)
      expect(blogPost.excerpt).toBe(
        'This is the content that should become the excerpt.'
      )
    })

    it('truncates generated excerpt to 200 characters', () => {
      const longContent = '<p>' + 'A'.repeat(300) + '</p>'
      const ghostPost = createMockGhostPost({
        custom_excerpt: null,
        excerpt: undefined,
        html: longContent,
      })
      const blogPost = mapGhostPostToBlogPost(ghostPost)
      expect(blogPost.excerpt.length).toBe(200)
      expect(blogPost.excerpt.endsWith('...')).toBe(true)
    })

    it('maps domain from tags', () => {
      const blogPost = mapGhostPostToBlogPost(mockGhostPostWithDomain)
      expect(blogPost.domain).toBe('DevOps')
    })

    it('defaults to Projects domain when no domain tag', () => {
      const blogPost = mapGhostPostToBlogPost(mockGhostPostWithoutDomain)
      expect(blogPost.domain).toBe('Projects')
    })

    it('extracts non-domain tags', () => {
      const blogPost = mapGhostPostToBlogPost(mockGhostPostWithDomain)
      expect(blogPost.tags).toContain('Kubernetes')
      expect(blogPost.tags).not.toContain('DevOps')
    })

    it('uses Ghost reading_time for readTime', () => {
      const ghostPost = createMockGhostPost({ reading_time: 12 })
      const blogPost = mapGhostPostToBlogPost(ghostPost)
      expect(blogPost.readTime).toBe(12)
    })

    it('maps feature_image to imageUrl', () => {
      const ghostPost = createMockGhostPost({
        feature_image: 'https://example.com/image.jpg',
      })
      const blogPost = mapGhostPostToBlogPost(ghostPost)
      expect(blogPost.imageUrl).toBe('https://example.com/image.jpg')
    })

    it('sets imageUrl to undefined when no feature_image', () => {
      const ghostPost = createMockGhostPost({ feature_image: null })
      const blogPost = mapGhostPostToBlogPost(ghostPost)
      expect(blogPost.imageUrl).toBeUndefined()
    })

    it('handles post with empty tags array', () => {
      const blogPost = mapGhostPostToBlogPost(mockGhostPostMinimal)
      expect(blogPost.tags).toEqual([])
      expect(blogPost.domain).toBe('Projects')
    })
  })
})
