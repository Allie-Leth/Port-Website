import { Taglines } from './taglines'
import { cn } from '@/lib/utils'

interface HeroSectionProps {
  name: string
  title: string
  taglines: string[]
  className?: string
}

export function HeroSection({
  name,
  title,
  taglines,
  className,
}: HeroSectionProps) {
  return (
    <section className={cn('text-center', className)}>
      <h1 className="text-3xl sm:text-5xl md:text-7xl font-light mb-3 md:mb-4 tracking-wide">
        {name}
      </h1>
      <p className="text-base md:text-xl text-gray-400 mb-6 md:mb-8">{title}</p>

      {/* Rotating capability display */}
      <div className="h-10 md:h-12 mb-8 md:mb-12 flex items-center justify-center">
        <Taglines
          taglines={taglines}
          interval={3000}
          className="text-sm md:text-lg text-gray-300"
        />
      </div>
    </section>
  )
}
