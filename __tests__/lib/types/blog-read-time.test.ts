import { calculateReadTime } from '@/lib/types/blog'

describe('calculateReadTime', () => {
  it('calculates read time based on word count', () => {
    // Average reading speed: 200-250 words per minute
    const shortContent = 'word '.repeat(100) // 100 words
    expect(calculateReadTime(shortContent)).toBe(1) // rounds up

    const mediumContent = 'word '.repeat(500) // 500 words
    expect(calculateReadTime(mediumContent)).toBe(3) // ~2.5 rounds to 3

    const longContent = 'word '.repeat(2000) // 2000 words
    expect(calculateReadTime(longContent)).toBe(10)
  })

  it('handles empty content', () => {
    expect(calculateReadTime('')).toBe(0)
    expect(calculateReadTime('   ')).toBe(0)
  })

  it('returns minimum 1 minute for very short content', () => {
    expect(calculateReadTime('Hello world')).toBe(1)
    expect(calculateReadTime('Single')).toBe(1)
  })

  it('ignores HTML tags if present', () => {
    const htmlContent = '<p>This is <strong>some</strong> content</p>'
    const plainContent = 'This is some content'
    expect(calculateReadTime(htmlContent)).toBe(calculateReadTime(plainContent))
  })

  it('handles code blocks appropriately', () => {
    const contentWithCode = `
      Here is some text explaining the code.
      \`\`\`javascript
      const x = 1;
      const y = 2;
      const sum = x + y;
      \`\`\`
      More explanation text here.
    `
    // Should count code but potentially at different rate
    expect(calculateReadTime(contentWithCode)).toBeGreaterThan(0)
    expect(calculateReadTime(contentWithCode)).toBeLessThanOrEqual(2)
  })

  it('handles unicode and special characters', () => {
    const unicodeContent = 'Hello 世界 🌍 café naïve résumé'
    expect(calculateReadTime(unicodeContent)).toBe(1)
  })

  it('handles markdown formatting', () => {
    const markdownContent = `
      # Main Heading
      
      **Bold text** and *italic text* and ~~strikethrough~~
      
      ## Subheading
      
      - List item 1
      - List item 2
      - List item 3
      
      1. Numbered item
      2. Another item
      
      > Blockquote text
      
      [Link text](https://example.com)
      ![Image alt](image.jpg)
    `
    const wordCount = markdownContent
      .split(/\s+/)
      .filter((w) => w.length > 0).length
    const expectedTime = Math.ceil(wordCount / 200)
    expect(calculateReadTime(markdownContent)).toBe(expectedTime)
  })

  it('handles very long content efficiently', () => {
    const veryLongContent = 'word '.repeat(10000) // 10000 words
    expect(calculateReadTime(veryLongContent)).toBe(50) // 10000/200 = 50
  })

  it('handles content with lots of whitespace', () => {
    const spacedContent = 'word     word     word     word'
    expect(calculateReadTime(spacedContent)).toBe(1)
  })

  it('handles content with newlines and tabs', () => {
    const formattedContent = 'word\nword\nword\tword\n\n\nword'
    expect(calculateReadTime(formattedContent)).toBe(1)
  })

  it('provides consistent results for same content', () => {
    const content = 'This is a test content with several words in it.'
    const time1 = calculateReadTime(content)
    const time2 = calculateReadTime(content)
    expect(time1).toBe(time2)
  })
})
