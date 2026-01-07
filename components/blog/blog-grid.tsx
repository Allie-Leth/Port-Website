'use client'

import React from 'react'
import { BlogPost } from '@/lib/types/blog'
import { BlogCard } from './blog-card'
import { cn } from '@/lib/utils'

/**
 * Static class mappings for Tailwind CSS purging.
 * Dynamic classes like `grid-cols-${n}` cannot be purged by Tailwind.
 * These explicit mappings ensure classes are included in production builds.
 */
const gridColsMap: Record<number, string> = {
  1: 'grid-cols-1',
  2: 'grid-cols-2',
  3: 'grid-cols-3',
  4: 'grid-cols-4',
}

const mdGridColsMap: Record<number, string> = {
  1: 'md:grid-cols-1',
  2: 'md:grid-cols-2',
  3: 'md:grid-cols-3',
  4: 'md:grid-cols-4',
}

const lgGridColsMap: Record<number, string> = {
  1: 'lg:grid-cols-1',
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
}

interface BlogGridProps {
  posts: BlogPost[] | null | undefined
  loading?: boolean
  columns?: {
    sm?: number
    md?: number
    lg?: number
  }
  className?: string
  emptyMessage?: string
}

/**
 * Skeleton loader for blog cards
 */
function BlogCardSkeleton() {
  return (
    <div
      data-testid="blog-card-skeleton"
      className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-6 animate-pulse"
    >
      <div className="flex items-center gap-4 mb-3">
        <div className="h-3 bg-slate-700 rounded w-20"></div>
        <div className="h-3 bg-slate-700 rounded w-16"></div>
      </div>
      <div className="h-6 bg-slate-700 rounded mb-2"></div>
      <div className="h-4 bg-slate-700 rounded w-24 mb-3"></div>
      <div className="space-y-2 mb-4">
        <div className="h-3 bg-slate-700 rounded"></div>
        <div className="h-3 bg-slate-700 rounded"></div>
        <div className="h-3 bg-slate-700 rounded w-4/5"></div>
      </div>
      <div className="flex gap-2">
        <div className="h-6 bg-slate-700 rounded-full w-16"></div>
        <div className="h-6 bg-slate-700 rounded-full w-20"></div>
        <div className="h-6 bg-slate-700 rounded-full w-14"></div>
      </div>
    </div>
  )
}

/**
 * Empty state component
 */
function EmptyState({ message }: { message: string }) {
  return (
    <div className="text-center py-12">
      <p className="text-gray-400 text-lg">{message}</p>
    </div>
  )
}

/**
 * Blog grid component for displaying blog posts
 */
export function BlogGrid({
  posts,
  loading = false,
  columns = { sm: 1, md: 2, lg: 3 },
  className,
  emptyMessage = 'No posts found',
}: BlogGridProps) {
  // Handle null/undefined posts
  const safePosts = posts || []

  // Determine grid column classes using static mappings for Tailwind purging
  const gridCols = cn(
    'grid gap-6',
    gridColsMap[columns.sm || 1],
    columns.md && mdGridColsMap[columns.md],
    columns.lg && lgGridColsMap[columns.lg]
  )

  // Show loading skeletons
  if (loading) {
    return (
      <section className={className} aria-label="Blog posts" role="region">
        <div className={gridCols}>
          {Array.from({ length: 6 }).map((_, index) => (
            <BlogCardSkeleton key={`skeleton-${index}`} />
          ))}
        </div>
      </section>
    )
  }

  // Show empty state
  if (safePosts.length === 0) {
    return (
      <section className={className} aria-label="Blog posts" role="region">
        <EmptyState message={emptyMessage} />
      </section>
    )
  }

  // Render blog posts
  return (
    <section className={className} aria-label="Blog posts" role="region">
      <div className={gridCols}>
        {safePosts.map((post) => (
          <BlogCard key={post.id} post={post} />
        ))}
      </div>
    </section>
  )
}
