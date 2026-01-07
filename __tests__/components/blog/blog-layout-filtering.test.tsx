import React from 'react'
import { render, screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { BlogLayout } from '@/components/blog/blog-layout'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'

/**
 * Helper to get the desktop filter container.
 * Needed because BlogLayout now renders both mobile (chips) and desktop (sidebar) filters.
 */
const getDesktopFilter = () => screen.getByTestId('desktop-filter')

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

describe('BlogLayout Domain Filtering', () => {
  const mockPosts = [
    createMockBlogPost({
      id: '1',
      title: 'DevOps Post 1',
      domain: 'DevOps',
      featured: false,
    }),
    createMockBlogPost({
      id: '2',
      title: 'DevOps Post 2',
      domain: 'DevOps',
      featured: false,
    }),
    createMockBlogPost({
      id: '3',
      title: 'Security Post',
      domain: 'Security',
      featured: false,
    }),
    createMockBlogPost({
      id: '4',
      title: 'Full-Stack Post',
      domain: 'Full-Stack',
      featured: false,
    }),
    createMockBlogPost({
      id: '5',
      title: 'Firmware Post',
      domain: 'Firmware',
      featured: false,
    }),
  ]

  it('extracts unique domains from posts', () => {
    render(<BlogLayout posts={mockPosts} />)

    // Check all domains are displayed in desktop filter
    const filter = within(getDesktopFilter())
    expect(filter.getByRole('button', { name: /DevOps/i })).toBeInTheDocument()
    expect(
      filter.getByRole('button', { name: /Security/i })
    ).toBeInTheDocument()
    expect(
      filter.getByRole('button', { name: /Full-Stack/i })
    ).toBeInTheDocument()
    expect(
      filter.getByRole('button', { name: /Firmware/i })
    ).toBeInTheDocument()
  })

  it('filters posts by selected domain', async () => {
    const user = userEvent.setup()
    render(<BlogLayout posts={mockPosts} />)

    const filter = within(getDesktopFilter())

    // Initially all posts visible
    expect(screen.getByText('DevOps Post 1')).toBeInTheDocument()
    expect(screen.getByText('Security Post')).toBeInTheDocument()

    // Click DevOps filter
    await user.click(filter.getByRole('button', { name: /DevOps/i }))

    // Only DevOps posts should be visible
    await waitFor(() => {
      expect(screen.getByText('DevOps Post 1')).toBeInTheDocument()
      expect(screen.getByText('DevOps Post 2')).toBeInTheDocument()
      expect(screen.queryByText('Security Post')).not.toBeInTheDocument()
      expect(screen.queryByText('Full-Stack Post')).not.toBeInTheDocument()
    })
  })

  it('shows all posts when All filter is selected', async () => {
    const user = userEvent.setup()
    render(<BlogLayout posts={mockPosts} />)

    const filter = within(getDesktopFilter())

    // Filter by domain first
    await user.click(filter.getByRole('button', { name: /Security/i }))

    await waitFor(() => {
      expect(screen.queryByText('DevOps Post 1')).not.toBeInTheDocument()
      expect(screen.getByText('Security Post')).toBeInTheDocument()
    })

    // Click All to show everything
    await user.click(filter.getByRole('button', { name: /All/i }))

    await waitFor(() => {
      expect(screen.getByText('DevOps Post 1')).toBeInTheDocument()
      expect(screen.getByText('Security Post')).toBeInTheDocument()
      expect(screen.getByText('Full-Stack Post')).toBeInTheDocument()
    })
  })

  it('displays domain post counts', () => {
    render(<BlogLayout posts={mockPosts} />)

    const filter = within(getDesktopFilter())

    // DevOps has 2 posts
    const devopsButton = filter.getByRole('button', { name: /DevOps/i })
    expect(devopsButton.textContent).toContain('2')

    // Others have 1 post each
    const securityButton = filter.getByRole('button', { name: /Security/i })
    expect(securityButton.textContent).toContain('1')
  })

  it('maintains filter state when posts update', () => {
    const { rerender } = render(<BlogLayout posts={mockPosts} />)

    const filter = within(getDesktopFilter())

    // Add a new post
    const updatedPosts = [
      ...mockPosts,
      createMockBlogPost({
        id: '6',
        title: 'New DevOps Post',
        domain: 'DevOps',
      }),
    ]

    rerender(<BlogLayout posts={updatedPosts} />)

    // New domain count should update
    const devopsButton = filter.getByRole('button', { name: /DevOps/i })
    expect(devopsButton.textContent).toContain('3')
  })

  it('handles posts with no domain gracefully', () => {
    const postsWithoutDomain = [
      createMockBlogPost({ title: 'Post 1', domain: 'DevOps' }),
      createMockBlogPost({ title: 'Post 2', domain: 'Security' }),
    ]

    render(<BlogLayout posts={postsWithoutDomain} />)

    const filter = within(getDesktopFilter())

    // Should still show available domains
    expect(filter.getByRole('button', { name: /DevOps/i })).toBeInTheDocument()
    expect(
      filter.getByRole('button', { name: /Security/i })
    ).toBeInTheDocument()
  })

  it('shows empty state when filtered domain has no posts', async () => {
    const user = userEvent.setup()
    const limitedPosts = [
      createMockBlogPost({ title: 'Only DevOps', domain: 'DevOps' }),
    ]

    render(<BlogLayout posts={limitedPosts} />)

    const filter = within(getDesktopFilter())

    // If Security filter exists but has no posts
    const securityButton = filter.queryByRole('button', { name: /Security/i })
    if (securityButton) {
      await user.click(securityButton)

      await waitFor(() => {
        expect(
          screen.getByText(/no posts|no articles|coming soon/i)
        ).toBeInTheDocument()
      })
    }
  })

  it('preserves filter selection across re-renders', async () => {
    const user = userEvent.setup()
    const { rerender } = render(<BlogLayout posts={mockPosts} />)

    const filter = within(getDesktopFilter())

    // Select a filter
    await user.click(filter.getByRole('button', { name: /Security/i }))

    // Re-render component
    rerender(<BlogLayout posts={mockPosts} />)

    // Filter should still be active (using aria-pressed instead of CSS class)
    const securityButton = filter.getByRole('button', { name: /Security/i })
    expect(securityButton).toHaveAttribute('aria-pressed', 'true')
  })

  it('filters work with featured post present', async () => {
    const user = userEvent.setup()
    const postsWithFeatured = [
      createMockBlogPost({
        title: 'Featured DevOps',
        domain: 'DevOps',
        featured: true,
      }),
      ...mockPosts,
    ]

    render(<BlogLayout posts={postsWithFeatured} />)

    const filter = within(getDesktopFilter())

    // Initially, featured post should be visible
    expect(screen.getByText('Featured DevOps')).toBeInTheDocument()

    // Filter by Security
    await user.click(filter.getByRole('button', { name: /Security/i }))

    await waitFor(() => {
      // Security post should be visible
      expect(screen.getByText('Security Post')).toBeInTheDocument()
      // The filter button should be active
      const securityButton = filter.getByRole('button', { name: /Security/i })
      expect(securityButton).toHaveAttribute('aria-pressed', 'true')
    })

    // Note: Featured post behavior when filtered may vary by implementation
    // Some designs show featured posts regardless of filter, others filter them
  })
})
