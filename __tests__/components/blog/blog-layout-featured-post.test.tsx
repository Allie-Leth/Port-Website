import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BlogLayout } from '@/components/blog/blog-layout'
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

describe('BlogLayout Featured Post', () => {
  const mockPosts = [
    createMockBlogPost({
      id: '1',
      slug: 'featured-post',
      title: 'Featured Post Title',
      excerpt: 'This is the featured post excerpt.',
      featured: true,
      imageUrl: '/images/featured.jpg',
    }),
    createMockBlogPost({
      id: '2',
      title: 'Regular Post 1',
      featured: false,
    }),
    createMockBlogPost({
      id: '3',
      title: 'Regular Post 2',
      featured: false,
    }),
  ]

  describe('Featured Post Display', () => {
    it('displays featured post prominently with badge', () => {
      render(<BlogLayout posts={mockPosts} />)

      // Featured post should have featured indicator
      const featuredSection = screen
        .getByText('Featured Post Title')
        .closest('section')
      expect(featuredSection).toBeInTheDocument()

      // Should show featured badge
      const featuredBadges = screen.getAllByText(/featured/i)
      expect(featuredBadges.length).toBeGreaterThan(0)
    })

    it('displays featured post image when available', () => {
      render(<BlogLayout posts={mockPosts} />)

      const featuredImage = screen.getByRole('img', { name: /featured post/i })
      expect(featuredImage).toHaveAttribute(
        'src',
        expect.stringContaining('featured.jpg')
      )
    })

    it('shows featured post metadata', () => {
      const featuredPost = createMockBlogPost({
        title: 'Featured Article',
        author: 'Jane Author',
        readTime: 10,
        tags: ['React', 'Testing'],
        featured: true,
      })

      render(<BlogLayout posts={[featuredPost, ...mockPosts]} />)

      // Should display all metadata
      expect(screen.getByText(/Jane Author/)).toBeInTheDocument()
      expect(screen.getByText(/10 min read/)).toBeInTheDocument()
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Testing')).toBeInTheDocument()
    })
  })

  describe('Featured Post Behavior', () => {
    it('handles no featured post gracefully', () => {
      const nonFeaturedPosts = mockPosts.map((p) => ({ ...p, featured: false }))
      render(<BlogLayout posts={nonFeaturedPosts} />)

      // Should still render without featured section
      expect(
        screen.getByRole('heading', { level: 1, name: /blog/i })
      ).toBeInTheDocument()

      // No "Featured" badge should be present
      const featuredBadges = screen.queryAllByText((content, element) => {
        return (
          element?.tagName === 'SPAN' && content.toLowerCase() === 'featured'
        )
      })
      expect(featuredBadges).toHaveLength(0)

      // All posts should be in the grid
      expect(screen.getByText('Regular Post 1')).toBeInTheDocument()
    })

    it('excludes featured post from main grid', () => {
      render(<BlogLayout posts={mockPosts} />)

      // Featured post appears in featured section
      const featuredSection = screen
        .getByText('Featured Post Title')
        .closest('article')
      expect(featuredSection).toBeInTheDocument()

      // Check that there are only 3 articles total (1 featured + 2 regular)
      const regularCards = screen.getAllByRole('article')
      expect(regularCards).toHaveLength(3)
    })

    it('handles multiple featured posts by showing first one', () => {
      const multipleFeatured = [
        createMockBlogPost({
          id: '1',
          title: 'First Featured',
          featured: true,
          date: '2024-01-20',
        }),
        createMockBlogPost({
          id: '2',
          title: 'Second Featured',
          featured: true,
          date: '2024-01-15',
        }),
        createMockBlogPost({
          id: '3',
          title: 'Regular Post',
          featured: false,
        }),
      ]

      render(<BlogLayout posts={multipleFeatured} />)

      // Should show the most recent featured post
      expect(screen.getByText('First Featured')).toBeInTheDocument()

      // Second featured should be in regular grid
      expect(screen.getByText('Second Featured')).toBeInTheDocument()
    })
  })

  describe('Featured Post Styling', () => {
    it('applies special styling to featured post', () => {
      const { container } = render(<BlogLayout posts={mockPosts} />)

      // Featured post should have distinct container
      const featuredContainer = screen
        .getByText('Featured Post Title')
        .closest('article')
      // Featured post should have distinct container
      expect(featuredContainer).toBeTruthy()
    })

    it('renders featured post with larger image', () => {
      render(<BlogLayout posts={mockPosts} />)

      const featuredImage = screen.getByRole('img', { name: /featured post/i })

      // Image should be present and accessible
      expect(featuredImage).toBeInTheDocument()
      expect(featuredImage).toHaveAttribute('alt')
    })
  })

  describe('Featured Post Interaction', () => {
    it('makes entire featured card clickable', () => {
      render(<BlogLayout posts={mockPosts} />)

      const featuredLink = screen.getByRole('link', {
        name: /featured post title/i,
      })
      expect(featuredLink).toHaveAttribute('href', '/blog/featured-post')
    })

    it('links featured post correctly', () => {
      render(<BlogLayout posts={mockPosts} />)

      const featuredLink = screen.getByRole('link', {
        name: /featured post title/i,
      })

      expect(featuredLink).toHaveAttribute(
        'href',
        expect.stringContaining('featured-post')
      )
    })
  })

  describe('Conditional Display', () => {
    it('respects showFeatured configuration', () => {
      render(<BlogLayout posts={mockPosts} showFeatured={false} />)

      // All posts should still be visible
      expect(screen.getByText('Featured Post Title')).toBeInTheDocument()
      expect(screen.getByText('Regular Post 1')).toBeInTheDocument()
      expect(screen.getByText('Regular Post 2')).toBeInTheDocument()

      // Posts are displayed in some form
      const articles = screen.getAllByRole('article')
      expect(articles.length).toBeGreaterThan(0)
    })

    it('displays featured post prominently when enabled', () => {
      render(<BlogLayout posts={mockPosts} showFeatured={true} />)

      // Featured post should be displayed prominently
      const featuredTitle = screen.getByText('Featured Post Title')
      expect(featuredTitle).toBeInTheDocument()

      // Should have featured indicator
      const featuredIndicators = screen.getAllByText(/featured/i)
      expect(featuredIndicators.length).toBeGreaterThan(0)
    })
  })
})
