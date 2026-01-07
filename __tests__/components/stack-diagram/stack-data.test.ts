import {
  getStackData,
  getHighlightedBoxes,
} from '@/components/stack-diagram/stack-data'
import type { StackData } from '@/components/stack-diagram/types'

describe('stack-data', () => {
  let stackData: StackData

  beforeEach(async () => {
    stackData = await getStackData()
  })

  describe('structure', () => {
    it('contains projects array', () => {
      expect(Array.isArray(stackData.projects)).toBe(true)
      expect(stackData.projects.length).toBeGreaterThan(0)
    })

    it('contains layers array', () => {
      expect(Array.isArray(stackData.layers)).toBe(true)
      expect(stackData.layers.length).toBeGreaterThan(0)
    })

    it('each project has required fields', () => {
      stackData.projects.forEach((project) => {
        expect(project).toHaveProperty('id')
        expect(project).toHaveProperty('label')
        expect(project).toHaveProperty('tagline')
        expect(project).toHaveProperty('highlights')
        expect(Array.isArray(project.highlights)).toBe(true)
      })
    })

    it('each layer has required fields', () => {
      stackData.layers.forEach((layer) => {
        expect(layer).toHaveProperty('id')
        expect(layer).toHaveProperty('label')
        expect(layer).toHaveProperty('boxes')
        expect(Array.isArray(layer.boxes)).toBe(true)
      })
    })

    it('each box has required fields', () => {
      stackData.layers.forEach((layer) => {
        layer.boxes.forEach((box) => {
          expect(box).toHaveProperty('id')
          expect(box).toHaveProperty('label')
          // popup is optional
          // tags is optional
        })
      })
    })

    it('box tags field is an array of strings when present', () => {
      stackData.layers.forEach((layer) => {
        layer.boxes.forEach((box) => {
          if (box.tags !== undefined) {
            expect(Array.isArray(box.tags)).toBe(true)
            box.tags.forEach((tag) => {
              expect(typeof tag).toBe('string')
            })
          }
        })
      })
    })
  })

  describe('data integrity', () => {
    it('all highlight references point to valid box IDs', () => {
      const allBoxIds = stackData.layers.flatMap((l) =>
        l.boxes.map((b) => b.id)
      )

      stackData.projects.forEach((project) => {
        project.highlights.forEach((highlightId) => {
          expect(allBoxIds).toContain(highlightId)
        })
      })
    })

    it('all IDs are unique within their scope', () => {
      const projectIds = stackData.projects.map((p) => p.id)
      expect(new Set(projectIds).size).toBe(projectIds.length)

      const layerIds = stackData.layers.map((l) => l.id)
      expect(new Set(layerIds).size).toBe(layerIds.length)

      const boxIds = stackData.layers.flatMap((l) => l.boxes.map((b) => b.id))
      expect(new Set(boxIds).size).toBe(boxIds.length)
    })
  })

  describe('project content', () => {
    it('contains expected projects', () => {
      const projectIds = stackData.projects.map((p) => p.id)

      expect(projectIds).toContain('portfolio')
      expect(projectIds).toContain('infrastructure')
      expect(projectIds).toContain('monitoring')
      expect(projectIds).toContain('gitlab-ce')
      expect(projectIds).toContain('antstack')
    })

    it('antstack project highlights embedded framework boxes', async () => {
      const antstackHighlights = await getHighlightedBoxes('antstack')

      expect(antstackHighlights).toContain('freertos')
      expect(antstackHighlights).toContain('esp-idf')
      expect(antstackHighlights).toContain('platformio')
    })
  })

  describe('embedded frameworks', () => {
    it('contains individual embedded framework boxes instead of generic firmware', () => {
      const allBoxIds = stackData.layers.flatMap((l) =>
        l.boxes.map((b) => b.id)
      )

      // Should have individual frameworks
      expect(allBoxIds).toContain('freertos')
      expect(allBoxIds).toContain('esp-idf')
      expect(allBoxIds).toContain('platformio')

      // Should not have generic firmware box
      expect(allBoxIds).not.toContain('firmware')
    })
  })

  describe('getHighlightedBoxes', () => {
    it('returns array for valid project', async () => {
      const highlights = await getHighlightedBoxes('portfolio')
      expect(Array.isArray(highlights)).toBe(true)
    })

    it('returns empty array for invalid project', async () => {
      const highlights = await getHighlightedBoxes('nonexistent')
      expect(highlights).toEqual([])
    })

    it('returned IDs exist in box data', async () => {
      const allBoxIds = stackData.layers.flatMap((l) =>
        l.boxes.map((b) => b.id)
      )

      for (const project of stackData.projects) {
        const highlights = await getHighlightedBoxes(project.id)
        highlights.forEach((id) => {
          expect(allBoxIds).toContain(id)
        })
      }
    })
  })
})
