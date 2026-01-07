import Link from 'next/link'
import type { BlogPost } from '@/lib/types/blog'

export interface BlogPostCardProps {
  post: BlogPost
}

/**
 * Card component displaying a blog post summary for the side panel.
 */
export function BlogPostCard({ post }: BlogPostCardProps) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block p-4 rounded-lg bg-slate-800/50 hover:bg-slate-700/50 transition-colors border border-slate-700/50"
    >
      <h3 className="font-medium text-white mb-2">{post.title}</h3>
      <p className="text-sm text-gray-400 mb-3">{post.excerpt}</p>
      <div className="flex items-center justify-between">
        <div className="flex flex-wrap gap-1">
          {post.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs px-2 py-0.5 bg-slate-700/50 rounded text-gray-300"
            >
              {tag}
            </span>
          ))}
        </div>
        <span className="text-xs text-gray-500">{post.readTime} min</span>
      </div>
    </Link>
  )
}
