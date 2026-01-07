import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { ContentGrid } from '@/components/content-grid'

describe('ContentGrid', () => {
  const defaultItems = [
    {
      href: '/blog/test-post',
      label: 'latest.blog',
      title: 'Test Blog Post',
      description: 'A fascinating blog about testing',
      labelColor: 'blue' as const,
    },
    {
      href: '/projects/test-project',
      label: 'featured.project',
      title: 'Test Project',
      description: 'An innovative project showcase',
      labelColor: 'green' as const,
    },
  ]

  it('displays all content cards with their titles and descriptions', () => {
    render(<ContentGrid items={defaultItems} />)

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    expect(
      screen.getByText('A fascinating blog about testing')
    ).toBeInTheDocument()
    expect(screen.getByText('Test Project')).toBeInTheDocument()
    expect(
      screen.getByText('An innovative project showcase')
    ).toBeInTheDocument()
  })

  it('displays labels for each content card', () => {
    render(<ContentGrid items={defaultItems} />)

    expect(screen.getByText('latest.blog')).toBeInTheDocument()
    expect(screen.getByText('featured.project')).toBeInTheDocument()
  })

  it('creates clickable links to content pages', () => {
    render(<ContentGrid items={defaultItems} />)

    const blogLink = screen.getByRole('link', { name: /Test Blog Post/i })
    expect(blogLink).toHaveAttribute('href', '/blog/test-post')

    const projectLink = screen.getByRole('link', { name: /Test Project/i })
    expect(projectLink).toHaveAttribute('href', '/projects/test-project')
  })

  it('displays single item when only one provided', () => {
    const singleItem = [defaultItems[0]]
    render(<ContentGrid items={singleItem} />)

    expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    expect(screen.queryByText('Test Project')).not.toBeInTheDocument()
  })

  it('renders empty grid without crashing when no items provided', () => {
    const { container } = render(<ContentGrid items={[]} />)

    const grid = container.querySelector('div')
    expect(grid).toBeInTheDocument()
    expect(screen.queryByRole('link')).not.toBeInTheDocument()
  })
})
