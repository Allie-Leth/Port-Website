import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { SkillBox } from '@/components/stack-diagram/SkillBox'

describe('SkillBox', () => {
  describe('rendering - skill variant (default)', () => {
    it('renders as a div with button role for skill variant', () => {
      render(<SkillBox label="Test" />)
      const element = screen.getByRole('button')
      expect(element.tagName).toBe('DIV')
    })

    it('displays the label text', () => {
      render(<SkillBox label="Next.js" />)
      expect(
        screen.getByRole('button', { name: /next\.js/i })
      ).toBeInTheDocument()
    })

    it('has tabIndex for keyboard navigation', () => {
      render(<SkillBox label="Test" />)
      expect(screen.getByRole('button')).toHaveAttribute('tabindex', '0')
    })
  })

  describe('rendering - domain variant', () => {
    it('renders as a button element for domain variant', () => {
      render(<SkillBox label="Test" variant="domain" />)
      const element = screen.getByRole('button')
      expect(element.tagName).toBe('BUTTON')
    })

    it('displays tagline when provided', () => {
      render(
        <SkillBox label="Web" tagline="Dashboards and APIs" variant="domain" />
      )
      expect(screen.getByText(/dashboards and apis/i)).toBeInTheDocument()
    })

    it('does not display tagline when not provided', () => {
      render(<SkillBox label="Web" variant="domain" />)
      const button = screen.getByRole('button')
      expect(button.textContent).toBe('Web')
    })
  })

  describe('accessibility', () => {
    it('domain variant has aria-pressed false by default', () => {
      render(<SkillBox label="Test" variant="domain" />)
      expect(screen.getByRole('button')).toHaveAttribute(
        'aria-pressed',
        'false'
      )
    })

    it('domain variant has aria-pressed true when isSelected', () => {
      render(<SkillBox label="Test" variant="domain" isSelected />)
      expect(screen.getByRole('button')).toHaveAttribute('aria-pressed', 'true')
    })

    it('skill variant does not have aria-pressed', () => {
      render(<SkillBox label="Test" />)
      expect(screen.getByRole('button')).not.toHaveAttribute('aria-pressed')
    })

    it('forwards additional props', () => {
      render(<SkillBox label="Test" data-testid="custom-box" />)
      expect(screen.getByTestId('custom-box')).toBeInTheDocument()
    })
  })

  describe('interaction', () => {
    it('calls onClick when clicked', async () => {
      const handleClick = jest.fn()
      const user = userEvent.setup()

      render(<SkillBox label="Test" onClick={handleClick} />)
      await user.click(screen.getByRole('button'))

      expect(handleClick).toHaveBeenCalledTimes(1)
    })

    it('is focusable via keyboard', async () => {
      const user = userEvent.setup()
      render(<SkillBox label="Test" />)

      await user.tab()
      expect(screen.getByRole('button')).toHaveFocus()
    })
  })

  describe('variants', () => {
    it('accepts variant prop without error', () => {
      expect(() => {
        render(<SkillBox label="Test" variant="domain" />)
      }).not.toThrow()

      expect(() => {
        render(<SkillBox label="Test" variant="skill" />)
      }).not.toThrow()
    })
  })

  describe('highlight state', () => {
    it('accepts isHighlighted prop without error', () => {
      expect(() => {
        render(<SkillBox label="Test" isHighlighted />)
      }).not.toThrow()
    })

    it('accepts isHighlighted false without error', () => {
      expect(() => {
        render(<SkillBox label="Test" isHighlighted={false} />)
      }).not.toThrow()
    })
  })
})
