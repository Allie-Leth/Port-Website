import {
  BREAKPOINTS,
  setViewportWidth,
  createMatchMedia,
  evaluateMediaQuery,
  resetViewport,
  isMobileViewport,
  isDesktopViewport,
} from './responsive-utils'

describe('responsive-utils', () => {
  afterEach(() => {
    resetViewport()
  })

  describe('BREAKPOINTS', () => {
    it('has mobile breakpoint at 375px', () => {
      expect(BREAKPOINTS.mobile).toBe(375)
    })

    it('has md breakpoint at 768px matching Tailwind', () => {
      expect(BREAKPOINTS.md).toBe(768)
    })

    it('has lg breakpoint at 1024px matching Tailwind', () => {
      expect(BREAKPOINTS.lg).toBe(1024)
    })

    it('has desktop breakpoint at 1280px', () => {
      expect(BREAKPOINTS.desktop).toBe(1280)
    })
  })

  describe('setViewportWidth', () => {
    it('sets window.innerWidth to the specified value', () => {
      setViewportWidth(500)
      expect(window.innerWidth).toBe(500)
    })

    it('sets window.innerHeight to a default value', () => {
      setViewportWidth(500)
      expect(window.innerHeight).toBe(800)
    })

    it('updates matchMedia to respond to the new width', () => {
      setViewportWidth(600)
      expect(window.matchMedia('(min-width: 768px)').matches).toBe(false)

      setViewportWidth(800)
      expect(window.matchMedia('(min-width: 768px)').matches).toBe(true)
    })
  })

  describe('evaluateMediaQuery', () => {
    it('correctly evaluates min-width queries', () => {
      expect(evaluateMediaQuery('(min-width: 768px)', 800)).toBe(true)
      expect(evaluateMediaQuery('(min-width: 768px)', 768)).toBe(true)
      expect(evaluateMediaQuery('(min-width: 768px)', 767)).toBe(false)
    })

    it('correctly evaluates max-width queries', () => {
      expect(evaluateMediaQuery('(max-width: 768px)', 700)).toBe(true)
      expect(evaluateMediaQuery('(max-width: 768px)', 768)).toBe(true)
      expect(evaluateMediaQuery('(max-width: 768px)', 769)).toBe(false)
    })

    it('returns true for unrecognized queries', () => {
      expect(evaluateMediaQuery('(orientation: landscape)', 800)).toBe(true)
    })
  })

  describe('createMatchMedia', () => {
    it('returns a function', () => {
      const matchMedia = createMatchMedia(800)
      expect(typeof matchMedia).toBe('function')
    })

    it('returns MediaQueryList-like object', () => {
      const matchMedia = createMatchMedia(800)
      const result = matchMedia('(min-width: 768px)')

      expect(result).toHaveProperty('matches')
      expect(result).toHaveProperty('media')
      expect(result).toHaveProperty('addEventListener')
      expect(result).toHaveProperty('removeEventListener')
    })

    it('correctly matches queries for the given width', () => {
      const mobileMatchMedia = createMatchMedia(375)
      const desktopMatchMedia = createMatchMedia(1024)

      expect(mobileMatchMedia('(min-width: 768px)').matches).toBe(false)
      expect(desktopMatchMedia('(min-width: 768px)').matches).toBe(true)
    })
  })

  describe('resetViewport', () => {
    it('resets viewport to desktop width', () => {
      setViewportWidth(375)
      expect(window.innerWidth).toBe(375)

      resetViewport()
      expect(window.innerWidth).toBe(BREAKPOINTS.desktop)
    })
  })

  describe('isMobileViewport', () => {
    it('returns true when viewport is below md breakpoint', () => {
      setViewportWidth(767)
      expect(isMobileViewport()).toBe(true)
    })

    it('returns false when viewport is at or above md breakpoint', () => {
      setViewportWidth(768)
      expect(isMobileViewport()).toBe(false)
    })
  })

  describe('isDesktopViewport', () => {
    it('returns false when viewport is below md breakpoint', () => {
      setViewportWidth(767)
      expect(isDesktopViewport()).toBe(false)
    })

    it('returns true when viewport is at or above md breakpoint', () => {
      setViewportWidth(768)
      expect(isDesktopViewport()).toBe(true)
    })
  })
})
