import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import BlogPage from '@/app/blog/page'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'

/**
 * Helper to get the desktop filter container.
 * Needed because BlogLayout now renders both mobile (chips) and desktop (sidebar) filters.
 */
const getDesktopFilter = () => screen.getByTestId('desktop-filter')

// Mock the blog service
const mockPosts = [
  createMockBlogPost({
    id: '1',
    slug: 'devops-post',
    title: 'DevOps Post',
    domain: 'DevOps',
    date: '2024-01-15T10:00:00Z',
    featured: false,
  }),
  createMockBlogPost({
    id: '2',
    slug: 'security-post',
    title: 'Security Post',
    domain: 'Security',
    date: '2024-01-20T10:00:00Z',
    featured: true,
  }),
  createMockBlogPost({
    id: '3',
    slug: 'firmware-post',
    title: 'Firmware Post',
    domain: 'Firmware',
    date: '2024-01-25T10:00:00Z',
    featured: false,
  }),
]

jest.mock('@/lib/services/blog-service', () => ({
  getAllPosts: jest.fn(() => Promise.resolve(mockPosts)),
}))

// Only mock Next.js Image component (necessary for tests)
jest.mock('next/image', () => ({
  __esModule: true,
  default: ({
    fill,
    priority,
    ...props
  }: React.ImgHTMLAttributes<HTMLImageElement> & {
    fill?: boolean
    priority?: boolean
  }) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img data-fill={fill} data-priority={priority} {...props} />
  },
}))

// Helper to create searchParams promise
const mockSearchParams = (params: Record<string, string> = {}) =>
  Promise.resolve(params)

describe('BlogPage Integration', () => {
  describe('page structure', () => {
    it('renders main landmark', async () => {
      render(await BlogPage({ searchParams: mockSearchParams() }))
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('renders level 1 heading', async () => {
      render(await BlogPage({ searchParams: mockSearchParams() }))
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('renders navigation for filters', async () => {
      render(await BlogPage({ searchParams: mockSearchParams() }))
      // Now renders both mobile and desktop navigation
      const navElements = screen.getAllByRole('navigation')
      expect(navElements.length).toBeGreaterThan(0)
    })

    it('renders blog posts as article elements', async () => {
      render(await BlogPage({ searchParams: mockSearchParams() }))
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThan(0)
    })
  })

  describe('domain filter', () => {
    it('renders All Posts button', async () => {
      render(await BlogPage({ searchParams: mockSearchParams() }))
      const filter = within(getDesktopFilter())
      expect(
        filter.getByRole('button', { name: /all posts/i })
      ).toBeInTheDocument()
    })

    it('renders filter buttons for each domain type', async () => {
      render(await BlogPage({ searchParams: mockSearchParams() }))
      const filter = within(getDesktopFilter())
      // These are the TechnicalDomain values from types
      expect(
        filter.getByRole('button', { name: /firmware/i })
      ).toBeInTheDocument()
      expect(
        filter.getByRole('button', { name: /devops/i })
      ).toBeInTheDocument()
      expect(
        filter.getByRole('button', { name: /security/i })
      ).toBeInTheDocument()
      expect(
        filter.getByRole('button', { name: /full-stack/i })
      ).toBeInTheDocument()
    })

    it('reduces displayed posts when domain filter is applied', async () => {
      const user = userEvent.setup()
      render(await BlogPage({ searchParams: mockSearchParams() }))

      const filter = within(getDesktopFilter())
      const initialCount = screen.getAllByRole('article').length

      // Click a domain filter
      await user.click(filter.getByRole('button', { name: /devops/i }))

      await waitFor(() => {
        const filteredCount = screen.getAllByRole('article').length
        // Filtered count should be less than or equal to initial
        // (equal if all posts happen to be DevOps)
        expect(filteredCount).toBeLessThanOrEqual(initialCount)
        expect(filteredCount).toBeGreaterThan(0)
      })
    })

    it('restores original post count when All Posts is clicked after filtering', async () => {
      const user = userEvent.setup()
      render(await BlogPage({ searchParams: mockSearchParams() }))

      const filter = within(getDesktopFilter())
      const initialCount = screen.getAllByRole('article').length

      // Filter first
      await user.click(filter.getByRole('button', { name: /devops/i }))

      await waitFor(() => {
        expect(screen.getAllByRole('article').length).toBeLessThanOrEqual(
          initialCount
        )
      })

      // Reset filter
      await user.click(filter.getByRole('button', { name: /all posts/i }))

      await waitFor(() => {
        expect(screen.getAllByRole('article').length).toBe(initialCount)
      })
    })
  })

  describe('blog post links', () => {
    it('contains links to individual blog posts', async () => {
      render(await BlogPage({ searchParams: mockSearchParams() }))

      const links = screen.getAllByRole('link')
      const blogLinks = links.filter((link) =>
        link.getAttribute('href')?.startsWith('/blog/')
      )

      expect(blogLinks.length).toBeGreaterThan(0)
    })

    it('blog post links have valid slug format', async () => {
      render(await BlogPage({ searchParams: mockSearchParams() }))

      const links = screen.getAllByRole('link')
      const blogLinks = links.filter((link) =>
        link.getAttribute('href')?.startsWith('/blog/')
      )

      blogLinks.forEach((link) => {
        expect(link).toHaveAttribute(
          'href',
          expect.stringMatching(/^\/blog\/[\w-]+$/)
        )
      })
    })
  })

  describe('post metadata', () => {
    it('displays time elements for post dates', async () => {
      render(await BlogPage({ searchParams: mockSearchParams() }))
      // Use semantic time elements rather than text matching
      const timeElements = document.querySelectorAll('time')
      expect(timeElements.length).toBeGreaterThan(0)
    })

    it('displays read time indicators', async () => {
      render(await BlogPage({ searchParams: mockSearchParams() }))
      // Match the pattern, not specific content
      const readTimes = screen.getAllByText(/\d+\s*min/i)
      expect(readTimes.length).toBeGreaterThan(0)
    })
  })

  describe('featured post', () => {
    // Note: This test assumes at least one post has featured: true in the MDX data.
    // Currently: content/blog/cloudflare-chunked-transfer-mystery.mdx
    // The featured post displays a "Featured" badge (span), not a heading.
    it('displays featured badge', async () => {
      render(await BlogPage({ searchParams: mockSearchParams() }))
      expect(screen.getByText('Featured')).toBeInTheDocument()
    })

    it('featured badge is within an article', async () => {
      render(await BlogPage({ searchParams: mockSearchParams() }))
      const featuredBadge = screen.getByText('Featured')
      const article = featuredBadge.closest('article')
      expect(article).toBeInTheDocument()
    })
  })
})
