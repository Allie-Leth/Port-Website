import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContentCard } from '@/components/content-card'

describe('ContentCard', () => {
  const defaultProps = {
    href: '/blog/test-post',
    label: 'latest.blog',
    title: 'Test Blog Post',
    description: '2024-01-15',
  }

  it('renders as an accessible link with all content', () => {
    render(<ContentCard {...defaultProps} />)

    // Verify it's a link
    const link = screen.getByRole('link', { name: /test blog post/i })
    expect(link).toBeInTheDocument()
    expect(link).toHaveAttribute('href', '/blog/test-post')

    // Verify all content is present
    expect(screen.getByText('latest.blog')).toBeInTheDocument()
    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    expect(screen.getByText('2024-01-15')).toBeInTheDocument()
  })

  it('uses semantic HTML structure', () => {
    const { container } = render(<ContentCard {...defaultProps} />)

    // Should use article element for content
    const article = container.querySelector('article')
    expect(article).toBeInTheDocument()
  })

  it('supports different content types', () => {
    const projectProps = {
      href: '/projects/k3s',
      label: 'featured.project',
      title: 'k3s Infrastructure',
      description: 'Production-ready Kubernetes cluster',
    }

    render(<ContentCard {...projectProps} />)

    const link = screen.getByRole('link', { name: /k3s infrastructure/i })
    expect(link).toHaveAttribute('href', '/projects/k3s')
    expect(screen.getByText('featured.project')).toBeInTheDocument()
    expect(
      screen.getByText('Production-ready Kubernetes cluster')
    ).toBeInTheDocument()
  })

  it('handles optional label color for different content types', () => {
    // For blog posts
    const { rerender } = render(
      <ContentCard {...defaultProps} labelColor="blue" />
    )
    expect(screen.getByText('latest.blog')).toBeInTheDocument()

    // For projects
    rerender(
      <ContentCard
        {...defaultProps}
        label="featured.project"
        labelColor="green"
      />
    )
    expect(screen.getByText('featured.project')).toBeInTheDocument()
  })

  it('accepts custom className for layout purposes', () => {
    const { container } = render(
      <ContentCard {...defaultProps} className="custom-layout" />
    )

    // Just verify the component renders - don't test CSS
    const article = container.querySelector('article')
    expect(article).toBeInTheDocument()
  })
})
