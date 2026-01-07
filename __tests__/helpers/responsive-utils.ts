/**
 * Viewport testing utilities for responsive component testing.
 * Provides helpers to simulate different screen sizes in Jest/JSDOM.
 */

/**
 * Common breakpoints matching Tailwind CSS defaults
 */
export const BREAKPOINTS = {
  /** Small mobile devices */
  mobile: 375,
  /** Large mobile / small tablet */
  mobileLg: 425,
  /** Tablet */
  tablet: 640,
  /** Tailwind md breakpoint */
  md: 768,
  /** Tailwind lg breakpoint */
  lg: 1024,
  /** Desktop */
  desktop: 1280,
  /** Wide desktop */
  wide: 1536,
} as const

export type Breakpoint = keyof typeof BREAKPOINTS

/**
 * Sets the window.innerWidth and configures matchMedia mock
 * to respond correctly for the given viewport width.
 *
 * @param width - The viewport width in pixels
 *
 * @example
 * ```typescript
 * beforeEach(() => setViewportWidth(BREAKPOINTS.mobile))
 *
 * it('shows mobile layout', () => {
 *   render(<Component />)
 *   expect(screen.getByTestId('mobile-nav')).toBeInTheDocument()
 * })
 * ```
 */
export function setViewportWidth(width: number): void {
  Object.defineProperty(window, 'innerWidth', {
    value: width,
    writable: true,
    configurable: true,
  })

  Object.defineProperty(window, 'innerHeight', {
    value: 800,
    writable: true,
    configurable: true,
  })

  // Update matchMedia to respond correctly for the viewport
  window.matchMedia = createMatchMedia(width)

  // Dispatch resize event for components using resize listeners
  window.dispatchEvent(new Event('resize'))
}

/**
 * Creates a matchMedia mock function that responds correctly
 * based on the provided viewport width.
 *
 * @param width - The viewport width to simulate
 * @returns A matchMedia function that evaluates media queries
 */
export function createMatchMedia(
  width: number
): (query: string) => MediaQueryList {
  return (query: string): MediaQueryList => {
    const matches = evaluateMediaQuery(query, width)

    return {
      matches,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(() => true),
    }
  }
}

/**
 * Evaluates a media query string against a given width.
 * Supports min-width and max-width queries.
 *
 * @param query - CSS media query string
 * @param width - Viewport width to test against
 * @returns Whether the media query matches
 */
export function evaluateMediaQuery(query: string, width: number): boolean {
  // Handle min-width queries
  const minWidthMatch = query.match(/\(min-width:\s*(\d+)px\)/)
  if (minWidthMatch) {
    return width >= parseInt(minWidthMatch[1], 10)
  }

  // Handle max-width queries
  const maxWidthMatch = query.match(/\(max-width:\s*(\d+)px\)/)
  if (maxWidthMatch) {
    return width <= parseInt(maxWidthMatch[1], 10)
  }

  // Default to true for unrecognized queries
  return true
}

/**
 * Resets viewport to desktop default.
 * Useful in afterEach to prevent test pollution.
 */
export function resetViewport(): void {
  setViewportWidth(BREAKPOINTS.desktop)
}

/**
 * Helper to check if current viewport is below the md breakpoint
 */
export function isMobileViewport(): boolean {
  return window.innerWidth < BREAKPOINTS.md
}

/**
 * Helper to check if current viewport is at or above md breakpoint
 */
export function isDesktopViewport(): boolean {
  return window.innerWidth >= BREAKPOINTS.md
}
