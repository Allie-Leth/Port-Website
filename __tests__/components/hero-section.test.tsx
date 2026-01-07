import { render, screen, waitFor, act } from '@testing-library/react'
import '@testing-library/jest-dom'
import { HeroSection } from '@/components/hero-section'

describe('HeroSection', () => {
  const defaultProps = {
    name: 'Alison Alva',
    title: 'Systems Engineer',
    taglines: [
      'Building embedded firmware → cloud infrastructure',
      'From bare metal → distributed systems',
      'Debugging hardware → scaling containers',
    ],
  }

  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    act(() => {
      jest.runOnlyPendingTimers()
    })
    jest.useRealTimers()
  })

  it('displays the name as main heading', () => {
    render(<HeroSection {...defaultProps} />)

    const heading = screen.getByRole('heading', { level: 1 })
    expect(heading).toHaveTextContent('Alison Alva')
  })

  it('displays the professional title below the name', () => {
    render(<HeroSection {...defaultProps} />)

    expect(screen.getByText('Systems Engineer')).toBeInTheDocument()
  })

  it('cycles through taglines automatically', async () => {
    render(<HeroSection {...defaultProps} />)

    expect(
      screen.getByText('Building embedded firmware → cloud infrastructure')
    ).toBeInTheDocument()

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    await waitFor(() => {
      expect(
        screen.getByText('From bare metal → distributed systems')
      ).toBeInTheDocument()
    })

    act(() => {
      jest.advanceTimersByTime(3000)
    })

    await waitFor(() => {
      expect(
        screen.getByText('Debugging hardware → scaling containers')
      ).toBeInTheDocument()
    })
  })

  it('displays first tagline initially', () => {
    render(<HeroSection {...defaultProps} />)

    expect(
      screen.getByText('Building embedded firmware → cloud infrastructure')
    ).toBeInTheDocument()
    expect(
      screen.queryByText('From bare metal → distributed systems')
    ).not.toBeInTheDocument()
  })

  it('provides semantic HTML structure for accessibility', () => {
    const { container } = render(<HeroSection {...defaultProps} />)

    const mainHeading = screen.getByRole('heading', {
      level: 1,
      name: 'Alison Alva',
    })
    expect(mainHeading).toBeInTheDocument()

    const section = container.querySelector('section')
    expect(section).toBeInTheDocument()
  })
})
