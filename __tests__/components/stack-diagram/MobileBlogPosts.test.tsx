import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { MobileBlogPosts } from '@/components/stack-diagram/MobileBlogPosts'
import type { BlogPost } from '@/lib/types/blog'

// Mock next/link
jest.mock('next/link', () => ({
  __esModule: true,
  default: ({
    children,
    href,
  }: {
    children: React.ReactNode
    href: string
  }) => <a href={href}>{children}</a>,
}))

const createMockPost = (overrides: Partial<BlogPost> = {}): BlogPost => ({
  id: 'test-post',
  title: 'Test Post',
  slug: 'test-post',
  date: '2024-01-15',
  excerpt: 'Test excerpt',
  content: 'Test content',
  tags: ['docker', 'kubernetes'],
  domain: 'DevOps',
  readTime: 5,
  author: 'Test Author',
  featured: false,
  ...overrides,
})

describe('MobileBlogPosts', () => {
  describe('rendering', () => {
    it('renders nothing when no tags provided', () => {
      const { container } = render(
        <MobileBlogPosts
          tags={[]}
          allPosts={[createMockPost()]}
          selectedLabel="Docker"
        />
      )
      expect(container.firstChild).toBeNull()
    })

    it('renders nothing when no matching posts', () => {
      const { container } = render(
        <MobileBlogPosts
          tags={['nonexistent']}
          allPosts={[createMockPost()]}
          selectedLabel="Test"
        />
      )
      expect(container.firstChild).toBeNull()
    })

    it('renders matching posts', () => {
      render(
        <MobileBlogPosts
          tags={['docker']}
          allPosts={[createMockPost({ title: 'Docker Guide' })]}
          selectedLabel="Docker"
        />
      )
      expect(screen.getByText('Docker Guide')).toBeInTheDocument()
    })

    it('displays selected label in header', () => {
      render(
        <MobileBlogPosts
          tags={['docker']}
          allPosts={[createMockPost()]}
          selectedLabel="Docker"
        />
      )
      expect(screen.getByText('Docker posts')).toBeInTheDocument()
    })

    it('displays fallback header when no label', () => {
      render(
        <MobileBlogPosts
          tags={['docker']}
          allPosts={[createMockPost()]}
          selectedLabel={null}
        />
      )
      expect(screen.getByText('Related posts')).toBeInTheDocument()
    })
  })

  describe('filtering', () => {
    it('filters posts by tags case-insensitively', () => {
      const posts = [
        createMockPost({ id: '1', title: 'Docker Post', tags: ['Docker'] }),
        createMockPost({ id: '2', title: 'Other Post', tags: ['python'] }),
      ]
      render(
        <MobileBlogPosts
          tags={['docker']}
          allPosts={posts}
          selectedLabel="Docker"
        />
      )
      expect(screen.getByText('Docker Post')).toBeInTheDocument()
      expect(screen.queryByText('Other Post')).not.toBeInTheDocument()
    })

    it('limits to 5 posts maximum', () => {
      const posts = Array.from({ length: 10 }, (_, i) =>
        createMockPost({
          id: `post-${i}`,
          title: `Post ${i}`,
          tags: ['docker'],
        })
      )
      render(
        <MobileBlogPosts
          tags={['docker']}
          allPosts={posts}
          selectedLabel="Docker"
        />
      )
      const links = screen.getAllByRole('link')
      expect(links.length).toBe(5)
    })
  })

  describe('links', () => {
    it('links to blog post', () => {
      render(
        <MobileBlogPosts
          tags={['docker']}
          allPosts={[createMockPost({ slug: 'my-post' })]}
          selectedLabel="Docker"
        />
      )
      expect(screen.getByRole('link')).toHaveAttribute('href', '/blog/my-post')
    })
  })

  describe('post card content', () => {
    it('displays read time and domain', () => {
      render(
        <MobileBlogPosts
          tags={['docker']}
          allPosts={[createMockPost({ readTime: 7, domain: 'DevOps' })]}
          selectedLabel="Docker"
        />
      )
      expect(screen.getByText('7 min')).toBeInTheDocument()
      expect(screen.getByText('DevOps')).toBeInTheDocument()
    })
  })
})
