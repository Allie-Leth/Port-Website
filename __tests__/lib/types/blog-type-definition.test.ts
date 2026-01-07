import { BlogPost } from '@/lib/types/blog'

describe('BlogPost Type Definition', () => {
  it('accepts valid blog post data', () => {
    const validPost: BlogPost = {
      id: 'test-1',
      slug: 'test-post',
      title: 'Test Blog Post',
      excerpt: 'This is a test excerpt',
      content: 'Full blog content here',
      date: '2024-01-15T00:00:00Z',
      author: 'Test Author',
      tags: ['testing', 'typescript'],
      domain: 'Full-Stack',
      readTime: 5,
      featured: false,
    }

    expect(validPost.id).toBe('test-1')
    expect(validPost.tags).toHaveLength(2)
  })

  it('accepts optional imageUrl', () => {
    const postWithImage: BlogPost = {
      id: 'test-2',
      slug: 'post-with-image',
      title: 'Post with Image',
      excerpt: 'Has an image',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'DevOps',
      readTime: 1,
      featured: true,
      imageUrl: '/images/blog/test.jpg',
    }

    expect(postWithImage.imageUrl).toBe('/images/blog/test.jpg')
  })

  it('accepts posts without imageUrl', () => {
    const postWithoutImage: BlogPost = {
      id: 'no-image-1',
      slug: 'no-image-post',
      title: 'Post Without Image',
      excerpt: 'Text only post',
      content: 'No image content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'Security',
      readTime: 3,
      featured: false,
    }

    expect(postWithoutImage.imageUrl).toBeUndefined()
  })

  it('accepts all technical domains', () => {
    const domains = ['Firmware', 'DevOps', 'Security', 'Full-Stack'] as const

    domains.forEach((domain) => {
      const post: BlogPost = {
        id: `${domain}-1`,
        slug: `${domain}-post`,
        title: `${domain} Post`,
        excerpt: 'Test',
        content: 'Test',
        date: '2024-01-15T00:00:00Z',
        author: 'Author',
        tags: [],
        domain,
        readTime: 1,
        featured: false,
      }

      expect(post.domain).toBe(domain)
    })
  })

  it('handles empty tags array', () => {
    const postWithoutTags: BlogPost = {
      id: 'no-tags',
      slug: 'no-tags-post',
      title: 'Post Without Tags',
      excerpt: 'No tags here',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'Full-Stack',
      readTime: 2,
      featured: false,
    }

    expect(postWithoutTags.tags).toEqual([])
  })

  it('handles long content and high read time', () => {
    const longPost: BlogPost = {
      id: 'long-post',
      slug: 'comprehensive-guide',
      title: 'Comprehensive Guide',
      excerpt: 'A very long post',
      content: 'A'.repeat(10000),
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: ['long-form', 'tutorial'],
      domain: 'DevOps',
      readTime: 45,
      featured: true,
    }

    expect(longPost.readTime).toBe(45)
    expect(longPost.content.length).toBe(10000)
  })

  it('accepts optional summary field for hire page preview', () => {
    const postWithSummary: BlogPost = {
      id: 'summary-post',
      slug: 'post-with-summary',
      title: 'Post with Summary',
      excerpt: 'Standard excerpt for blog listing',
      summary: 'Short summary for hire page preview card',
      content: 'Full content here',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: ['testing'],
      domain: 'Full-Stack',
      readTime: 3,
      featured: false,
    }

    expect(postWithSummary.summary).toBe(
      'Short summary for hire page preview card'
    )
  })

  it('accepts posts without summary (uses excerpt as fallback)', () => {
    const postWithoutSummary: BlogPost = {
      id: 'no-summary',
      slug: 'no-summary-post',
      title: 'Post Without Summary',
      excerpt: 'This excerpt will be used as fallback',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'DevOps',
      readTime: 2,
      featured: false,
    }

    expect(postWithoutSummary.summary).toBeUndefined()
  })

  it('accepts optional relatedUrl field for repo/project links', () => {
    const postWithRelatedUrl: BlogPost = {
      id: 'with-repo',
      slug: 'project-post',
      title: 'Project Post',
      excerpt: 'Post about a project',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: ['project'],
      domain: 'Full-Stack',
      readTime: 4,
      featured: false,
      relatedUrl: 'https://github.com/user/project',
    }

    expect(postWithRelatedUrl.relatedUrl).toBe(
      'https://github.com/user/project'
    )
  })

  it('accepts posts without relatedUrl', () => {
    const postWithoutRelatedUrl: BlogPost = {
      id: 'no-related',
      slug: 'standalone-post',
      title: 'Standalone Post',
      excerpt: 'No related project',
      content: 'Content',
      date: '2024-01-15T00:00:00Z',
      author: 'Author',
      tags: [],
      domain: 'Security',
      readTime: 3,
      featured: false,
    }

    expect(postWithoutRelatedUrl.relatedUrl).toBeUndefined()
  })
})
