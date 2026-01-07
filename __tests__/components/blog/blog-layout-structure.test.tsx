import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BlogLayout } from '@/components/blog/blog-layout'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'

// Only mock Next.js specific components that can't run in test environment
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
    return <img {...props} />
  },
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('BlogLayout Structure', () => {
  const mockPosts = [
    createMockBlogPost({
      id: '1',
      slug: 'featured-post',
      title: 'Featured Post',
      excerpt: 'Featured excerpt',
      domain: 'DevOps',
      featured: true,
    }),
    createMockBlogPost({
      id: '2',
      slug: 'post-2',
      title: 'Regular Post',
      domain: 'Full-Stack',
      featured: false,
    }),
    createMockBlogPost({
      id: '3',
      slug: 'post-3',
      title: 'Another Post',
      domain: 'Security',
      featured: false,
    }),
  ]

  it('renders all major sections', () => {
    render(<BlogLayout posts={mockPosts} />)

    // Check for main heading
    expect(screen.getByRole('heading', { name: /blog/i })).toBeInTheDocument()

    // Check for featured post
    expect(screen.getByText('Featured Post')).toBeInTheDocument()

    // Check for domain filter
    expect(screen.getByText('Technical Domains')).toBeInTheDocument()

    // Check for regular posts
    expect(screen.getByText('Regular Post')).toBeInTheDocument()
    expect(screen.getByText('Another Post')).toBeInTheDocument()
  })

  it('renders with proper layout structure', () => {
    const { container } = render(<BlogLayout posts={mockPosts} />)
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
    expect(main).toHaveAttribute('role', 'main')
  })

  it('renders header with title and description', () => {
    render(<BlogLayout posts={mockPosts} />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent(/blog/i)

    // Should have filter-related content (matches "All Posts" or similar)
    const filterText = screen.getAllByText(/thoughts|articles|posts/i)
    expect(filterText.length).toBeGreaterThan(0)
  })

  it('organizes content in semantic sections', () => {
    const { container } = render(<BlogLayout posts={mockPosts} />)

    // Should have sections for different parts
    const sections = container.querySelectorAll('section')
    expect(sections.length).toBeGreaterThan(0)
  })

  it('maintains responsive layout containers', () => {
    const { container } = render(<BlogLayout posts={mockPosts} />)

    // Check for container with responsive classes
    const containers = container.querySelectorAll(
      '[class*="container"], [class*="max-w"]'
    )
    expect(containers.length).toBeGreaterThan(0)
  })

  it('handles empty posts array', () => {
    render(<BlogLayout posts={[]} />)

    // Should still render structure
    expect(screen.getByRole('heading', { name: /blog/i })).toBeInTheDocument()

    // Should show empty state
    expect(
      screen.getByText(/no posts|coming soon|check back/i)
    ).toBeInTheDocument()
  })

  it('renders complete layout structure', () => {
    render(<BlogLayout posts={mockPosts} />)

    // Main content area should be present
    const main = screen.getByRole('main')
    expect(main).toBeInTheDocument()
  })

  it('applies custom className when provided', () => {
    const { container } = render(
      <BlogLayout posts={mockPosts} className="custom-blog-layout" />
    )

    expect(container.firstChild).toHaveClass('custom-blog-layout')
  })
})
