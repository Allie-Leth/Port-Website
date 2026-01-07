import { isBlogPost } from '@/lib/types/blog'

describe('isBlogPost Type Guard', () => {
  it('validates a correct blog post object', () => {
    const validPost = {
      id: 'test-1',
      slug: 'test-post',
      title: 'Test',
      excerpt: 'Excerpt',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: ['tag1'],
      domain: 'DevOps',
      readTime: 5,
      featured: false,
    }

    expect(isBlogPost(validPost)).toBe(true)
  })

  it('rejects objects missing required fields', () => {
    const invalidPost = {
      id: 'test-1',
      title: 'Test',
      // missing other required fields
    }

    expect(isBlogPost(invalidPost)).toBe(false)
  })

  it('rejects objects with wrong field types', () => {
    const invalidPost = {
      id: 123, // should be string
      slug: 'test',
      title: 'Test',
      excerpt: 'Excerpt',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: 'not-an-array', // should be array
      domain: 'DevOps',
      readTime: '5', // should be number
      featured: 'false', // should be boolean
    }

    expect(isBlogPost(invalidPost)).toBe(false)
  })

  it('rejects tags with non-string elements', () => {
    const invalidTags = {
      id: 'test',
      slug: 'test',
      title: 'Test',
      excerpt: 'Excerpt',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: ['valid', 123, null], // mixed types
      domain: 'DevOps',
      readTime: 5,
      featured: false,
    }

    expect(isBlogPost(invalidTags)).toBe(false)
  })

  it('rejects each missing required field', () => {
    const fields = [
      'id',
      'slug',
      'title',
      'excerpt',
      'content',
      'date',
      'author',
    ]

    fields.forEach((field) => {
      const post: any = {
        id: 'test',
        slug: 'test',
        title: 'Test',
        excerpt: 'Excerpt',
        content: 'Content',
        date: '2024-01-15T00:00:00Z',
        author: 'Author',
        tags: [],
        domain: 'DevOps',
        readTime: 5,
        featured: false,
      }

      delete post[field]
      expect(isBlogPost(post)).toBe(false)
    })
  })

  it('rejects invalid data types for numeric fields', () => {
    const invalidReadTime = {
      id: 'test',
      slug: 'test',
      title: 'Test',
      excerpt: 'Excerpt',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'DevOps',
      readTime: '5', // string instead of number
      featured: false,
    }

    expect(isBlogPost(invalidReadTime)).toBe(false)
  })

  it('rejects invalid data types for boolean fields', () => {
    const invalidFeatured = {
      id: 'test',
      slug: 'test',
      title: 'Test',
      excerpt: 'Excerpt',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'DevOps',
      readTime: 5,
      featured: 'false', // string instead of boolean
    }

    expect(isBlogPost(invalidFeatured)).toBe(false)
  })

  it('rejects invalid optional field types', () => {
    const invalidImageUrl = {
      id: 'test',
      slug: 'test',
      title: 'Test',
      excerpt: 'Excerpt',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'DevOps',
      readTime: 5,
      featured: false,
      imageUrl: 123, // should be string
    }

    expect(isBlogPost(invalidImageUrl)).toBe(false)
  })

  it('rejects invalid domain values', () => {
    const invalidDomain = {
      id: 'test',
      slug: 'test',
      title: 'Test',
      excerpt: 'Excerpt',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'InvalidDomain', // not a valid TechnicalDomain
      readTime: 5,
      featured: false,
    }

    expect(isBlogPost(invalidDomain)).toBe(false)
  })

  it('accepts Projects as a valid domain', () => {
    const projectsPost = {
      id: 'test',
      slug: 'test-project',
      title: 'Test Project',
      excerpt: 'Project excerpt',
      content: 'Project content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: ['project'],
      domain: 'Projects',
      readTime: 5,
      featured: false,
    }

    expect(isBlogPost(projectsPost)).toBe(true)
  })

  it('handles null and undefined inputs', () => {
    expect(isBlogPost(null)).toBe(false)
    expect(isBlogPost(undefined)).toBe(false)
  })

  it('handles non-object inputs', () => {
    expect(isBlogPost('string')).toBe(false)
    expect(isBlogPost(123)).toBe(false)
    expect(isBlogPost(true)).toBe(false)
    expect(isBlogPost([])).toBe(false)
  })

  it('handles empty objects', () => {
    expect(isBlogPost({})).toBe(false)
  })

  it('accepts valid post with optional summary field', () => {
    const postWithSummary = {
      id: 'test',
      slug: 'test',
      title: 'Test',
      excerpt: 'Excerpt',
      summary: 'Short summary for hire page',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'DevOps',
      readTime: 5,
      featured: false,
    }

    expect(isBlogPost(postWithSummary)).toBe(true)
  })

  it('rejects invalid summary type', () => {
    const invalidSummary = {
      id: 'test',
      slug: 'test',
      title: 'Test',
      excerpt: 'Excerpt',
      summary: 123, // should be string
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'DevOps',
      readTime: 5,
      featured: false,
    }

    expect(isBlogPost(invalidSummary)).toBe(false)
  })

  it('accepts valid post with optional relatedUrl field', () => {
    const postWithRelatedUrl = {
      id: 'test',
      slug: 'test',
      title: 'Test',
      excerpt: 'Excerpt',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'DevOps',
      readTime: 5,
      featured: false,
      relatedUrl: 'https://github.com/user/repo',
    }

    expect(isBlogPost(postWithRelatedUrl)).toBe(true)
  })

  it('rejects invalid relatedUrl type', () => {
    const invalidRelatedUrl = {
      id: 'test',
      slug: 'test',
      title: 'Test',
      excerpt: 'Excerpt',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'DevOps',
      readTime: 5,
      featured: false,
      relatedUrl: 123, // should be string
    }

    expect(isBlogPost(invalidRelatedUrl)).toBe(false)
  })
})
