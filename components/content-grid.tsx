import { ContentCard } from './content-card'
import { cn } from '@/lib/utils'

interface ContentItem {
  href: string
  label: string
  title: string
  description: string
  labelColor?: 'blue' | 'green' | string
}

interface ContentGridProps {
  items: ContentItem[]
  className?: string
}

export function ContentGrid({ items, className }: ContentGridProps) {
  return (
    <div className={cn('grid md:grid-cols-2 gap-3 text-left', className)}>
      {items.map((item) => (
        <ContentCard
          key={item.href}
          href={item.href}
          label={item.label}
          title={item.title}
          description={item.description}
          labelColor={item.labelColor}
        />
      ))}
    </div>
  )
}
