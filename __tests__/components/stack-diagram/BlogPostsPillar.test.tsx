import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { BlogPostsPillar } from '@/components/stack-diagram/BlogPostsPillar'
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

describe('BlogPostsPillar', () => {
  const mockOnPostSelect = jest.fn()

  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('when no skill is selected', () => {
    it('displays prompt to select a skill', () => {
      render(
        <BlogPostsPillar
          selectedLabel={null}
          tags={[]}
          allPosts={mockPosts}
          selectedPostId={null}
          onPostSelect={mockOnPostSelect}
        />
      )
      // Check for the subtitle prompt in the header
      expect(
        screen.getByText(/select a skill to see posts/i)
      ).toBeInTheDocument()
    })

    it('displays generic header', () => {
      render(
        <BlogPostsPillar
          selectedLabel={null}
          tags={[]}
          allPosts={mockPosts}
          selectedPostId={null}
          onPostSelect={mockOnPostSelect}
        />
      )
      expect(
        screen.getByRole('heading', { name: /related posts/i })
      ).toBeInTheDocument()
    })
  })

  describe('when a skill is selected', () => {
    it('displays skill name in header', () => {
      render(
        <BlogPostsPillar
          selectedLabel="Docker"
          tags={['Docker']}
          allPosts={mockPosts}
          selectedPostId={null}
          onPostSelect={mockOnPostSelect}
        />
      )
      // Header shows just label (no "Posts" suffix)
      expect(
        screen.getByRole('heading', { name: /docker/i })
      ).toBeInTheDocument()
    })

    it('displays posts matching the tags', () => {
      render(
        <BlogPostsPillar
          selectedLabel="Docker"
          tags={['Docker']}
          allPosts={mockPosts}
          selectedPostId={null}
          onPostSelect={mockOnPostSelect}
        />
      )
      expect(
        screen.getByRole('button', { name: /test blog post/i })
      ).toBeInTheDocument()
      expect(
        screen.queryByRole('button', { name: /other blog post/i })
      ).not.toBeInTheDocument()
    })

    it('filters posts case-insensitively', () => {
      render(
        <BlogPostsPillar
          selectedLabel="Docker"
          tags={['docker']}
          allPosts={mockPosts}
          selectedPostId={null}
          onPostSelect={mockOnPostSelect}
        />
      )
      expect(
        screen.getByRole('button', { name: /test blog post/i })
      ).toBeInTheDocument()
    })

    it('shows posts matching any of the provided tags', () => {
      render(
        <BlogPostsPillar
          selectedLabel="Multi-skill"
          tags={['Docker', 'React']}
          allPosts={mockPosts}
          selectedPostId={null}
          onPostSelect={mockOnPostSelect}
        />
      )
      expect(
        screen.getByRole('button', { name: /test blog post/i })
      ).toBeInTheDocument()
      expect(
        screen.getByRole('button', { name: /other blog post/i })
      ).toBeInTheDocument()
    })
  })

  describe('post selection', () => {
    it('calls onPostSelect when a post is clicked', async () => {
      const user = userEvent.setup()
      render(
        <BlogPostsPillar
          selectedLabel="Docker"
          tags={['Docker']}
          allPosts={mockPosts}
          selectedPostId={null}
          onPostSelect={mockOnPostSelect}
        />
      )

      await user.click(screen.getByRole('button', { name: /test blog post/i }))
      expect(mockOnPostSelect).toHaveBeenCalledWith(mockPost)
    })

    it('highlights selected post', () => {
      render(
        <BlogPostsPillar
          selectedLabel="Docker"
          tags={['Docker']}
          allPosts={mockPosts}
          selectedPostId="test-post"
          onPostSelect={mockOnPostSelect}
        />
      )
      const button = screen.getByRole('button', { name: /test blog post/i })
      expect(button).toHaveClass('border-blue-500/50')
    })
  })

  describe('empty state', () => {
    it('shows no posts message when no posts match tags', () => {
      render(
        <BlogPostsPillar
          selectedLabel="SomeSkill"
          tags={['NonexistentTag']}
          allPosts={mockPosts}
          selectedPostId={null}
          onPostSelect={mockOnPostSelect}
        />
      )
      expect(screen.getByText(/no related posts/i)).toBeInTheDocument()
    })

    it('shows no posts message when allPosts is empty', () => {
      render(
        <BlogPostsPillar
          selectedLabel="Docker"
          tags={['Docker']}
          allPosts={[]}
          selectedPostId={null}
          onPostSelect={mockOnPostSelect}
        />
      )
      expect(screen.getByText(/no related posts/i)).toBeInTheDocument()
    })
  })
})
