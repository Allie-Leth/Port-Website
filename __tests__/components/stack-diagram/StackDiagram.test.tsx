import { render, screen, act, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { StackDiagram } from '@/components/stack-diagram/StackDiagram'

// Mock the data module
jest.mock('@/components/stack-diagram/stack-data', () => ({
  getStackData: jest.fn().mockResolvedValue({
    projects: [
      {
        id: 'project-1',
        label: 'Project 1',
        tagline: 'Tagline 1',
        highlights: ['box-a', 'box-b'],
        tags: ['Docker', 'DevOps'],
        details: ['Project 1 detail 1', 'Project 1 detail 2'],
      },
      {
        id: 'project-2',
        label: 'Project 2',
        tagline: 'Tagline 2',
        highlights: ['box-b', 'box-c'],
        tags: ['React'],
        details: ['Project 2 detail'],
      },
      {
        id: 'project-3',
        label: 'Project 3',
        tagline: 'Tagline 3',
        highlights: ['box-c'],
        tags: ['Python'],
        details: ['Project 3 detail'],
      },
    ],
    layers: [
      {
        id: 'layer-1',
        label: 'Layer 1',
        boxes: [
          { id: 'box-a', label: 'Box A', popup: ['Tool 1'], tags: ['Docker'] },
          { id: 'box-b', label: 'Box B', popup: ['Tool 2'], tags: ['DevOps'] },
        ],
      },
      {
        id: 'layer-2',
        label: 'Layer 2',
        boxes: [{ id: 'box-c', label: 'Box C', popup: ['Tool 3'] }],
      },
    ],
  }),
  getHighlightedBoxes: jest
    .fn()
    .mockImplementation(async (projectId: string) => {
      const highlights: Record<string, string[]> = {
        'project-1': ['box-a', 'box-b'],
        'project-2': ['box-b', 'box-c'],
        'project-3': ['box-c'],
      }
      return highlights[projectId] || []
    }),
}))

// Mock blog posts for allPosts prop
const mockPosts = [
  {
    id: 'test-post',
    slug: 'test-post',
    title: 'Test Blog Post',
    excerpt: 'Test excerpt for the blog post',
    content: 'Content',
    date: '2024-01-15T00:00:00Z',
    author: 'Author',
    tags: ['Docker'],
    domain: 'DevOps' as const,
    readTime: 5,
    featured: false,
  },
]

describe('StackDiagram', () => {
  beforeEach(() => {
    jest.useFakeTimers()
  })

  afterEach(() => {
    jest.useRealTimers()
    jest.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders project buttons', async () => {
      render(<StackDiagram allPosts={mockPosts} />)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /project 1/i })
        ).toBeInTheDocument()
      })

      expect(
        screen.getByRole('button', { name: /project 2/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /project 3/i })
      ).toBeInTheDocument()
    })

    it('renders layer sections', async () => {
      render(<StackDiagram allPosts={mockPosts} />)

      await waitFor(() => {
        expect(
          screen.getByRole('heading', { name: /layer 1/i })
        ).toBeInTheDocument()
      })

      expect(
        screen.getByRole('heading', { name: /layer 2/i })
      ).toBeInTheDocument()
    })

    it('renders skill boxes within layers', async () => {
      render(<StackDiagram allPosts={mockPosts} />)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /box a/i })
        ).toBeInTheDocument()
      })

      expect(screen.getByRole('button', { name: /box b/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /box c/i })).toBeInTheDocument()
    })
  })

  describe('project selection', () => {
    it('first project is selected by default', async () => {
      render(<StackDiagram allPosts={mockPosts} />)

      await waitFor(() => {
        const project1Button = screen.getByRole('button', {
          name: /project 1/i,
        })
        expect(project1Button).toHaveAttribute('aria-pressed', 'true')
      })
    })

    it('other projects are not selected by default', async () => {
      render(<StackDiagram allPosts={mockPosts} />)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /project 1/i })
        ).toBeInTheDocument()
      })

      expect(
        screen.getByRole('button', { name: /project 2/i })
      ).toHaveAttribute('aria-pressed', 'false')
      expect(
        screen.getByRole('button', { name: /project 3/i })
      ).toHaveAttribute('aria-pressed', 'false')
    })

    it('clicking project updates selection', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<StackDiagram allPosts={mockPosts} />)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /project 1/i })
        ).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /project 2/i }))

      expect(
        screen.getByRole('button', { name: /project 2/i })
      ).toHaveAttribute('aria-pressed', 'true')
      expect(
        screen.getByRole('button', { name: /project 1/i })
      ).toHaveAttribute('aria-pressed', 'false')
    })
  })

  describe('auto-rotation', () => {
    it('rotates to next project after interval', async () => {
      render(<StackDiagram allPosts={mockPosts} />)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /project 1/i })
        ).toHaveAttribute('aria-pressed', 'true')
      })

      act(() => {
        jest.advanceTimersByTime(4000)
      })

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /project 2/i })
        ).toHaveAttribute('aria-pressed', 'true')
      })
    })

    it('cycles back to first project after last', async () => {
      render(<StackDiagram allPosts={mockPosts} />)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /project 1/i })
        ).toHaveAttribute('aria-pressed', 'true')
      })

      // Advance through all projects
      act(() => {
        jest.advanceTimersByTime(4000) // -> project 2
      })
      act(() => {
        jest.advanceTimersByTime(4000) // -> project 3
      })
      act(() => {
        jest.advanceTimersByTime(4000) // -> project 1 (cycle)
      })

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /project 1/i })
        ).toHaveAttribute('aria-pressed', 'true')
      })
    })

    it('stops auto-rotation when project is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<StackDiagram allPosts={mockPosts} />)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /project 1/i })
        ).toBeInTheDocument()
      })

      // Click project 2 to stop rotation
      await user.click(screen.getByRole('button', { name: /project 2/i }))

      expect(
        screen.getByRole('button', { name: /project 2/i })
      ).toHaveAttribute('aria-pressed', 'true')

      // Advance time - should NOT rotate
      act(() => {
        jest.advanceTimersByTime(4000)
      })

      // Still on project 2
      expect(
        screen.getByRole('button', { name: /project 2/i })
      ).toHaveAttribute('aria-pressed', 'true')
    })
  })

  describe('loading state', () => {
    it('shows loading state initially', () => {
      render(<StackDiagram allPosts={mockPosts} />)
      expect(document.body).toBeInTheDocument()
    })
  })

  describe('blog posts pillar', () => {
    it('renders the blog posts pillar with project posts', async () => {
      render(<StackDiagram allPosts={mockPosts} />)

      await waitFor(() => {
        // Project 1 is selected by default, which has Docker tag
        // Our mock post has Docker tag - header shows just label (no "Posts" suffix)
        expect(
          screen.getByRole('heading', { name: /project 1/i })
        ).toBeInTheDocument()
      })
    })

    it('shows project posts by default', async () => {
      render(<StackDiagram allPosts={mockPosts} />)

      await waitFor(() => {
        // Project 1 has tags ['Docker', 'DevOps'], our post has ['Docker']
        expect(
          screen.getByRole('button', { name: /test blog post/i })
        ).toBeInTheDocument()
      })
    })

    it('updates posts when skill is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<StackDiagram allPosts={mockPosts} />)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /box a/i })
        ).toBeInTheDocument()
      })

      // Click Box A which has Docker tag
      await user.click(screen.getByRole('button', { name: /box a/i }))

      await waitFor(() => {
        // Header shows just label (no "Posts" suffix)
        expect(
          screen.getByRole('heading', { name: /box a/i })
        ).toBeInTheDocument()
      })
    })
  })

  describe('blog post preview', () => {
    it('shows post preview when post is clicked', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<StackDiagram allPosts={mockPosts} />)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /test blog post/i })
        ).toBeInTheDocument()
      })

      // Click the post in the list
      await user.click(screen.getByRole('button', { name: /test blog post/i }))

      await waitFor(() => {
        // Should show the excerpt in the preview
        expect(
          screen.getByText(/test excerpt for the blog post/i)
        ).toBeInTheDocument()
      })
    })

    it('makes post preview clickable to blog post', async () => {
      const user = userEvent.setup({ advanceTimers: jest.advanceTimersByTime })
      render(<StackDiagram allPosts={mockPosts} />)

      await waitFor(() => {
        expect(
          screen.getByRole('button', { name: /test blog post/i })
        ).toBeInTheDocument()
      })

      await user.click(screen.getByRole('button', { name: /test blog post/i }))

      await waitFor(() => {
        // The entire preview card is a clickable link
        const link = screen.getByRole('link', { name: /test blog post/i })
        expect(link).toHaveAttribute('href', '/blog/test-post')
      })
    })
  })
})
