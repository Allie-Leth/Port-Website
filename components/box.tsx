import React from 'react'

type BoxVariant = 'default' | 'primary' | 'secondary'

interface BoxProps {
  children: React.ReactNode
  className?: string
  variant?: BoxVariant
  as?: React.ElementType
  href?: string
  [key: string]: any
}

const variantStyles: Record<BoxVariant, string> = {
  default:
    'bg-slate-800/30 border-slate-700/50 hover:bg-slate-800/50 hover:border-slate-600/50',
  primary:
    'bg-slate-800/50 border-slate-700/60 hover:bg-slate-700/60 hover:border-slate-600/60',
  secondary:
    'bg-slate-900/40 border-slate-700/40 hover:bg-slate-900/60 hover:border-slate-600/40',
}

export const Box: React.FC<BoxProps> = ({
  children,
  className = '',
  variant = 'default',
  as: Component = 'div',
  ...props
}) => {
  const baseClasses = 'rounded-lg border transition-all p-4'
  const variantClasses = variantStyles[variant]
  const combinedClasses = `${baseClasses} ${variantClasses} ${className}`.trim()

  return (
    <Component className={combinedClasses} {...props}>
      {children}
    </Component>
  )
}
