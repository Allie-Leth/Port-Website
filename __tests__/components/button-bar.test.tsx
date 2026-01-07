import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ButtonBar } from '@/components/button-bar'

describe('ButtonBar', () => {
  const mockButtons = [
    { href: '/blog', label: 'Blog' },
    { href: '/projects', label: 'Projects' },
    { href: '/about', label: 'About' },
  ]

  it('renders without crashing', () => {
    render(<ButtonBar buttons={mockButtons} />)
  })

  it('renders all buttons', () => {
    render(<ButtonBar buttons={mockButtons} />)
    const links = screen.getAllByRole('link')
    expect(links).toHaveLength(3)
  })

  it('renders buttons with correct labels', () => {
    render(<ButtonBar buttons={mockButtons} />)
    expect(screen.getByRole('link', { name: /blog/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /projects/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /about/i })).toBeInTheDocument()
  })

  it('renders buttons with correct hrefs', () => {
    render(<ButtonBar buttons={mockButtons} />)
    expect(screen.getByRole('link', { name: /blog/i })).toHaveAttribute(
      'href',
      '/blog'
    )
    expect(screen.getByRole('link', { name: /projects/i })).toHaveAttribute(
      'href',
      '/projects'
    )
    expect(screen.getByRole('link', { name: /about/i })).toHaveAttribute(
      'href',
      '/about'
    )
  })

  it('applies default styling', () => {
    render(<ButtonBar buttons={mockButtons} />)
    const container = screen.getByTestId('button-bar')
    expect(container).toHaveClass('flex')
    expect(container).toHaveClass('justify-center')
  })

  it('accepts custom className', () => {
    render(<ButtonBar buttons={mockButtons} className="custom-bar" />)
    const container = screen.getByTestId('button-bar')
    expect(container).toHaveClass('custom-bar')
  })

  it('accepts variant prop for different button styles', () => {
    render(<ButtonBar buttons={mockButtons} variant="boxed" />)
    const firstButton = screen.getByRole('link', { name: /blog/i })
    expect(firstButton).toHaveClass('bg-slate-800/70')
  })

  it('handles empty button array', () => {
    render(<ButtonBar buttons={[]} />)
    const container = screen.getByTestId('button-bar')
    expect(container).toBeInTheDocument()
    expect(screen.queryAllByRole('link')).toHaveLength(0)
  })
})
