import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Box } from '@/components/box'

describe('Box', () => {
  it('provides a container for content', () => {
    render(<Box>Test Content</Box>)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('supports polymorphic rendering with semantic HTML', () => {
    render(<Box as="section">Section Content</Box>)

    // Renders as semantic section element
    const section = screen.getByText('Section Content')
    expect(section.tagName).toBe('SECTION')
  })

  it('can be used as a navigation container', () => {
    render(
      <Box as="nav" aria-label="Main navigation">
        <a href="/home">Home</a>
        <a href="/about">About</a>
      </Box>
    )

    // Functions as navigation landmark
    const nav = screen.getByRole('navigation', { name: 'Main navigation' })
    expect(nav).toBeInTheDocument()

    // Contains navigation links
    expect(screen.getByRole('link', { name: 'Home' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: 'About' })).toBeInTheDocument()
  })

  it('can serve as an article container', () => {
    render(
      <Box as="article">
        <h2>Article Title</h2>
        <p>Article content goes here</p>
      </Box>
    )

    // Provides article semantic structure
    const article = screen.getByRole('article')
    expect(article).toBeInTheDocument()

    // Contains article content
    expect(
      screen.getByRole('heading', { name: 'Article Title' })
    ).toBeInTheDocument()
    expect(screen.getByText('Article content goes here')).toBeInTheDocument()
  })

  it('supports different visual variants without affecting semantics', () => {
    const { rerender } = render(<Box variant="default">Default Content</Box>)
    expect(screen.getByText('Default Content')).toBeInTheDocument()

    rerender(<Box variant="primary">Primary Content</Box>)
    expect(screen.getByText('Primary Content')).toBeInTheDocument()

    rerender(<Box variant="secondary">Secondary Content</Box>)
    expect(screen.getByText('Secondary Content')).toBeInTheDocument()
  })

  it('accepts additional HTML attributes for accessibility', () => {
    render(
      <Box
        role="region"
        aria-label="Important information"
        aria-describedby="description"
      >
        <span id="description">This box contains important details</span>
      </Box>
    )

    // Box can be enhanced with ARIA attributes
    const region = screen.getByRole('region', { name: 'Important information' })
    expect(region).toBeInTheDocument()
    expect(region).toHaveAttribute('aria-describedby', 'description')
  })

  it('can be extended with custom properties', () => {
    const handleClick = jest.fn()

    render(
      <Box as="button" onClick={handleClick} type="button">
        Click me
      </Box>
    )

    // Works as interactive element when needed
    const button = screen.getByRole('button', { name: 'Click me' })
    expect(button).toBeInTheDocument()
    expect(button).toHaveAttribute('type', 'button')
  })

  it('composes with other components', () => {
    render(
      <Box as="aside">
        <Box as="header">
          <h3>Sidebar Title</h3>
        </Box>
        <Box as="nav">
          <ul>
            <li>Item 1</li>
            <li>Item 2</li>
          </ul>
        </Box>
      </Box>
    )

    // Can be composed to create complex layouts
    const aside = screen.getByRole('complementary')
    expect(aside).toBeInTheDocument()

    // Nested boxes maintain semantic structure
    expect(
      screen.getByRole('heading', { name: 'Sidebar Title' })
    ).toBeInTheDocument()
    expect(screen.getByText('Item 1')).toBeInTheDocument()
  })
})
