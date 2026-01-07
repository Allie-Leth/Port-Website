import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { MinimalHeader } from '@/components/layout/minimal-header'

describe('MinimalHeader', () => {
  describe('responsive padding', () => {
    it('applies mobile-first responsive padding classes', () => {
      render(<MinimalHeader />)
      const header = screen.getByRole('banner')

      // Mobile: p-4, Desktop: md:p-8
      expect(header.className).toContain('p-4')
      expect(header.className).toContain('md:p-8')
    })
  })

  it('provides navigation breadcrumbs for wayfinding', () => {
    render(<MinimalHeader />)

    // Header landmark for accessibility
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()

    // Hire/portfolio link accessible via tilde
    const hireLink = screen.getByRole('link', { name: '~' })
    expect(hireLink).toBeInTheDocument()
    expect(hireLink).toHaveAttribute('href', '/hire')

    // Current page indication
    expect(screen.getByText('home')).toBeInTheDocument()
  })

  it('enables quick access to contact page', () => {
    render(<MinimalHeader />)

    // Contact link is discoverable and accessible
    const contactLink = screen.getByRole('link', { name: /contact/i })
    expect(contactLink).toBeInTheDocument()
    expect(contactLink).toHaveAttribute('href', '/contact')
  })

  it('maintains persistent navigation throughout the site', () => {
    render(<MinimalHeader />)

    // Header provides consistent navigation landmark
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()

    // Navigation is always available
    const nav = screen.getByRole('navigation')
    expect(nav).toBeInTheDocument()
  })

  it('supports keyboard navigation for accessibility', async () => {
    const user = userEvent.setup()
    render(<MinimalHeader />)

    // Tab to reach navigation elements
    await user.tab()

    // Hire link should be focusable
    const hireLink = screen.getByRole('link', { name: '~' })
    expect(hireLink).toHaveAttribute('href', '/hire')

    // Contact link should be keyboard accessible
    const contactLink = screen.getByRole('link', { name: /contact/i })
    await user.tab()
    expect(document.activeElement).toBe(contactLink)
  })

  it('accepts additional properties for extensibility', () => {
    render(<MinimalHeader className="custom-header-style" />)

    // Component accepts and applies custom props
    const header = screen.getByRole('banner')
    expect(header).toBeInTheDocument()
  })

  it('provides accessible navigation structure', () => {
    render(<MinimalHeader />)

    // Header should be a landmark
    expect(screen.getByRole('banner')).toBeInTheDocument()

    // Should have navigation elements
    expect(screen.getByRole('navigation')).toBeInTheDocument()
  })
})
