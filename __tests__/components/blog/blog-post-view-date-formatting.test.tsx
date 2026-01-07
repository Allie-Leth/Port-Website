import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BlogPostView } from '@/components/blog/blog-post-view'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
  }),
}))

// Mock Next.js Image
jest.mock('next/image', () => ({
  __esModule: true,
  default: (props: any) => <img {...props} />,
}))

// Mock react-markdown (ESM-only module)
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({ children }: { children: string }) => <div>{children}</div>,
}))

jest.mock('remark-gfm', () => ({
  __esModule: true,
  default: () => {},
}))

// Mock SyntaxHighlighter
jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: string }) => <pre>{children}</pre>,
}))

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {},
}))

describe('BlogPostView Date Formatting', () => {
  describe('Valid Date Formats', () => {
    it('formats ISO date string correctly', () => {
      const post = createMockBlogPost({
        date: '2024-01-15',
      })

      render(<BlogPostView post={post} />)

      expect(screen.getByText('January 15, 2024')).toBeInTheDocument()
    })

    it('formats full ISO datetime string correctly', () => {
      const post = createMockBlogPost({
        date: '2024-06-20T14:30:00Z',
      })

      render(<BlogPostView post={post} />)

      expect(screen.getByText('June 20, 2024')).toBeInTheDocument()
    })

    it('formats date with timezone offset correctly', () => {
      const post = createMockBlogPost({
        date: '2024-12-25T00:00:00+05:00',
      })

      render(<BlogPostView post={post} />)

      // Using UTC ensures consistent formatting regardless of timezone
      expect(screen.getByText('December 24, 2024')).toBeInTheDocument()
    })

    it('handles dates at year boundaries', () => {
      const post = createMockBlogPost({
        date: '2024-12-31',
      })

      render(<BlogPostView post={post} />)

      expect(screen.getByText('December 31, 2024')).toBeInTheDocument()
    })

    it('handles leap year dates', () => {
      const post = createMockBlogPost({
        date: '2024-02-29',
      })

      render(<BlogPostView post={post} />)

      expect(screen.getByText('February 29, 2024')).toBeInTheDocument()
    })
  })

  describe('Date Element Attributes', () => {
    it('includes datetime attribute on time element', () => {
      const post = createMockBlogPost({
        date: '2024-01-15',
      })

      const { container } = render(<BlogPostView post={post} />)

      const timeElement = container.querySelector('time')
      expect(timeElement).toHaveAttribute('dateTime', '2024-01-15')
    })
  })

  describe('Edge Cases', () => {
    it('handles invalid date gracefully', () => {
      const post = createMockBlogPost({
        date: 'not-a-valid-date',
      })

      render(<BlogPostView post={post} />)

      // Should display "Invalid date" for malformed dates
      expect(screen.getByText('Invalid Date')).toBeInTheDocument()
    })

    it('handles empty date string', () => {
      const post = createMockBlogPost({
        date: '',
      })

      render(<BlogPostView post={post} />)

      // Empty date should result in Invalid Date
      expect(screen.getByText('Invalid Date')).toBeInTheDocument()
    })
  })

  describe('Timezone Consistency', () => {
    it('formats dates consistently regardless of local timezone', () => {
      // This test verifies that UTC is used for consistent SSR/CSR rendering
      const post = createMockBlogPost({
        date: '2024-01-15T23:59:59Z', // Late night UTC
      })

      render(<BlogPostView post={post} />)

      // Should always show January 15, not potentially January 16 in some timezones
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument()
    })

    it('handles midnight UTC correctly', () => {
      const post = createMockBlogPost({
        date: '2024-07-04T00:00:00Z',
      })

      render(<BlogPostView post={post} />)

      expect(screen.getByText('July 4, 2024')).toBeInTheDocument()
    })
  })

  describe('Different Year Formats', () => {
    it('formats dates from different decades', () => {
      const post = createMockBlogPost({
        date: '2020-03-15',
      })

      render(<BlogPostView post={post} />)

      expect(screen.getByText('March 15, 2020')).toBeInTheDocument()
    })

    it('formats future dates correctly', () => {
      const post = createMockBlogPost({
        date: '2030-11-11',
      })

      render(<BlogPostView post={post} />)

      expect(screen.getByText('November 11, 2030')).toBeInTheDocument()
    })
  })
})
