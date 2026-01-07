import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import BlogPage from '@/app/blog/page'

// Mock the BlogLayout component
jest.mock('@/components/blog/blog-layout', () => ({
  BlogLayout: ({
    posts,
    layout,
    showFeatured,
    showDomainFilter,
    initialDomain,
    emptyMessage,
  }: any) => (
    <div data-testid="blog-layout">
      <div>Posts: {posts?.length || 0}</div>
      <div>Layout: {layout}</div>
      <div>Show Featured: {showFeatured?.toString()}</div>
      <div>Show Domain Filter: {showDomainFilter?.toString()}</div>
      <div>Initial Domain: {initialDomain ?? 'null'}</div>
      <div>Empty Message: {emptyMessage}</div>
    </div>
  ),
}))

// Helper to create searchParams promise
const mockSearchParams = (params: Record<string, string> = {}) =>
  Promise.resolve(params)

// Mock the blog service
jest.mock('@/lib/services/blog-service', () => ({
  getAllPosts: jest.fn(() =>
    Promise.resolve([
      {
        id: '1',
        slug: 'test-post-1',
        title: 'Test Post 1',
        excerpt: 'Test excerpt 1',
        content: 'Test content 1',
        date: '2024-01-01T00:00:00Z',
        author: 'Test Author',
        tags: ['test'],
        domain: 'DevOps',
        readTime: 5,
        featured: false,
      },
      {
        id: '2',
        slug: 'test-post-2',
        title: 'Test Post 2',
        excerpt: 'Test excerpt 2',
        content: 'Test content 2',
        date: '2024-01-02T00:00:00Z',
        author: 'Test Author',
        tags: ['test'],
        domain: 'Full-Stack',
        readTime: 3,
        featured: false,
      },
      {
        id: '3',
        slug: 'test-post-3',
        title: 'Test Post 3',
        excerpt: 'Test excerpt 3',
        content: 'Test content 3',
        date: '2024-01-03T00:00:00Z',
        author: 'Test Author',
        tags: ['test'],
        domain: 'Security',
        readTime: 7,
        featured: true,
      },
    ])
  ),
}))

describe('BlogPage', () => {
  it('renders the blog page with gradient background', async () => {
    const { container } = render(
      await BlogPage({ searchParams: mockSearchParams() })
    )
    const wrapper = container.firstChild as HTMLElement
    expect(wrapper).toHaveClass(
      'min-h-screen',
      'bg-gradient-to-br',
      'from-slate-950',
      'to-slate-900',
      'text-white'
    )
  })

  it('renders BlogLayout component', async () => {
    render(await BlogPage({ searchParams: mockSearchParams() }))
    expect(screen.getByTestId('blog-layout')).toBeInTheDocument()
  })

  it('fetches and passes posts to BlogLayout', async () => {
    render(await BlogPage({ searchParams: mockSearchParams() }))
    expect(screen.getByText('Posts: 3')).toBeInTheDocument()
  })

  it('configures BlogLayout with sidebar layout', async () => {
    render(await BlogPage({ searchParams: mockSearchParams() }))
    expect(screen.getByText('Layout: sidebar')).toBeInTheDocument()
  })

  it('enables featured post display', async () => {
    render(await BlogPage({ searchParams: mockSearchParams() }))
    expect(screen.getByText('Show Featured: true')).toBeInTheDocument()
  })

  it('enables domain filtering', async () => {
    render(await BlogPage({ searchParams: mockSearchParams() }))
    expect(screen.getByText('Show Domain Filter: true')).toBeInTheDocument()
  })

  it('provides custom empty message', async () => {
    render(await BlogPage({ searchParams: mockSearchParams() }))
    expect(
      screen.getByText(
        'Empty Message: No blog posts available yet. Check back soon!'
      )
    ).toBeInTheDocument()
  })

  it('handles empty posts array', async () => {
    const { getAllPosts } = require('@/lib/services/blog-service')
    getAllPosts.mockResolvedValueOnce([])

    render(await BlogPage({ searchParams: mockSearchParams() }))
    expect(screen.getByText('Posts: 0')).toBeInTheDocument()
  })

  it('passes null initialDomain when no query param', async () => {
    render(await BlogPage({ searchParams: mockSearchParams() }))
    expect(screen.getByText('Initial Domain: null')).toBeInTheDocument()
  })

  it('passes valid domain from query param', async () => {
    render(
      await BlogPage({ searchParams: mockSearchParams({ domain: 'Projects' }) })
    )
    expect(screen.getByText('Initial Domain: Projects')).toBeInTheDocument()
  })

  it('ignores invalid domain query param', async () => {
    render(
      await BlogPage({
        searchParams: mockSearchParams({ domain: 'InvalidDomain' }),
      })
    )
    expect(screen.getByText('Initial Domain: null')).toBeInTheDocument()
  })
})
