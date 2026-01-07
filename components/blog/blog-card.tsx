'use client'

import Link from 'next/link'
import { BlogPost } from '@/lib/types/blog'
import { cn } from '@/lib/utils'

interface BlogCardProps {
  post: BlogPost
  className?: string
}

/**
 * Format date to human-readable format with consistent timezone handling
 */
function formatDate(dateString: string): string {
  try {
    const date = new Date(dateString)
    if (isNaN(date.getTime())) {
      return 'Invalid date'
    }

    // Use UTC to ensure consistent formatting between server and client
    const options: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    }
    return date.toLocaleDateString('en-US', options)
  } catch {
    return 'Invalid date'
  }
}

/**
 * Truncate text to a maximum length
 */
function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) {
    return text
  }
  return text.slice(0, maxLength).trim() + '...'
}

/**
 * Blog card component for displaying a blog post preview
 */
export function BlogCard({ post, className }: BlogCardProps) {
  const formattedDate = formatDate(post.date)
  const truncatedExcerpt = truncateText(post.excerpt, 150)
  const readTimeText = `${post.readTime} min read`

  // For very long tag lists, show only first 5
  const displayTags = post.tags.slice(0, 5)

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'block',
        'rounded-lg border transition-all',
        'bg-slate-800/30 border-slate-700/50',
        'hover:bg-slate-800/50 hover:border-slate-600/50',
        'group',
        className
      )}
      aria-label={`Read more about ${post.title}`}
    >
      <article className="p-6">
        {/* Header with date and read time */}
        <div className="flex items-center gap-4 text-xs text-gray-500 mb-3">
          <time dateTime={post.date}>{formattedDate}</time>
          <span>•</span>
          <span>{readTimeText}</span>
        </div>

        {/* Title */}
        <h3 className="text-xl font-semibold text-white mb-2 group-hover:text-blue-400 transition-colors">
          {post.title}
        </h3>

        {/* Author */}
        <p className="text-sm text-gray-400 mb-3">by {post.author}</p>

        {/* Excerpt */}
        <p className="text-gray-300 text-sm mb-4 line-clamp-3">
          {truncatedExcerpt}
        </p>

        {/* Tags */}
        {post.tags.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {displayTags.map((tag) => (
              <span
                key={tag}
                className="inline-block px-2 py-1 text-xs font-medium rounded-full bg-slate-700/50 text-gray-300"
              >
                {tag}
              </span>
            ))}
            {post.tags.length > 5 && (
              <span className="inline-block px-2 py-1 text-xs text-gray-500">
                +{post.tags.length - 5} more
              </span>
            )}
          </div>
        )}
      </article>
    </Link>
  )
}
