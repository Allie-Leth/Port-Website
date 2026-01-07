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

// Mock react-markdown with more complete implementation for markdown tests
jest.mock('react-markdown', () => ({
  __esModule: true,
  default: ({
    children,
    components,
  }: {
    children: string
    components: any
  }) => {
    // Parse markdown-like content for testing
    const lines = children.split('\n')
    const elements: React.ReactNode[] = []

    let inCodeBlock = false
    let codeBlockContent = ''
    let codeBlockLang = ''

    for (let i = 0; i < lines.length; i++) {
      const line = lines[i]

      // Code blocks
      if (line.startsWith('```')) {
        if (inCodeBlock) {
          // End of code block
          if (codeBlockLang && components?.code) {
            elements.push(
              components.code({
                key: i,
                inline: false,
                className: `language-${codeBlockLang}`,
                children: codeBlockContent.trim(),
              })
            )
          } else {
            elements.push(<pre key={i}>{codeBlockContent.trim()}</pre>)
          }
          codeBlockContent = ''
          codeBlockLang = ''
          inCodeBlock = false
        } else {
          // Start of code block
          inCodeBlock = true
          codeBlockLang = line.slice(3).trim()
        }
        continue
      }

      if (inCodeBlock) {
        codeBlockContent += line + '\n'
        continue
      }

      // Headings
      if (line.startsWith('### ')) {
        const content = line.slice(4)
        elements.push(
          components?.h3 ? (
            components.h3({ key: i, children: content })
          ) : (
            <h3 key={i}>{content}</h3>
          )
        )
        continue
      }
      if (line.startsWith('## ')) {
        const content = line.slice(3)
        elements.push(
          components?.h2 ? (
            components.h2({ key: i, children: content })
          ) : (
            <h2 key={i}>{content}</h2>
          )
        )
        continue
      }
      if (line.startsWith('# ')) {
        const content = line.slice(2)
        elements.push(
          components?.h1 ? (
            components.h1({ key: i, children: content })
          ) : (
            <h1 key={i}>{content}</h1>
          )
        )
        continue
      }

      // Blockquote
      if (line.startsWith('> ')) {
        const content = line.slice(2)
        elements.push(
          components?.blockquote ? (
            components.blockquote({ key: i, children: <p>{content}</p> })
          ) : (
            <blockquote key={i}>{content}</blockquote>
          )
        )
        continue
      }

      // Horizontal rule
      if (line === '---') {
        elements.push(
          components?.hr ? components.hr({ key: i }) : <hr key={i} />
        )
        continue
      }

      // Lists
      if (line.startsWith('- ')) {
        const content = line.slice(2)
        // Check for task list
        if (content.startsWith('[x] ') || content.startsWith('[ ] ')) {
          elements.push(<li key={i}>{content.slice(4)}</li>)
        } else {
          elements.push(<li key={i}>{content}</li>)
        }
        continue
      }
      if (/^\d+\. /.test(line)) {
        const content = line.replace(/^\d+\. /, '')
        elements.push(<li key={i}>{content}</li>)
        continue
      }

      // Tables (simplified)
      if (line.startsWith('|')) {
        const cells = line.split('|').filter((c) => c.trim())
        if (line.includes('---')) continue // Skip separator row
        const isHeader = !elements.some(
          (e: any) => e?.type === 'th' || e?.type === 'td'
        )
        if (isHeader) {
          cells.forEach((cell, j) => {
            elements.push(
              components?.th ? (
                components.th({ key: `${i}-${j}`, children: cell.trim() })
              ) : (
                <th key={`${i}-${j}`}>{cell.trim()}</th>
              )
            )
          })
        } else {
          cells.forEach((cell, j) => {
            elements.push(
              components?.td ? (
                components.td({ key: `${i}-${j}`, children: cell.trim() })
              ) : (
                <td key={`${i}-${j}`}>{cell.trim()}</td>
              )
            )
          })
        }
        continue
      }

      // Strikethrough
      if (line.includes('~~')) {
        const match = line.match(/~~(.+?)~~/)
        if (match) {
          elements.push(<del key={i}>{match[1]}</del>)
          continue
        }
      }

      // Inline code
      if (line.includes('`') && !line.startsWith('```')) {
        const parts = line.split(/`([^`]+)`/)
        const children = parts.map((part, j) => {
          if (j % 2 === 1) {
            return components?.code ? (
              components.code({
                key: j,
                inline: true,
                children: part,
              })
            ) : (
              <code key={j}>{part}</code>
            )
          }
          return part
        })
        elements.push(
          components?.p ? (
            components.p({ key: i, children })
          ) : (
            <p key={i}>{children}</p>
          )
        )
        continue
      }

      // Autolinks
      if (line.includes('https://')) {
        const match = line.match(/(https?:\/\/[^\s]+)/)
        if (match) {
          elements.push(
            <p key={i}>
              {line.replace(match[1], '')}
              <a href={match[1]}>{match[1]}</a>
            </p>
          )
          continue
        }
      }

      // Regular paragraph
      if (line.trim()) {
        elements.push(
          components?.p ? (
            components.p({ key: i, children: line })
          ) : (
            <p key={i}>{line}</p>
          )
        )
      }
    }

    // Wrap list items in lists
    const wrappedElements: React.ReactNode[] = []
    let currentList: React.ReactNode[] = []
    let listType: 'ul' | 'ol' | null = null

    elements.forEach((el: any, i) => {
      if (el?.type === 'li') {
        const newListType = lines.some(
          (l) => l.startsWith('- ') || l.startsWith('[')
        )
          ? 'ul'
          : 'ol'
        if (listType && listType !== newListType) {
          if (listType === 'ul') {
            wrappedElements.push(
              components?.ul ? (
                components.ul({ key: `list-${i}`, children: currentList })
              ) : (
                <ul key={`list-${i}`}>{currentList}</ul>
              )
            )
          } else {
            wrappedElements.push(
              components?.ol ? (
                components.ol({ key: `list-${i}`, children: currentList })
              ) : (
                <ol key={`list-${i}`}>{currentList}</ol>
              )
            )
          }
          currentList = []
        }
        listType = newListType
        currentList.push(el)
      } else {
        if (currentList.length > 0) {
          if (listType === 'ul') {
            wrappedElements.push(
              components?.ul ? (
                components.ul({
                  key: `list-${i}`,
                  children: currentList,
                })
              ) : (
                <ul key={`list-${i}`}>{currentList}</ul>
              )
            )
          } else if (listType === 'ol') {
            wrappedElements.push(
              components?.ol ? (
                components.ol({
                  key: `list-${i}`,
                  children: currentList,
                })
              ) : (
                <ol key={`list-${i}`}>{currentList}</ol>
              )
            )
          }
          currentList = []
          listType = null
        }
        wrappedElements.push(el)
      }
    })

    // Handle remaining list items
    if (currentList.length > 0) {
      if (listType === 'ul') {
        wrappedElements.push(
          components?.ul ? (
            components.ul({ key: 'final-list', children: currentList })
          ) : (
            <ul key="final-list">{currentList}</ul>
          )
        )
      } else if (listType === 'ol') {
        wrappedElements.push(
          components?.ol ? (
            components.ol({ key: 'final-list', children: currentList })
          ) : (
            <ol key="final-list">{currentList}</ol>
          )
        )
      }
    }

    // Handle tables - wrap th/td in proper structure
    const tableElements = wrappedElements.filter(
      (e: any) => e?.type === 'th' || e?.type === 'td'
    )
    if (tableElements.length > 0) {
      const headers = tableElements.filter((e: any) => e?.type === 'th')
      const cells = tableElements.filter((e: any) => e?.type === 'td')

      const tableContent = (
        <table key="table" className="min-w-full border-collapse">
          {headers.length > 0 && (
            <thead>
              <tr>{headers}</tr>
            </thead>
          )}
          {cells.length > 0 && (
            <tbody>
              <tr>{cells}</tr>
            </tbody>
          )}
        </table>
      )

      const wrapper = components?.table ? (
        components.table({ key: 'table-wrapper', children: tableContent })
      ) : (
        <div key="table-wrapper" className="overflow-x-auto my-6">
          {tableContent}
        </div>
      )

      return (
        <>
          {wrappedElements.filter(
            (e: any) => e?.type !== 'th' && e?.type !== 'td'
          )}
          {wrapper}
        </>
      )
    }

    return <>{wrappedElements}</>
  },
}))

jest.mock('remark-gfm', () => ({
  __esModule: true,
  default: () => {},
}))

// Mock SyntaxHighlighter
jest.mock('react-syntax-highlighter', () => ({
  Prism: ({ children, language }: { children: string; language: string }) => (
    <pre data-testid="syntax-highlighter" data-language={language}>
      {children}
    </pre>
  ),
}))

jest.mock('react-syntax-highlighter/dist/esm/styles/prism', () => ({
  vscDarkPlus: {},
}))

describe('BlogPostView Markdown Content Rendering', () => {
  describe('Markdown Headings', () => {
    it('renders h1 markdown headings with correct styling', async () => {
      const markdownPost = createMockBlogPost({
        content: '# Markdown H1 Heading',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        const headings = screen.getAllByRole('heading', { level: 1 })
        const contentH1 = headings.find(
          (h) => h.textContent === 'Markdown H1 Heading'
        )
        expect(contentH1).toBeInTheDocument()
        expect(contentH1).toHaveClass('text-4xl', 'font-bold', 'text-white')
      })
    })

    it('renders h2 markdown headings with correct styling', async () => {
      const markdownPost = createMockBlogPost({
        content: '## Markdown H2 Heading',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        const heading = screen.getByRole('heading', {
          level: 2,
          name: 'Markdown H2 Heading',
        })
        expect(heading).toHaveClass('text-3xl', 'font-semibold', 'text-white')
      })
    })

    it('renders h3 markdown headings with correct styling', async () => {
      const markdownPost = createMockBlogPost({
        content: '### Markdown H3 Heading',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        const heading = screen.getByRole('heading', {
          level: 3,
          name: 'Markdown H3 Heading',
        })
        expect(heading).toHaveClass('text-2xl', 'font-semibold', 'text-white')
      })
    })
  })

  describe('Markdown Paragraphs', () => {
    it('renders paragraphs with correct styling', async () => {
      const markdownPost = createMockBlogPost({
        content: 'This is a markdown paragraph.',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        const paragraph = screen.getByText('This is a markdown paragraph.')
        expect(paragraph.tagName).toBe('P')
        expect(paragraph).toHaveClass(
          'text-lg',
          'text-gray-300',
          'leading-relaxed'
        )
      })
    })

    it('handles multiple paragraphs', async () => {
      const markdownPost = createMockBlogPost({
        content: 'First paragraph.\n\nSecond paragraph.',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        expect(screen.getByText('First paragraph.')).toBeInTheDocument()
        expect(screen.getByText('Second paragraph.')).toBeInTheDocument()
      })
    })
  })

  describe('Markdown Lists', () => {
    it('renders unordered lists with correct styling', async () => {
      const markdownPost = createMockBlogPost({
        content: '- Item 1\n- Item 2\n- Item 3',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        const list = screen.getByRole('list')
        expect(list.tagName).toBe('UL')
        expect(list).toHaveClass('list-disc', 'list-inside', 'text-gray-300')
      })
    })

    it('renders ordered lists with correct styling', async () => {
      const markdownPost = createMockBlogPost({
        content: '1. First\n2. Second\n3. Third',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        const list = screen.getByRole('list')
        expect(list.tagName).toBe('OL')
        expect(list).toHaveClass('list-decimal', 'list-inside', 'text-gray-300')
      })
    })
  })

  describe('Markdown Blockquotes', () => {
    it('renders blockquotes with correct styling', async () => {
      const markdownPost = createMockBlogPost({
        content: '> This is a blockquote',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        const blockquote = screen
          .getByText('This is a blockquote')
          .closest('blockquote')
        expect(blockquote).toHaveClass(
          'border-l-4',
          'border-blue-500',
          'italic',
          'text-gray-400'
        )
      })
    })
  })

  describe('Markdown Code', () => {
    it('renders inline code with correct styling', async () => {
      const markdownPost = createMockBlogPost({
        content: 'Use `const` for constants.',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        const code = screen.getByText('const')
        expect(code.tagName).toBe('CODE')
        expect(code).toHaveClass(
          'text-blue-300',
          'bg-slate-800',
          'rounded',
          'text-sm'
        )
      })
    })

    it('renders code blocks with syntax highlighting', async () => {
      const markdownPost = createMockBlogPost({
        content: '```javascript\nconst x = 1;\n```',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        const syntaxHighlighter = screen.getByTestId('syntax-highlighter')
        expect(syntaxHighlighter).toBeInTheDocument()
        expect(syntaxHighlighter).toHaveAttribute('data-language', 'javascript')
      })
    })

    it('renders code blocks without language as inline code', async () => {
      const markdownPost = createMockBlogPost({
        content: '```\nplain code\n```',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        // Without language, it should still render
        expect(screen.getByText('plain code')).toBeInTheDocument()
      })
    })
  })

  describe('Markdown Tables', () => {
    it('renders tables with correct wrapper', async () => {
      const markdownPost = createMockBlogPost({
        content: '| Header |\n|--------|\n| Cell |',
      })

      const { container } = render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        const wrapper = container.querySelector('.overflow-x-auto')
        expect(wrapper).toBeInTheDocument()
        expect(wrapper?.querySelector('table')).toBeInTheDocument()
      })
    })

    it('styles table headers correctly', async () => {
      const markdownPost = createMockBlogPost({
        content: '| Header |\n|--------|\n| Cell |',
      })

      render(<BlogPostView post={markdownPost} />)

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
      const markdownPost = createMockBlogPost({
        content: '| Header |\n|--------|\n| Cell |',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        const td = screen.getByRole('cell')
        expect(td).toHaveClass('p-3', 'text-gray-300')
      })
    })
  })

  describe('Markdown Horizontal Rule', () => {
    it('renders horizontal rules with correct styling', async () => {
      const markdownPost = createMockBlogPost({
        content: 'Above\n\n---\n\nBelow',
      })

      const { container } = render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        const hr = container.querySelector('hr')
        expect(hr).toHaveClass('border-slate-700', 'my-8')
      })
    })
  })

  describe('GFM (GitHub Flavored Markdown)', () => {
    it('supports strikethrough text', async () => {
      const markdownPost = createMockBlogPost({
        content: '~~strikethrough~~',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        const del = screen.getByText('strikethrough')
        expect(del.tagName).toBe('DEL')
      })
    })

    it('supports autolinks', async () => {
      const markdownPost = createMockBlogPost({
        content: 'Check out https://example.com',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', 'https://example.com')
      })
    })

    it('supports task lists', async () => {
      const markdownPost = createMockBlogPost({
        content: '- [x] Done\n- [ ] Todo',
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        expect(screen.getByText('Done')).toBeInTheDocument()
        expect(screen.getByText('Todo')).toBeInTheDocument()
      })
    })
  })

  describe('Complex Markdown Content', () => {
    it('handles mixed content correctly', async () => {
      const markdownPost = createMockBlogPost({
        content: `
## Getting Started

This is an introduction paragraph.

### Prerequisites

- Node.js
- npm

### Installation

\`\`\`bash
npm install
\`\`\`

> **Note:** Make sure to run tests.
        `.trim(),
      })

      render(<BlogPostView post={markdownPost} />)

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { level: 2, name: 'Getting Started' })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('heading', { level: 3, name: 'Prerequisites' })
        ).toBeInTheDocument()
        expect(
          screen.getByRole('heading', { level: 3, name: 'Installation' })
        ).toBeInTheDocument()
        expect(screen.getByText('Node.js')).toBeInTheDocument()
        expect(screen.getByText('npm install')).toBeInTheDocument()
      })
    })
  })
})
