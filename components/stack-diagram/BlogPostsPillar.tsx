'use client'

import { useMemo } from 'react'
import type { BlogPost } from '@/lib/types/blog'

export interface BlogPostsPillarProps {
  /** Label of the selected skill/domain */
  selectedLabel: string | null
  /** Tags to filter posts by */
  tags: string[]
  /** All available blog posts */
  allPosts: BlogPost[]
  /** Currently selected post ID */
  selectedPostId: string | null
  /** Callback when a post is clicked */
  onPostSelect: (post: BlogPost) => void
}

/**
 * Inline column displaying related blog posts for a selected skill/domain.
 * Clicking a post triggers onPostSelect for preview in another pillar.
 */
export function BlogPostsPillar({
  selectedLabel,
  tags,
  allPosts,
  selectedPostId,
  onPostSelect,
}: BlogPostsPillarProps) {
  // Filter posts by tags
  const posts = useMemo(() => {
    if (tags.length === 0) return []

    // Filter posts that have at least one matching tag (case-insensitive)
    const lowercaseTags = tags.map((t) => t.toLowerCase())
    const filtered = allPosts.filter((post) =>
      post.tags.some((postTag) => lowercaseTags.includes(postTag.toLowerCase()))
    )

    // Sort by date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [tags, allPosts])

  return (
    <div className="flex flex-col">
      {/* Header - fixed height, right aligned, with vertical line on inside edge */}
      <div className="relative h-24 flex flex-col justify-center text-right pr-4">
        {/* Vertical line on right edge - fades at top and bottom */}
        <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
        <h2 className="text-lg font-medium text-white">
          {selectedLabel ?? 'Related Posts'}
        </h2>
        <p className="text-sm text-gray-400">
          {selectedLabel ? 'Click to preview' : 'Select a skill to see posts'}
        </p>
      </div>

      {/* Posts list - right aligned */}
      <div className="pt-4 space-y-2 flex flex-col items-end">
        {posts.length > 0 ? (
          posts.map((post) => (
            <button
              key={post.id}
              onClick={() => onPostSelect(post)}
              className={`group w-full text-right p-3 rounded-lg border transition-all cursor-pointer ${
                selectedPostId === post.id
                  ? 'bg-slate-700/50 border-blue-500/50'
                  : 'bg-slate-800/30 border-slate-700/50 hover:bg-slate-700/40 hover:border-slate-600'
              }`}
            >
              <h3
                className={`text-sm font-medium line-clamp-2 transition-colors ${
                  selectedPostId === post.id
                    ? 'text-blue-300'
                    : 'text-white group-hover:text-blue-300'
                }`}
              >
                {post.title}
              </h3>
              <div className="flex items-center justify-end gap-2 mt-1 text-xs text-gray-400">
                <span>{post.readTime} min</span>
                <span>·</span>
                <span>{post.domain}</span>
                <span
                  className={`transition-colors ${
                    selectedPostId === post.id
                      ? 'text-blue-300'
                      : 'text-blue-400/50 group-hover:text-blue-300'
                  }`}
                >
                  →
                </span>
              </div>
            </button>
          ))
        ) : selectedLabel ? (
          <p className="text-gray-500 text-sm py-4">No related posts yet.</p>
        ) : (
          <p className="text-gray-500 text-sm py-4">
            Select a skill to see related blog posts.
          </p>
        )}
      </div>
    </div>
  )
}
