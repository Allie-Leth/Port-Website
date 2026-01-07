import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BlogCard } from '@/components/blog/blog-card'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'
import type { BlogPost } from '@/lib/types/blog'

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

describe('BlogCard Date and Time Handling', () => {
  const basePost = createMockBlogPost({
    title: 'Test Post',
    date: '2024-01-15',
    readTime: 5,
  })

  describe('Date Formatting', () => {
    it('formats dates correctly for different months', () => {
      const decemberPost: BlogPost = {
        ...basePost,
        date: '2023-12-25',
      }

      render(<BlogCard post={decemberPost} />)
      expect(screen.getByText(/Dec.*25.*2023/i)).toBeInTheDocument()
    })

    it('formats January dates correctly', () => {
      const januaryPost: BlogPost = {
        ...basePost,
        date: '2024-01-01',
      }

      render(<BlogCard post={januaryPost} />)
      expect(screen.getByText(/Jan.*1.*2024/i)).toBeInTheDocument()
    })

    it('formats February dates correctly', () => {
      const februaryPost: BlogPost = {
        ...basePost,
        date: '2024-02-29', // Leap year
      }

      render(<BlogCard post={februaryPost} />)
      expect(screen.getByText(/Feb.*29.*2024/i)).toBeInTheDocument()
    })

    it('formats summer months correctly', () => {
      const julyPost: BlogPost = {
        ...basePost,
        date: '2024-07-04',
      }

      render(<BlogCard post={julyPost} />)
      expect(screen.getByText(/Jul.*4.*2024/i)).toBeInTheDocument()
    })

    it('handles different date formats consistently', () => {
      const isoPost: BlogPost = {
        ...basePost,
        date: '2024-03-15T14:30:00Z',
      }

      render(<BlogCard post={isoPost} />)
      expect(screen.getByText(/Mar.*15.*2024/i)).toBeInTheDocument()
    })

    it('handles dates without time component', () => {
      const dateOnlyPost: BlogPost = {
        ...basePost,
        date: '2024-06-20',
      }

      render(<BlogCard post={dateOnlyPost} />)
      expect(screen.getByText(/Jun.*20.*2024/i)).toBeInTheDocument()
    })

    it('uses semantic time element for dates', () => {
      render(<BlogCard post={basePost} />)
      const timeElement = screen.getByText(/Jan.*15.*2024/i)

      // Should be wrapped in a time element or have datetime attribute
      expect(timeElement.closest('time')).toBeInTheDocument()
    })

    it('provides machine-readable datetime attribute', () => {
      render(<BlogCard post={basePost} />)
      const timeElement = document.querySelector('time')

      expect(timeElement).toHaveAttribute('dateTime')
      expect(timeElement?.getAttribute('dateTime')).toMatch(/2024-01-15/)
    })
  })

  describe('Invalid Date Handling', () => {
    it('handles invalid dates gracefully', () => {
      const invalidDatePost: BlogPost = {
        ...basePost,
        date: 'invalid-date',
      }

      render(<BlogCard post={invalidDatePost} />)
      // Should either show fallback or not crash
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('handles malformed ISO dates', () => {
      const malformedPost: BlogPost = {
        ...basePost,
        date: '2024-13-35T25:70:80Z', // Invalid month, day, hour, minute, second
      }

      render(<BlogCard post={malformedPost} />)
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('handles empty date string', () => {
      const emptyDatePost: BlogPost = {
        ...basePost,
        date: '',
      }

      render(<BlogCard post={emptyDatePost} />)
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('handles null-like date values', () => {
      const nullDatePost: BlogPost = {
        ...basePost,
        date: 'null',
      }

      render(<BlogCard post={nullDatePost} />)
      expect(screen.getByRole('article')).toBeInTheDocument()
    })
  })

  describe('Read Time Display', () => {
    it('displays singular minute correctly', () => {
      const oneMinutePost: BlogPost = {
        ...basePost,
        readTime: 1,
      }

      render(<BlogCard post={oneMinutePost} />)
      expect(screen.getByText(/1 min read/i)).toBeInTheDocument()
    })

    it('displays plural minutes correctly', () => {
      const multiMinutePost: BlogPost = {
        ...basePost,
        readTime: 5,
      }

      render(<BlogCard post={multiMinutePost} />)
      expect(screen.getByText(/5 min read/i)).toBeInTheDocument()
    })

    it('handles zero read time', () => {
      const zeroTimePost: BlogPost = {
        ...basePost,
        readTime: 0,
      }

      render(<BlogCard post={zeroTimePost} />)
      // Should either not show or show "< 1 min"
      const article = screen.getByRole('article')
      expect(article).toBeInTheDocument()

      // Might show "< 1 min" or hide the read time entirely
      const readTimeText = screen.queryByText(/min read/i)
      if (readTimeText) {
        expect(readTimeText.textContent).toMatch(/(< 1|0) min/)
      }
    })

    it('handles very long read times', () => {
      const longReadPost: BlogPost = {
        ...basePost,
        readTime: 60,
      }

      render(<BlogCard post={longReadPost} />)
      expect(screen.getByText(/60 min read/i)).toBeInTheDocument()
    })

    it('handles fractional read times', () => {
      const fractionalPost: BlogPost = {
        ...basePost,
        readTime: 2.5,
      }

      render(<BlogCard post={fractionalPost} />)
      // Should display some form of read time
      expect(screen.getByText(/min read/i)).toBeInTheDocument()
    })

    it('handles negative read times gracefully', () => {
      const negativeTimePost: BlogPost = {
        ...basePost,
        readTime: -5,
      }

      render(<BlogCard post={negativeTimePost} />)
      // Should handle gracefully (might show 0 or hide)
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('handles extremely large read times', () => {
      const extremeReadPost: BlogPost = {
        ...basePost,
        readTime: 999,
      }

      render(<BlogCard post={extremeReadPost} />)
      expect(screen.getByText(/999 min read/i)).toBeInTheDocument()
    })
  })

  describe('Date and Time Layout', () => {
    it('displays date and read time in proper order', () => {
      render(<BlogCard post={basePost} />)

      // Both elements should be present and in logical order
      const dateElement = screen.getByText(/Jan.*15.*2024/i)
      const readTimeElement = screen.getByText(/5 min read/i)

      expect(dateElement).toBeInTheDocument()
      expect(readTimeElement).toBeInTheDocument()

      // They should be in the same parent container
      const dateContainer = dateElement.closest('div')
      const readTimeContainer = readTimeElement.closest('div')

      // Should be in same metadata container
      expect(dateContainer).toBe(readTimeContainer)
    })

    it('displays both date and read time information', () => {
      render(<BlogCard post={basePost} />)

      // Both date and read time should be visible to users
      const dateElement = screen.getByText(/Jan/i)
      const readTimeElement = screen.getByText(/min read/i)

      expect(dateElement).toBeInTheDocument()
      expect(readTimeElement).toBeInTheDocument()
    })
  })

  describe('Timezone Handling', () => {
    it('handles different timezone formats consistently', () => {
      const utcPost: BlogPost = {
        ...basePost,
        date: '2024-01-15T10:00:00Z',
      }

      render(<BlogCard post={utcPost} />)
      expect(screen.getByText(/Jan.*15.*2024/i)).toBeInTheDocument()
    })

    it('handles timezone offset formats', () => {
      const offsetPost: BlogPost = {
        ...basePost,
        date: '2024-01-15T10:00:00-05:00',
      }

      render(<BlogCard post={offsetPost} />)
      expect(screen.getByText(/Jan.*15.*2024/i)).toBeInTheDocument()
    })

    it('displays dates consistently regardless of user timezone', () => {
      // Mock different timezone
      const originalTZ = process.env.TZ
      process.env.TZ = 'Pacific/Auckland'

      render(<BlogCard post={basePost} />)
      expect(screen.getByText(/Jan.*15.*2024/i)).toBeInTheDocument()

      // Restore timezone
      process.env.TZ = originalTZ
    })
  })
})
