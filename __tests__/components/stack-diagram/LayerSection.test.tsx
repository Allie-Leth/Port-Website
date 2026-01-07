import { render, screen } from '@testing-library/react'
import { LayerSection } from '@/components/stack-diagram/LayerSection'

describe('LayerSection', () => {
  describe('rendering', () => {
    it('renders as a section element', () => {
      render(
        <LayerSection label="Test Layer">
          <div>Child content</div>
        </LayerSection>
      )
      expect(document.querySelector('section')).toBeInTheDocument()
    })

    it('renders children', () => {
      render(
        <LayerSection label="Test Layer">
          <button>Child Button</button>
        </LayerSection>
      )
      expect(screen.getByRole('button')).toBeInTheDocument()
    })

    it('renders multiple children', () => {
      render(
        <LayerSection label="Test Layer">
          <button>Button 1</button>
          <button>Button 2</button>
          <button>Button 3</button>
        </LayerSection>
      )
      expect(screen.getAllByRole('button')).toHaveLength(3)
    })
  })

  describe('heading', () => {
    it('renders label as a heading', () => {
      render(
        <LayerSection label="Frameworks">
          <div>Content</div>
        </LayerSection>
      )
      expect(screen.getByRole('heading')).toBeInTheDocument()
    })

    it('heading displays the label prop', () => {
      render(
        <LayerSection label="Test Label Text">
          <div>Content</div>
        </LayerSection>
      )
      expect(screen.getByRole('heading')).toHaveTextContent('Test Label Text')
    })

    it('heading has level 3', () => {
      render(
        <LayerSection label="Test">
          <div>Content</div>
        </LayerSection>
      )
      expect(screen.getByRole('heading', { level: 3 })).toBeInTheDocument()
    })
  })

  describe('props', () => {
    it('applies custom className', () => {
      render(
        <LayerSection label="Test" className="custom-class">
          <div>Content</div>
        </LayerSection>
      )
      const section = document.querySelector('section')
      expect(section).toHaveClass('custom-class')
    })
  })
})
