'use client'

import { useState, useEffect, useMemo } from 'react'
import { SkillBox } from './SkillBox'
import { LayerSection } from './LayerSection'
import { BlogPostsPillar } from './BlogPostsPillar'
import { BlogPostPreview } from './BlogPostPreview'
import { MobileBlogPosts } from './MobileBlogPosts'
import { StackDiagramSkeleton } from './StackDiagramSkeleton'
import { getStackData, getHighlightedBoxes } from './stack-data'
import type { StackData, BoxData, ProjectData } from './types'
import type { BlogPost } from '@/lib/types/blog'

const ROTATION_INTERVAL_MS = 4000
const MOBILE_BREAKPOINT = 768 // md breakpoint

export interface StackDiagramProps {
  /** All blog posts for the pillar filtering */
  allPosts?: BlogPost[]
}

/**
 * Main stack diagram component with auto-rotating project selection.
 * Displays projects at the top, layers of skill boxes, and side pillars for blog posts and details.
 */
export function StackDiagram({ allPosts = [] }: StackDiagramProps) {
  const [data, setData] = useState<StackData | null>(null)
  const [selectedProject, setSelectedProject] = useState<string | null>(null)
  const [highlightedBoxes, setHighlightedBoxes] = useState<string[]>([])
  const [isAutoRotating, setIsAutoRotating] = useState(true)
  const [selectedSkill, setSelectedSkill] = useState<BoxData | null>(null)
  const [selectedPost, setSelectedPost] = useState<BlogPost | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  // Get the current project object
  const currentProject: ProjectData | null = useMemo(() => {
    if (!data || !selectedProject) return null
    return data.projects.find((p) => p.id === selectedProject) ?? null
  }, [data, selectedProject])

  // Determine what to show in blog pillar: skill takes priority, then project
  const pillarLabel = selectedSkill?.label ?? currentProject?.label ?? null
  const pillarTags = selectedSkill?.tags ?? currentProject?.tags ?? []

  // Determine skill details: skill popup takes priority, then project details
  const skillDetails = selectedSkill?.popup ?? currentProject?.details ?? []

  // Detect mobile viewport for compact layout
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT)
    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  // Load data on mount
  useEffect(() => {
    async function loadData() {
      const stackData = await getStackData()
      setData(stackData)
      if (stackData.projects.length > 0) {
        setSelectedProject(stackData.projects[0].id)
      }
    }
    loadData()
  }, [])

  // Update highlighted boxes when selection changes
  useEffect(() => {
    if (!selectedProject) return

    async function updateHighlights() {
      const highlights = await getHighlightedBoxes(selectedProject!)
      setHighlightedBoxes(highlights)
    }
    updateHighlights()
  }, [selectedProject])

  // Auto-rotate through projects
  useEffect(() => {
    if (!isAutoRotating || !data) return

    const projectIds = data.projects.map((p) => p.id)

    const interval = setInterval(() => {
      setSelectedProject((prev) => {
        if (!prev) return projectIds[0]
        const currentIndex = projectIds.indexOf(prev)
        return projectIds[(currentIndex + 1) % projectIds.length]
      })
    }, ROTATION_INTERVAL_MS)

    return () => clearInterval(interval)
  }, [isAutoRotating, data])

  const handleProjectClick = (projectId: string) => {
    setIsAutoRotating(false)
    setSelectedProject(projectId)
    setSelectedSkill(null) // Clear skill selection when project changes
    setSelectedPost(null) // Clear post selection
  }

  const handleSkillClick = (box: BoxData) => {
    setIsAutoRotating(false) // Stop auto-rotation when user interacts
    // Toggle selection - clicking same box deselects it
    if (selectedSkill?.id === box.id) {
      setSelectedSkill(null)
    } else {
      setSelectedSkill(box)
    }
    setSelectedPost(null) // Clear post selection when skill changes
  }

  const handlePostSelect = (post: BlogPost) => {
    setSelectedPost(post)
  }

  if (!data) {
    return <StackDiagramSkeleton />
  }

  // Layout: pillars anchored to center content edges
  // Desktop: Center is 800px, left pillar 224px (w-56), right pillar 384px (w-96)
  // Mobile: Simple stacked layout without pillars
  return (
    <div className="relative w-full" data-testid="stack-diagram">
      <div className="relative">
        {/* Center - Main stack diagram */}
        {/* Desktop: fixed width centered, Mobile: full width with padding */}
        <div className="w-full md:w-[800px] mx-auto px-4 md:px-0">
          {/* Top section - Projects */}
          {/* Mobile: horizontal scroll row with compact pills */}
          {/* Desktop: centered with full boxes */}
          <div className="pt-6 md:pt-8 px-2 md:px-8">
            {isMobile ? (
              <div className="flex items-center gap-2">
                <h2 className="text-xs shrink-0 w-16 text-gray-400">
                  Projects
                </h2>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {data.projects.map((project) => (
                    <SkillBox
                      key={project.id}
                      label={project.label}
                      variant="domain"
                      size="compact"
                      isSelected={
                        !selectedSkill && selectedProject === project.id
                      }
                      isHighlighted={
                        !selectedSkill && selectedProject === project.id
                      }
                      onClick={() => handleProjectClick(project.id)}
                    />
                  ))}
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <h2 className="text-lg font-light text-gray-300 tracking-wide mb-4">
                  My Projects
                </h2>
                <div className="flex flex-wrap gap-3 justify-center">
                  {data.projects.map((project) => (
                    <SkillBox
                      key={project.id}
                      label={project.label}
                      tagline={project.tagline}
                      variant="domain"
                      isSelected={
                        !selectedSkill && selectedProject === project.id
                      }
                      isHighlighted={
                        !selectedSkill && selectedProject === project.id
                      }
                      onClick={() => handleProjectClick(project.id)}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Bottom section - Tech layers */}
          {/* Mobile: horizontal scroll rows with compact pills */}
          {/* Desktop: stacked layout with full boxes */}
          <div className="px-2 md:px-8 py-4 md:py-8 flex flex-col gap-3 md:gap-12">
            {data.layers.map((layer) => (
              <LayerSection
                key={layer.id}
                label={layer.label}
                layout={isMobile ? 'horizontal' : 'stacked'}
              >
                {layer.boxes.map((box) => (
                  <SkillBox
                    key={box.id}
                    label={box.label}
                    size={isMobile ? 'compact' : 'default'}
                    isHighlighted={
                      selectedSkill
                        ? selectedSkill.id === box.id
                        : highlightedBoxes.includes(box.id)
                    }
                    isSelected={selectedSkill?.id === box.id}
                    onClick={() => handleSkillClick(box)}
                  />
                ))}
              </LayerSection>
            ))}
          </div>
        </div>

        {/* Left pillar - right-aligned text, aligned with domain boxes */}
        {/* Hidden on mobile */}
        <div
          className="hidden lg:block absolute w-56 text-right"
          style={{ right: 'calc(50% + 400px + 16px)', top: '4.5rem' }}
        >
          <div className="pl-4">
            <BlogPostsPillar
              selectedLabel={pillarLabel}
              tags={pillarTags}
              allPosts={allPosts}
              selectedPostId={selectedPost?.id ?? null}
              onPostSelect={handlePostSelect}
            />
          </div>
        </div>

        {/* Right pillar - aligned with domain boxes */}
        {/* Hidden on mobile */}
        <div
          className="hidden lg:block absolute w-96"
          style={{ left: 'calc(50% + 400px + 16px)', top: '4.5rem' }}
        >
          <div className="pr-4">
            <BlogPostPreview post={selectedPost} skillDetails={skillDetails} />
          </div>
        </div>
      </div>

      {/* Mobile blog posts - horizontal scroll, shown only on mobile */}
      {isMobile && pillarTags.length > 0 && (
        <MobileBlogPosts
          tags={pillarTags}
          allPosts={allPosts}
          selectedLabel={pillarLabel}
        />
      )}

      {/* Bottom spacing before CTA */}
      <div className="h-8 md:h-16" />
    </div>
  )
}
