'use client'

import { useEffect, useMemo } from 'react'
import { BlogPostCard } from './BlogPostCard'
import type { BlogPost } from '@/lib/types/blog'

export interface BlogSidePanelProps {
  isOpen: boolean
  boxLabel: string
  tags: string[]
  allPosts: BlogPost[]
  onClose: () => void
}

/**
 * Side panel showing related blog posts for a skill box.
 * Posts are passed as props from the server to avoid client-side fs imports.
 */
export function BlogSidePanel({
  isOpen,
  boxLabel,
  tags,
  allPosts,
  onClose,
}: BlogSidePanelProps) {
  // Handle escape key
  useEffect(() => {
    if (!isOpen) return

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [isOpen, onClose])

  // Filter posts by tags
  const posts = useMemo(() => {
    if (!isOpen || tags.length === 0) return []

    // Filter posts that have at least one matching tag (case-insensitive)
    const lowercaseTags = tags.map((t) => t.toLowerCase())
    const filtered = allPosts.filter((post) =>
      post.tags.some((postTag) => lowercaseTags.includes(postTag.toLowerCase()))
    )

    // Sort by date (newest first)
    return filtered.sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [isOpen, tags, allPosts])

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div
        data-testid="side-panel-backdrop"
        className="fixed inset-0 bg-black/50 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div
        role="dialog"
        aria-labelledby="side-panel-title"
        className="fixed right-0 top-0 h-full w-full max-w-md bg-slate-900 border-l border-slate-700 z-50 overflow-y-auto"
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2
              id="side-panel-title"
              className="text-xl font-medium text-white"
            >
              {boxLabel}
            </h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-white transition-colors"
              aria-label="Close panel"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* Posts */}
          {posts.length > 0 ? (
            <div className="space-y-4">
              {posts.map((post) => (
                <BlogPostCard key={post.id} post={post} />
              ))}
            </div>
          ) : (
            <p className="text-gray-400 text-center py-8">
              No related posts yet.
            </p>
          )}
        </div>
      </div>
    </>
  )
}
