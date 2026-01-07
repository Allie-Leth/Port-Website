import { cn } from '@/lib/utils'

interface LayerSectionProps {
  /** Label displayed as the section heading */
  label: string
  /** Child elements (typically SkillBox components) */
  children: React.ReactNode
  /** Layout variant - stacked (default) or horizontal for mobile scroll */
  layout?: 'stacked' | 'horizontal'
  /** Additional CSS classes */
  className?: string
}

/**
 * A labeled section containing a row of skill boxes.
 * Server Component - no client-side interactivity needed.
 *
 * Layout variants:
 * - stacked: Label above, boxes centered and wrapping (default)
 * - horizontal: Label on left, boxes scroll horizontally on mobile
 */
export function LayerSection({
  label,
  children,
  layout = 'stacked',
  className,
}: LayerSectionProps) {
  // Horizontal layout: label on left, boxes scroll horizontally on mobile
  if (layout === 'horizontal') {
    return (
      <section
        className={cn(
          'flex items-center gap-2 md:block md:space-y-4',
          className
        )}
      >
        <h3 className="text-xs shrink-0 w-16 text-gray-400 md:text-sm md:font-light md:tracking-wide md:text-center md:w-auto">
          {label}
        </h3>
        <div className="flex gap-1.5 overflow-x-auto pb-1 md:flex-wrap md:gap-3 md:justify-center md:overflow-visible md:pb-0">
          {children}
        </div>
      </section>
    )
  }

  // Default stacked layout
  return (
    <section className={cn('space-y-3 md:space-y-4', className)}>
      <h3 className="text-xs md:text-sm font-light text-gray-400 tracking-wide text-center">
        {label}
      </h3>
      <div className="flex flex-wrap gap-2 md:gap-3 justify-center">
        {children}
      </div>
    </section>
  )
}
