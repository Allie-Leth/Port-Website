import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContactDropdown } from '@/components/layout/contact-dropdown'

describe('ContactDropdown', () => {
  it('renders Contact link', () => {
    render(<ContactDropdown />)

    const link = screen.getByRole('link', { name: /contact/i })
    expect(link).toBeInTheDocument()
  })

  it('links to contact page', () => {
    render(<ContactDropdown />)

    const link = screen.getByRole('link', { name: /contact/i })
    expect(link).toHaveAttribute('href', '/contact')
  })

  it('maintains pill styling consistent with design', () => {
    render(<ContactDropdown />)

    const link = screen.getByRole('link', { name: /contact/i })
    expect(link.className).toContain('rounded-full')
    expect(link.className).toContain('px-5')
    expect(link.className).toContain('py-2.5')
  })

  it('applies custom className', () => {
    render(<ContactDropdown className="custom-class" />)

    const link = screen.getByRole('link', { name: /contact/i })
    expect(link.className).toContain('custom-class')
  })
})
