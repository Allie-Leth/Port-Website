'use client'

import { useMemo } from 'react'
import Link from 'next/link'
import type { BlogPost } from '@/lib/types/blog'

export interface MobileBlogPostsProps {
  /** Tags to filter posts by */
  tags: string[]
  /** All available blog posts */
  allPosts: BlogPost[]
  /** Label for the header */
  selectedLabel: string | null
}

/**
 * Horizontal scrolling blog posts for mobile view.
 * Shows compact cards that link to related blog posts.
 */
export function MobileBlogPosts({
  tags,
  allPosts,
  selectedLabel,
}: MobileBlogPostsProps) {
  // Filter posts by tags
  const posts = useMemo(() => {
    if (tags.length === 0) return []

    const lowercaseTags = tags.map((t) => t.toLowerCase())
    const filtered = allPosts.filter((post) =>
      post.tags.some((postTag) => lowercaseTags.includes(postTag.toLowerCase()))
    )

    return filtered
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 5) // Limit to 5 posts on mobile
  }, [tags, allPosts])

  if (posts.length === 0) return null

  return (
    <div className="px-4 py-4">
      <div className="flex items-center gap-2 mb-2">
        <h3 className="text-xs text-gray-400 shrink-0">
          {selectedLabel ? `${selectedLabel} posts` : 'Related posts'}
        </h3>
        <div className="flex-1 h-px bg-slate-700/50" />
      </div>
      <div className="flex gap-2 overflow-x-auto pb-2">
        {posts.map((post) => (
          <Link
            key={post.id}
            href={`/blog/${post.slug}`}
            className="shrink-0 w-48 p-3 rounded-lg bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600 transition-colors"
          >
            <h4 className="text-sm font-medium text-white line-clamp-2 mb-1">
              {post.title}
            </h4>
            <div className="flex items-center gap-2 text-xs text-gray-400">
              <span>{post.readTime} min</span>
              <span>·</span>
              <span className="truncate">{post.domain}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  )
}
