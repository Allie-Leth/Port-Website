import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BlogTagFilter } from '@/components/blog/blog-tag-filter'

describe('BlogTagFilter Styling and Layout', () => {
  const mockTags = ['React', 'TypeScript', 'Testing']

  it('supports horizontal layout', () => {
    const { container } = render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
        layout="horizontal"
      />
    )

    const filterContainer = container.firstChild as HTMLElement
    expect(filterContainer.className).toMatch(/flex/)
    expect(filterContainer.className).not.toMatch(/flex-col/)
  })

  it('supports vertical layout', () => {
    const { container } = render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
        layout="vertical"
      />
    )

    const filterContainer = container.firstChild as HTMLElement
    expect(filterContainer.className).toMatch(/flex-col/)
  })

  it('defaults to horizontal layout', () => {
    const { container } = render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    const filterContainer = container.firstChild as HTMLElement
    expect(filterContainer.className).toMatch(/flex/)
    expect(filterContainer.className).not.toMatch(/flex-col/)
  })

  it('applies hover states to buttons', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    const button = screen.getByRole('button', { name: 'React' })
    expect(button.className).toMatch(/hover:/)
  })

  it('differentiates active and inactive states', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag="React"
        onTagSelect={() => {}}
      />
    )

    const activeButton = screen.getByRole('button', { name: 'React' })
    const inactiveButton = screen.getByRole('button', { name: 'TypeScript' })

    expect(activeButton).toHaveClass('bg-blue-500', 'text-white')
    expect(inactiveButton).toHaveClass('bg-slate-700/50', 'text-gray-300')
  })

  it('accepts custom className', () => {
    const { container } = render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
        className="custom-filter-class"
      />
    )

    const filterContainer = container.firstChild as HTMLElement
    expect(filterContainer).toHaveClass('custom-filter-class')
  })

  it('maintains consistent button spacing', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button.className).toMatch(/px-3|py-1.5/)
    })
  })

  it('applies rounded corners to buttons', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button.className).toMatch(/rounded/)
    })
  })

  it('uses appropriate text sizing', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    const buttons = screen.getAllByRole('button')
    buttons.forEach((button) => {
      expect(button.className).toMatch(/text-sm/)
    })
  })

  it('includes focus ring for keyboard navigation', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    const button = screen.getByRole('button', { name: 'React' })
    expect(button.className).toMatch(/focus:ring|focus:outline/)
  })

  it('provides smooth transitions', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    const button = screen.getByRole('button', { name: 'React' })
    expect(button.className).toMatch(/transition/)
  })

  it('handles long tag names gracefully', () => {
    const longTags = ['VeryLongTagNameThatMightCauseLayoutIssues']

    render(
      <BlogTagFilter
        tags={longTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    const button = screen.getByRole('button', { name: longTags[0] })
    expect(button).toBeInTheDocument()
    // Should not overflow or break layout
    expect(button.className).not.toMatch(/truncate/)
  })
})
