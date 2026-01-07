/**
 * Individual skill/technology box within a layer
 */
export interface BoxData {
  id: string
  label: string
  popup?: string[]
  tags?: string[]
}

/**
 * A horizontal layer containing related technologies
 */
export interface LayerData {
  id: string
  label: string
  boxes: BoxData[]
}

/**
 * A project that highlights specific technologies across layers
 */
export interface ProjectData {
  id: string
  label: string
  tagline: string
  highlights: string[]
  /** Blog post tags associated with this project */
  tags?: string[]
  /** Detail items shown when project is selected */
  details?: string[]
  /** Optional URL to project repo or live site */
  url?: string
}

/**
 * Complete stack diagram data structure
 */
export interface StackData {
  projects: ProjectData[]
  layers: LayerData[]
}
