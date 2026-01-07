import Link from 'next/link'
import { cn } from '@/lib/utils'

type ButtonVariant = 'text' | 'boxed'

interface Button {
  href: string
  label: string
}

interface ButtonBarProps {
  buttons: Button[]
  className?: string
  variant?: ButtonVariant
  justify?: 'center' | 'between' | 'start' | 'end'
}

const buttonStyles: Record<ButtonVariant, string> = {
  text: 'text-gray-400 hover:text-white transition-colors',
  boxed:
    'px-6 py-2 bg-slate-800/70 hover:bg-slate-700/80 text-white rounded-lg font-medium transition-all border border-slate-700/50 hover:border-slate-600 hover:shadow-lg',
}

export function ButtonBar({
  buttons,
  className,
  variant = 'text',
  justify = 'center',
}: ButtonBarProps) {
  const justifyClass = {
    center: 'justify-center',
    between: 'justify-between',
    start: 'justify-start',
    end: 'justify-end',
  }[justify]

  // For special alignment with content grid inner edges
  if (justify === 'between' && buttons.length === 2) {
    return (
      <div
        data-testid="button-bar"
        className={cn('grid grid-cols-2 gap-3 text-sm', className)}
      >
        {/* Mobile: both buttons visible side by side, centered in grid cells */}
        {/* Desktop: aligned to inner edges */}
        <div className="flex justify-center md:justify-end">
          <Link
            href={buttons[0].href}
            className={cn(
              buttonStyles[variant],
              'w-full md:w-auto text-center'
            )}
          >
            {buttons[0].label}
          </Link>
        </div>
        <div className="flex justify-center md:justify-start">
          <Link
            href={buttons[1].href}
            className={cn(
              buttonStyles[variant],
              'w-full md:w-auto text-center'
            )}
          >
            {buttons[1].label}
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div
      data-testid="button-bar"
      className={cn('flex gap-8 text-sm', justifyClass, className)}
    >
      {buttons.map((button) => (
        <Link
          key={button.href}
          href={button.href}
          className={buttonStyles[variant]}
        >
          {button.label}
        </Link>
      ))}
    </div>
  )
}
