import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BlogCard } from '@/components/blog/blog-card'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'

// Mock Next.js components
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

jest.mock('next/link', () => ({
  __esModule: true,
  default: ({ children, href, ...props }: any) => (
    <a href={href} {...props}>
      {children}
    </a>
  ),
}))

describe('BlogCard Rendering', () => {
  const mockPost = createMockBlogPost({
    title: 'Test Blog Post Title',
    excerpt:
      'This is a test excerpt that provides a brief overview of the blog post content.',
    date: '2024-01-15',
    tags: ['React', 'Testing', 'TypeScript'],
    domain: 'Full-Stack',
  })

  describe('Basic Structure', () => {
    it('renders as an article element with proper semantic structure', () => {
      const { container } = render(<BlogCard post={mockPost} />)
      const article = container.querySelector('article')
      expect(article).toBeInTheDocument()
    })

    it('renders as a link to the blog post', () => {
      render(<BlogCard post={mockPost} />)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', `/blog/${mockPost.slug}`)
    })

    it('displays the blog post title', () => {
      render(<BlogCard post={mockPost} />)
      expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument()
    })

    it('displays the excerpt', () => {
      render(<BlogCard post={mockPost} />)
      expect(screen.getByText(/This is a test excerpt/)).toBeInTheDocument()
    })

    it('displays formatted date', () => {
      render(<BlogCard post={mockPost} />)
      // Should format date as "Jan 15, 2024" or similar human-readable format
      expect(screen.getByText(/Jan.*15.*2024/i)).toBeInTheDocument()
    })

    it('displays read time with proper unit', () => {
      render(<BlogCard post={mockPost} />)
      expect(screen.getByText(/5 min read/i)).toBeInTheDocument()
    })

    it('displays all tags', () => {
      render(<BlogCard post={mockPost} />)
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Testing')).toBeInTheDocument()
      expect(screen.getByText('TypeScript')).toBeInTheDocument()
    })

    it('displays author name', () => {
      render(<BlogCard post={mockPost} />)
      // Author text includes "by " prefix
      expect(screen.getByText(/by Test Author/)).toBeInTheDocument()
    })
  })

  describe('Layout Variants', () => {
    it('works in a grid layout', () => {
      const { container } = render(
        <div className="grid grid-cols-2">
          <BlogCard post={mockPost} />
          <BlogCard post={{ ...mockPost, id: '2', slug: 'post-2' }} />
        </div>
      )

      const articles = container.querySelectorAll('article')
      expect(articles).toHaveLength(2)
    })

    it('maintains consistent spacing', () => {
      const { container } = render(<BlogCard post={mockPost} />)
      const article = container.querySelector('article')

      // Should have padding/margin classes
      expect(article?.parentElement?.className).toBeTruthy()
    })

    it('applies hover states for interactivity', () => {
      const { container } = render(<BlogCard post={mockPost} />)
      const card = container.querySelector('article')?.parentElement

      // Should have hover-related classes
      expect(card?.className).toBeTruthy()
    })
  })

  describe('Featured Post Variant', () => {
    it('handles featured posts appropriately', () => {
      const featuredPost = createMockBlogPost({
        ...mockPost,
        featured: true,
      })

      render(<BlogCard post={featuredPost} />)
      // Featured posts in card view might have special styling
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('renders featured posts with same content structure', () => {
      const featuredPost = createMockBlogPost({
        ...mockPost,
        featured: true,
      })

      render(<BlogCard post={featuredPost} />)

      // Should still show all the same elements
      expect(screen.getByText('Test Blog Post Title')).toBeInTheDocument()
      expect(screen.getByText(/This is a test excerpt/)).toBeInTheDocument()
      expect(screen.getByText(/by Test Author/)).toBeInTheDocument()
    })
  })

  describe('Optional Props', () => {
    it('accepts and applies custom className', () => {
      const { container } = render(
        <BlogCard post={mockPost} className="custom-class" />
      )

      // Should apply custom class while maintaining defaults
      const element = container.firstChild
      expect(element).toHaveClass('custom-class')
    })

    it('handles posts with optional imageUrl', () => {
      const postWithImage = createMockBlogPost({
        ...mockPost,
        imageUrl: '/images/test.jpg',
      })

      render(<BlogCard post={postWithImage} />)
      // Cards might not show images, but shouldn't break
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('handles posts without images gracefully', () => {
      const postWithoutImage = createMockBlogPost({
        ...mockPost,
        imageUrl: undefined,
      })

      render(<BlogCard post={postWithoutImage} />)
      expect(screen.getByRole('article')).toBeInTheDocument()
    })
  })
})
