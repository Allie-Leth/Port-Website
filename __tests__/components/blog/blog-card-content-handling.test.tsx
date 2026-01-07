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

describe('BlogCard Content Handling', () => {
  const basePost = createMockBlogPost({
    title: 'Base Post',
    excerpt: 'Base excerpt',
    tags: ['React'],
  })

  describe('Excerpt Handling', () => {
    it('truncates very long excerpts', () => {
      const longExcerpt = 'A'.repeat(200)
      const postWithLongExcerpt: BlogPost = {
        ...basePost,
        excerpt: longExcerpt,
      }

      render(<BlogCard post={postWithLongExcerpt} />)
      // Find the excerpt paragraph specifically
      const excerptElement = screen.getByText((content, element) => {
        return (
          (element?.className?.includes('line-clamp') &&
            content.includes('AAA')) ||
          false
        )
      })

      // Should be truncated to around 150 characters with ellipsis
      expect(excerptElement.textContent?.length).toBeLessThan(160)
      expect(excerptElement.textContent).toContain('...')
    })

    it('does not truncate short excerpts', () => {
      const shortExcerpt = 'Short excerpt'
      const postWithShortExcerpt: BlogPost = {
        ...basePost,
        excerpt: shortExcerpt,
      }

      render(<BlogCard post={postWithShortExcerpt} />)
      expect(screen.getByText(shortExcerpt)).toBeInTheDocument()
    })

    it('handles empty excerpt gracefully', () => {
      const postWithEmptyExcerpt: BlogPost = {
        ...basePost,
        excerpt: '',
      }

      render(<BlogCard post={postWithEmptyExcerpt} />)
      // Should still render the card
      expect(screen.getByRole('article')).toBeInTheDocument()
    })

    it('handles excerpts with special characters', () => {
      const specialExcerpt = 'Excerpt with "quotes" & symbols <>'
      const postWithSpecialExcerpt: BlogPost = {
        ...basePost,
        excerpt: specialExcerpt,
      }

      render(<BlogCard post={postWithSpecialExcerpt} />)
      expect(screen.getByText(/quotes.*symbols/)).toBeInTheDocument()
    })
  })

  describe('Tag Handling', () => {
    it('handles empty tags array', () => {
      const postWithoutTags: BlogPost = {
        ...basePost,
        tags: [],
      }

      const { container } = render(<BlogCard post={postWithoutTags} />)
      // Should still render without errors
      expect(container.querySelector('article')).toBeInTheDocument()
    })

    it('handles many tags gracefully', () => {
      const manyTags = Array.from({ length: 10 }, (_, i) => `Tag${i + 1}`)
      const postWithManyTags: BlogPost = {
        ...basePost,
        tags: manyTags,
      }

      render(<BlogCard post={postWithManyTags} />)
      // Should show first few tags or have overflow handling
      const tagElements = screen.getAllByText(/Tag\d+/)
      expect(tagElements.length).toBeGreaterThan(0)
    })

    it('applies appropriate styling to tags', () => {
      const postWithTags: BlogPost = {
        ...basePost,
        tags: ['React', 'TypeScript'],
      }

      render(<BlogCard post={postWithTags} />)
      const reactTag = screen.getByText('React')

      // Tags should have some distinguishing style
      expect(reactTag.className).toBeTruthy()
    })

    it('handles tags with special characters', () => {
      const specialTags = ['C++', 'C#', '.NET', 'Node.js']
      const postWithSpecialTags: BlogPost = {
        ...basePost,
        tags: specialTags,
      }

      render(<BlogCard post={postWithSpecialTags} />)
      expect(screen.getByText('C++')).toBeInTheDocument()
      expect(screen.getByText('C#')).toBeInTheDocument()
      expect(screen.getByText('.NET')).toBeInTheDocument()
    })

    it('handles very long tag names', () => {
      const longTag = 'VeryLongTagNameThatMightBreakLayout'
      const postWithLongTag: BlogPost = {
        ...basePost,
        tags: [longTag],
      }

      render(<BlogCard post={postWithLongTag} />)
      expect(screen.getByText(longTag)).toBeInTheDocument()
    })
  })

  describe('Title Handling', () => {
    it('handles very long titles', () => {
      const longTitle =
        'This is a Very Long Blog Post Title That Might Need Truncation or Special Handling'
      const postWithLongTitle: BlogPost = {
        ...basePost,
        title: longTitle,
      }

      render(<BlogCard post={postWithLongTitle} />)
      expect(screen.getByText(longTitle)).toBeInTheDocument()
    })

    it('handles titles with special characters', () => {
      const specialTitle = 'Post about "React" & TypeScript: A Guide'
      const postWithSpecialTitle: BlogPost = {
        ...basePost,
        title: specialTitle,
      }

      render(<BlogCard post={postWithSpecialTitle} />)
      expect(screen.getByText(specialTitle)).toBeInTheDocument()
    })

    it('handles titles with HTML entities', () => {
      const htmlTitle = 'Managing State in React < v18 & Beyond'
      const postWithHtmlTitle: BlogPost = {
        ...basePost,
        title: htmlTitle,
      }

      render(<BlogCard post={postWithHtmlTitle} />)
      expect(screen.getByText(htmlTitle)).toBeInTheDocument()
    })
  })

  describe('Author Handling', () => {
    it('handles author names with special characters', () => {
      const specialAuthor = 'José García-Smith'
      const postWithSpecialAuthor: BlogPost = {
        ...basePost,
        author: specialAuthor,
      }

      render(<BlogCard post={postWithSpecialAuthor} />)
      expect(screen.getByText(`by ${specialAuthor}`)).toBeInTheDocument()
    })

    it('handles very long author names', () => {
      const longAuthor =
        'Very Long Author Name That Might Need Special Handling'
      const postWithLongAuthor: BlogPost = {
        ...basePost,
        author: longAuthor,
      }

      render(<BlogCard post={postWithLongAuthor} />)
      expect(screen.getByText(`by ${longAuthor}`)).toBeInTheDocument()
    })

    it('handles empty author name', () => {
      const postWithEmptyAuthor: BlogPost = {
        ...basePost,
        author: '',
      }

      render(<BlogCard post={postWithEmptyAuthor} />)
      // Should still render the card
      expect(screen.getByRole('article')).toBeInTheDocument()
    })
  })

  describe('Content Sanitization', () => {
    it('prevents XSS in title', () => {
      const xssTitle = '<script>alert("xss")</script>Safe Title'
      const postWithXssTitle: BlogPost = {
        ...basePost,
        title: xssTitle,
      }

      const { container } = render(<BlogCard post={postWithXssTitle} />)
      // Should not contain script tag
      expect(container.querySelector('script')).not.toBeInTheDocument()
      expect(screen.getByText(/Safe Title/)).toBeInTheDocument()
    })

    it('prevents XSS in excerpt', () => {
      const xssExcerpt = '<img src="x" onerror="alert(\'xss\')" />Safe excerpt'
      const postWithXssExcerpt: BlogPost = {
        ...basePost,
        excerpt: xssExcerpt,
      }

      const { container } = render(<BlogCard post={postWithXssExcerpt} />)
      // Should not contain malicious img tag
      expect(container.querySelector('img[onerror]')).not.toBeInTheDocument()
    })

    it('handles HTML entities in content correctly', () => {
      const entityContent = {
        title: 'React &amp; TypeScript',
        excerpt: 'Learn about &lt;components&gt; &amp; hooks',
      }
      const postWithEntities: BlogPost = {
        ...basePost,
        ...entityContent,
      }

      render(<BlogCard post={postWithEntities} />)
      // HTML entities should be properly rendered
      expect(screen.getByText(/React.*TypeScript/)).toBeInTheDocument()
      expect(
        screen.getByText(/Learn about.*components.*hooks/)
      ).toBeInTheDocument()
    })
  })
})
