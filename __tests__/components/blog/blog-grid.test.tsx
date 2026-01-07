import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BlogGrid } from '@/components/blog/blog-grid'
import { BlogPost } from '@/lib/types/blog'

describe('BlogGrid', () => {
  const mockPosts: BlogPost[] = [
    {
      id: '1',
      slug: 'post-1',
      title: 'First Post',
      excerpt: 'First post excerpt',
      content: 'Content 1',
      date: '2024-01-15T00:00:00Z',
      author: 'Author 1',
      tags: ['React'],
      domain: 'Full-Stack',
      readTime: 5,
      featured: false,
    },
    {
      id: '2',
      slug: 'post-2',
      title: 'Second Post',
      excerpt: 'Second post excerpt',
      content: 'Content 2',
      date: '2024-01-10T00:00:00Z',
      author: 'Author 2',
      tags: ['TypeScript'],
      domain: 'DevOps',
      readTime: 3,
      featured: false,
    },
    {
      id: '3',
      slug: 'post-3',
      title: 'Third Post',
      excerpt: 'Third post excerpt',
      content: 'Content 3',
      date: '2024-01-05T00:00:00Z',
      author: 'Author 3',
      tags: ['Testing'],
      domain: 'Security',
      readTime: 7,
      featured: false,
    },
  ]

  describe('Rendering', () => {
    it('renders a grid container', () => {
      const { container } = render(<BlogGrid posts={mockPosts} />)
      const grid = container.querySelector('.grid')
      expect(grid).toBeInTheDocument()
    })

    it('renders all provided posts', () => {
      render(<BlogGrid posts={mockPosts} />)
      expect(screen.getByText('First Post')).toBeInTheDocument()
      expect(screen.getByText('Second Post')).toBeInTheDocument()
      expect(screen.getByText('Third Post')).toBeInTheDocument()
    })

    it('renders BlogCard components for each post', () => {
      render(<BlogGrid posts={mockPosts} />)
      const articles = screen.getAllByRole('article')
      expect(articles).toHaveLength(3)
    })

    it('passes post data to BlogCard components', () => {
      render(<BlogGrid posts={mockPosts} />)
      expect(screen.getByText('First post excerpt')).toBeInTheDocument()
      expect(screen.getByText(/Author 1/)).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
    })
  })

  describe('Empty State', () => {
    it('handles empty posts array', () => {
      render(<BlogGrid posts={[]} />)
      expect(screen.getByText(/no posts/i)).toBeInTheDocument()
    })

    it('shows appropriate empty message', () => {
      render(<BlogGrid posts={[]} />)
      const emptyMessage = screen.getByText(/no posts found/i)
      expect(emptyMessage).toBeInTheDocument()
    })

    it('maintains layout structure when empty', () => {
      const { container } = render(<BlogGrid posts={[]} />)
      // Should still have a container element
      expect(container.firstChild).toBeInTheDocument()
    })
  })

  describe('Grid Layout', () => {
    it('applies responsive grid classes', () => {
      const { container } = render(<BlogGrid posts={mockPosts} />)
      const grid = container.querySelector('.grid')
      expect(grid?.className).toContain('md:grid-cols-2')
      expect(grid?.className).toContain('lg:grid-cols-3')
    })

    it('has proper gap between cards', () => {
      const { container } = render(<BlogGrid posts={mockPosts} />)
      const grid = container.querySelector('.grid')
      expect(grid?.className).toMatch(/gap-\d/)
    })

    it('handles single post layout', () => {
      const singlePost = [mockPosts[0]]
      render(<BlogGrid posts={singlePost} />)
      const articles = screen.getAllByRole('article')
      expect(articles).toHaveLength(1)
    })

    it('handles many posts gracefully', () => {
      const manyPosts = Array.from({ length: 12 }, (_, i) => ({
        ...mockPosts[0],
        id: `post-${i}`,
        slug: `post-${i}`,
        title: `Post ${i}`,
      }))

      render(<BlogGrid posts={manyPosts} />)
      const articles = screen.getAllByRole('article')
      expect(articles).toHaveLength(12)
    })
  })

  describe('Loading State', () => {
    it('shows loading skeleton when loading prop is true', () => {
      render(<BlogGrid posts={[]} loading={true} />)
      const skeletons = screen.getAllByTestId('blog-card-skeleton')
      expect(skeletons.length).toBeGreaterThan(0)
    })

    it('shows multiple skeleton cards', () => {
      render(<BlogGrid posts={[]} loading={true} />)
      const skeletons = screen.getAllByTestId('blog-card-skeleton')
      expect(skeletons.length).toBeGreaterThanOrEqual(6) // Show at least 6 skeletons
    })

    it('does not show posts when loading', () => {
      render(<BlogGrid posts={mockPosts} loading={true} />)
      expect(screen.queryByText('First Post')).not.toBeInTheDocument()
    })

    it('hides loading state when not loading', () => {
      render(<BlogGrid posts={mockPosts} loading={false} />)
      expect(screen.queryByTestId('blog-card-skeleton')).not.toBeInTheDocument()
    })
  })

  describe('Custom Columns', () => {
    it('accepts custom column configuration', () => {
      const { container } = render(
        <BlogGrid posts={mockPosts} columns={{ sm: 1, md: 2, lg: 4 }} />
      )
      const grid = container.querySelector('.grid')
      expect(grid?.className).toContain('md:grid-cols-2')
      expect(grid?.className).toContain('lg:grid-cols-4')
    })

    it('uses default columns when not specified', () => {
      const { container } = render(<BlogGrid posts={mockPosts} />)
      const grid = container.querySelector('.grid')
      // Should have default responsive columns
      expect(grid?.className).toMatch(/grid-cols/)
    })

    it('applies explicit grid-cols classes for Tailwind purging', () => {
      // This test ensures we use static class strings, not dynamic template literals
      // Dynamic classes like `grid-cols-${n}` won't be purged by Tailwind correctly
      const { container } = render(
        <BlogGrid posts={mockPosts} columns={{ sm: 2, md: 3, lg: 4 }} />
      )
      const grid = container.querySelector('.grid')
      // Verify exact class strings are present (not dynamic)
      expect(grid?.className).toContain('grid-cols-2')
      expect(grid?.className).toContain('md:grid-cols-3')
      expect(grid?.className).toContain('lg:grid-cols-4')
    })

    it('applies grid-cols-1 for single column layout', () => {
      const { container } = render(
        <BlogGrid posts={mockPosts} columns={{ sm: 1, md: 1, lg: 1 }} />
      )
      const grid = container.querySelector('.grid')
      expect(grid?.className).toContain('grid-cols-1')
    })
  })

  describe('Accessibility', () => {
    it('uses semantic HTML structure', () => {
      const { container } = render(<BlogGrid posts={mockPosts} />)
      const section = container.querySelector('section')
      expect(section).toBeInTheDocument()
    })

    it('has appropriate ARIA labels', () => {
      render(<BlogGrid posts={mockPosts} />)
      const grid = screen.getByRole('region', { name: /blog posts/i })
      expect(grid).toBeInTheDocument()
    })

    it('maintains heading hierarchy', () => {
      render(<BlogGrid posts={mockPosts} />)
      const headings = screen.getAllByRole('heading')
      // Blog card headings should be h3
      headings.forEach((heading) => {
        expect(heading.tagName).toBe('H3')
      })
    })

    it('provides keyboard navigation', () => {
      render(<BlogGrid posts={mockPosts} />)
      const links = screen.getAllByRole('link')
      links.forEach((link) => {
        expect(link).toHaveAttribute('href')
      })
    })
  })

  describe('Optional Props', () => {
    it('accepts custom className', () => {
      const { container } = render(
        <BlogGrid posts={mockPosts} className="custom-grid-class" />
      )
      const section = container.querySelector('section')
      expect(section).toHaveClass('custom-grid-class')
    })

    it('accepts custom empty message', () => {
      render(<BlogGrid posts={[]} emptyMessage="No blog posts available yet" />)
      expect(
        screen.getByText('No blog posts available yet')
      ).toBeInTheDocument()
    })
  })

  describe('Error Handling', () => {
    it('handles posts with missing fields gracefully', () => {
      const invalidPosts = [
        {
          ...mockPosts[0],
          title: '', // Empty title
        },
      ] as BlogPost[]

      // Should render without crashing
      render(<BlogGrid posts={invalidPosts} />)
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('handles null/undefined posts array', () => {
      render(<BlogGrid posts={null} />)
      expect(screen.getByText(/no posts/i)).toBeInTheDocument()
    })
  })

  describe('Performance', () => {
    it('uses React keys for list items', () => {
      const { container } = render(<BlogGrid posts={mockPosts} />)
      const gridChildren = container.querySelector('.grid')?.children
      // Each child should be rendered with a unique key (React handles this internally)
      expect(gridChildren?.length).toBe(3)
    })

    it('memoizes grid when posts do not change', () => {
      const { rerender } = render(<BlogGrid posts={mockPosts} />)
      const firstRender = screen.getByText('First Post')

      // Rerender with same posts
      rerender(<BlogGrid posts={mockPosts} />)
      const secondRender = screen.getByText('First Post')

      // Elements should be the same (not recreated)
      expect(firstRender).toBe(secondRender)
    })
  })
})
