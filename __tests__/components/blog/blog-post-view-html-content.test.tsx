import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
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
  default: ({ children }: { children: string }) => {
    // Simple parsing for markdown content
    const lines = children.split('\n').filter((l) => l.trim())
    return (
      <div data-testid="react-markdown">
        {lines.map((line, i) => (
          <p key={i}>{line.replace(/^#+ /, '')}</p>
        ))}
      </div>
    )
  },
}))

jest.mock('remark-gfm', () => ({
  __esModule: true,
  default: () => {},
}))

// Mock SyntaxHighlighter
jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children }: { children: string }) => (
    <pre data-testid="syntax-highlighter">{children}</pre>
  ),
}))

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {},
}))

describe('BlogPostView HTML Content Parsing', () => {
  describe('isHtmlContent Detection', () => {
    it('detects HTML content starting with <p>', async () => {
      const htmlPost = createMockBlogPost({
        content: '<p>This is HTML paragraph content.</p>',
      })

      render(<BlogPostView post={htmlPost} />)

      await waitFor(() => {
        const paragraph = screen.getByText('This is HTML paragraph content.')
        expect(paragraph.tagName).toBe('P')
      })
    })

    it('detects HTML content starting with <h1>', async () => {
      const htmlPost = createMockBlogPost({
        content: '<h1>HTML Heading</h1>',
      })

      render(<BlogPostView post={htmlPost} />)

      await waitFor(() => {
        // The post has its own h1 for title, so we look for the content h1
        const headings = screen.getAllByRole('heading', { level: 1 })
        expect(headings.some((h) => h.textContent === 'HTML Heading')).toBe(
          true
        )
      })
    })

    it('detects HTML content with leading whitespace', async () => {
      const htmlPost = createMockBlogPost({
        content: '  <div>Content with whitespace</div>',
      })

      render(<BlogPostView post={htmlPost} />)

      await waitFor(() => {
        expect(screen.getByText('Content with whitespace')).toBeInTheDocument()
      })
    })

    it('treats non-HTML content as Markdown', async () => {
      const markdownPost = createMockBlogPost({
        content: '# Markdown Heading\n\nThis is markdown.',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        expect(screen.getByText('This is markdown.')).toBeInTheDocument()
      })
    })
  })

  describe('HTML Element Styling', () => {
    describe('Headings', () => {
      it('styles h1 elements correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<h1>Styled H1</h1>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const headings = screen.getAllByRole('heading', { level: 1 })
          const contentH1 = headings.find((h) => h.textContent === 'Styled H1')
          expect(contentH1).toHaveClass('text-4xl', 'font-bold', 'text-white')
        })
      })

      it('styles h2 elements correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<h2>Styled H2</h2>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const heading = screen.getByRole('heading', {
            level: 2,
            name: 'Styled H2',
          })
          expect(heading).toHaveClass('text-3xl', 'font-semibold', 'text-white')
        })
      })

      it('styles h3 elements correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<h3>Styled H3</h3>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const heading = screen.getByRole('heading', {
            level: 3,
            name: 'Styled H3',
          })
          expect(heading).toHaveClass('text-2xl', 'font-semibold', 'text-white')
        })
      })

      it('styles h4 elements correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<h4>Styled H4</h4>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const heading = screen.getByRole('heading', {
            level: 4,
            name: 'Styled H4',
          })
          expect(heading).toHaveClass('text-xl', 'font-semibold', 'text-white')
        })
      })
    })

    describe('Text Elements', () => {
      it('styles paragraph elements correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<p>Styled paragraph text.</p>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const paragraph = screen.getByText('Styled paragraph text.')
          expect(paragraph).toHaveClass(
            'text-lg',
            'text-gray-300',
            'leading-relaxed'
          )
        })
      })

      it('styles strong elements correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<p><strong>Bold text</strong></p>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const strong = screen.getByText('Bold text')
          expect(strong.tagName).toBe('STRONG')
          expect(strong).toHaveClass('text-white', 'font-semibold')
        })
      })

      it('styles b elements same as strong', async () => {
        const htmlPost = createMockBlogPost({
          content: '<p><b>Bold text</b></p>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const bold = screen.getByText('Bold text')
          expect(bold.tagName).toBe('STRONG')
          expect(bold).toHaveClass('text-white', 'font-semibold')
        })
      })

      it('styles em elements correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<p><em>Italic text</em></p>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const em = screen.getByText('Italic text')
          expect(em.tagName).toBe('EM')
          expect(em).toHaveClass('italic')
        })
      })

      it('styles i elements same as em', async () => {
        const htmlPost = createMockBlogPost({
          content: '<p><i>Italic text</i></p>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const italic = screen.getByText('Italic text')
          expect(italic.tagName).toBe('EM')
          expect(italic).toHaveClass('italic')
        })
      })
    })

    describe('Links', () => {
      it('styles anchor elements correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<p><a href="https://example.com">Link text</a></p>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const link = screen.getByRole('link', { name: 'Link text' })
          expect(link).toHaveAttribute('href', 'https://example.com')
          expect(link).toHaveClass('text-blue-400')
        })
      })

      it('preserves link target attribute', async () => {
        const htmlPost = createMockBlogPost({
          content:
            '<p><a href="https://example.com" target="_blank">Link</a></p>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const link = screen.getByRole('link', { name: 'Link' })
          expect(link).toHaveAttribute('target', '_blank')
        })
      })

      it('adds noopener noreferrer by default', async () => {
        const htmlPost = createMockBlogPost({
          content: '<p><a href="https://example.com">Link</a></p>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const link = screen.getByRole('link', { name: 'Link' })
          expect(link).toHaveAttribute('rel', 'noopener noreferrer')
        })
      })

      it('preserves existing rel attribute', async () => {
        const htmlPost = createMockBlogPost({
          content: '<p><a href="https://example.com" rel="author">Link</a></p>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const link = screen.getByRole('link', { name: 'Link' })
          expect(link).toHaveAttribute('rel', 'author')
        })
      })
    })

    describe('Lists', () => {
      it('styles unordered lists correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<ul><li>Item 1</li><li>Item 2</li></ul>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const list = screen.getByRole('list')
          expect(list).toHaveClass('list-disc', 'list-inside', 'text-gray-300')
        })
      })

      it('styles ordered lists correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<ol><li>First</li><li>Second</li></ol>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const list = screen.getByRole('list')
          expect(list).toHaveClass(
            'list-decimal',
            'list-inside',
            'text-gray-300'
          )
        })
      })

      it('renders list items with proper styling', async () => {
        const htmlPost = createMockBlogPost({
          content: '<ul><li>List item</li></ul>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const item = screen.getByRole('listitem')
          expect(item).toHaveClass('mb-2')
        })
      })
    })

    describe('Blockquote', () => {
      it('styles blockquote elements correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<blockquote>Quoted text</blockquote>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const blockquote = screen.getByText('Quoted text')
          expect(blockquote.closest('blockquote')).toHaveClass(
            'border-l-4',
            'border-blue-500',
            'italic',
            'text-gray-400'
          )
        })
      })
    })

    describe('Code Elements', () => {
      it('styles inline code correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<p>Use <code>const</code> for constants.</p>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const code = screen.getByText('const')
          expect(code).toHaveClass(
            'text-blue-300',
            'bg-slate-800',
            'rounded',
            'text-sm'
          )
        })
      })

      it('styles pre elements correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<pre>code block</pre>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const pre = screen.getByText('code block').closest('pre')
          expect(pre).toHaveClass('bg-slate-800', 'rounded-lg', 'text-sm')
        })
      })
    })

    describe('Horizontal Rule', () => {
      it('styles hr elements correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<p>Before</p><hr/><p>After</p>',
        })

        const { container } = render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const hr = container.querySelector('hr')
          expect(hr).toHaveClass('border-slate-700', 'my-8')
        })
      })
    })

    describe('Tables', () => {
      it('wraps tables in scrollable container', async () => {
        const htmlPost = createMockBlogPost({
          content:
            '<table><thead><tr><th>Header</th></tr></thead><tbody><tr><td>Cell</td></tr></tbody></table>',
        })

        const { container } = render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const wrapper = container.querySelector('.overflow-x-auto')
          expect(wrapper).toBeInTheDocument()
          expect(wrapper?.querySelector('table')).toBeInTheDocument()
        })
      })

      it('styles table header cells correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<table><thead><tr><th>Header</th></tr></thead></table>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const th = screen.getByRole('columnheader')
          expect(th).toHaveClass(
            'bg-slate-800',
            'p-3',
            'font-semibold',
            'text-white'
          )
        })
      })

      it('styles table data cells correctly', async () => {
        const htmlPost = createMockBlogPost({
          content: '<table><tbody><tr><td>Cell data</td></tr></tbody></table>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const td = screen.getByRole('cell')
          expect(td).toHaveClass('p-3', 'text-gray-300')
        })
      })
    })

    describe('Images', () => {
      it('renders images with Next.js Image component', async () => {
        const htmlPost = createMockBlogPost({
          content:
            '<img src="https://example.com/image.jpg" alt="Test image" />',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const img = screen.getByRole('img', { name: 'Test image' })
          expect(img).toHaveAttribute('src', 'https://example.com/image.jpg')
        })
      })

      it('applies correct styling to images', async () => {
        const htmlPost = createMockBlogPost({
          content: '<img src="https://example.com/image.jpg" alt="Test" />',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const img = screen.getByRole('img', { name: 'Test' })
          expect(img).toHaveClass('max-w-full', 'rounded-lg')
        })
      })

      it('handles images without src gracefully', async () => {
        const htmlPost = createMockBlogPost({
          content: '<p>Text</p><img alt="No source" /><p>More text</p>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          expect(screen.getByText('Text')).toBeInTheDocument()
          expect(screen.getByText('More text')).toBeInTheDocument()
          expect(
            screen.queryByRole('img', { name: 'No source' })
          ).not.toBeInTheDocument()
        })
      })
    })

    describe('Figure and Figcaption', () => {
      it('styles figure elements correctly', async () => {
        const htmlPost = createMockBlogPost({
          content:
            '<figure><img src="https://example.com/img.jpg" alt="Fig" /></figure>',
        })

        const { container } = render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const figure = container.querySelector('figure')
          expect(figure).toHaveClass('my-6')
        })
      })

      it('styles figcaption elements correctly', async () => {
        const htmlPost = createMockBlogPost({
          content:
            '<figure><img src="https://example.com/img.jpg" alt="Fig" /><figcaption>Caption text</figcaption></figure>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          const caption = screen.getByText('Caption text')
          expect(caption).toHaveClass('text-center', 'text-gray-400', 'text-sm')
        })
      })
    })

    describe('Unhandled Elements', () => {
      it('renders unhandled elements with default behavior', async () => {
        const htmlPost = createMockBlogPost({
          content: '<div class="custom"><span>Content in span</span></div>',
        })

        render(<BlogPostView post={htmlPost} />)

        await waitFor(() => {
          expect(screen.getByText('Content in span')).toBeInTheDocument()
        })
      })
    })
  })

  describe('Complex HTML Content', () => {
    it('handles nested HTML structure correctly', async () => {
      const htmlPost = createMockBlogPost({
        content: `
          <h2>Nested Content</h2>
          <p>Paragraph with <strong>bold</strong> and <em>italic</em> text.</p>
          <ul>
            <li>List item with <a href="#">link</a></li>
          </ul>
        `,
      })

      render(<BlogPostView post={htmlPost} />)

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { level: 2, name: 'Nested Content' })
        ).toBeInTheDocument()
        expect(screen.getByText('bold')).toBeInTheDocument()
        expect(screen.getByText('italic')).toBeInTheDocument()
        expect(screen.getByRole('link', { name: 'link' })).toBeInTheDocument()
      })
    })
  })
})
