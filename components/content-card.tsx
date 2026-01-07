import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ContentCardProps {
  href: string
  label: string
  title: string
  description: string
  labelColor?: 'blue' | 'green' | string
  className?: string
}

export function ContentCard({
  href,
  label,
  title,
  description,
  labelColor = 'blue',
  className,
}: ContentCardProps) {
  const labelColorClass =
    labelColor === 'blue'
      ? 'text-blue-400'
      : labelColor === 'green'
        ? 'text-green-400'
        : 'text-gray-400'

  return (
    <Link
      href={href}
      className={cn(
        'block',
        'rounded-lg border transition-all p-4',
        'bg-slate-800/30 border-slate-700/50',
        'hover:bg-slate-800/50 hover:border-slate-600/50',
        'group',
        className
      )}
      aria-label={title}
    >
      <article>
        <div className={cn('text-xs mb-2 font-mono', labelColorClass)}>
          {label}
        </div>
        <h3 className="text-white font-medium mb-1 group-hover:text-blue-400 transition-colors">
          {title}
        </h3>
        <p className="text-xs text-gray-500">{description}</p>
      </article>
    </Link>
  )
}
