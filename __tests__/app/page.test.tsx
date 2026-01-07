import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import Home from '@/app/page'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'

// Mock the blog-service module
jest.mock('@/lib/services/blog-service', () => ({
  getAllPosts: jest.fn(),
  getFeaturedPost: jest.fn(),
}))

import { getAllPosts, getFeaturedPost } from '@/lib/services/blog-service'

const mockGetAllPosts = getAllPosts as jest.MockedFunction<typeof getAllPosts>
const mockGetFeaturedPost = getFeaturedPost as jest.MockedFunction<
  typeof getFeaturedPost
>

describe('Home Page', () => {
  const mockPosts = [
    createMockBlogPost({
      id: '1',
      slug: 'latest-post',
      title: 'Latest Post',
      date: '2024-01-25T10:00:00Z',
      featured: false,
    }),
    createMockBlogPost({
      id: '2',
      slug: 'featured-post',
      title: 'Featured Post',
      date: '2024-01-20T10:00:00Z',
      featured: true,
      excerpt:
        'This is the featured post excerpt that should be truncated for display.',
    }),
  ]

  beforeEach(() => {
    jest.clearAllMocks()
    mockGetAllPosts.mockResolvedValue(mockPosts)
    mockGetFeaturedPost.mockResolvedValue(mockPosts[1])
  })

  it('renders the main heading structure', async () => {
    render(await Home())
    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toBeInTheDocument()
  })

  it('renders navigation and featured content links', async () => {
    render(await Home())
    const links = screen.getAllByRole('link')
    expect(links.length).toBeGreaterThanOrEqual(4) // 2 featured + 2 nav links
  })

  it('renders the taglines component', async () => {
    render(await Home())
    const taglinesContainer = screen.getByTestId('taglines-container')
    expect(taglinesContainer).toBeInTheDocument()
  })

  it('applies proper styling classes to taglines', async () => {
    render(await Home())
    const taglinesContainer = screen.getByTestId('taglines-container')
    expect(taglinesContainer).toHaveClass('transition-opacity')
    expect(taglinesContainer).toHaveClass('duration-300')
  })
})
