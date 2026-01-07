import { render, screen } from '@testing-library/react'
import ContactPage from '@/app/contact/page'

describe('ContactPage', () => {
  it('renders the page heading', () => {
    render(<ContactPage />)
    expect(
      screen.getByRole('heading', { name: /get in touch/i })
    ).toBeInTheDocument()
  })

  it('renders availability message', () => {
    render(<ContactPage />)
    expect(
      screen.getByText(/open to work and collaboration/i)
    ).toBeInTheDocument()
  })

  it('renders email contact link', () => {
    render(<ContactPage />)
    const emailLink = screen.getByRole('link', { name: /email/i })
    expect(emailLink).toBeInTheDocument()
    expect(emailLink).toHaveAttribute(
      'href',
      expect.stringContaining('mailto:')
    )
  })

  it('displays email address as copyable text', () => {
    render(<ContactPage />)
    expect(
      screen.getByText('allie.leth@scopecreep.productions')
    ).toBeInTheDocument()
  })

  it('renders GitHub contact link', () => {
    render(<ContactPage />)
    const githubLink = screen.getByRole('link', { name: /github/i })
    expect(githubLink).toBeInTheDocument()
    expect(githubLink).toHaveAttribute(
      'href',
      expect.stringContaining('github.com')
    )
  })

  it('displays GitHub URL as copyable text', () => {
    render(<ContactPage />)
    expect(screen.getByText('github.com/Allie-Leth')).toBeInTheDocument()
  })

  it('renders GitLab contact link', () => {
    render(<ContactPage />)
    const gitlabLink = screen.getByRole('link', { name: /gitlab/i })
    expect(gitlabLink).toBeInTheDocument()
    expect(gitlabLink).toHaveAttribute(
      'href',
      expect.stringContaining('gitlab')
    )
  })

  it('displays GitLab URL as copyable text', () => {
    render(<ContactPage />)
    expect(
      screen.getByText('gitlab.scopecreep.productions/leth')
    ).toBeInTheDocument()
  })

  it('opens external links in new tab', () => {
    render(<ContactPage />)
    const externalLinks = screen
      .getAllByRole('link')
      .filter((link) => !link.getAttribute('href')?.startsWith('mailto:'))

    externalLinks.forEach((link) => {
      expect(link).toHaveAttribute('target', '_blank')
      expect(link).toHaveAttribute('rel', expect.stringContaining('noopener'))
    })
  })
})
