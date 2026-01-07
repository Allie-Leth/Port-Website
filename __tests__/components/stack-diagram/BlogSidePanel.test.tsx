import { render, screen, fireEvent } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlogSidePanel } from '@/components/stack-diagram/BlogSidePanel'
import type { BlogPost } from '@/lib/types/blog'

const mockPost: BlogPost = {
  id: 'test-post',
  slug: 'test-post-slug',
  title: 'Test Blog Post',
  excerpt: 'Test excerpt',
  content: 'Content',
  date: '2024-01-15T00:00:00Z',
  author: 'Author',
  tags: ['Docker', 'DevOps'],
  domain: 'DevOps',
  readTime: 5,
  featured: false,
}

const mockPostWithDifferentTags: BlogPost = {
  id: 'other-post',
  slug: 'other-post-slug',
  title: 'Other Blog Post',
  excerpt: 'Other excerpt',
  content: 'Other content',
  date: '2024-01-10T00:00:00Z',
  author: 'Author',
  tags: ['React', 'TypeScript'],
  domain: 'Full-Stack',
  readTime: 3,
  featured: false,
}

const mockPosts: BlogPost[] = [mockPost, mockPostWithDifferentTags]

describe('BlogSidePanel', () => {
  const mockOnClose = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('visibility', () => {
    it('renders nothing when closed', () => {
      render(
        <BlogSidePanel
          isOpen={false}
          boxLabel="Docker"
          tags={['Docker']}
          allPosts={mockPosts}
          onClose={mockOnClose}
        />
      )
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument()
    })

    it('renders panel when open', () => {
      render(
        <BlogSidePanel
          isOpen={true}
          boxLabel="Docker"
          tags={['Docker']}
          allPosts={mockPosts}
          onClose={mockOnClose}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })
  })

  describe('content', () => {
    it('displays the box label as header', () => {
      render(
        <BlogSidePanel
          isOpen={true}
          boxLabel="Docker"
          tags={['Docker']}
          allPosts={mockPosts}
          onClose={mockOnClose}
        />
      )
      expect(
        screen.getByRole('heading', { name: /docker/i })
      ).toBeInTheDocument()
    })

    it('displays blog posts from matching tags', () => {
      render(
        <BlogSidePanel
          isOpen={true}
          boxLabel="Docker"
          tags={['Docker']}
          allPosts={mockPosts}
          onClose={mockOnClose}
        />
      )
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
    })

    it('filters posts by tags (case-insensitive)', () => {
      render(
        <BlogSidePanel
          isOpen={true}
          boxLabel="Docker"
          tags={['docker']}
          allPosts={mockPosts}
          onClose={mockOnClose}
        />
      )
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
      expect(screen.queryByText('Other Blog Post')).not.toBeInTheDocument()
    })

    it('shows posts matching any of the provided tags', () => {
      render(
        <BlogSidePanel
          isOpen={true}
          boxLabel="Docker"
          tags={['Docker', 'React']}
          allPosts={mockPosts}
          onClose={mockOnClose}
        />
      )
      expect(screen.getByText('Test Blog Post')).toBeInTheDocument()
      expect(screen.getByText('Other Blog Post')).toBeInTheDocument()
    })
  })

  describe('empty state', () => {
    it('shows empty state when no posts match tags', () => {
      render(
        <BlogSidePanel
          isOpen={true}
          boxLabel="SomeSkill"
          tags={['NonexistentTag']}
          allPosts={mockPosts}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByText(/no related posts/i)).toBeInTheDocument()
    })

    it('shows empty state when allPosts is empty', () => {
      render(
        <BlogSidePanel
          isOpen={true}
          boxLabel="Docker"
          tags={['Docker']}
          allPosts={[]}
          onClose={mockOnClose}
        />
      )

      expect(screen.getByText(/no related posts/i)).toBeInTheDocument()
    })
  })

  describe('close behavior', () => {
    it('calls onClose when close button is clicked', async () => {
      const user = userEvent.setup()
      render(
        <BlogSidePanel
          isOpen={true}
          boxLabel="Docker"
          tags={['Docker']}
          allPosts={mockPosts}
          onClose={mockOnClose}
        />
      )

      await user.click(screen.getByRole('button', { name: /close/i }))
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('calls onClose when escape key is pressed', () => {
      render(
        <BlogSidePanel
          isOpen={true}
          boxLabel="Docker"
          tags={['Docker']}
          allPosts={mockPosts}
          onClose={mockOnClose}
        />
      )

      fireEvent.keyDown(document, { key: 'Escape' })
      expect(mockOnClose).toHaveBeenCalled()
    })

    it('calls onClose when backdrop is clicked', async () => {
      const user = userEvent.setup()
      render(
        <BlogSidePanel
          isOpen={true}
          boxLabel="Docker"
          tags={['Docker']}
          allPosts={mockPosts}
          onClose={mockOnClose}
        />
      )

      const backdrop = screen.getByTestId('side-panel-backdrop')
      await user.click(backdrop)
      expect(mockOnClose).toHaveBeenCalled()
    })
  })

  describe('accessibility', () => {
    it('has dialog role', () => {
      render(
        <BlogSidePanel
          isOpen={true}
          boxLabel="Docker"
          tags={['Docker']}
          allPosts={mockPosts}
          onClose={mockOnClose}
        />
      )
      expect(screen.getByRole('dialog')).toBeInTheDocument()
    })

    it('has accessible close button', () => {
      render(
        <BlogSidePanel
          isOpen={true}
          boxLabel="Docker"
          tags={['Docker']}
          allPosts={mockPosts}
          onClose={mockOnClose}
        />
      )
      expect(screen.getByRole('button', { name: /close/i })).toBeInTheDocument()
    })
  })
})
