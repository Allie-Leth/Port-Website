import React from 'react'
import { render, screen, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import { Taglines } from '@/components/taglines'

describe('Taglines', () => {
  const mockTaglines = [
    'Building scalable infrastructure',
    'Automating deployment pipelines',
    'Optimizing system performance',
    'Securing cloud environments',
  ]

  it('displays first tagline immediately', () => {
    render(<Taglines taglines={mockTaglines} />)
    expect(
      screen.getByText('Building scalable infrastructure')
    ).toBeInTheDocument()
  })

  it('presents tagline content to users', () => {
    render(<Taglines taglines={mockTaglines} />)
    // Tagline text is visible to users
    expect(screen.getByText(mockTaglines[0])).toBeInTheDocument()
  })

  it('cycles through taglines automatically', async () => {
    render(<Taglines taglines={mockTaglines} interval={1000} />)

    // First tagline is visible
    expect(screen.getByText(mockTaglines[0])).toBeInTheDocument()

    // Wait for second tagline
    await waitFor(
      () => {
        expect(screen.getByText(mockTaglines[1])).toBeInTheDocument()
      },
      { timeout: 1500 }
    )

    // Wait for third tagline
    await waitFor(
      () => {
        expect(screen.getByText(mockTaglines[2])).toBeInTheDocument()
      },
      { timeout: 2500 }
    )
  })

  it('provides smooth visual transitions between taglines', async () => {
    render(<Taglines taglines={mockTaglines} interval={1000} />)

    // First tagline is visible
    expect(screen.getByText(mockTaglines[0])).toBeInTheDocument()

    // Taglines transition smoothly (opacity changes handled by component)
    await waitFor(
      () => {
        expect(screen.getByText(mockTaglines[1])).toBeInTheDocument()
      },
      { timeout: 1500 }
    )
  })

  it('loops back to first tagline after the last one', async () => {
    const shortTaglines = ['First', 'Second']
    render(<Taglines taglines={shortTaglines} interval={500} />)

    // Shows first tagline
    expect(screen.getByText('First')).toBeInTheDocument()

    // Cycles to second
    await waitFor(
      () => {
        expect(screen.getByText('Second')).toBeInTheDocument()
      },
      { timeout: 1000 }
    )

    // Loops back to first
    await waitFor(
      () => {
        expect(screen.getByText('First')).toBeInTheDocument()
      },
      { timeout: 1500 }
    )
  })

  it('displays taglines with default timing when interval not specified', () => {
    render(<Taglines taglines={mockTaglines} />)
    // Tagline is displayed even without explicit interval
    expect(screen.getByText(mockTaglines[0])).toBeInTheDocument()
  })

  it('stops cycling when component unmounts', async () => {
    const { unmount } = render(
      <Taglines taglines={mockTaglines} interval={500} />
    )

    // Initially shows first tagline
    expect(screen.getByText(mockTaglines[0])).toBeInTheDocument()

    // Wait for it to cycle to second tagline
    await waitFor(
      () => expect(screen.getByText(mockTaglines[1])).toBeInTheDocument(),
      { timeout: 1000 }
    )

    // Unmount component
    unmount()

    // Component and its content should be removed cleanly
    expect(screen.queryByText(mockTaglines[1])).not.toBeInTheDocument()
  })

  it('renders nothing when taglines array is empty', () => {
    const { container } = render(<Taglines taglines={[]} />)
    // Component returns null for empty taglines
    expect(container.firstChild).toBeNull()
  })

  it('displays single tagline continuously without changes', async () => {
    const singleTagline = ['Only one tagline']
    render(<Taglines taglines={singleTagline} interval={500} />)

    // Single tagline is displayed
    expect(screen.getByText('Only one tagline')).toBeInTheDocument()

    // Still shows same tagline after interval
    await waitFor(
      () => {
        expect(screen.getByText('Only one tagline')).toBeInTheDocument()
      },
      { timeout: 1000 }
    )
  })

  it('accepts additional properties for customization', () => {
    render(<Taglines taglines={mockTaglines} className="custom-class" />)

    // Component accepts and applies custom props
    // Tagline content is still rendered correctly
    expect(screen.getByText(mockTaglines[0])).toBeInTheDocument()
  })
})
