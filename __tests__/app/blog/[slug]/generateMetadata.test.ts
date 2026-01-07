/**
 * Tests for blog post generateMetadata function
 */

// Mock components that have ESM-only dependencies
jest.mock('@/components/blog/blog-post-view', () => ({
  BlogPostView: () => null,
}))

jest.mock('next-seo', () => ({
  ArticleJsonLd: () => null,
  BreadcrumbJsonLd: () => null,
}))

jest.mock('@/lib/services/blog-service', () => ({
  getPostBySlug: jest.fn(),
  getAllPosts: jest.fn(),
}))

jest.mock('@/lib/seo/config', () => ({
  seoConfig: {
    getSiteUrl: () => 'https://test.scopecreep.productions',
    siteName: 'Test Site',
  },
}))

import { generateMetadata } from '@/app/blog/[slug]/page'
import { getPostBySlug } from '@/lib/services/blog-service'

const mockGetPostBySlug = getPostBySlug as jest.MockedFunction<
  typeof getPostBySlug
>

describe('generateMetadata', () => {
  const mockPost = {
    id: '1',
    slug: 'test-post',
    title: 'Test Post Title',
    excerpt: 'Test excerpt description',
    content: 'Full content here',
    date: '2025-01-15T10:00:00Z',
    author: 'Ghost Author Name',
    tags: ['kubernetes', 'devops'],
    domain: 'DevOps' as const,
    readTime: 5,
    featured: false,
    imageUrl: 'https://example.com/image.jpg',
  }

  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('returns post title as metadata title', async () => {
    mockGetPostBySlug.mockResolvedValue(mockPost)

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'test-post' }),
    })

    expect(metadata.title).toBe('Test Post Title')
  })

  it('returns post excerpt as metadata description', async () => {
    mockGetPostBySlug.mockResolvedValue(mockPost)

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'test-post' }),
    })

    expect(metadata.description).toBe('Test excerpt description')
  })

  it('uses dynamic author from Ghost CMS', async () => {
    mockGetPostBySlug.mockResolvedValue(mockPost)

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'test-post' }),
    })

    expect(metadata.authors).toEqual([{ name: 'Ghost Author Name' }])
  })

  it('generates correct canonical URL', async () => {
    mockGetPostBySlug.mockResolvedValue(mockPost)

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'test-post' }),
    })

    expect(metadata.alternates?.canonical).toBe(
      'https://test.scopecreep.productions/blog/test-post'
    )
  })

  it('handles missing post gracefully', async () => {
    mockGetPostBySlug.mockResolvedValue(null)

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'nonexistent' }),
    })

    expect(metadata.title).toBe('Post Not Found')
  })

  it('includes OG image when post has imageUrl', async () => {
    mockGetPostBySlug.mockResolvedValue(mockPost)

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'test-post' }),
    })

    expect(metadata.openGraph?.images).toEqual([
      { url: 'https://example.com/image.jpg' },
    ])
  })

  it('returns empty images array when post has no imageUrl', async () => {
    const postWithoutImage = { ...mockPost, imageUrl: undefined }
    mockGetPostBySlug.mockResolvedValue(postWithoutImage)

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'test-post' }),
    })

    expect(metadata.openGraph?.images).toEqual([])
  })

  it('includes OG article type', async () => {
    mockGetPostBySlug.mockResolvedValue(mockPost)

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'test-post' }),
    })

    const openGraph = metadata.openGraph as { type?: string }
    expect(openGraph?.type).toBe('article')
  })

  it('includes publishedTime from post date', async () => {
    mockGetPostBySlug.mockResolvedValue(mockPost)

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'test-post' }),
    })

    const openGraph = metadata.openGraph as { publishedTime?: string }
    expect(openGraph?.publishedTime).toBe('2025-01-15T10:00:00Z')
  })

  it('includes tags in OG metadata', async () => {
    mockGetPostBySlug.mockResolvedValue(mockPost)

    const metadata = await generateMetadata({
      params: Promise.resolve({ slug: 'test-post' }),
    })

    const openGraph = metadata.openGraph as { tags?: string[] }
    expect(openGraph?.tags).toEqual(['kubernetes', 'devops'])
  })
})
