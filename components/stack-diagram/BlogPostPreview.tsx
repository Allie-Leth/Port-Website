'use client'

import Link from 'next/link'
import type { BlogPost } from '@/lib/types/blog'

export interface BlogPostPreviewProps {
  /** The blog post to preview, or null if none selected */
  post: BlogPost | null
  /** Skill detail bullets to display (shown regardless of post selection) */
  skillDetails?: string[]
}

/**
 * Displays skill details bullets and a compact blog post preview card.
 * Skill details are shown independently of post selection.
 */
export function BlogPostPreview({
  post,
  skillDetails = [],
}: BlogPostPreviewProps) {
  // Use summary if available, otherwise fall back to excerpt
  const previewText = post ? (post.summary ?? post.excerpt) : null

  return (
    <div className="flex flex-col">
      {/* Header - fixed height with skill details, with vertical line on inside edge */}
      <div className="relative h-24 flex flex-col justify-center pl-4">
        {/* Vertical line on left edge - fades at top and bottom */}
        <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
        {skillDetails.length > 0 ? (
          <div className="flex gap-4">
            {/* First column - up to 3 items */}
            <div className="space-y-1">
              {skillDetails.slice(0, 3).map((detail, index) => (
                <div
                  key={index}
                  className="flex items-start gap-2 text-sm text-gray-300"
                >
                  <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                  <span className="line-clamp-1">{detail}</span>
                </div>
              ))}
            </div>
            {/* Second column - items 4-6 if they exist */}
            {skillDetails.length > 3 && (
              <div className="space-y-1">
                {skillDetails.slice(3, 6).map((detail, index) => (
                  <div
                    key={index}
                    className="flex items-start gap-2 text-sm text-gray-300"
                  >
                    <span className="text-blue-400 mt-0.5 shrink-0">•</span>
                    <span className="line-clamp-1">{detail}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <p className="text-gray-500 text-sm">Select a skill to see details</p>
        )}
      </div>

      {/* Blog post section */}
      {post && (
        <div className="pt-4">
          {/* Clickable blog card */}
          <Link
            href={`/blog/${post.slug}`}
            className="block p-4 rounded-lg border border-slate-700/50 bg-slate-800/30 hover:bg-slate-700/30 hover:border-blue-500/30 transition-all"
          >
            {/* Title */}
            <h3 className="text-sm font-medium text-white line-clamp-2 mb-2">
              {post.title}
            </h3>

            {/* Meta info */}
            <div className="flex items-center gap-1 text-xs text-gray-400 mb-3">
              <span>{post.readTime}m</span>
              <span>·</span>
              <span>{post.domain}</span>
            </div>

            {/* Preview text */}
            <p className="text-gray-300 text-sm leading-relaxed line-clamp-[8]">
              {previewText}
            </p>
          </Link>

          {/* Related URL link (below the card) */}
          {post.relatedUrl && (
            <div className="mt-3">
              <a
                href={post.relatedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 text-blue-400 hover:text-blue-300 text-xs font-medium transition-colors"
              >
                View project
                <svg
                  className="w-3 h-3"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"
                  />
                </svg>
              </a>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
