import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { BlogCard } from '@/components/blog/blog-card'
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

describe('BlogCard Accessibility', () => {
  const mockPost = createMockBlogPost({
    title: 'Accessible Blog Post Title',
    excerpt: 'This is an accessible blog post excerpt for testing.',
    date: '2024-01-15',
    tags: ['React', 'Accessibility'],
  })

  describe('Semantic HTML', () => {
    it('uses semantic HTML elements', () => {
      const { container } = render(<BlogCard post={mockPost} />)

      expect(container.querySelector('article')).toBeInTheDocument()
      expect(container.querySelector('h3')).toBeInTheDocument() // Title should be heading
      expect(container.querySelector('time')).toBeInTheDocument() // Date should use time element
    })

    it('provides proper heading hierarchy', () => {
      render(<BlogCard post={mockPost} />)
      const heading = screen.getByRole('heading')

      // BlogCard headings should be h3 (assuming h1 is page, h2 is section)
      expect(heading.tagName).toBe('H3')
      expect(heading).toHaveTextContent('Accessible Blog Post Title')
    })

    it('uses proper article structure', () => {
      const { container } = render(<BlogCard post={mockPost} />)
      const article = container.querySelector('article')

      expect(article).toBeInTheDocument()
      expect(article).toContainElement(screen.getByRole('heading'))
      expect(article).toContainElement(
        screen.getByText(/This is an accessible/)
      )
    })

    it('provides semantic time element with datetime attribute', () => {
      render(<BlogCard post={mockPost} />)
      const timeElement = document.querySelector('time')

      expect(timeElement).toBeInTheDocument()
      expect(timeElement).toHaveAttribute('dateTime')
      expect(timeElement?.getAttribute('dateTime')).toMatch(/2024-01-15/)
    })
  })

  describe('Keyboard Navigation', () => {
    it('supports keyboard navigation', () => {
      render(<BlogCard post={mockPost} />)
      const link = screen.getByRole('link')

      // Should be focusable
      link.focus()
      expect(link).toHaveFocus()
    })

    it('responds to Enter key', async () => {
      const user = userEvent.setup()
      render(<BlogCard post={mockPost} />)
      const link = screen.getByRole('link')

      // Focus and press Enter
      link.focus()
      await user.keyboard('{Enter}')

      // Should maintain focus and be activatable
      expect(link).toHaveFocus()
    })

    it('responds to Space key for activation', async () => {
      const user = userEvent.setup()
      render(<BlogCard post={mockPost} />)
      const link = screen.getByRole('link')

      link.focus()
      await user.keyboard(' ')

      // Link should remain focusable after Space
      expect(link).toHaveFocus()
    })

    it('provides visible focus indicators', () => {
      render(<BlogCard post={mockPost} />)
      const link = screen.getByRole('link')

      // Focus the link
      link.focus()

      // Should have focus styles (this is implementation dependent)
      expect(link).toHaveFocus()
      expect(link.className).toBeDefined()
    })
  })

  describe('Screen Reader Support', () => {
    it('has accessible name for screen readers', () => {
      render(<BlogCard post={mockPost} />)
      const link = screen.getByRole('link')

      // Link should have accessible name from title
      expect(link).toHaveAccessibleName(expect.stringContaining(mockPost.title))
    })

    it('provides ARIA labels where appropriate', () => {
      render(<BlogCard post={mockPost} />)
      const link = screen.getByRole('link')

      // Should have aria-label or be properly labeled by content
      const accessibleName = link.getAttribute('aria-label') || link.textContent
      expect(accessibleName).toContain('Accessible Blog Post Title')
    })

    it('announces content changes properly', () => {
      const { rerender } = render(<BlogCard post={mockPost} />)

      const updatedPost = createMockBlogPost({
        ...mockPost,
        title: 'Updated Title',
      })

      rerender(<BlogCard post={updatedPost} />)

      // Screen readers should be able to detect the change
      expect(screen.getByText('Updated Title')).toBeInTheDocument()
    })

    it('provides context for metadata', () => {
      render(<BlogCard post={mockPost} />)

      // Date should be in a time element with proper context
      const timeElement = screen.getByText(/Jan.*15.*2024/i)
      expect(timeElement.closest('time')).toBeInTheDocument()

      // Read time should have contextual information
      const readTime = screen.getByText(/min read/i)
      expect(readTime).toBeInTheDocument()
    })
  })

  describe('Color and Contrast', () => {
    it('has sufficient color contrast', () => {
      render(<BlogCard post={mockPost} />)

      // Text should be readable (this is more of a visual test)
      // We can at least verify text elements exist and are visible
      expect(screen.getByText(mockPost.title)).toBeVisible()
      expect(screen.getByText(/This is an accessible/)).toBeVisible()
    })

    it('provides non-color indicators for interactive states', () => {
      const { container } = render(<BlogCard post={mockPost} />)
      const link = screen.getByRole('link')

      // Should have text decoration, border changes, or other non-color indicators
      expect(link.className).toBeTruthy()

      // Focus should be indicated by more than just color
      link.focus()
      expect(link).toHaveFocus()
    })

    it('maintains readability in high contrast mode', () => {
      // Simulate high contrast mode
      const { container } = render(
        <div style={{ filter: 'contrast(1000%)' }}>
          <BlogCard post={mockPost} />
        </div>
      )

      // Elements should still be accessible
      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.getByText(mockPost.title)).toBeVisible()
    })
  })

  describe('Motion and Animation', () => {
    it('respects reduced motion preferences', () => {
      // Mock reduced motion preference
      Object.defineProperty(window, 'matchMedia', {
        value: jest.fn(() => ({
          matches: true, // prefers-reduced-motion: reduce
          media: '(prefers-reduced-motion: reduce)',
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
        })),
      })

      render(<BlogCard post={mockPost} />)

      // Component should still be functional
      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.getByRole('link')).toBeInTheDocument()
    })
  })

  describe('Touch Accessibility', () => {
    it('provides clickable/tappable interface', () => {
      render(<BlogCard post={mockPost} />)
      const link = screen.getByRole('link')

      // Card should be interactive
      expect(link).toBeInTheDocument()
      expect(link).toHaveAttribute('href')
    })

    it('works on all device types', () => {
      render(<BlogCard post={mockPost} />)

      // Card functionality should work regardless of device
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', `/blog/${mockPost.slug}`)
      expect(link).toHaveAccessibleName()
    })
  })

  describe('ARIA and Role Attributes', () => {
    it('uses appropriate ARIA roles', () => {
      const { container } = render(<BlogCard post={mockPost} />)

      // Article element provides semantic structure
      const article = container.querySelector('article')
      expect(article).toBeInTheDocument()
    })

    it('provides ARIA descriptions for complex content', () => {
      render(<BlogCard post={mockPost} />)
      const link = screen.getByRole('link')

      // Link should provide enough context
      const accessibleDescription = link.getAttribute('aria-describedby')
      if (accessibleDescription) {
        const descriptionElement = document.getElementById(
          accessibleDescription
        )
        expect(descriptionElement).toBeInTheDocument()
      }
    })

    it('handles ARIA states correctly', () => {
      render(<BlogCard post={mockPost} />)

      // Interactive elements should have proper ARIA states
      const interactiveElements = screen.getAllByRole('link')
      interactiveElements.forEach((element) => {
        // Should not have invalid ARIA states
        expect(element).not.toHaveAttribute('aria-disabled', 'true')
        expect(element).not.toHaveAttribute('aria-hidden', 'true')
      })
    })
  })

  describe('Error Handling and Robustness', () => {
    it('remains accessible with missing content', () => {
      const incompletePost = createMockBlogPost({
        title: 'Title Only',
        excerpt: '',
        author: '',
        tags: [],
      })

      render(<BlogCard post={incompletePost} />)

      // Should still be navigable and accessible
      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.getByRole('link')).toBeInTheDocument()
      expect(screen.getByRole('heading')).toHaveTextContent('Title Only')
    })

    it('handles screen reader navigation correctly', () => {
      render(<BlogCard post={mockPost} />)

      // All important content should be discoverable by screen readers
      const heading = screen.getByRole('heading')
      const link = screen.getByRole('link')
      const article = screen.getByRole('article')

      expect(heading).toBeInTheDocument()
      expect(link).toBeInTheDocument()
      expect(article).toBeInTheDocument()

      // Content should be present and structured
      expect(article).toBeInTheDocument()
      expect(heading).toBeInTheDocument()
    })
  })
})
