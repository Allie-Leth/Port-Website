import { Breadcrumbs } from './breadcrumbs'
import { ContactDropdown } from './contact-dropdown'
import { cn } from '@/lib/utils'

interface MinimalHeaderProps {
  className?: string
}

export function MinimalHeader({ className }: MinimalHeaderProps) {
  return (
    <header
      className={cn(
        'fixed top-0 left-0 right-0 z-50',
        'p-4 md:p-8',
        // No background - completely transparent
        className
      )}
    >
      <div className="w-full flex justify-between items-start">
        <Breadcrumbs />
        <ContactDropdown />
      </div>
    </header>
  )
}
