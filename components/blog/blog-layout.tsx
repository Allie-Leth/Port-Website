'use client'

import React, { useState, useMemo, useEffect } from 'react'
import { BlogPost, TechnicalDomain } from '@/lib/types/blog'
import { FeaturedBlogCard } from './featured-blog-card'
import { BlogGrid } from './blog-grid'
import { DomainFilter } from './domain-filter'
import { cn } from '@/lib/utils'

interface BlogLayoutProps {
  posts: BlogPost[] | null | undefined
  loading?: boolean
  layout?: 'sidebar' | 'stacked'
  showFeatured?: boolean
  showDomainFilter?: boolean
  /** Initial domain filter from URL query param */
  initialDomain?: TechnicalDomain | null
  gridColumns?: {
    sm?: number
    md?: number
    lg?: number
  }
  emptyMessage?: string
  className?: string
}

/**
 * Complete blog layout with featured post, domain filtering, and grid
 */
export function BlogLayout({
  posts,
  loading = false,
  layout = 'sidebar',
  showFeatured = true,
  showDomainFilter = true,
  initialDomain = null,
  gridColumns,
  emptyMessage,
  className,
}: BlogLayoutProps) {
  const [selectedDomain, setSelectedDomain] = useState<TechnicalDomain | null>(
    initialDomain
  )

  // Sync state when initialDomain prop changes (e.g., from URL query param)
  useEffect(() => {
    setSelectedDomain(initialDomain)
  }, [initialDomain])

  // Sort posts by date (newest first)
  const sortedPosts = useMemo(() => {
    const safePosts = posts || []
    return [...safePosts].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    )
  }, [posts])

  // Get featured post (first featured post found)
  const featuredPost = useMemo(() => {
    if (!showFeatured) return null
    return sortedPosts.find((post) => post.featured) || null
  }, [sortedPosts, showFeatured])

  // Get posts for grid (exclude featured if showing featured section)
  const gridPosts = useMemo(() => {
    if (showFeatured && featuredPost) {
      // Only exclude the featured post if we're showing it separately
      return sortedPosts.filter((post) => post.id !== featuredPost.id)
    }
    return sortedPosts
  }, [sortedPosts, showFeatured, featuredPost])

  // Filter posts by selected domain
  const filteredPosts = useMemo(() => {
    if (!selectedDomain) return gridPosts
    return gridPosts.filter((post) => post.domain === selectedDomain)
  }, [gridPosts, selectedDomain])

  // Count posts by domain
  const { domainCounts, totalCount } = useMemo(() => {
    const counts: Partial<Record<TechnicalDomain, number>> = {}

    // Count domains from grid posts only (not featured)
    gridPosts.forEach((post) => {
      counts[post.domain] = (counts[post.domain] || 0) + 1
    })

    return {
      domainCounts: counts as Record<TechnicalDomain, number>,
      totalCount: gridPosts.length,
    }
  }, [gridPosts])

  // Layout classes
  const containerClasses = cn('min-h-screen', className)

  const mainClasses = cn(
    'container mx-auto px-4 py-8',
    layout === 'sidebar' ? 'max-w-7xl' : 'max-w-5xl'
  )

  // Responsive layout classes:
  // - Mobile: always stack vertically
  // - Desktop: flex row for sidebar, flex col for stacked
  const layoutClasses = cn(
    'flex flex-col',
    layout === 'sidebar' ? 'md:flex-row md:gap-8 gap-6' : 'space-y-8'
  )

  return (
    <div className={containerClasses}>
      <main className={mainClasses} role="main">
        {/* Page Title - centered on mobile to avoid breadcrumb overlap */}
        <h1 className="text-2xl md:text-4xl font-bold mb-6 md:mb-8 text-white text-center md:text-left">
          Blog
        </h1>

        {/* Featured Post Section */}
        {showFeatured && featuredPost && (
          <section className="mb-8 md:mb-12">
            <FeaturedBlogCard post={featuredPost} priority={true} />
          </section>
        )}

        {/* Content Layout */}
        <div className={layoutClasses}>
          {/* Mobile: Collapsible dropdown filter (shown first on mobile) */}
          {showDomainFilter && layout === 'sidebar' && (
            <section className="md:hidden mb-4" data-testid="mobile-filter">
              <DomainFilter
                variant="dropdown"
                selectedDomain={selectedDomain}
                onDomainSelect={setSelectedDomain}
                domainCounts={domainCounts}
                totalCount={totalCount}
              />
            </section>
          )}

          {/* Desktop: Sidebar Domain Filter */}
          {showDomainFilter && layout === 'sidebar' && (
            <aside
              className="hidden md:block w-72 flex-shrink-0"
              data-testid="desktop-filter"
            >
              <div className="sticky top-4">
                <DomainFilter
                  variant="sidebar"
                  selectedDomain={selectedDomain}
                  onDomainSelect={setSelectedDomain}
                  domainCounts={domainCounts}
                  totalCount={totalCount}
                />
              </div>
            </aside>
          )}

          {/* Stacked layout: chips variant */}
          {showDomainFilter && layout === 'stacked' && (
            <section>
              <DomainFilter
                variant="chips"
                selectedDomain={selectedDomain}
                onDomainSelect={setSelectedDomain}
                domainCounts={domainCounts}
                totalCount={totalCount}
              />
            </section>
          )}

          {/* Blog Grid */}
          <section className="flex-1">
            <BlogGrid
              posts={filteredPosts}
              loading={loading}
              columns={gridColumns}
              emptyMessage={emptyMessage}
            />
          </section>
        </div>
      </main>
    </div>
  )
}
