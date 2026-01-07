import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { FeaturedBlogCard } from '@/components/blog/featured-blog-card'
import { BlogPost } from '@/lib/types/blog'

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => {
    // eslint-disable-next-line jsx-a11y/alt-text
    return <img {...props} />
  },
}))

describe('FeaturedBlogCard', () => {
  const mockFeaturedPost: BlogPost = {
    id: 'featured-1',
    slug: 'featured-post',
    title: 'Featured Blog Post: Implementing GitOps with ArgoCD',
    excerpt:
      'Learn how to set up a production-ready GitOps workflow using ArgoCD in a lightweight k3s cluster. This comprehensive guide covers installation, configuration, and best practices.',
    content: 'Full featured content here...',
    date: '2024-01-20T14:30:00Z',
    author: 'Alison Alva',
    tags: ['GitOps', 'Kubernetes', 'DevOps', 'ArgoCD'],
    domain: 'DevOps',
    readTime: 12,
    featured: true,
    imageUrl: '/images/blog/gitops-hero.jpg',
  }

  const mockPostWithoutImage: BlogPost = {
    ...mockFeaturedPost,
    imageUrl: undefined,
  }

  describe('Rendering', () => {
    it('renders as an article element with semantic structure', () => {
      const { container } = render(<FeaturedBlogCard post={mockFeaturedPost} />)
      const article = container.querySelector('article')
      expect(article).toBeInTheDocument()
    })

    it('renders as a link to the blog post', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', `/blog/${mockFeaturedPost.slug}`)
    })

    it('displays the title prominently', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)
      const title = screen.getByText(mockFeaturedPost.title)
      expect(title).toBeInTheDocument()
      // Should be a larger heading than regular cards
      expect(title.tagName).toMatch(/H[23]/)
    })

    it('displays the full excerpt without truncation', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)
      // Full excerpt should be visible
      expect(screen.getByText(mockFeaturedPost.excerpt)).toBeInTheDocument()
    })

    it('displays formatted date', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)
      expect(screen.getByText(/Jan.*20.*2024/i)).toBeInTheDocument()
    })

    it('displays author name', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)
      expect(screen.getByText(/Alison Alva/)).toBeInTheDocument()
    })

    it('displays read time', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)
      expect(screen.getByText(/12 min read/i)).toBeInTheDocument()
    })

    it('displays all tags', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)
      expect(screen.getByText('GitOps')).toBeInTheDocument()
      expect(screen.getByText('Kubernetes')).toBeInTheDocument()
      expect(screen.getByText('DevOps')).toBeInTheDocument()
      expect(screen.getByText('ArgoCD')).toBeInTheDocument()
    })

    it('displays a featured badge or indicator', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)
      // Should have some indication this is featured (multiple elements)
      const featuredElements = screen.getAllByText(/featured/i)
      expect(featuredElements.length).toBeGreaterThan(0)
    })
  })

  describe('Image Handling', () => {
    it('displays hero image when imageUrl is provided', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute(
        'src',
        expect.stringContaining('gitops-hero.jpg')
      )
      expect(image).toHaveAttribute(
        'alt',
        expect.stringContaining(mockFeaturedPost.title)
      )
    })

    it('handles missing image gracefully', () => {
      render(<FeaturedBlogCard post={mockPostWithoutImage} />)
      // Should render without image but not break
      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.queryByRole('img')).not.toBeInTheDocument()
    })

    it('provides appropriate alt text for accessibility', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)
      const image = screen.getByRole('img')
      expect(image).toHaveAttribute('alt')
      expect(image.getAttribute('alt')).not.toBe('')
    })
  })

  describe('Visual Prominence', () => {
    it('emphasizes featured content through semantic HTML', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)

      // Featured post uses prominent heading level
      const heading = screen.getByRole('heading')
      expect(heading).toBeInTheDocument()
      expect(heading.tagName).toMatch(/H[23]/)

      // Full excerpt is displayed for featured posts
      expect(screen.getByText(mockFeaturedPost.excerpt)).toBeInTheDocument()
    })

    it('provides complete content preview', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)

      // All metadata is visible
      expect(screen.getByText(/12 min read/i)).toBeInTheDocument()
      expect(screen.getByText(/Alison Alva/)).toBeInTheDocument()
      expect(screen.getByText(/Jan.*20.*2024/i)).toBeInTheDocument()

      // All tags are displayed
      mockFeaturedPost.tags.forEach((tag) => {
        expect(screen.getByText(tag)).toBeInTheDocument()
      })
    })

    it('maintains interactive elements for user engagement', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)

      // Card is fully clickable
      const link = screen.getByRole('link')
      expect(link).toHaveAttribute('href', `/blog/${mockFeaturedPost.slug}`)

      // Has accessible name for screen readers
      expect(link).toHaveAccessibleName()
    })

    it('displays hero image prominently when available', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)

      const image = screen.getByRole('img')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute(
        'alt',
        expect.stringContaining(mockFeaturedPost.title)
      )

      // Image loads with appropriate source
      expect(image).toHaveAttribute(
        'src',
        expect.stringContaining('gitops-hero.jpg')
      )
    })
  })

  describe('Content Organization', () => {
    it('adapts content presentation based on layout prop', () => {
      const { rerender } = render(
        <FeaturedBlogCard post={mockFeaturedPost} layout="horizontal" />
      )

      // Content remains accessible in horizontal layout
      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.getByRole('heading')).toBeInTheDocument()
      expect(screen.getByText(mockFeaturedPost.excerpt)).toBeInTheDocument()

      // Content remains accessible in vertical layout
      rerender(<FeaturedBlogCard post={mockFeaturedPost} layout="vertical" />)
      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.getByRole('heading')).toBeInTheDocument()
      expect(screen.getByText(mockFeaturedPost.excerpt)).toBeInTheDocument()
    })

    it('maintains content hierarchy regardless of layout', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} layout="horizontal" />)

      // Title remains the primary focus
      const heading = screen.getByRole('heading')
      expect(heading).toHaveTextContent(mockFeaturedPost.title)

      // Metadata remains accessible
      expect(screen.getByText(/12 min read/i)).toBeInTheDocument()

      // Image maintains proper alt text
      if (mockFeaturedPost.imageUrl) {
        const image = screen.getByRole('img')
        expect(image).toHaveAttribute('alt')
      }
    })
  })

  describe('Accessibility', () => {
    it('uses semantic HTML elements', () => {
      const { container } = render(<FeaturedBlogCard post={mockFeaturedPost} />)
      expect(container.querySelector('article')).toBeInTheDocument()
      expect(container.querySelector('time')).toBeInTheDocument()
    })

    it('has proper heading hierarchy', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)
      const heading = screen.getByRole('heading')
      // Featured card should use h2 (assuming h1 is page title)
      expect(heading.tagName).toBe('H2')
    })

    it('provides accessible link text', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)
      const link = screen.getByRole('link')
      expect(link).toHaveAccessibleName()
    })

    it('marks decorative elements appropriately', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} />)
      // Featured badge should be decorative or have proper ARIA
      const featuredBadges = screen.getAllByText(/featured/i)
      expect(featuredBadges[0]).toBeInTheDocument()
    })
  })

  describe('Long Content Handling', () => {
    it('handles very long titles gracefully', () => {
      const longTitlePost: BlogPost = {
        ...mockFeaturedPost,
        title: 'A'.repeat(150),
      }

      render(<FeaturedBlogCard post={longTitlePost} />)
      const title = screen.getByRole('heading')
      // Should wrap or truncate appropriately
      expect(title).toBeInTheDocument()
    })

    it('handles very long excerpts', () => {
      const longExcerptPost: BlogPost = {
        ...mockFeaturedPost,
        excerpt: 'B'.repeat(500),
      }

      render(<FeaturedBlogCard post={longExcerptPost} />)
      // Featured cards might show more excerpt than regular cards
      expect(screen.getByText(/B{10,}/)).toBeInTheDocument()
    })

    it('handles many tags', () => {
      const manyTagsPost: BlogPost = {
        ...mockFeaturedPost,
        tags: Array.from({ length: 15 }, (_, i) => `Tag${i}`),
      }

      render(<FeaturedBlogCard post={manyTagsPost} />)
      // Should handle overflow gracefully
      const tags = screen.getAllByText(/Tag\d+/)
      expect(tags.length).toBeGreaterThan(0)
    })
  })

  describe('Configuration Options', () => {
    it('accepts additional properties for customization', () => {
      render(
        <FeaturedBlogCard
          post={mockFeaturedPost}
          className="custom-featured"
          data-testid="featured-card"
        />
      )

      // Component accepts custom props without breaking
      expect(screen.getByRole('article')).toBeInTheDocument()
      expect(screen.getByRole('heading')).toHaveTextContent(
        mockFeaturedPost.title
      )
    })

    it('supports image loading optimization', () => {
      render(<FeaturedBlogCard post={mockFeaturedPost} priority />)

      // Image is rendered and accessible
      const image = screen.getByRole('img')
      expect(image).toBeInTheDocument()
      expect(image).toHaveAttribute('alt')

      // Image source is correctly set
      expect(image).toHaveAttribute(
        'src',
        expect.stringContaining('gitops-hero.jpg')
      )
    })
  })

  describe('Read Time Formatting', () => {
    it('formats single minute correctly', () => {
      const oneMinPost: BlogPost = {
        ...mockFeaturedPost,
        readTime: 1,
      }

      render(<FeaturedBlogCard post={oneMinPost} />)
      expect(screen.getByText(/1 min read/i)).toBeInTheDocument()
    })

    it('formats hour+ read times', () => {
      const longReadPost: BlogPost = {
        ...mockFeaturedPost,
        readTime: 75,
      }

      render(<FeaturedBlogCard post={longReadPost} />)
      // Could show as "75 min" or "1h 15min"
      expect(screen.getByText(/75 min|1h/i)).toBeInTheDocument()
    })
  })
})
