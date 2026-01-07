import { render, screen } from '@testing-library/react'
import { SkillDetailsPillar } from '@/components/stack-diagram/SkillDetailsPillar'

describe('SkillDetailsPillar', () => {
  describe('when no skill is selected', () => {
    it('displays prompt to select a skill', () => {
      render(<SkillDetailsPillar selectedLabel={null} details={[]} />)
      expect(screen.getByText(/select a skill to see/i)).toBeInTheDocument()
    })

    it('displays generic header', () => {
      render(<SkillDetailsPillar selectedLabel={null} details={[]} />)
      expect(
        screen.getByRole('heading', { name: /skill details/i })
      ).toBeInTheDocument()
    })
  })

  describe('when a skill is selected', () => {
    it('displays skill name in header', () => {
      render(
        <SkillDetailsPillar
          selectedLabel="Docker"
          details={['Containerization', 'Docker Compose']}
        />
      )
      expect(
        screen.getByRole('heading', { name: /docker/i })
      ).toBeInTheDocument()
    })

    it('displays detail items', () => {
      render(
        <SkillDetailsPillar
          selectedLabel="Docker"
          details={['Containerization', 'Docker Compose', 'Multi-stage builds']}
        />
      )
      expect(screen.getByText('Containerization')).toBeInTheDocument()
      expect(screen.getByText('Docker Compose')).toBeInTheDocument()
      expect(screen.getByText('Multi-stage builds')).toBeInTheDocument()
    })

    it('displays subheader text', () => {
      render(
        <SkillDetailsPillar
          selectedLabel="Docker"
          details={['Containerization']}
        />
      )
      expect(screen.getByText(/technologies and tools/i)).toBeInTheDocument()
    })
  })

  describe('empty state with selection', () => {
    it('shows no details message when details array is empty', () => {
      render(<SkillDetailsPillar selectedLabel="SomeSkill" details={[]} />)
      expect(screen.getByText(/no additional details/i)).toBeInTheDocument()
    })
  })
})
