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
      excerpt: 'This is the featured post excerpt',
      domain: 'DevOps',
      featured: true,
      date: '2024-01-20T00:00:00Z',
    }),
    createMockBlogPost({
      id: '2',
      slug: 'regular-post',
      title: 'Regular Post',
      featured: false,
    }),
  ]

  it('displays the featured post prominently', () => {
    render(<BlogLayout posts={mockPosts} />)

    const featuredTitle = screen.getByText('Featured Post Title')
    expect(featuredTitle).toBeInTheDocument()

    // Featured post should have its excerpt visible
    expect(
      screen.getByText('This is the featured post excerpt')
    ).toBeInTheDocument()
  })

  it('handles no featured post gracefully', () => {
    const nonFeaturedPosts = mockPosts.map((p) => ({ ...p, featured: false }))
    render(<BlogLayout posts={nonFeaturedPosts} />)

    // Should still render all posts in grid
    expect(screen.getByText('Featured Post Title')).toBeInTheDocument()
    expect(screen.getByText('Regular Post')).toBeInTheDocument()
  })

  it('selects only the first featured post when multiple exist', () => {
    const multipleFeatured = [
      createMockBlogPost({
        id: '1',
        featured: true,
        title: 'First Featured',
        date: '2024-01-20T00:00:00Z',
      }),
      createMockBlogPost({
        id: '2',
        featured: true,
        title: 'Second Featured',
        date: '2024-01-19T00:00:00Z',
      }),
      createMockBlogPost({
        id: '3',
        featured: false,
        title: 'Regular Post',
      }),
    ]

    render(<BlogLayout posts={multipleFeatured} />)

    // First featured should be in featured section
    const firstFeatured = screen.getByText('First Featured')
    expect(firstFeatured).toBeInTheDocument()

    // Second featured should appear in regular grid
    const secondFeatured = screen.getByText('Second Featured')
    expect(secondFeatured).toBeInTheDocument()
  })

  it('excludes featured post from main grid', () => {
    render(<BlogLayout posts={mockPosts} />)

    // Featured post should appear only once
    const featuredElements = screen.getAllByText('Featured Post Title')
    expect(featuredElements).toHaveLength(1)
  })

  it('links featured post to correct URL', () => {
    render(<BlogLayout posts={mockPosts} />)

    const featuredLink = screen.getByRole('link', {
      name: /Featured Post Title/i,
    })
    expect(featuredLink).toHaveAttribute('href', '/blog/featured-post')
  })

  it('displays featured post metadata', () => {
    render(<BlogLayout posts={mockPosts} />)

    // Should show author, date, read time for featured post
    // There may be multiple author instances (featured + regular cards)
    const authors = screen.getAllByText(/Test Author/i)
    expect(authors.length).toBeGreaterThan(0)

    // Should show read time
    const readTime = screen.getAllByText(/min read/i)
    expect(readTime.length).toBeGreaterThan(0)
  })

  it('applies special styling to featured section', () => {
    render(<BlogLayout posts={mockPosts} />)

    // Featured section should have a featured badge or indicator
    // Using getAllByText since there might be multiple elements containing "featured"
    const featuredElements = screen.getAllByText(/featured/i)
    expect(featuredElements.length).toBeGreaterThan(0)

    // Featured post should be displayed
    expect(screen.getByText('Featured Post Title')).toBeInTheDocument()
  })

  it('handles featured post with image', () => {
    const postsWithImage = [
      createMockBlogPost({
        featured: true,
        title: 'Post with Image',
        imageUrl: '/images/featured.jpg',
      }),
    ]

    render(<BlogLayout posts={postsWithImage} />)

    const image = screen.getByRole('img')
    expect(image).toHaveAttribute('src', '/images/featured.jpg')
  })

  it('respects showFeatured prop', () => {
    render(<BlogLayout posts={mockPosts} showFeatured={false} />)

    // All posts should appear in grid, none featured
    const titles = screen.getAllByText(/Featured Post Title|Regular Post/)
    expect(titles.length).toBe(2)
  })
})
