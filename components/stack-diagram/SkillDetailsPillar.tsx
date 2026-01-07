'use client'

export interface SkillDetailsPillarProps {
  /** Label of the selected skill box */
  selectedLabel: string | null
  /** Detail items to display (from box.popup) */
  details: string[]
}

/**
 * Inline column displaying skill details for a selected skill.
 * Shows detail items when a skill is selected, or a prompt when nothing selected.
 */
export function SkillDetailsPillar({
  selectedLabel,
  details,
}: SkillDetailsPillarProps) {
  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="mb-4">
        <h2 className="text-lg font-medium text-white">
          {selectedLabel ? selectedLabel : 'Skill Details'}
        </h2>
        <p className="text-sm text-gray-400">
          {selectedLabel
            ? 'Technologies and tools'
            : 'Click a skill to see details'}
        </p>
      </div>

      {/* Details list */}
      <div className="flex-1">
        {details.length > 0 ? (
          <ul className="space-y-2">
            {details.map((detail, index) => (
              <li
                key={index}
                className="text-gray-300 text-sm flex items-center gap-2"
              >
                <span className="w-1.5 h-1.5 bg-blue-400 rounded-full flex-shrink-0" />
                {detail}
              </li>
            ))}
          </ul>
        ) : selectedLabel ? (
          <p className="text-gray-500 text-sm py-4">No additional details.</p>
        ) : (
          <p className="text-gray-500 text-sm py-4">
            Select a skill to see its details.
          </p>
        )}
      </div>
    </div>
  )
}
