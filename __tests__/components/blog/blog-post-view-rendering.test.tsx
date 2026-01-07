import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { BlogPostView } from '@/components/blog/blog-post-view'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'

// Mock Next.js router
const mockPush = jest.fn()
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
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
  default: ({ children }: { children: string }) => {
    // Simple markdown-like rendering for tests
    const lines = children.split('\n')
    return (
      <>
        {lines.map((line, i) => {
          if (line.startsWith('# ')) {
            return (
              <h1 key={i} className="text-4xl font-bold mt-12 mb-6 text-white">
                {line.slice(2)}
              </h1>
            )
          }
          if (line.startsWith('## ')) {
            return (
              <h2
                key={i}
                className="text-3xl font-semibold mt-12 mb-6 text-white"
              >
                {line.slice(3)}
              </h2>
            )
          }
          if (line.trim()) {
            return (
              <p key={i} className="text-lg text-gray-300 leading-relaxed mb-6">
                {line}
              </p>
            )
          }
          return null
        })}
      </>
    )
  },
}))

jest.mock('remark-gfm', () => ({
  __esModule: true,
  default: () => {},
}))

// Mock SyntaxHighlighter to avoid complex rendering
jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: string }) => (
    <pre data-testid="syntax-highlighter">{children}</pre>
  ),
}))

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {},
}))

describe('BlogPostView Rendering', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  const mockPost = createMockBlogPost({
    title: 'Test Blog Post Title',
    excerpt: 'This is a test excerpt for the blog post.',
    content: '# Test Heading\n\nThis is test content.',
    date: '2024-01-15',
    author: 'Test Author',
    domain: 'DevOps',
    readTime: 5,
    tags: ['React', 'Testing'],
  })

  describe('Basic Structure', () => {
    it('renders as an article element', () => {
      const { container } = render(<BlogPostView post={mockPost} />)
      expect(container.querySelector('article')).toBeInTheDocument()
    })

    it('displays the post title as h1', () => {
      render(<BlogPostView post={mockPost} />)
      expect(
        screen.getByRole('heading', { level: 1, name: /Test Blog Post Title/i })
      ).toBeInTheDocument()
    })

    it('displays the post excerpt', () => {
      render(<BlogPostView post={mockPost} />)
      expect(
        screen.getByText('This is a test excerpt for the blog post.')
      ).toBeInTheDocument()
    })

    it('displays the author name', () => {
      render(<BlogPostView post={mockPost} />)
      expect(screen.getByText('Test Author')).toBeInTheDocument()
    })

    it('displays the domain badge', () => {
      render(<BlogPostView post={mockPost} />)
      expect(screen.getByText('DevOps')).toBeInTheDocument()
    })

    it('displays the read time', () => {
      render(<BlogPostView post={mockPost} />)
      expect(screen.getByText('5 min read')).toBeInTheDocument()
    })

    it('displays formatted date', () => {
      render(<BlogPostView post={mockPost} />)
      expect(screen.getByText('January 15, 2024')).toBeInTheDocument()
    })
  })

  describe('Tags Section', () => {
    it('displays all tags when present', () => {
      render(<BlogPostView post={mockPost} />)
      expect(screen.getByText('React')).toBeInTheDocument()
      expect(screen.getByText('Testing')).toBeInTheDocument()
    })

    it('does not render tags section when no tags', () => {
      const postWithoutTags = createMockBlogPost({
        ...mockPost,
        tags: [],
      })
      const { container } = render(<BlogPostView post={postWithoutTags} />)
      // Should not have the border-b element that wraps tags
      const tagContainers = container.querySelectorAll(
        '.border-b.border-slate-800'
      )
      expect(tagContainers.length).toBe(0)
    })

    it('renders tags with proper styling', () => {
      render(<BlogPostView post={mockPost} />)
      const reactTag = screen.getByText('React')
      expect(reactTag).toHaveClass('rounded-full')
    })
  })

  describe('Navigation Elements', () => {
    it('renders back to blog button at top', () => {
      render(<BlogPostView post={mockPost} />)
      const backButton = screen.getByRole('button', { name: /Back to Blog/i })
      expect(backButton).toBeInTheDocument()
    })

    it('navigates to /blog when back button is clicked', async () => {
      const user = userEvent.setup()
      render(<BlogPostView post={mockPost} />)

      const backButton = screen.getByRole('button', { name: /Back to Blog/i })
      await user.click(backButton)

      expect(mockPush).toHaveBeenCalledWith('/blog')
    })

    it('renders back to all posts link in footer', () => {
      render(<BlogPostView post={mockPost} />)
      const footerLink = screen.getByRole('button', {
        name: /Back to all posts/i,
      })
      expect(footerLink).toBeInTheDocument()
    })

    it('navigates when footer back link is clicked', async () => {
      const user = userEvent.setup()
      render(<BlogPostView post={mockPost} />)

      const footerLink = screen.getByRole('button', {
        name: /Back to all posts/i,
      })
      await user.click(footerLink)

      expect(mockPush).toHaveBeenCalledWith('/blog')
    })

    it('renders share button in footer', () => {
      render(<BlogPostView post={mockPost} />)
      expect(screen.getByRole('button', { name: /Share/i })).toBeInTheDocument()
    })
  })

  describe('Custom className', () => {
    it('applies custom className to article', () => {
      const { container } = render(
        <BlogPostView post={mockPost} className="custom-class" />
      )
      const article = container.querySelector('article')
      expect(article).toHaveClass('custom-class')
    })

    it('maintains default classes with custom className', () => {
      const { container } = render(
        <BlogPostView post={mockPost} className="custom-class" />
      )
      const article = container.querySelector('article')
      expect(article).toHaveClass('w-full')
      expect(article).toHaveClass('py-16')
    })
  })

  describe('Content Mounting Behavior', () => {
    it('shows plain content before mount', () => {
      // React.useState mock to simulate unmounted state
      const originalUseState = React.useState
      jest
        .spyOn(React, 'useState')
        .mockImplementationOnce(() => [false, jest.fn()])

      render(<BlogPostView post={mockPost} />)

      // Should show plain text content
      expect(screen.getByText(/Test Heading/)).toBeInTheDocument()

      // Restore
      jest.spyOn(React, 'useState').mockImplementation(originalUseState)
    })

    it('renders markdown content after mount', async () => {
      render(<BlogPostView post={mockPost} />)

      await waitFor(() => {
        expect(screen.getByText(/This is test content/)).toBeInTheDocument()
      })
    })
  })
})
