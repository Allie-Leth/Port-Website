'use client'

import { forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface SkillBoxProps {
  /** Display text for the box */
  label: string
  /** Optional subtitle (typically used for domain boxes) */
  tagline?: string
  /** Whether this box is highlighted by domain selection */
  isHighlighted?: boolean
  /** Whether this box is the currently selected domain */
  isSelected?: boolean
  /** Visual variant - domain uses button, skill uses div */
  variant?: 'domain' | 'skill'
  /** Size variant - compact for mobile horizontal scroll */
  size?: 'default' | 'compact'
  /** Click handler */
  onClick?: () => void
  /** Additional class names */
  className?: string
  /** Data test id */
  'data-testid'?: string
}

/**
 * Interactive box component for stack diagram.
 * Domain variant renders as button with aria-pressed.
 * Skill variant renders as div with button role.
 */
export const SkillBox = forwardRef<HTMLElement, SkillBoxProps>(
  (
    {
      label,
      tagline,
      isHighlighted = false,
      isSelected = false,
      variant = 'skill',
      size = 'default',
      onClick,
      className,
      'data-testid': dataTestId,
    },
    ref
  ) => {
    // Compact pill variant for mobile horizontal scroll
    if (size === 'compact') {
      const compactClasses = cn(
        'px-2 py-1 rounded-full text-xs whitespace-nowrap shrink-0',
        'border transition-all duration-300',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1 focus:ring-offset-slate-900',
        variant === 'domain'
          ? isSelected
            ? 'bg-amber-500/20 border-amber-400 text-white'
            : 'bg-slate-800/50 border-slate-600 text-gray-300 hover:border-amber-400/50'
          : isHighlighted || isSelected
            ? 'bg-slate-800/50 border-blue-400 text-white opacity-100'
            : 'bg-slate-800/30 border-slate-700/50 text-gray-400 opacity-50',
        className
      )

      if (variant === 'domain') {
        return (
          <button
            ref={ref as React.Ref<HTMLButtonElement>}
            type="button"
            className={compactClasses}
            aria-pressed={isSelected}
            onClick={onClick}
            data-testid={dataTestId}
          >
            {label}
          </button>
        )
      }

      return (
        <div
          ref={ref as React.Ref<HTMLDivElement>}
          role="button"
          tabIndex={0}
          className={compactClasses}
          onClick={onClick}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              onClick?.()
            }
          }}
          data-testid={dataTestId}
        >
          {label}
        </div>
      )
    }
    // Domain variant: bold cards with distinct color
    // Mobile: smaller padding and min-width
    const domainClasses = cn(
      'relative rounded-xl border-2 px-4 py-3 md:px-6 md:py-4 transition-all duration-300',
      'focus:outline-none focus:ring-2 focus:ring-amber-400 focus:ring-offset-2 focus:ring-offset-slate-900',
      'min-w-[100px] md:min-w-[140px] text-center',
      isSelected
        ? 'bg-gradient-to-br from-amber-500/20 to-orange-600/20 border-amber-400 shadow-lg shadow-amber-500/20'
        : 'bg-slate-800/50 border-slate-600 hover:border-amber-400/50 hover:bg-slate-700/50',
      className
    )

    // Skill variant: subtler boxes
    // Mobile: smaller padding
    const skillClasses = cn(
      'relative rounded-lg border p-3 md:p-4 transition-all duration-300',
      'bg-slate-800/30 border-slate-700/50',
      'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-900',
      'cursor-pointer',
      isHighlighted || isSelected
        ? 'opacity-100 scale-100 ring-2 ring-blue-400'
        : 'opacity-40 scale-95',
      className
    )

    const baseClasses = variant === 'domain' ? domainClasses : skillClasses

    const content =
      variant === 'domain' ? (
        <>
          <span className="font-semibold text-base md:text-lg text-white">
            {label}
          </span>
          {tagline && (
            <span className="block text-xs md:text-sm text-gray-300 mt-1">
              {tagline}
            </span>
          )}
        </>
      ) : (
        <>
          <span className="font-medium text-sm md:text-base text-white">
            {label}
          </span>
          {tagline && (
            <span className="block text-xs text-gray-400 mt-1">{tagline}</span>
          )}
        </>
      )

    // Domain variant: actual button with aria-pressed
    if (variant === 'domain') {
      return (
        <button
          ref={ref as React.Ref<HTMLButtonElement>}
          type="button"
          className={baseClasses}
          aria-pressed={isSelected}
          onClick={onClick}
          data-testid={dataTestId}
        >
          {content}
        </button>
      )
    }

    // Skill variant: div with button role
    return (
      <div
        ref={ref as React.Ref<HTMLDivElement>}
        role="button"
        tabIndex={0}
        className={baseClasses}
        onClick={onClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            onClick?.()
          }
        }}
        data-testid={dataTestId}
      >
        {content}
      </div>
    )
  }
)

SkillBox.displayName = 'SkillBox'
