import React from 'react'
import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { BlogTagFilter } from '@/components/blog/blog-tag-filter'

describe('BlogTagFilter Display', () => {
  const mockTags = ['React', 'TypeScript', 'Testing', 'DevOps', 'Kubernetes']

  it('displays all available tag filters', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    mockTags.forEach((tag) => {
      expect(screen.getByRole('button', { name: tag })).toBeInTheDocument()
    })
    expect(screen.getByRole('button', { name: 'All' })).toBeInTheDocument()
  })

  it('displays All filter and all tags when rendered', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    const buttons = screen.getAllByRole('button')
    expect(buttons).toHaveLength(mockTags.length + 1) // +1 for "All" button
  })

  it('highlights selected tag visually', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag="React"
        onTagSelect={() => {}}
      />
    )

    const reactButton = screen.getByRole('button', { name: 'React' })
    const typescriptButton = screen.getByRole('button', { name: 'TypeScript' })

    expect(reactButton).toHaveClass('bg-blue-500')
    expect(typescriptButton).toHaveClass('bg-slate-700/50')
  })

  it('highlights All button when no tag is selected', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    const allButton = screen.getByRole('button', { name: 'All' })
    const reactButton = screen.getByRole('button', { name: 'React' })

    expect(allButton).toHaveClass('bg-blue-500')
    expect(reactButton).toHaveClass('bg-slate-700/50')
  })

  it('displays tag counts when provided', () => {
    const tagCounts = {
      React: 5,
      TypeScript: 3,
      Testing: 2,
      DevOps: 7,
      Kubernetes: 4,
    }

    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
        tagCounts={tagCounts}
      />
    )

    expect(screen.getByText('React (5)')).toBeInTheDocument()
    expect(screen.getByText('TypeScript (3)')).toBeInTheDocument()
    expect(screen.getByText('DevOps (7)')).toBeInTheDocument()
  })

  it('shows total count for All option', () => {
    const tagCounts = {
      React: 5,
      TypeScript: 3,
      Testing: 2,
      DevOps: 7,
      Kubernetes: 4,
    }

    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
        tagCounts={tagCounts}
        totalCount={21}
      />
    )

    expect(screen.getByText('All (21)')).toBeInTheDocument()
  })

  it('handles missing counts gracefully', () => {
    render(
      <BlogTagFilter
        tags={mockTags}
        selectedTag={null}
        onTagSelect={() => {}}
        tagCounts={{}}
      />
    )

    expect(screen.getByText('React')).toBeInTheDocument()
    expect(screen.queryByText(/React \(\d+\)/)).not.toBeInTheDocument()
  })

  it('handles empty tags array', () => {
    render(
      <BlogTagFilter tags={[]} selectedTag={null} onTagSelect={() => {}} />
    )

    expect(screen.getByText('All')).toBeInTheDocument()
  })

  it('handles undefined tags', () => {
    render(
      <BlogTagFilter
        tags={undefined}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    expect(screen.getByText('All')).toBeInTheDocument()
  })

  it('sorts tags alphabetically by default', () => {
    const unsortedTags = [
      'Kubernetes',
      'React',
      'DevOps',
      'TypeScript',
      'Testing',
    ]

    render(
      <BlogTagFilter
        tags={unsortedTags}
        selectedTag={null}
        onTagSelect={() => {}}
      />
    )

    const buttons = screen.getAllByRole('button')
    const buttonTexts = buttons.map((b) => b.textContent)

    expect(buttonTexts).toEqual([
      'All',
      'DevOps',
      'Kubernetes',
      'React',
      'Testing',
      'TypeScript',
    ])
  })

  it('preserves original order when sortTags is false', () => {
    const unsortedTags = ['Kubernetes', 'React', 'DevOps']

    render(
      <BlogTagFilter
        tags={unsortedTags}
        selectedTag={null}
        onTagSelect={() => {}}
        sortTags={false}
      />
    )

    const buttons = screen.getAllByRole('button')
    const buttonTexts = buttons.map((b) => b.textContent)

    expect(buttonTexts).toEqual(['All', 'Kubernetes', 'React', 'DevOps'])
  })
})
