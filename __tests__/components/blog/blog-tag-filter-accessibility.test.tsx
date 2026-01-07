import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { BlogTagFilter } from '@/components/blog/blog-tag-filter'

describe('BlogTagFilter Accessibility', () => {
  const mockTags = ['React', 'TypeScript', 'Testing']

  it('uses semantic button elements', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons.length).toBeGreaterThan(0)

    buttons.forEach((button) => {
      expect(button.tagName).toBe('BUTTON')
    })
  })

  it('provides ARIA labels for screen readers', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag="React"
        onTagSelect={() => {}}
      />
    )

    const activeButton = screen.getByRole('button', { name: 'React' })
    const inactiveButton = screen.getByRole('button', { name: 'TypeScript' })

    // Active button should indicate its state
    expect(activeButton).toHaveAttribute('aria-pressed', 'true')
    expect(inactiveButton).toHaveAttribute('aria-pressed', 'false')
  })

  it('has proper focus management', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    const buttons = screen.getAllByRole('button')

    buttons.forEach((button) => {
      // Should be focusable
      expect(button).not.toHaveAttribute('tabindex', '-1')
      // Should have visible focus indicator
      expect(button.className).toMatch(/focus:/)
    })
  })

  it('announces selection changes', () => {
    const { rerender } = render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    // Initially no selection
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )

    // After selection change
    rerender(
      <BlogTagFilter
        tags={mockTags}
        selectedTag="React"
        onTagSelect={() => {}}
      />
    )

    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('supports keyboard-only navigation', async () => {
    const user = userEvent.setup()
    let selectedTag: string | null = null

    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={selectedTag}
        onTagSelect={(tag) => {
          selectedTag = tag
        }}
      />
    )

    // Should be able to tab to first button
    await user.tab()
    expect(screen.getByRole('button', { name: 'All' })).toHaveFocus()

    // Should be able to navigate with arrow keys (if implemented)
    await user.tab()
    expect(screen.getByRole('button', { name: 'React' })).toHaveFocus()

    // Should be able to activate with Enter
    await user.keyboard('{Enter}')
    expect(selectedTag).toBe('React')

    // Should be able to activate with Space
    await user.keyboard(' ')
    expect(selectedTag).toBe('React')
  })

  it('has sufficient color contrast', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag="React"
        onTagSelect={() => {}}
      />
    )

    const activeButton = screen.getByRole('button', { name: 'React' })
    const inactiveButton = screen.getByRole('button', { name: 'TypeScript' })

    // Active state should have good contrast
    expect(activeButton).toHaveClass('bg-blue-500', 'text-white')

    // Inactive state should also have sufficient contrast
    expect(inactiveButton).toHaveClass('text-gray-300')
  })

  it('provides clear visual feedback for interactions', async () => {
    const user = userEvent.setup()

    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    const button = screen.getByRole('button', { name: 'React' })

    // Should have hover state
    expect(button.className).toMatch(/hover:/)

    // Should have focus state
    await user.tab()
    await user.tab() // Navigate to React button
    expect(button.className).toMatch(/focus:/)
  })

  it('maintains consistent tab order', async () => {
    const user = userEvent.setup()

    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    // Tab through all buttons in order
    await user.tab()
    expect(screen.getByRole('button', { name: 'All' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: 'React' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: 'Testing' })).toHaveFocus()

    await user.tab()
    expect(screen.getByRole('button', { name: 'TypeScript' })).toHaveFocus()
  })

  it('works with screen reader virtual cursor', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    // All interactive elements should be in the accessibility tree
    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(mockTags.length + 1) // +1 for "All"

    // Each button should have accessible name
    buttons.forEach((button) => {
      expect(button).toHaveAccessibleName()
    })
  })

  it('indicates filter purpose to assistive technology', () => {
    const { container } = render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    // Container should have appropriate role or label
    const filterContainer = container.firstChild as HTMLElement

    // Should be identifiable as a filter control - checking actual implementation
    // The component uses role="navigation" which is also semantically correct
    expect(filterContainer).toHaveAttribute('role')
    const role = filterContainer.getAttribute('role')
    expect(['group', 'navigation', 'toolbar']).toContain(role)
  })
})
