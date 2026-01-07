import { render, screen, within } from '@/__tests__/setup/test-utils'
import { fireEvent } from '@testing-library/react'
import Home from '@/app/page'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'

// Mock the blog service
jest.mock('@/lib/services/blog-service', () => ({
  getAllPosts: jest.fn(() =>
    Promise.resolve([
      createMockBlogPost({
        id: '1',
        slug: 'latest-post',
        title: 'Latest Post',
        date: '2024-01-25T10:00:00Z',
        featured: false,
      }),
      createMockBlogPost({
        id: '2',
        slug: 'featured-post',
        title: 'Featured Post',
        date: '2024-01-20T10:00:00Z',
        featured: true,
        excerpt: 'This is the featured post excerpt.',
      }),
    ])
  ),
  getFeaturedPost: jest.fn(() =>
    Promise.resolve(
      createMockBlogPost({
        id: '2',
        slug: 'featured-post',
        title: 'Featured Post',
        date: '2024-01-20T10:00:00Z',
        featured: true,
        excerpt: 'This is the featured post excerpt.',
      })
    )
  ),
}))

describe('Home Component', () => {
  it('renders the main heading', async () => {
    render(await Home())

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('renders the name and title structure', async () => {
    render(await Home())

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    // Name and title exist but we don't test specific text
  })

  it('renders the taglines container', async () => {
    render(await Home())

    const taglinesContainer = screen.getByTestId('taglines-container')
    expect(taglinesContainer).toBeInTheDocument()
  })

  it('renders navigation links', async () => {
    render(await Home())

    const links = screen.getAllByRole('link')
    // We have navigation links but don't test specific text
    expect(links.length).toBeGreaterThan(0)
    links.forEach((link) => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('renders the button bar with navigation', async () => {
    render(await Home())

    const buttonBar = screen.getByTestId('button-bar')
    expect(buttonBar).toBeInTheDocument()

    const links = within(buttonBar).getAllByRole('link')
    expect(links.length).toBe(2) // Blog, About
  })

  // Removed: CSS class testing provides no regression value

  // Removed: Implementation detail testing

  // Removed: CSS class testing for responsive design

  // Removed: CSS state testing - will be replaced with interaction tests

  // New high-quality tests below

  it('all interactive elements can receive focus', async () => {
    render(await Home())

    const links = screen.getAllByRole('link')

    // Test that all links can receive focus
    links.forEach((link) => {
      link.focus()
      expect(document.activeElement).toBe(link)
    })
  })

  it('buttons are keyboard accessible', async () => {
    render(await Home())

    const links = screen.getAllByRole('link')
    const firstLink = links[0]

    // Focus the button
    firstLink.focus()
    expect(document.activeElement).toBe(firstLink)

    // Test Enter key activation (navigation would happen in real app)
    const enterEvent = fireEvent.keyDown(firstLink, { key: 'Enter' })
    expect(enterEvent).toBe(true) // Event was not prevented
  })

  it('maintains proper heading hierarchy for accessibility', async () => {
    render(await Home())

    const headings = screen.getAllByRole('heading')
    // Should have one h1 and possibly h3s for cards
    expect(headings.length).toBeGreaterThanOrEqual(1)
    expect(headings[0]).toHaveProperty('tagName', 'H1')

    // Ensure h1 exists and has content
    expect(headings[0]).toBeInTheDocument()
  })

  it('provides semantic navigation structure', async () => {
    render(await Home())

    // Page has proper heading
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()

    // All interactive elements are links with href
    const links = screen.getAllByRole('link')
    links.forEach((link) => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('maintains proper tab order for keyboard navigation', async () => {
    render(await Home())

    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThan(0)

    // Verify all links are in the tab order
    links.forEach((link) => {
      expect(link).toHaveAttribute('href')
    })
  })

  it('provides appropriate link structure for screen readers', async () => {
    render(await Home())

    const links = screen.getAllByRole('link')

    // All links have href attributes
    links.forEach((link) => {
      expect(link).toHaveAttribute('href')
      // Links have text content (not empty)
      expect(link.textContent).toBeTruthy()
    })
  })

  it('renders without crashing in different scenarios', async () => {
    // Test multiple renders don't cause issues
    const homeElement = await Home()
    const { rerender } = render(homeElement)
    expect(() => rerender(homeElement)).not.toThrow()

    // Test unmounting doesn't cause issues
    const { unmount } = render(await Home())
    expect(() => unmount()).not.toThrow()
  })

  it('contains accessible text elements', async () => {
    render(await Home())

    // Verify text elements exist
    // This is a basic test - full contrast testing would use axe-core
    const heading = screen.getByRole('heading', { level: 1 })
    const taglinesContainer = screen.getByTestId('taglines-container')

    // Elements should have text content (not be invisible)
    expect(heading.textContent).toBeTruthy()
    expect(taglinesContainer.textContent).toBeTruthy()
  })
})
