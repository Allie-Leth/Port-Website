import { render, screen, waitFor } from '@testing-library/react'
import HirePage from '@/app/hire/page'
import { createMockBlogPost } from '@/__tests__/fixtures/blog-posts'

// Mock the blog service
jest.mock('@/lib/services/blog-service', () => ({
  getAllPosts: jest.fn(() =>
    Promise.resolve([
      createMockBlogPost({
        id: '1',
        slug: 'test-post',
        title: 'Test Post',
        domain: 'DevOps',
      }),
    ])
  ),
}))

// Mock the stack-data module to avoid async data loading issues in tests
jest.mock('@/components/stack-diagram/stack-data', () => ({
  getStackData: jest.fn().mockResolvedValue({
    projects: [
      {
        id: 'portfolio',
        label: 'Portfolio Site',
        tagline: 'Test tagline',
        highlights: ['box-1'],
      },
    ],
    layers: [
      {
        id: 'layer-1',
        label: 'Test Layer',
        boxes: [{ id: 'box-1', label: 'Test Box' }],
      },
    ],
  }),
  getHighlightedBoxes: jest.fn().mockResolvedValue(['box-1']),
}))

describe('Hire Page', () => {
  describe('structure', () => {
    it('renders a level 1 heading', async () => {
      render(await HirePage())
      expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument()
    })

    it('renders main landmark for accessibility', async () => {
      render(await HirePage())
      expect(screen.getByRole('main')).toBeInTheDocument()
    })

    it('contains hero section', async () => {
      render(await HirePage())
      const main = screen.getByRole('main')
      expect(main.querySelector('section')).toBeInTheDocument()
    })
  })

  describe('stack diagram integration', () => {
    it('renders the stack diagram', async () => {
      render(await HirePage())

      // Wait for async data to load and projects to render
      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /portfolio site/i })
        ).toBeInTheDocument()
      })
    })

    it('renders layer headings from stack diagram', async () => {
      render(await HirePage())

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: /test layer/i })
        ).toBeInTheDocument()
      })
    })
  })
})
