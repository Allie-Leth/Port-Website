import Link from 'next/link'
import { cn } from '@/lib/utils'

interface ContactButtonProps {
  className?: string
}

export function ContactDropdown({ className }: ContactButtonProps) {
  return (
    <Link
      href="/contact"
      className={cn(
        'inline-flex items-center',
        'px-5 py-2.5 rounded-full',
        'bg-slate-900/50',
        'border border-slate-800/50',
        'text-sm text-slate-400',
        'hover:text-white hover:border-slate-700/50',
        'transition-all duration-200',
        className
      )}
    >
      Contact
    </Link>
  )
}
