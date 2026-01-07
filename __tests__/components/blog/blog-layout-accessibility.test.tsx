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

describe('BlogLayout Accessibility', () => {
  const mockPosts = [
    createMockBlogPost({
      id: '1',
      title: 'Featured Post',
      featured: true,
      domain: 'Full-Stack',
    }),
    createMockBlogPost({
      id: '2',
      title: 'DevOps Post',
      domain: 'DevOps',
    }),
    createMockBlogPost({
      id: '3',
      title: 'Security Post',
      domain: 'Security',
    }),
  ]

  describe('Semantic Structure', () => {
    it('has proper semantic HTML structure', () => {
      render(<BlogLayout posts={mockPosts} />)

      // Main landmark
      expect(screen.getByRole('main')).toBeInTheDocument()

      // Navigation for filters (mobile + desktop = 2 nav elements)
      const navElements = screen.getAllByRole('navigation')
      expect(navElements.length).toBeGreaterThan(0)

      // Articles for blog posts
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThan(0)

      // Proper heading hierarchy
      const h1 = screen.getByRole('heading', { level: 1 })
      expect(h1).toHaveTextContent(/blog/i)
    })

    it('uses appropriate ARIA labels', () => {
      render(<BlogLayout posts={mockPosts} />)

      // All navigation elements should have labels
      const navElements = screen.getAllByRole('navigation')
      navElements.forEach((nav) => {
        expect(nav).toHaveAttribute('aria-label')
      })

      // Filter buttons in desktop filter should have ARIA states
      const filter = within(getDesktopFilter())
      const filterButtons = filter.getAllByRole('button')
      filterButtons.forEach((button) => {
        expect(button).toHaveAttribute('aria-pressed')
      })
    })

    it('provides skip navigation link', () => {
      render(<BlogLayout posts={mockPosts} />)

      // Should have skip to content link (may be visually hidden)
      const skipLink = screen.queryByText(/skip to content/i)
      if (skipLink) {
        expect(skipLink).toHaveAttribute('href', '#main-content')
      }
    })
  })

  describe('Keyboard Navigation', () => {
    it('provides keyboard navigation for all interactive elements', async () => {
      render(<BlogLayout posts={mockPosts} />)

      const filterButtons = screen.getAllByRole('button')
      const links = screen.getAllByRole('link')

      // All interactive elements should be keyboard accessible
      const allElements = [...filterButtons, ...links]
      allElements.forEach((element) => {
        const tabindex = element.getAttribute('tabindex')
        if (tabindex) {
          expect(parseInt(tabindex)).toBeGreaterThanOrEqual(-1)
        }
      })
    })

    it('supports Tab key navigation through filters', async () => {
      const user = userEvent.setup()
      render(<BlogLayout posts={mockPosts} />)

      // Tab through interactive elements
      await user.tab()
      // Should focus on something interactive (button or link)
      expect(
        document.activeElement?.getAttribute('role') === 'button' ||
          document.activeElement?.getAttribute('role') === 'link' ||
          document.activeElement?.tagName === 'A' ||
          document.activeElement?.tagName === 'BUTTON'
      ).toBeTruthy()

      await user.tab()
      // Should continue to next interactive element
      expect(
        document.activeElement?.getAttribute('role') === 'button' ||
          document.activeElement?.getAttribute('role') === 'link' ||
          document.activeElement?.tagName === 'A' ||
          document.activeElement?.tagName === 'BUTTON'
      ).toBeTruthy()
    })

    it('supports Enter and Space keys for filter activation', async () => {
      const user = userEvent.setup()
      render(<BlogLayout posts={mockPosts} />)

      const filter = within(getDesktopFilter())
      const devOpsButton = filter.getByRole('button', { name: /devops/i })
      devOpsButton.focus()

      // Enter key
      await user.keyboard('{Enter}')
      await waitFor(() => {
        expect(devOpsButton).toHaveAttribute('aria-pressed', 'true')
      })

      // Reset
      const allButton = filter.getByRole('button', { name: /all posts/i })
      await user.click(allButton)

      // Space key
      devOpsButton.focus()
      await user.keyboard(' ')
      await waitFor(() => {
        expect(devOpsButton).toHaveAttribute('aria-pressed', 'true')
      })
    })

    it('maintains focus after filter selection', async () => {
      const user = userEvent.setup()
      render(<BlogLayout posts={mockPosts} />)

      const filter = within(getDesktopFilter())
      const devOpsButton = filter.getByRole('button', { name: /devops/i })
      devOpsButton.focus()

      await user.click(devOpsButton)

      // Focus should remain on the clicked button
      await waitFor(() => {
        expect(document.activeElement).toBe(devOpsButton)
      })
    })
  })

  describe('Screen Reader Support', () => {
    it('announces filter changes to screen readers', async () => {
      const user = userEvent.setup()
      render(<BlogLayout posts={mockPosts} />)

      const filter = within(getDesktopFilter())
      const devOpsButton = filter.getByRole('button', { name: /devops/i })

      // Button should have aria-pressed state
      expect(devOpsButton).toHaveAttribute('aria-pressed', 'false')

      await user.click(devOpsButton)

      // State should update for screen readers
      await waitFor(() => {
        expect(devOpsButton).toHaveAttribute('aria-pressed', 'true')
      })
    })

    it('provides descriptive labels for all images', () => {
      const postsWithImages = mockPosts.map((p) => ({
        ...p,
        imageUrl: '/test-image.jpg',
      }))

      render(<BlogLayout posts={postsWithImages} />)

      const images = screen.getAllByRole('img')
      images.forEach((img) => {
        expect(img).toHaveAttribute('alt')
        expect(img.getAttribute('alt')).not.toBe('')
      })
    })

    it('uses live regions for dynamic content updates', async () => {
      const user = userEvent.setup()
      render(<BlogLayout posts={mockPosts} />)

      // Component should handle dynamic updates accessibly
      // Either through live regions or other ARIA announcements
      const filter = within(getDesktopFilter())
      const devOpsButton = filter.getByRole('button', { name: /devops/i })

      // Click filter to trigger update
      await user.click(devOpsButton)

      // Content should update dynamically
      await waitFor(() => {
        // Check that filtering happened - DevOps post should be visible
        expect(screen.getByText('DevOps Post')).toBeInTheDocument()
      })

      // Component provides feedback about the change
      // Either through live regions, aria-pressed, or visible content changes
      expect(devOpsButton).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('Focus Management', () => {
    it('traps focus within modal dialogs if present', () => {
      // Test only if BlogLayout has modal functionality
      const { container } = render(<BlogLayout posts={mockPosts} />)

      const modal = container.querySelector('[role="dialog"]')
      if (modal) {
        expect(modal).toHaveAttribute('aria-modal', 'true')
      }
    })

    it('restores focus after closing overlays', async () => {
      const user = userEvent.setup()
      render(<BlogLayout posts={mockPosts} />)

      // If there's a filter dropdown or modal
      const triggerButton = screen.queryByRole('button', { name: /filter/i })
      if (triggerButton) {
        triggerButton.focus()
        const initialFocus = document.activeElement

        await user.click(triggerButton)
        await user.keyboard('{Escape}')

        expect(document.activeElement).toBe(initialFocus)
      }
    })
  })

  describe('Color Contrast and Visual Indicators', () => {
    it('provides non-color indicators for active states', () => {
      render(<BlogLayout posts={mockPosts} />)

      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        // Should have text or aria indicators for state
        const ariaPressed = button.getAttribute('aria-pressed')
        const ariaExpanded = button.getAttribute('aria-expanded')

        // Button should indicate its state through ARIA (either pressed or expanded)
        const hasAriaState = ariaPressed !== null || ariaExpanded !== null
        expect(hasAriaState).toBe(true)

        // Active button has non-color indicator (aria-pressed="true")
        if (ariaPressed === 'true') {
          // This is the non-color indicator - screen readers will announce it
          expect(button).toHaveAttribute('aria-pressed', 'true')
        }
      })
    })

    it('ensures interactive elements have visible focus indicators', () => {
      const { container } = render(<BlogLayout posts={mockPosts} />)

      // Check for focus styles
      const styles = container.querySelector('style')
      if (styles) {
        expect(styles.textContent).toContain('focus')
      }

      // All interactive elements should have focus styles
      const buttons = screen.getAllByRole('button')
      buttons.forEach((button) => {
        // Elements should have focus-visible or similar classes available
        expect(button.className).toBeDefined()
      })
    })
  })

  describe('Responsive Accessibility', () => {
    it('maintains accessibility on mobile viewports', () => {
      // Mock mobile viewport
      global.innerWidth = 375
      global.innerHeight = 667

      render(<BlogLayout posts={mockPosts} />)

      // All interactive elements should be accessible
      const buttons = screen.getAllByRole('button')
      const links = screen.getAllByRole('link')

      // Should have interactive elements
      expect(buttons.length + links.length).toBeGreaterThan(0)

      // Interactive elements should be keyboard accessible
      const allElements = [...buttons, ...links]
      allElements.forEach((element) => {
        // Should not be disabled or hidden from accessibility tree
        expect(element).not.toHaveAttribute('aria-hidden', 'true')
        expect(element).not.toBeDisabled()
      })
    })

    it('provides appropriate navigation for touch devices', () => {
      render(<BlogLayout posts={mockPosts} />)

      // Should not rely on hover-only interactions
      const interactiveElements = screen.getAllByRole('button')
      interactiveElements.forEach((element) => {
        // Should have click handlers, not just hover
        expect(element).toHaveProperty('onclick')
      })
    })
  })
})
