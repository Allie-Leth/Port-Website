/**
 * Factory functions for creating test data
 * Provides consistent patterns for generating test objects
 */

/**
 * Create a sequence of items with incremental IDs
 */
export function createSequence<T>(
  count: number,
  factory: (index: number) => T
): T[] {
  return Array.from({ length: count }, (_, i) => factory(i))
}

/**
 * Create a date string in ISO format
 */
export function createDate(daysFromNow: number = 0): string {
  const date = new Date()
  date.setDate(date.getDate() + daysFromNow)
  return date.toISOString().split('T')[0]
}

/**
 * Create random selection from array
 */
export function randomFrom<T>(items: T[]): T {
  return items[Math.floor(Math.random() * items.length)]
}

/**
 * Create test IDs consistently
 */
export function createTestId(prefix: string, index: number): string {
  return `${prefix}-${index.toString().padStart(3, '0')}`
}

/**
 * Create slug from title
 */
export function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/--+/g, '-')
    .trim()
}

/**
 * Create excerpt from content
 */
export function createExcerpt(
  content: string,
  maxLength: number = 150
): string {
  const cleaned = content.replace(/^#.*$/gm, '').replace(/\n+/g, ' ').trim()
  if (cleaned.length <= maxLength) return cleaned
  return cleaned.substring(0, maxLength).trim() + '...'
}

/**
 * Calculate read time from content
 */
export function calculateReadTime(
  content: string,
  wordsPerMinute: number = 200
): number {
  const words = content.split(/\s+/).length
  return Math.ceil(words / wordsPerMinute)
}
