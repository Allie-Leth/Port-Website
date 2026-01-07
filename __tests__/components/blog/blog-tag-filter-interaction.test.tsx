import React from 'react'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import '@testing-library/jest-dom'
import { BlogTagFilter } from '@/components/blog/blog-tag-filter'

describe('BlogTagFilter User Interaction', () => {
  const mockTags = ['React', 'TypeScript', 'Testing', 'DevOps', 'Kubernetes']

  it('indicates selected tag through ARIA attributes when user selects a tag', async () => {
    const user = userEvent.setup()
    let selectedTag: string | null = null

    const { rerender } = render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={selectedTag}
        onTagSelect={(tag) => {
          selectedTag = tag
        }}
      />
    )

    // Initially, All button is selected
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )

    await user.click(screen.getByRole('button', { name: 'React' }))

    rerender(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={selectedTag}
        onTagSelect={(tag) => {
          selectedTag = tag
        }}
      />
    )

    // React button is now selected
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('clears filter when user clicks All button', async () => {
    const user = userEvent.setup()
    let selectedTag: string | null = 'React'

    const { rerender } = render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={selectedTag}
        onTagSelect={(tag) => {
          selectedTag = tag
        }}
      />
    )

    // React is initially selected
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )

    await user.click(screen.getByRole('button', { name: 'All' }))

    rerender(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={selectedTag}
        onTagSelect={(tag) => {
          selectedTag = tag
        }}
      />
    )

    // All button is now selected, React is not
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('maintains selection when clicking already selected tag', async () => {
    const user = userEvent.setup()
    let selectedTag: string | null = 'React'

    const { rerender } = render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={selectedTag}
        onTagSelect={(tag) => {
          selectedTag = tag
        }}
      />
    )

    // React is selected
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )

    await user.click(screen.getByRole('button', { name: 'React' }))

    rerender(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={selectedTag}
        onTagSelect={(tag) => {
          selectedTag = tag
        }}
      />
    )

    // React remains selected after clicking it again
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
  })

  it('supports keyboard navigation for accessibility', async () => {
    const user = userEvent.setup()
    let selectedTag: string | null = null

    const { rerender } = render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={selectedTag}
        onTagSelect={(tag) => {
          selectedTag = tag
        }}
      />
    )

    // Navigate to first button with Tab
    await user.tab()
    expect(screen.getByRole('button', { name: 'All' })).toHaveFocus()

    // Tab through sorted buttons to reach React
    await user.tab()
    await user.tab()
    await user.tab()
    expect(screen.getByRole('button', { name: 'React' })).toHaveFocus()

    // Activate button with Enter key
    await user.keyboard('{Enter}')

    rerender(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={selectedTag}
        onTagSelect={(tag) => {
          selectedTag = tag
        }}
      />
    )

    // React button is now selected via keyboard
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'React' })).toHaveFocus()
  })

  it('allows selecting different tags in sequence', async () => {
    const user = userEvent.setup()
    let selectedTag: string | null = null

    const { rerender } = render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={selectedTag}
        onTagSelect={(tag) => {
          selectedTag = tag
        }}
      />
    )

    // Select React
    await user.click(screen.getByRole('button', { name: 'React' }))
    rerender(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={selectedTag}
        onTagSelect={(tag) => {
          selectedTag = tag
        }}
      />
    )
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )

    // Switch to TypeScript
    await user.click(screen.getByRole('button', { name: 'TypeScript' }))
    rerender(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={selectedTag}
        onTagSelect={(tag) => {
          selectedTag = tag
        }}
      />
    )
    expect(screen.getByRole('button', { name: 'TypeScript' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'React' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )

    // Back to All
    await user.click(screen.getByRole('button', { name: 'All' }))
    rerender(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={selectedTag}
        onTagSelect={(tag) => {
          selectedTag = tag
        }}
      />
    )
    expect(screen.getByRole('button', { name: 'All' })).toHaveAttribute(
      'aria-pressed',
      'true'
    )
    expect(screen.getByRole('button', { name: 'TypeScript' })).toHaveAttribute(
      'aria-pressed',
      'false'
    )
  })

  it('handles rapid clicks without errors', async () => {
    const user = userEvent.setup()
    const onTagSelect = jest.fn()

    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={onTagSelect}
      />
    )

    const reactButton = screen.getByRole('button', { name: 'React' })

    // Rapid clicks execute without errors
    await user.click(reactButton)
    await user.click(reactButton)
    await user.click(reactButton)

    // Verify button remains interactive
    expect(reactButton).toBeEnabled()
    expect(reactButton).toHaveAttribute('aria-pressed')

    // Callback was invoked for each click
    expect(onTagSelect).toHaveBeenCalledTimes(3)
    expect(onTagSelect).toHaveBeenCalledWith('React')
  })

  it('communicates selected state to screen readers', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag="TypeScript"
        onTagSelect={() => {}}
      />
    )

    // Selected button announces its state
    const selectedButton = screen.getByRole('button', { name: 'TypeScript' })
    expect(selectedButton).toHaveAttribute('aria-pressed', 'true')

    // Other buttons announce they are not selected
    const unselectedButtons = [
      screen.getByRole('button', { name: 'All' }),
      screen.getByRole('button', { name: 'React' }),
      screen.getByRole('button', { name: 'Testing' }),
    ]

    unselectedButtons.forEach((button) => {
      expect(button).toHaveAttribute('aria-pressed', 'false')
    })
  })

  it('provides proper focus management for keyboard users', async () => {
    const user = userEvent.setup()
    const onTagSelect = jest.fn()

    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={onTagSelect}
      />
    )

    // Tab into the filter group
    await user.tab()

    // First button (All) receives focus
    const allButton = screen.getByRole('button', { name: 'All' })
    expect(allButton).toHaveFocus()

    // Space key also activates buttons
    await user.keyboard(' ')
    expect(onTagSelect).toHaveBeenCalledWith(null)

    // Arrow keys can navigate between buttons (if implemented)
    // This tests the actual keyboard behavior users experience
  })
})
