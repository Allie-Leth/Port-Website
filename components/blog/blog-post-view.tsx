'use client'

import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import parse, {
  domToReact,
  HTMLReactParserOptions,
  Element,
  DOMNode,
} from 'html-react-parser'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism'
import Image from 'next/image'
import { BlogPost } from '@/lib/types/blog'
import { cn } from '@/lib/utils'

/**
 * Check if content is HTML (from Ghost) or Markdown (from MDX)
 */
function isHtmlContent(content: string): boolean {
  // Ghost returns HTML content that starts with tags like <p>, <h1>, etc.
  return content.trim().startsWith('<')
}

/**
 * HTML parser options for Ghost content with styled components
 */
const htmlParserOptions: HTMLReactParserOptions = {
  replace: (domNode) => {
    if (!(domNode instanceof Element)) return

    const { name, children, attribs } = domNode

    // Helper to render children
    const renderChildren = () =>
      domToReact(children as DOMNode[], htmlParserOptions)

    switch (name) {
      case 'h1':
        return (
          <h1 className="text-4xl font-bold mt-12 mb-6 text-white">
            {renderChildren()}
          </h1>
        )
      case 'h2':
        return (
          <h2 className="text-3xl font-semibold mt-12 mb-6 text-white">
            {renderChildren()}
          </h2>
        )
      case 'h3':
        return (
          <h3 className="text-2xl font-semibold mt-10 mb-4 text-white">
            {renderChildren()}
          </h3>
        )
      case 'h4':
        return (
          <h4 className="text-xl font-semibold mt-8 mb-3 text-white">
            {renderChildren()}
          </h4>
        )
      case 'p':
        return (
          <p className="text-lg text-gray-300 leading-relaxed mb-6">
            {renderChildren()}
          </p>
        )
      case 'a':
        return (
          <a
            href={attribs?.href}
            target={attribs?.target}
            rel={attribs?.rel || 'noopener noreferrer'}
            className="text-blue-400 hover:text-blue-300 transition-colors"
          >
            {renderChildren()}
          </a>
        )
      case 'strong':
      case 'b':
        return (
          <strong className="text-white font-semibold">
            {renderChildren()}
          </strong>
        )
      case 'em':
      case 'i':
        return <em className="italic">{renderChildren()}</em>
      case 'ul':
        return (
          <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
            {renderChildren()}
          </ul>
        )
      case 'ol':
        return (
          <ol className="list-decimal list-inside text-gray-300 mb-6 space-y-2">
            {renderChildren()}
          </ol>
        )
      case 'li':
        return <li className="mb-2">{renderChildren()}</li>
      case 'blockquote':
        return (
          <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-6">
            {renderChildren()}
          </blockquote>
        )
      case 'pre':
        return (
          <pre className="bg-slate-800 rounded-lg p-4 overflow-x-auto my-6 text-sm">
            {renderChildren()}
          </pre>
        )
      case 'code':
        // Check if this is inside a <pre> (code block) or inline
        return (
          <code className="text-blue-300 bg-slate-800 px-2 py-1 rounded text-sm">
            {renderChildren()}
          </code>
        )
      case 'hr':
        return <hr className="border-slate-700 my-8" />
      case 'table':
        return (
          <div className="overflow-x-auto my-6">
            <table className="min-w-full border-collapse">
              {renderChildren()}
            </table>
          </div>
        )
      case 'thead':
        return <thead>{renderChildren()}</thead>
      case 'tbody':
        return <tbody>{renderChildren()}</tbody>
      case 'tr':
        return <tr>{renderChildren()}</tr>
      case 'th':
        return (
          <th className="bg-slate-800 p-3 text-left font-semibold text-white border-b border-slate-700">
            {renderChildren()}
          </th>
        )
      case 'td':
        return (
          <td className="p-3 text-gray-300 border-t border-slate-700">
            {renderChildren()}
          </td>
        )
      case 'img':
        // Return empty fragment for images without src to suppress rendering
        if (!attribs?.src) return <></>
        return (
          <Image
            src={attribs.src}
            alt={attribs?.alt || ''}
            width={800}
            height={450}
            className="max-w-full h-auto rounded-lg my-6"
            unoptimized
          />
        )
      case 'figure':
        return <figure className="my-6">{renderChildren()}</figure>
      case 'figcaption':
        return (
          <figcaption className="text-center text-gray-400 text-sm mt-2">
            {renderChildren()}
          </figcaption>
        )
      default:
        // Return undefined to keep default rendering for unhandled elements
        return undefined
    }
  },
}

interface BlogPostViewProps {
  post: BlogPost
  className?: string
}

/**
 * Format date to human-readable format with consistent timezone handling
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    // Use UTC to ensure consistent formatting between server and client
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: 'UTC',
    }
    return date.toLocaleDateString('en-US', options)
  } catch {
    return 'Invalid date'
  }
}

/**
 * Full blog post view component
 */
export function BlogPostView({ post, className }: BlogPostViewProps) {
  const [mounted, setMounted] = useState(false)
  const router = useRouter()

  useEffect(() => {
    setMounted(true)
  }, [])

  // Define layout widths for different sections
  const containerWidth = 'w-full px-4 sm:px-6 md:px-8 lg:px-12 xl:px-16 py-16'
  const contentWidth = 'max-w-screen-xl mx-auto'
  // Header slightly narrower for better readability but not too centered
  const headerWidth = 'max-w-5xl mx-auto'

  return (
    <article className={cn(containerWidth, className)}>
      {/* Navigation */}
      <div className={cn(contentWidth, 'mb-8 relative z-50')}>
        <button
          onClick={() => router.push('/blog')}
          className="inline-flex items-center text-gray-400 hover:text-white transition-colors cursor-pointer relative z-50"
          type="button"
        >
          <svg
            className="w-4 h-4 mr-2"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 19l-7-7 7-7"
            />
          </svg>
          Back to Blog
        </button>
      </div>

      {/* Post Header - Slightly narrower for readability */}
      <header className={cn(headerWidth, 'mb-8')}>
        <div className="flex flex-wrap items-center gap-3 text-sm mb-6">
          <span className="px-3 py-1 bg-blue-500/20 text-blue-300 rounded-full font-medium">
            {post.domain}
          </span>
          <span className="text-gray-400">
            By <span className="text-white font-medium">{post.author}</span>
          </span>
          <span className="text-gray-400">•</span>
          <time dateTime={post.date} className="text-gray-400">
            {formatDate(post.date)}
          </time>
          <span className="text-gray-400">•</span>
          <span className="text-gray-400">{post.readTime} min read</span>
        </div>

        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 text-white leading-tight">
          {post.title}
        </h1>

        <p className="text-xl md:text-2xl text-gray-300 leading-relaxed">
          {post.excerpt}
        </p>
      </header>

      {/* Post Content - Using ReactMarkdown */}
      <div className={contentWidth}>
        {/* Tags */}
        {post.tags && post.tags.length > 0 && (
          <div className="mb-8 pb-8 border-b border-slate-800">
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="px-3 py-1.5 bg-slate-800/50 text-gray-400 rounded-full text-sm hover:bg-slate-800 transition-colors cursor-default"
                >
                  {tag}
                </span>
              ))}
            </div>
          </div>
        )}
        <div
          className="prose prose-invert prose-xl max-w-none
          prose-headings:text-white prose-headings:font-semibold
          prose-h1:text-4xl prose-h1:mt-12 prose-h1:mb-6
          prose-h2:text-3xl prose-h2:mt-12 prose-h2:mb-6
          prose-h3:text-2xl prose-h3:mt-10 prose-h3:mb-4
          prose-p:text-gray-300 prose-p:leading-relaxed prose-p:mb-6 prose-p:text-lg
          prose-a:text-blue-400 prose-a:no-underline hover:prose-a:text-blue-300
          prose-strong:text-white prose-strong:font-semibold
          prose-ul:text-gray-300 prose-li:mb-2
          prose-ol:text-gray-300
          prose-blockquote:border-l-4 prose-blockquote:border-blue-500 prose-blockquote:pl-4 prose-blockquote:italic prose-blockquote:text-gray-400
          prose-table:border-collapse prose-table:w-full
          prose-th:bg-slate-800 prose-th:p-3 prose-th:text-left prose-th:font-semibold
          prose-td:border-t prose-td:border-slate-700 prose-td:p-3
          prose-hr:border-slate-700 prose-hr:my-8
          prose-code:text-blue-300 prose-code:bg-slate-800 prose-code:px-2 prose-code:py-1 prose-code:rounded prose-code:before:content-[''] prose-code:after:content-['']
        "
        >
          {mounted ? (
            isHtmlContent(post.content) ? (
              // Ghost returns HTML content - parse with styled components
              <>{parse(post.content, htmlParserOptions)}</>
            ) : (
              // MDX/Markdown content - use ReactMarkdown
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                  h1: ({ children }) => (
                    <h1 className="text-4xl font-bold mt-12 mb-6 text-white">
                      {children}
                    </h1>
                  ),
                  h2: ({ children }) => (
                    <h2 className="text-3xl font-semibold mt-12 mb-6 text-white">
                      {children}
                    </h2>
                  ),
                  h3: ({ children }) => (
                    <h3 className="text-2xl font-semibold mt-10 mb-4 text-white">
                      {children}
                    </h3>
                  ),
                  p: ({ children }) => (
                    <p className="text-lg text-gray-300 leading-relaxed mb-6">
                      {children}
                    </p>
                  ),
                  blockquote: ({ children }) => (
                    <blockquote className="border-l-4 border-blue-500 pl-4 italic text-gray-400 my-6">
                      {children}
                    </blockquote>
                  ),
                  table: ({ children }) => (
                    <div className="overflow-x-auto my-6">
                      <table className="min-w-full border-collapse">
                        {children}
                      </table>
                    </div>
                  ),
                  th: ({ children }) => (
                    <th className="bg-slate-800 p-3 text-left font-semibold text-white border-b border-slate-700">
                      {children}
                    </th>
                  ),
                  td: ({ children }) => (
                    <td className="p-3 text-gray-300 border-t border-slate-700">
                      {children}
                    </td>
                  ),
                  hr: () => <hr className="border-slate-700 my-8" />,
                  ul: ({ children }) => (
                    <ul className="list-disc list-inside text-gray-300 mb-6 space-y-2">
                      {children}
                    </ul>
                  ),
                  ol: ({ children }) => (
                    <ol className="list-decimal list-inside text-gray-300 mb-6 space-y-2">
                      {children}
                    </ol>
                  ),
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '')
                    const language = match ? match[1] : ''

                    return !inline && language ? (
                      <SyntaxHighlighter
                        style={vscDarkPlus}
                        language={language}
                        PreTag="div"
                        className="rounded-lg my-6 text-sm"
                        {...props}
                      >
                        {String(children).replace(/\n$/, '')}
                      </SyntaxHighlighter>
                    ) : (
                      <code className="text-blue-300 bg-slate-800 px-2 py-1 rounded text-sm">
                        {children}
                      </code>
                    )
                  },
                }}
              >
                {post.content}
              </ReactMarkdown>
            )
          ) : (
            <div className="text-gray-300 whitespace-pre-wrap font-sans">
              {post.content}
            </div>
          )}
        </div>
      </div>

      {/* Footer - Full width to match content */}
      <footer
        className={cn(contentWidth, 'mt-16 pt-8 border-t border-slate-800')}
      >
        <div className="flex items-center justify-between">
          <button
            onClick={() => router.push('/blog')}
            className="text-blue-400 hover:text-blue-300 transition-colors cursor-pointer"
          >
            ← Back to all posts
          </button>

          <div className="flex gap-4">
            <button className="text-gray-400 hover:text-white transition-colors">
              Share
            </button>
          </div>
        </div>
      </footer>
    </article>
  )
}
