import { BlogPost, validateBlogPost } from '@/lib/types/blog'

describe('validateBlogPost', () => {
  it('validates and returns errors for invalid posts', () => {
    const invalidPost = {
      id: '',
      slug: 'test-post',
      title: '',
      excerpt: 'Excerpt',
      content: 'Content',
      date: 'invalid-date',
      author: '',
      tags: [],
      domain: 'DevOps',
      readTime: -1,
      featured: false,
    }

    const errors = validateBlogPost(invalidPost as BlogPost)
    expect(errors).toContain('ID cannot be empty')
    expect(errors).toContain('Title cannot be empty')
    expect(errors).toContain('Author cannot be empty')
    expect(errors).toContain('Invalid date format')
    expect(errors).toContain('Read time must be positive')
  })

  it('returns empty array for valid posts', () => {
    const validPost: BlogPost = {
      id: 'test-1',
      slug: 'test-post',
      title: 'Valid Post',
      excerpt: 'Valid excerpt',
      content: 'Valid content',
      date: '2024-01-15T00:00:00Z',
      author: 'Valid Author',
      tags: ['tag1', 'tag2'],
      domain: 'DevOps',
      readTime: 5,
      featured: false,
    }

    const errors = validateBlogPost(validPost)
    expect(errors).toHaveLength(0)
  })

  it('validates slug format', () => {
    const invalidSlug: BlogPost = {
      id: 'test-1',
      slug: 'Invalid Slug With Spaces',
      title: 'Test',
      excerpt: 'Excerpt',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'DevOps',
      readTime: 1,
      featured: false,
    }

    const errors = validateBlogPost(invalidSlug)
    expect(errors).toContain('Slug must be URL-friendly')
  })

  it('validates tag names are not empty', () => {
    const invalidTags: BlogPost = {
      id: 'test-1',
      slug: 'test-post',
      title: 'Test',
      excerpt: 'Excerpt',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: ['', '  ', 'valid-tag'],
      domain: 'DevOps',
      readTime: 1,
      featured: false,
    }

    const errors = validateBlogPost(invalidTags)
    expect(errors).toContain('Tags cannot be empty strings')
  })

  it('accepts empty content (not validated)', () => {
    const emptyContent: BlogPost = {
      id: 'test-1',
      slug: 'test-post',
      title: 'Test',
      excerpt: 'Excerpt',
      content: '',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'Security',
      readTime: 0,
      featured: false,
    }

    const errors = validateBlogPost(emptyContent)
    // Currently, empty content is not validated
    expect(errors).toHaveLength(0)
  })

  it('accepts empty excerpt (not validated)', () => {
    const emptyExcerpt: BlogPost = {
      id: 'test-1',
      slug: 'test-post',
      title: 'Test',
      excerpt: '',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'Firmware',
      readTime: 1,
      featured: false,
    }

    const errors = validateBlogPost(emptyExcerpt)
    // Currently, empty excerpt is not validated
    expect(errors).toHaveLength(0)
  })

  it('validates multiple errors at once', () => {
    const multipleErrors: BlogPost = {
      id: '',
      slug: 'Bad Slug!',
      title: '',
      excerpt: '',
      content: '',
      date: 'not-a-date',
      author: '',
      tags: ['', 'tag'],
      domain: 'Full-Stack',
      readTime: -5,
      featured: false,
    }

    const errors = validateBlogPost(multipleErrors)
    expect(errors.length).toBeGreaterThanOrEqual(5)
    expect(errors).toContain('ID cannot be empty')
    expect(errors).toContain('Title cannot be empty')
    expect(errors).toContain('Author cannot be empty')
    expect(errors).toContain('Invalid date format')
    expect(errors).toContain('Read time must be positive')
    expect(errors).toContain('Tags cannot be empty strings')
    expect(errors).toContain('Slug must be URL-friendly')
  })
})
