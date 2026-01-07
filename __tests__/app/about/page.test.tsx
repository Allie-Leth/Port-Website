import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import AboutPage from '@/app/about/page'

describe('About Page', () => {
  it('renders without crashing', () => {
    render(<AboutPage />)
  })

  it('renders the page heading', () => {
    render(<AboutPage />)
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
    expect(heading).toHaveTextContent('About')
  })

  it('has proper responsive padding for fixed header', () => {
    const { container } = render(<AboutPage />)
    // Mobile: pt-16, Desktop: md:pt-32
    const contentContainer = container.querySelector('.pt-16')
    expect(contentContainer).toBeInTheDocument()
    expect(contentContainer).toHaveClass('md:pt-32')
  })

  it('renders professional bio content', () => {
    render(<AboutPage />)
    expect(
      screen.getByText(
        /I'm Alison, an engineer focused on networked embedded systems/i
      )
    ).toBeInTheDocument()
    expect(screen.getByText(/How I work/i)).toBeInTheDocument()
    expect(screen.getByText(/Outside of engineering/i)).toBeInTheDocument()
  })
})
