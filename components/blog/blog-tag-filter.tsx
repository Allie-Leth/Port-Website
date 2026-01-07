'use client'

import React from 'react'
import { cn } from '@/lib/utils'

interface BlogTagFilterProps {
  tags: string[] | undefined
  selectedTag: string | null
  onTagSelect: (tag: string | null) => void
  tagCounts?: Record<string, number>
  totalCount?: number
  layout?: 'horizontal' | 'vertical'
  sortTags?: boolean
  className?: string
}

/**
 * Blog tag filter component for filtering posts by tags
 */
export function BlogTagFilter({
  tags,
  selectedTag,
  onTagSelect,
  tagCounts,
  totalCount,
  layout = 'horizontal',
  sortTags = true,
  className,
}: BlogTagFilterProps) {
  // Handle undefined/null tags
  const safeTags = tags || []

  // Sort tags if requested
  const displayTags = sortTags
    ? [...safeTags].sort((a, b) => a.localeCompare(b))
    : safeTags

  // Determine layout classes
  const containerClasses = cn(
    'flex gap-2',
    layout === 'vertical' ? 'flex-col' : 'flex-wrap',
    className
  )

  // Button style helper
  const getButtonClasses = (isActive: boolean) =>
    cn(
      'px-3 py-1.5 rounded-full text-sm font-medium transition-all',
      'hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
      isActive
        ? 'bg-blue-500 text-white active selected primary'
        : 'bg-slate-700/50 text-gray-300 hover:bg-slate-700 hover:text-white'
    )

  // Format tag display with optional count
  const formatTagDisplay = (tag: string, count?: number) => {
    if (count !== undefined && tagCounts) {
      return `${tag} (${count})`
    }
    return tag
  }

  // Handle tag click
  const handleTagClick = (tag: string | null) => {
    // Always call onTagSelect, even if same tag
    onTagSelect(tag)
  }

  return (
    <nav
      className={containerClasses}
      aria-label="Filter posts by tag"
      role="navigation"
    >
      {/* All button */}
      <button
        className={getButtonClasses(selectedTag === null)}
        onClick={() => handleTagClick(null)}
        aria-pressed={selectedTag === null}
      >
        {formatTagDisplay('All', totalCount)}
      </button>

      {/* Tag buttons */}
      {displayTags.map((tag) => (
        <button
          key={tag}
          className={getButtonClasses(selectedTag === tag)}
          onClick={() => handleTagClick(tag)}
          aria-pressed={selectedTag === tag}
        >
          {formatTagDisplay(tag, tagCounts?.[tag])}
        </button>
      ))}
    </nav>
  )
}
