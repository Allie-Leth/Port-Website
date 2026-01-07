'use client' // Need usePathname hook

import { usePathname } from 'next/navigation'
import Link from 'next/link'
import { cn } from '@/lib/utils'

interface BreadcrumbsProps {
  className?: string
}

export function Breadcrumbs({ className }: BreadcrumbsProps) {
  const pathname = usePathname()

  // Build breadcrumb path - always include 'home' after tilde
  const segments =
    pathname === '/'
      ? ['home']
      : ['home', ...pathname.split('/').filter(Boolean)]

  // Create pill-style breadcrumb
  return (
    <nav
      aria-label="Breadcrumb"
      className={cn(
        'inline-flex items-center gap-1',
        'px-5 py-2.5 rounded-full',
        'bg-slate-900/50',
        'border border-slate-800/50',
        'text-sm',
        className
      )}
    >
      {/* Always show tilde as link to hire/portfolio page */}
      <Link
        href="/hire"
        className={cn(
          'text-slate-400 hover:text-white transition-colors',
          pathname === '/hire' && 'text-white'
        )}
      >
        ~
      </Link>

      {/* Show all path segments including home */}
      {segments.map((segment, index) => {
        // First segment is always 'home' which links to root
        const isHome = index === 0
        const href = isHome ? '/' : '/' + segments.slice(1, index + 1).join('/')
        const isLast = index === segments.length - 1
        const isCurrent =
          (isHome && pathname === '/') || (!isHome && pathname === href)

        return (
          <span key={`${href}-${index}`} className="flex items-center gap-1">
            <span className="text-slate-600">/</span>
            {isCurrent ? (
              <span className="text-white">{segment}</span>
            ) : (
              <Link
                href={href}
                className="text-slate-400 hover:text-white transition-colors"
              >
                {segment}
              </Link>
            )}
          </span>
        )
      })}
    </nav>
  )
}
