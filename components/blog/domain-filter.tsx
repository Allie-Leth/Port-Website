'use client'

import React, { useState } from 'react'
import { cn } from '@/lib/utils'
import { TechnicalDomain } from '@/lib/types/blog'

type DomainFilterVariant = 'sidebar' | 'chips' | 'dropdown'

interface DomainFilterProps {
  selectedDomain: TechnicalDomain | null
  onDomainSelect: (domain: TechnicalDomain | null) => void
  domainCounts?: Record<TechnicalDomain, number>
  totalCount?: number
  className?: string
  /**
   * Layout variant:
   * - 'sidebar': Vertical stack with descriptions (desktop)
   * - 'chips': Horizontal scrollable chips
   * - 'dropdown': Collapsible dropdown button (mobile)
   */
  variant?: DomainFilterVariant
}

// Descriptions for each domain
const domainDescriptions: Record<TechnicalDomain, string> = {
  Firmware: 'Embedded systems & hardware',
  DevOps: 'Infrastructure & automation',
  Security: 'DevSecOps & compliance',
  'Full-Stack': 'End-to-end applications',
  Projects: 'Completed projects & demos',
}

/**
 * Technical domain filter component for filtering blog posts.
 * Supports three variants:
 * - 'sidebar': Vertical stack with descriptions (desktop)
 * - 'chips': Horizontal scrollable chips
 * - 'dropdown': Collapsible dropdown button (mobile)
 */
export function DomainFilter({
  selectedDomain,
  onDomainSelect,
  domainCounts,
  totalCount,
  className,
  variant = 'sidebar',
}: DomainFilterProps) {
  const domains: TechnicalDomain[] = [
    'Firmware',
    'DevOps',
    'Security',
    'Full-Stack',
    'Projects',
  ]

  // Sidebar variant - vertical list with descriptions
  if (variant === 'sidebar') {
    return (
      <DomainFilterSidebar
        domains={domains}
        selectedDomain={selectedDomain}
        onDomainSelect={onDomainSelect}
        domainCounts={domainCounts}
        totalCount={totalCount}
        className={className}
      />
    )
  }

  // Dropdown variant - collapsible button for mobile
  if (variant === 'dropdown') {
    return (
      <DomainFilterDropdown
        domains={domains}
        selectedDomain={selectedDomain}
        onDomainSelect={onDomainSelect}
        domainCounts={domainCounts}
        totalCount={totalCount}
        className={className}
      />
    )
  }

  // Chips variant - horizontal scrollable
  return (
    <DomainFilterChips
      domains={domains}
      selectedDomain={selectedDomain}
      onDomainSelect={onDomainSelect}
      domainCounts={domainCounts}
      totalCount={totalCount}
      className={className}
    />
  )
}

/**
 * Sidebar variant - vertical list with full descriptions
 */
function DomainFilterSidebar({
  domains,
  selectedDomain,
  onDomainSelect,
  domainCounts,
  totalCount,
  className,
}: {
  domains: TechnicalDomain[]
  selectedDomain: TechnicalDomain | null
  onDomainSelect: (domain: TechnicalDomain | null) => void
  domainCounts?: Record<TechnicalDomain, number>
  totalCount?: number
  className?: string
}) {
  const getButtonClasses = (isActive: boolean) =>
    cn(
      'w-full text-left px-4 py-3 rounded-lg transition-all group',
      'hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
      isActive
        ? 'bg-blue-500/20 border-blue-500 border text-blue-300'
        : 'bg-slate-800/50 border-slate-700 border text-gray-300 hover:bg-slate-800 hover:border-slate-600'
    )

  return (
    <nav
      className={cn('space-y-3', className)}
      aria-label="Filter posts by technical domain"
      role="navigation"
    >
      <h3 className="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-4">
        Technical Domains
      </h3>

      <button
        className={getButtonClasses(selectedDomain === null)}
        onClick={() => onDomainSelect(null)}
        aria-pressed={selectedDomain === null}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">All Posts</div>
            <div className="text-xs text-gray-500">Everything</div>
          </div>
          {totalCount !== undefined && (
            <span className="text-sm text-gray-400">{totalCount}</span>
          )}
        </div>
      </button>

      {domains.map((domain) => {
        const count = domainCounts?.[domain]
        const hasContent = !count || count > 0

        return (
          <button
            key={domain}
            className={cn(
              getButtonClasses(selectedDomain === domain),
              !hasContent && 'opacity-50 cursor-not-allowed'
            )}
            onClick={() => hasContent && onDomainSelect(domain)}
            aria-pressed={selectedDomain === domain}
            disabled={!hasContent}
          >
            <div className="flex items-center justify-between">
              <div>
                <div className="font-medium">{domain}</div>
                <div className="text-xs text-gray-500">
                  {domainDescriptions[domain]}
                </div>
              </div>
              {count !== undefined && (
                <span className="text-sm text-gray-400">{count}</span>
              )}
            </div>
          </button>
        )
      })}
    </nav>
  )
}

/**
 * Chips variant - horizontal scrollable filter chips for mobile
 */
function DomainFilterChips({
  domains,
  selectedDomain,
  onDomainSelect,
  domainCounts,
  totalCount,
  className,
}: {
  domains: TechnicalDomain[]
  selectedDomain: TechnicalDomain | null
  onDomainSelect: (domain: TechnicalDomain | null) => void
  domainCounts?: Record<TechnicalDomain, number>
  totalCount?: number
  className?: string
}) {
  const getChipClasses = (isActive: boolean, hasContent: boolean = true) =>
    cn(
      'whitespace-nowrap px-3 py-2 rounded-full text-sm font-medium',
      'border transition-all shrink-0',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-slate-900',
      isActive
        ? 'bg-blue-500/20 border-blue-500 text-blue-300'
        : 'bg-slate-800/50 border-slate-700 text-gray-300 hover:bg-slate-800 hover:border-slate-600',
      !hasContent && 'opacity-50 cursor-not-allowed'
    )

  return (
    <nav
      className={cn('overflow-x-auto pb-2 -mb-2', className)}
      aria-label="Filter posts by technical domain"
      role="navigation"
    >
      <div className="flex gap-2">
        {/* All posts chip */}
        <button
          className={getChipClasses(selectedDomain === null)}
          onClick={() => onDomainSelect(null)}
          aria-pressed={selectedDomain === null}
        >
          All{totalCount !== undefined && ` (${totalCount})`}
        </button>

        {/* Domain chips */}
        {domains.map((domain) => {
          const count = domainCounts?.[domain]
          const hasContent = !count || count > 0

          return (
            <button
              key={domain}
              className={getChipClasses(selectedDomain === domain, hasContent)}
              onClick={() => hasContent && onDomainSelect(domain)}
              aria-pressed={selectedDomain === domain}
              disabled={!hasContent}
            >
              {domain}
              {count !== undefined && ` (${count})`}
            </button>
          )
        })}
      </div>
    </nav>
  )
}

/**
 * Dropdown variant - collapsible filter for mobile
 */
function DomainFilterDropdown({
  domains,
  selectedDomain,
  onDomainSelect,
  domainCounts,
  totalCount,
  className,
}: {
  domains: TechnicalDomain[]
  selectedDomain: TechnicalDomain | null
  onDomainSelect: (domain: TechnicalDomain | null) => void
  domainCounts?: Record<TechnicalDomain, number>
  totalCount?: number
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)

  const getOptionClasses = (isActive: boolean, hasContent: boolean = true) =>
    cn(
      'w-full text-left px-4 py-3 transition-colors',
      'focus:outline-none focus:bg-slate-700',
      isActive
        ? 'bg-blue-500/20 text-blue-300'
        : 'text-gray-300 hover:bg-slate-700',
      !hasContent && 'opacity-50 cursor-not-allowed'
    )

  const handleSelect = (domain: TechnicalDomain | null) => {
    onDomainSelect(domain)
    setIsOpen(false)
  }

  const selectedLabel = selectedDomain ?? 'All Posts'
  const selectedCount = selectedDomain
    ? domainCounts?.[selectedDomain]
    : totalCount

  return (
    <div className={cn('relative', className)}>
      {/* Trigger button */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className={cn(
          'w-full flex items-center justify-between gap-2',
          'px-4 py-3 rounded-lg',
          'bg-slate-800/50 border border-slate-700',
          'text-gray-300 hover:bg-slate-800 hover:border-slate-600',
          'focus:outline-none focus:ring-2 focus:ring-blue-500',
          'transition-all'
        )}
        aria-expanded={isOpen}
        aria-haspopup="listbox"
      >
        <span className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Filter:</span>
          <span className="font-medium text-white">{selectedLabel}</span>
          {selectedCount !== undefined && (
            <span className="text-sm text-gray-400">({selectedCount})</span>
          )}
        </span>
        <svg
          className={cn(
            'w-4 h-4 text-gray-400 transition-transform',
            isOpen && 'rotate-180'
          )}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {/* Dropdown panel */}
      {isOpen && (
        <nav
          className={cn(
            'absolute z-20 mt-2 w-full',
            'bg-slate-800 border border-slate-700 rounded-lg',
            'shadow-lg shadow-black/20',
            'overflow-hidden'
          )}
          role="listbox"
          aria-label="Filter posts by technical domain"
        >
          {/* All posts option */}
          <button
            className={getOptionClasses(selectedDomain === null)}
            onClick={() => handleSelect(null)}
            role="option"
            aria-selected={selectedDomain === null}
          >
            <div className="flex items-center justify-between">
              <span>All Posts</span>
              {totalCount !== undefined && (
                <span className="text-sm text-gray-400">{totalCount}</span>
              )}
            </div>
          </button>

          {/* Domain options */}
          {domains.map((domain) => {
            const count = domainCounts?.[domain]
            const hasContent = !count || count > 0

            return (
              <button
                key={domain}
                className={getOptionClasses(
                  selectedDomain === domain,
                  hasContent
                )}
                onClick={() => hasContent && handleSelect(domain)}
                role="option"
                aria-selected={selectedDomain === domain}
                disabled={!hasContent}
              >
                <div className="flex items-center justify-between">
                  <span>{domain}</span>
                  {count !== undefined && (
                    <span className="text-sm text-gray-400">{count}</span>
                  )}
                </div>
              </button>
            )
          })}
        </nav>
      )}
    </div>
  )
}
