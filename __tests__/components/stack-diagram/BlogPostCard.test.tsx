import { render, screen } from '@testing-library/react'
import { BlogPostCard } from '@/components/stack-diagram/BlogPostCard'
import type { BlogPost } from '@/lib/types/blog'

const mockPost: BlogPost = {
  id: 'test-post',
  slug: 'test-post-slug',
  title: 'Test Blog Post Title',
  excerpt: 'This is a test excerpt for the blog post card.',
  content: 'Full content here',
  date: '2024-01-15T00:00:00Z',
  author: 'Test Author',
  tags: ['Docker', 'DevOps', 'Testing'],
  domain: 'DevOps',
  readTime: 5,
  featured: false,
}

describe('BlogPostCard', () => {
  describe('rendering', () => {
    it('renders the post title', () => {
      render(<BlogPostCard post={mockPost} />)
      expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument()
    })

    it('renders the post excerpt', () => {
      render(<BlogPostCard post={mockPost} />)
      expect(
        screen.getByText('This is a test excerpt for the blog post card.')
      ).toBeInTheDocument()
    })

    it('renders the read time', () => {
      render(<BlogPostCard post={mockPost} />)
      expect(screen.getByText(/5 min/i)).toBeInTheDocument()
    })

    it('renders post tags', () => {
      render(<BlogPostCard post={mockPost} />)
      expect(screen.getByText('Docker')).toBeInTheDocument()
      expect(screen.getByText('DevOps')).toBeInTheDocument()
      expect(screen.getByText('Testing')).toBeInTheDocument()
    })
  })

  describe('link behavior', () => {
    it('links to the blog post page', () => {
      render(<BlogPostCard post={mockPost} />)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', '/blog/test-post-slug')
    })
  })

  describe('accessibility', () => {
    it('has accessible link with post title', () => {
      render(<BlogPostCard post={mockPost} />)
      const link = screen.getByRole('link', { name: /test blog post title/i })
      expect(link).toBeInTheDocument()
    })
  })

  describe('edge cases', () => {
    it('handles post with empty tags array', () => {
      const postWithNoTags = { ...mockPost, tags: [] }
      render(<BlogPostCard post={postWithNoTags} />)
      expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument()
    })

    it('handles long excerpt by displaying it', () => {
      const longExcerpt =
        'This is a very long excerpt that contains many words and should still be displayed properly in the card component without breaking the layout.'
      const postWithLongExcerpt = { ...mockPost, excerpt: longExcerpt }
      render(<BlogPostCard post={postWithLongExcerpt} />)
      expect(screen.getByText(longExcerpt)).toBeInTheDocument()
    })

    it('handles single minute read time', () => {
      const postWithOneMin = { ...mockPost, readTime: 1 }
      render(<BlogPostCard post={postWithOneMin} />)
      expect(screen.getByText(/1 min/i)).toBeInTheDocument()
    })
  })
})
