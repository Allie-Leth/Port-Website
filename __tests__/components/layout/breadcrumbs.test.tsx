import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Breadcrumbs } from '@/components/layout/breadcrumbs'

// Mock usePathname
jest.mock('next/navigation', () => ({
  usePathname: jest.fn(),
}))

import { usePathname } from 'next/navigation'

describe('Breadcrumbs', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  it('renders navigation element with proper ARIA label', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/')
    render(<Breadcrumbs />)

    const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(nav).toBeInTheDocument()
  })

  it('displays tilde (~) as hire/portfolio link', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/')
    render(<Breadcrumbs />)

    const hireLink = screen.getByRole('link', { name: '~' })
    expect(hireLink).toBeInTheDocument()
    expect(hireLink).toHaveAttribute('href', '/hire')
  })

  it('displays ~/home on homepage', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/')
    render(<Breadcrumbs />)

    expect(screen.getByText('~')).toBeInTheDocument()
    expect(screen.getByText('home')).toBeInTheDocument()
  })

  it('displays ~/home/blog on blog page', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/blog')
    render(<Breadcrumbs />)

    expect(screen.getByText('~')).toBeInTheDocument()
    const homeLink = screen.getByRole('link', { name: 'home' })
    expect(homeLink).toBeInTheDocument()
    expect(homeLink).toHaveAttribute('href', '/')
    expect(screen.getByText('blog')).toBeInTheDocument()
  })

  it('displays ~/home/blog/my-post for nested routes', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/blog/my-post')
    render(<Breadcrumbs />)

    expect(screen.getByText('~')).toBeInTheDocument()
    const homeLink = screen.getByRole('link', { name: 'home' })
    expect(homeLink).toHaveAttribute('href', '/')
    const blogLink = screen.getByRole('link', { name: 'blog' })
    expect(blogLink).toHaveAttribute('href', '/blog')
    expect(screen.getByText('my-post')).toBeInTheDocument()
  })

  it('accepts and applies custom className', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/')
    render(<Breadcrumbs className="custom-class" />)

    const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(nav.className).toContain('custom-class')
  })

  it('has pill styling', () => {
    ;(usePathname as jest.Mock).mockReturnValue('/')
    render(<Breadcrumbs />)

    const nav = screen.getByRole('navigation', { name: /breadcrumb/i })
    expect(nav.className).toContain('rounded-full')
  })
})
