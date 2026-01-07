import { GhostPost, GhostTag, GhostAuthor } from '@/lib/types/ghost'

/**
 * Shared test fixtures for Ghost API responses
 */

export const createMockGhostTag = (
  overrides?: Partial<GhostTag>
): GhostTag => ({
  id: 'tag-1',
  name: 'Testing',
  slug: 'testing',
  description: null,
  visibility: 'public',
  ...overrides,
})

export const createMockGhostAuthor = (
  overrides?: Partial<GhostAuthor>
): GhostAuthor => ({
  id: 'author-1',
  name: 'Test Author',
  slug: 'test-author',
  profile_image: null,
  bio: null,
  ...overrides,
})

export const createMockGhostPost = (
  overrides?: Partial<GhostPost>
): GhostPost => ({
  id: 'ghost-post-1',
  uuid: 'uuid-1234',
  slug: 'test-ghost-post',
  title: 'Test Ghost Post',
  html: '<p>This is test content from Ghost.</p>',
  excerpt: 'This is a test excerpt',
  custom_excerpt: null,
  feature_image: null,
  featured: false,
  published_at: '2024-01-15T10:00:00.000Z',
  updated_at: '2024-01-15T10:00:00.000Z',
  created_at: '2024-01-15T09:00:00.000Z',
  reading_time: 5,
  tags: [createMockGhostTag()],
  authors: [createMockGhostAuthor()],
  ...overrides,
})

export const mockGhostPostWithDomain = createMockGhostPost({
  id: 'ghost-devops-1',
  slug: 'kubernetes-guide',
  title: 'Kubernetes Guide',
  html: '<h1>Kubernetes</h1><p>Guide content here.</p>',
  tags: [
    createMockGhostTag({ id: 'tag-devops', name: 'DevOps', slug: 'devops' }),
    createMockGhostTag({
      id: 'tag-k8s',
      name: 'Kubernetes',
      slug: 'kubernetes',
    }),
  ],
  featured: true,
})

export const mockGhostPostWithoutDomain = createMockGhostPost({
  id: 'ghost-general-1',
  slug: 'general-post',
  title: 'General Post',
  tags: [
    createMockGhostTag({ id: 'tag-misc', name: 'Miscellaneous', slug: 'misc' }),
  ],
})

export const mockGhostPostWithCustomExcerpt = createMockGhostPost({
  id: 'ghost-custom-1',
  slug: 'custom-excerpt-post',
  title: 'Post with Custom Excerpt',
  custom_excerpt: 'This is a custom excerpt set in Ghost.',
  excerpt: 'This is the auto-generated excerpt.',
})

export const mockGhostPostMinimal = createMockGhostPost({
  id: 'ghost-minimal-1',
  slug: 'minimal-post',
  title: 'Minimal Post',
  tags: [],
  authors: [],
  custom_excerpt: null,
  excerpt: undefined,
})

export const mockGhostPosts: GhostPost[] = [
  mockGhostPostWithDomain,
  mockGhostPostWithoutDomain,
  mockGhostPostWithCustomExcerpt,
  createMockGhostPost({
    id: 'ghost-firmware-1',
    slug: 'firmware-debugging',
    title: 'Firmware Debugging',
    tags: [
      createMockGhostTag({
        id: 'tag-firmware',
        name: 'Firmware',
        slug: 'firmware',
      }),
      createMockGhostTag({
        id: 'tag-debug',
        name: 'Debugging',
        slug: 'debugging',
      }),
    ],
    published_at: '2024-01-20T10:00:00.000Z',
  }),
  createMockGhostPost({
    id: 'ghost-security-1',
    slug: 'security-best-practices',
    title: 'Security Best Practices',
    tags: [
      createMockGhostTag({
        id: 'tag-security',
        name: 'Security',
        slug: 'security',
      }),
    ],
    published_at: '2024-01-25T10:00:00.000Z',
    featured: true,
  }),
]
