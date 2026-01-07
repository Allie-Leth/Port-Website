'use client'

import Link from 'next/link'
import Image from 'next/image'
import { BlogPost } from '@/lib/types/blog'
import { cn } from '@/lib/utils'

interface FeaturedBlogCardProps {
  post: BlogPost
  className?: string
  layout?: 'horizontal' | 'vertical'
  priority?: boolean
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
 * Format read time - handle long read times
 */
function formatReadTime(minutes: number): string {
  if (minutes >= 60) {
    const hours = Math.floor(minutes / 60)
    const mins = minutes % 60
    if (mins === 0) {
      return `${hours}h read`
    }
    return `${hours}h ${mins}min read`
  }
  return `${minutes} min read`
}

/**
 * Featured blog card component for highlighting the main blog post
 */
export function FeaturedBlogCard({
  post,
  className,
  layout = 'horizontal',
  priority = false,
}: FeaturedBlogCardProps) {
  const formattedDate = formatDate(post.date)
  const readTimeText = formatReadTime(post.readTime)

  // Determine layout classes
  const isHorizontal = layout === 'horizontal'
  const layoutClasses = isHorizontal
    ? 'md:grid md:grid-cols-2 md:gap-8'
    : 'flex flex-col'

  return (
    <Link
      href={`/blog/${post.slug}`}
      className={cn(
        'block w-full',
        'rounded-lg border transition-all overflow-hidden',
        'bg-slate-800/30 border-slate-700/50',
        'hover:bg-slate-800/50 hover:border-slate-600/50',
        'group',
        className
      )}
      aria-label={`Read featured post: ${post.title}`}
    >
      <article className={cn('relative', layoutClasses)}>
        {/* Image Section */}
        {post.imageUrl && (
          <div
            className={cn(
              'relative',
              isHorizontal ? 'md:order-1' : '',
              'aspect-video bg-slate-800'
            )}
          >
            <Image
              src={post.imageUrl}
              alt={`Cover image for ${post.title}`}
              fill
              priority={priority}
              className="object-cover"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            {/* Featured Badge Overlay */}
            <div className="absolute top-4 left-4">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-500/90 text-white">
                Featured
              </span>
            </div>
          </div>
        )}

        {/* Content Section */}
        <div className={cn('p-8', isHorizontal ? 'md:order-2' : '')}>
          {/* Featured Badge (when no image) */}
          {!post.imageUrl && (
            <div className="mb-4">
              <span className="inline-block px-3 py-1 text-xs font-bold uppercase tracking-wider rounded-full bg-blue-500/90 text-white">
                Featured
              </span>
            </div>
          )}

          {/* Meta Information */}
          <div className="flex items-center gap-4 text-sm text-gray-400 mb-4">
            <time dateTime={post.date}>{formattedDate}</time>
            <span>•</span>
            <span>{readTimeText}</span>
            <span>•</span>
            <span>by {post.author}</span>
          </div>

          {/* Title */}
          <h2 className="text-2xl md:text-3xl font-bold text-white mb-4 group-hover:text-blue-400 transition-colors">
            {post.title}
          </h2>

          {/* Excerpt */}
          <p className="text-gray-300 text-base mb-6 leading-relaxed">
            {post.excerpt}
          </p>

          {/* Tags */}
          {post.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {post.tags.map((tag) => (
                <span
                  key={tag}
                  className="inline-block px-3 py-1 text-xs font-medium rounded-full bg-slate-700/50 text-gray-300"
                >
                  {tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </article>
    </Link>
  )
}
