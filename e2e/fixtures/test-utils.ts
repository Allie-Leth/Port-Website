import { test as base, expect, Page } from '@playwright/test'

/**
 * Extended test fixture with common utilities for E2E tests
 */
export const test = base.extend<{
  waitForHydration: (page: Page) => Promise<void>
}>({
  waitForHydration: async ({}, use) => {
    const waitForHydration = async (page: Page) => {
      await page.waitForLoadState('networkidle')
    }
    await use(waitForHydration)
  },
})

export { expect }

/**
 * Navigate to a path and wait for the page to be ready
 */
export async function navigateAndWait(page: Page, path: string) {
  await page.goto(path)
  await page.waitForLoadState('networkidle')
}

/**
 * Viewport breakpoints matching Tailwind CSS defaults
 */
export const BREAKPOINTS = {
  mobile: 375,
  tablet: 640,
  md: 768,
  lg: 1024,
  desktop: 1280,
  wide: 1536,
} as const

/**
 * Set mobile viewport (iPhone-like)
 */
export async function setMobileViewport(page: Page) {
  await page.setViewportSize({ width: BREAKPOINTS.mobile, height: 667 })
}

/**
 * Set tablet viewport
 */
export async function setTabletViewport(page: Page) {
  await page.setViewportSize({ width: BREAKPOINTS.tablet, height: 1024 })
}

/**
 * Set desktop viewport
 */
export async function setDesktopViewport(page: Page) {
  await page.setViewportSize({ width: BREAKPOINTS.desktop, height: 800 })
}

/**
 * Check if current viewport is mobile (below md breakpoint)
 */
export function isMobileBreakpoint(width: number): boolean {
  return width < BREAKPOINTS.md
}

/**
 * Wait for animations to complete (useful for rotating elements)
 */
export async function waitForAnimations(page: Page, timeout = 500) {
  await page.waitForTimeout(timeout)
}
