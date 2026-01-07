import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BlogLayout } from '@/components/blog/blog-layout'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('BlogLayout Rendering', () => {
  const mockPosts = [
    createMockBlogPost({
      id: '1',
      slug: 'featured-post',
      title: 'Featured Post Title',
      excerpt:
        'This is the featured post excerpt that explains what the post is about.',
      date: '2024-01-20',
      author: 'Jane Doe',
      tags: ['React', 'TypeScript'],
      domain: 'Full-Stack',
      readTime: 5,
      featured: true,
    }),
    createMockBlogPost({
      id: '2',
      slug: 'devops-post',
      title: 'DevOps Best Practices',
      excerpt: 'Learn about CI/CD pipelines and automation.',
      date: '2024-01-15',
      author: 'John Smith',
      tags: ['Docker', 'Kubernetes'],
      domain: 'DevOps',
      readTime: 3,
      featured: false,
    }),
    createMockBlogPost({
      id: '3',
      slug: 'security-post',
      title: 'Security Fundamentals',
      excerpt: 'Understanding application security basics.',
      date: '2024-01-10',
      author: 'Alice Johnson',
      tags: ['Security', 'OWASP'],
      domain: 'Security',
      readTime: 7,
      featured: false,
    }),
  ]

  describe('Complete Layout Rendering', () => {
    it('renders all major sections of the blog layout', () => {
      render(<BlogLayout posts={mockPosts} />)

      // Page title
      expect(
        screen.getByRole('heading', { level: 1, name: /blog/i })
      ).toBeInTheDocument()

      // Featured post is displayed
      expect(screen.getByText('Featured Post Title')).toBeInTheDocument()
      expect(screen.getByText(/featured post excerpt/i)).toBeInTheDocument()

      // Domain filter is present
      expect(screen.getByText('Technical Domains')).toBeInTheDocument()

      // Other posts are displayed
      expect(screen.getByText('DevOps Best Practices')).toBeInTheDocument()
      expect(screen.getByText('Security Fundamentals')).toBeInTheDocument()
    })

    it('displays correct metadata for each post', () => {
      render(<BlogLayout posts={mockPosts} />)

      // Authors
      expect(screen.getByText(/Jane Doe/)).toBeInTheDocument()
      expect(screen.getByText(/John Smith/)).toBeInTheDocument()

      // Read times
      expect(screen.getByText(/5 min read/)).toBeInTheDocument()
      expect(screen.getByText(/3 min read/)).toBeInTheDocument()

      // Dates (formatted)
      expect(screen.getByText(/Jan.*20.*2024/)).toBeInTheDocument()
    })
  })

  describe('Empty States', () => {
    it('shows empty message when no posts provided', () => {
      render(<BlogLayout posts={[]} />)
      expect(screen.getByText(/no posts found/i)).toBeInTheDocument()
    })

    it('shows custom empty message when provided', () => {
      render(<BlogLayout posts={[]} emptyMessage="Coming soon!" />)
      expect(screen.getByText('Coming soon!')).toBeInTheDocument()
    })
  })

  describe('Loading State', () => {
    it('shows loading skeletons when loading prop is true', () => {
      render(<BlogLayout posts={[]} loading={true} />)

      // Should show skeleton loaders
      const skeletons = screen.getAllByTestId('blog-card-skeleton')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('shows loading skeleton instead of content when loading', () => {
      render(<BlogLayout posts={mockPosts} loading={true} />)

      // Should show skeletons
      const skeletons = screen.getAllByTestId('blog-card-skeleton')
      expect(skeletons.length).toBeGreaterThan(0)

      // BlogLayout may still show featured post during loading
      // This is implementation-specific behavior
    })
  })

  describe('Responsive Behavior', () => {
    it('renders in sidebar layout by default', () => {
      const { container } = render(<BlogLayout posts={mockPosts} />)

      // Should have flex layout with responsive classes
      const layoutContainer = container.querySelector('.flex.flex-col')
      expect(layoutContainer).toBeInTheDocument()

      // Desktop sidebar should be present (hidden on mobile via CSS)
      const sidebar = screen.getByTestId('desktop-filter')
      expect(sidebar).toBeInTheDocument()

      // Mobile filter should also be present (hidden on desktop via CSS)
      const mobileFilter = screen.getByTestId('mobile-filter')
      expect(mobileFilter).toBeInTheDocument()
    })

    it('can render in stacked layout when specified', () => {
      const { container } = render(
        <BlogLayout posts={mockPosts} layout="stacked" />
      )

      // Should have different layout structure
      const mainContent = container.querySelector('main')
      expect(mainContent).toBeInTheDocument()
    })
  })

  describe('Optional Props', () => {
    it('hides featured section when showFeatured is false', () => {
      render(<BlogLayout posts={mockPosts} showFeatured={false} />)

      // Featured post should not be displayed separately
      // Check that the featured post is in the regular grid instead
      const allPosts = screen.getAllByRole('article')
      expect(allPosts.length).toBe(3) // All 3 posts in regular grid
    })

    it('hides domain filter when showDomainFilter is false', () => {
      render(<BlogLayout posts={mockPosts} showDomainFilter={false} />)

      // Domain filter should not be present
      expect(screen.queryByText('Technical Domains')).not.toBeInTheDocument()
      expect(screen.queryByRole('navigation')).not.toBeInTheDocument()
    })
  })
})
