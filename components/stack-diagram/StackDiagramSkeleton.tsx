'use client'

/**
 * Skeleton loader for StackDiagram that maintains the same layout dimensions
 * to prevent layout shift during content loading.
 */
export function StackDiagramSkeleton() {
  // Match the actual layout structure for consistent dimensions
  const skeletonDomains = Array(5).fill(null)
  const skeletonLayers = [
    { id: 'frameworks', label: 'Frameworks & Tools', boxCount: 8 },
    { id: 'cicd', label: 'CI/CD & Delivery', boxCount: 4 },
    { id: 'runtime', label: 'Runtime Platforms', boxCount: 4 },
    { id: 'languages', label: 'Languages', boxCount: 5 },
    { id: 'infrastructure', label: 'Infra & Hardware', boxCount: 3 },
  ]

  return (
    <div className="relative w-full">
      <div className="relative">
        {/* Center - Main stack diagram (fixed width, centered) */}
        <div className="w-[800px] mx-auto">
          {/* Top section - Projects/Domains */}
          <div className="pt-8 px-8 flex flex-col items-center">
            <div className="h-7 w-24 bg-slate-700/50 rounded animate-pulse mb-4" />
            <div className="flex flex-wrap gap-3 justify-center">
              {skeletonDomains.map((_, i) => (
                <div
                  key={i}
                  className="rounded-xl border-2 border-slate-600 bg-slate-800/50 px-6 py-4 min-w-[140px]"
                >
                  <div className="h-6 w-16 bg-slate-700/50 rounded animate-pulse mx-auto" />
                  <div className="h-4 w-24 bg-slate-700/30 rounded animate-pulse mx-auto mt-2" />
                </div>
              ))}
            </div>
          </div>

          {/* Bottom section - Tech layers */}
          <div className="px-8 py-8 flex flex-col gap-12">
            {skeletonLayers.map((layer) => (
              <section key={layer.id} className="space-y-4">
                <div className="h-5 w-32 bg-slate-700/30 rounded animate-pulse mx-auto" />
                <div className="flex flex-wrap gap-3 justify-center">
                  {Array(layer.boxCount)
                    .fill(null)
                    .map((_, i) => (
                      <div
                        key={i}
                        className="rounded-lg border border-slate-700/50 bg-slate-800/30 p-4 opacity-40 scale-95"
                      >
                        <div className="h-5 w-16 bg-slate-700/50 rounded animate-pulse" />
                      </div>
                    ))}
                </div>
              </section>
            ))}
          </div>
        </div>

        {/* Left pillar skeleton */}
        <div
          className="absolute w-56 text-right"
          style={{ right: 'calc(50% + 400px + 16px)', top: '4.5rem' }}
        >
          <div className="pl-4">
            <div className="relative h-24 flex flex-col justify-center text-right pr-4">
              <div className="absolute right-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
              <div className="h-6 w-32 bg-slate-700/50 rounded animate-pulse ml-auto" />
              <div className="h-4 w-24 bg-slate-700/30 rounded animate-pulse ml-auto mt-2" />
            </div>
          </div>
        </div>

        {/* Right pillar skeleton */}
        <div
          className="absolute w-96"
          style={{ left: 'calc(50% + 400px + 16px)', top: '4.5rem' }}
        >
          <div className="pr-4">
            <div className="relative h-24 flex flex-col justify-center pl-4">
              <div className="absolute left-0 top-0 bottom-0 w-px bg-gradient-to-b from-transparent via-slate-700 to-transparent" />
              <div className="h-4 w-40 bg-slate-700/30 rounded animate-pulse" />
              <div className="h-4 w-32 bg-slate-700/30 rounded animate-pulse mt-2" />
            </div>
          </div>
        </div>
      </div>

      {/* Bottom spacing before CTA */}
      <div className="h-16" />
    </div>
  )
}
