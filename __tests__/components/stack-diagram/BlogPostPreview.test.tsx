import { render, screen } from '@testing-library/react'
import { BlogPostPreview } from '@/components/stack-diagram/BlogPostPreview'
import type { BlogPost } from '@/lib/types/blog'

const mockPost: BlogPost = {
  id: 'test-post',
  slug: 'test-post-slug',
  title: 'Test Blog Post Title',
  excerpt: 'This is a test excerpt for the blog post preview.',
  content: 'Full content here',
  date: '2024-01-15T00:00:00Z',
  author: 'Author',
  tags: ['Docker', 'DevOps', 'Kubernetes'],
  domain: 'DevOps',
  readTime: 5,
  featured: false,
}

const mockPostWithSummary: BlogPost = {
  ...mockPost,
  id: 'summary-post',
  summary: 'Short summary for hire page preview',
}

const mockPostWithRelatedUrl: BlogPost = {
  ...mockPost,
  id: 'related-post',
  relatedUrl: 'https://github.com/user/project',
}

describe('BlogPostPreview', () => {
  describe('when no post is selected', () => {
    it('renders without blog card link when no post', () => {
      render(<BlogPostPreview post={null} />)
      expect(screen.queryByRole('link')).not.toBeInTheDocument()
    })

    it('renders skill details independently of post selection', () => {
      render(
        <BlogPostPreview post={null} skillDetails={['Skill 1', 'Skill 2']} />
      )
      expect(screen.getByText('Skill 1')).toBeInTheDocument()
      expect(screen.getByText('Skill 2')).toBeInTheDocument()
    })
  })

  describe('when a post is selected', () => {
    it('displays post title', () => {
      render(<BlogPostPreview post={mockPost} />)
      expect(
        screen.getByRole('heading', { name: /test blog post title/i })
      ).toBeInTheDocument()
    })

    it('displays post excerpt', () => {
      render(<BlogPostPreview post={mockPost} />)
      expect(screen.getByText(/this is a test excerpt/i)).toBeInTheDocument()
    })

    it('displays read time and domain', () => {
      render(<BlogPostPreview post={mockPost} />)
      expect(screen.getByText('5m')).toBeInTheDocument()
      expect(screen.getByText('DevOps')).toBeInTheDocument()
    })

    it('makes entire preview card a clickable link to post', () => {
      render(<BlogPostPreview post={mockPost} />)
      const link = screen.getByRole('link', { name: /test blog post title/i })
      expect(link).toHaveAttribute('href', '/blog/test-post-slug')
    })
  })

  describe('skill details bullets', () => {
    it('displays skill details when provided', () => {
      render(
        <BlogPostPreview
          post={mockPost}
          skillDetails={['Detail 1', 'Detail 2']}
        />
      )
      expect(screen.getByText('Detail 1')).toBeInTheDocument()
      expect(screen.getByText('Detail 2')).toBeInTheDocument()
    })

    it('does not show skill section when no details provided', () => {
      render(<BlogPostPreview post={mockPost} skillDetails={[]} />)
      expect(screen.queryByText(/skill details/i)).not.toBeInTheDocument()
    })
  })

  describe('summary field', () => {
    it('displays summary when available instead of excerpt', () => {
      render(<BlogPostPreview post={mockPostWithSummary} />)
      expect(
        screen.getByText(/short summary for hire page/i)
      ).toBeInTheDocument()
      expect(
        screen.queryByText(/this is a test excerpt/i)
      ).not.toBeInTheDocument()
    })

    it('falls back to excerpt when no summary provided', () => {
      render(<BlogPostPreview post={mockPost} />)
      expect(screen.getByText(/this is a test excerpt/i)).toBeInTheDocument()
    })
  })

  describe('related URL', () => {
    it('displays related link when relatedUrl is provided', () => {
      render(<BlogPostPreview post={mockPostWithRelatedUrl} />)
      const link = screen.getByRole('link', { name: /view project/i })
      expect(link).toHaveAttribute('href', 'https://github.com/user/project')
    })

    it('does not display related link when no relatedUrl', () => {
      render(<BlogPostPreview post={mockPost} />)
      expect(
        screen.queryByRole('link', { name: /view project/i })
      ).not.toBeInTheDocument()
    })
  })
})
