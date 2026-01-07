import {
  fetchGhostPosts,
  fetchGhostPostBySlug,
  isGhostConfigured,
} from '@/lib/services/ghost-service'
import {
  createMockGhostPost,
  mockGhostPosts,
} from '@/__tests__/fixtures/ghost-posts'

// Mock fetch globally
const mockFetch = jest.fn()
global.fetch = mockFetch

// Helper to create mock headers
const createMockHeaders = (contentType = 'application/json') => ({
  get: jest.fn((header: string) => {
    if (header.toLowerCase() === 'content-type') {
      return contentType
    }
    return null
  }),
})

// Helper to create a mock response with proper headers
const createMockResponse = (options: {
  ok: boolean
  status?: number
  statusText?: string
  json?: () => Promise<unknown>
  contentType?: string
}) => ({
  ok: options.ok,
  status: options.status || (options.ok ? 200 : 500),
  statusText: options.statusText || '',
  json: options.json,
  headers: createMockHeaders(options.contentType),
})

describe('Ghost Service - API Functions', () => {
  const originalEnv = process.env

  beforeEach(() => {
    jest.resetModules()
    mockFetch.mockReset()
    process.env = {
      ...originalEnv,
      GHOST_URL: 'http://ghost.test:2368',
      GHOST_API_KEY: 'test-api-key',
    }
  })

  afterAll(() => {
    process.env = originalEnv
  })

  describe('isGhostConfigured', () => {
    it('returns true when both env vars are set', () => {
      expect(isGhostConfigured()).toBe(true)
    })

    it('returns false when GHOST_URL is missing', () => {
      delete process.env.GHOST_URL
      expect(isGhostConfigured()).toBe(false)
    })

    it('returns false when GHOST_API_KEY is missing', () => {
      delete process.env.GHOST_API_KEY
      expect(isGhostConfigured()).toBe(false)
    })

    it('returns false when both env vars are missing', () => {
      delete process.env.GHOST_URL
      delete process.env.GHOST_API_KEY
      expect(isGhostConfigured()).toBe(false)
    })
  })

  describe('fetchGhostPosts', () => {
    it('fetches posts from Ghost API', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          json: async () => ({
            posts: mockGhostPosts,
            meta: { pagination: { page: 1, limit: 15, pages: 1, total: 5 } },
          }),
        })
      )

      const posts = await fetchGhostPosts()

      expect(mockFetch).toHaveBeenCalledTimes(1)
      expect(posts).toHaveLength(mockGhostPosts.length)
    })

    it('constructs correct API URL with parameters', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          json: async () => ({ posts: [], meta: { pagination: {} } }),
        })
      )

      await fetchGhostPosts()

      const calledUrl = mockFetch.mock.calls[0][0]
      expect(calledUrl).toContain(
        'http://ghost.test:2368/ghost/api/content/posts/'
      )
      expect(calledUrl).toContain('key=test-api-key')
      expect(calledUrl).toContain('include=tags%2Cauthors')
      expect(calledUrl).toContain('limit=all')
    })

    it('maps Ghost posts to BlogPost format', async () => {
      const ghostPost = createMockGhostPost({
        id: 'test-1',
        title: 'Test Post',
        slug: 'test-post',
      })

      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          json: async () => ({ posts: [ghostPost], meta: { pagination: {} } }),
        })
      )

      const posts = await fetchGhostPosts()

      expect(posts[0].id).toBe('test-1')
      expect(posts[0].title).toBe('Test Post')
      expect(posts[0].slug).toBe('test-post')
    })

    it('throws error when API returns non-ok response', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        })
      )

      await expect(fetchGhostPosts()).rejects.toThrow(
        'Ghost API error: 500 Internal Server Error'
      )
    })

    it('throws error when Ghost config is missing', async () => {
      delete process.env.GHOST_URL

      await expect(fetchGhostPosts()).rejects.toThrow(
        'Ghost API configuration missing'
      )
    })

    it('strips trailing slash from GHOST_URL', async () => {
      process.env.GHOST_URL = 'http://ghost.test:2368/'

      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          json: async () => ({ posts: [], meta: { pagination: {} } }),
        })
      )

      await fetchGhostPosts()

      const calledUrl = mockFetch.mock.calls[0][0]
      expect(calledUrl).toContain(
        'http://ghost.test:2368/ghost/api/content/posts/'
      )
      expect(calledUrl).not.toContain('http://ghost.test:2368//ghost')
    })

    it('includes revalidation options for Next.js caching', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          json: async () => ({ posts: [], meta: { pagination: {} } }),
        })
      )

      await fetchGhostPosts()

      const fetchOptions = mockFetch.mock.calls[0][1]
      expect(fetchOptions.next).toEqual({ revalidate: 300 })
    })

    it('returns empty array when response is non-JSON (auth redirect)', async () => {
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation()

      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          contentType: 'text/html',
          json: async () => {
            throw new Error('Should not call json()')
          },
        })
      )

      const posts = await fetchGhostPosts()

      expect(posts).toEqual([])
      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('non-JSON response')
      )

      consoleWarn.mockRestore()
    })
  })

  describe('fetchGhostPostBySlug', () => {
    it('fetches single post by slug', async () => {
      const ghostPost = createMockGhostPost({
        slug: 'test-slug',
        title: 'Test Post',
      })

      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          json: async () => ({ posts: [ghostPost] }),
        })
      )

      const post = await fetchGhostPostBySlug('test-slug')

      expect(post).not.toBeNull()
      expect(post?.slug).toBe('test-slug')
      expect(post?.title).toBe('Test Post')
    })

    it('constructs correct API URL for slug endpoint', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          json: async () => ({ posts: [createMockGhostPost()] }),
        })
      )

      await fetchGhostPostBySlug('my-post-slug')

      const calledUrl = mockFetch.mock.calls[0][0]
      expect(calledUrl).toContain('/ghost/api/content/posts/slug/my-post-slug/')
      expect(calledUrl).toContain('key=test-api-key')
      expect(calledUrl).toContain('include=tags%2Cauthors')
    })

    it('returns null for 404 response', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: false,
          status: 404,
        })
      )

      const post = await fetchGhostPostBySlug('non-existent')

      expect(post).toBeNull()
    })

    it('returns null when posts array is empty', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          json: async () => ({ posts: [] }),
        })
      )

      const post = await fetchGhostPostBySlug('empty-result')

      expect(post).toBeNull()
    })

    it('throws error for non-404 error responses', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: false,
          status: 500,
          statusText: 'Internal Server Error',
        })
      )

      await expect(fetchGhostPostBySlug('error-post')).rejects.toThrow(
        'Ghost API error: 500 Internal Server Error'
      )
    })

    it('maps fetched post to BlogPost format', async () => {
      const ghostPost = createMockGhostPost({
        html: '<p>Content</p>',
        reading_time: 8,
        featured: true,
      })

      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          json: async () => ({ posts: [ghostPost] }),
        })
      )

      const post = await fetchGhostPostBySlug('any')

      expect(post?.content).toBe('<p>Content</p>')
      expect(post?.readTime).toBe(8)
      expect(post?.featured).toBe(true)
    })

    it('includes revalidation options for Next.js caching', async () => {
      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          json: async () => ({ posts: [createMockGhostPost()] }),
        })
      )

      await fetchGhostPostBySlug('any')

      const fetchOptions = mockFetch.mock.calls[0][1]
      expect(fetchOptions.next).toEqual({ revalidate: 300 })
    })

    it('returns null when response is non-JSON (auth redirect)', async () => {
      const consoleWarn = jest.spyOn(console, 'warn').mockImplementation()

      mockFetch.mockResolvedValueOnce(
        createMockResponse({
          ok: true,
          contentType: 'text/html',
          json: async () => {
            throw new Error('Should not call json()')
          },
        })
      )

      const post = await fetchGhostPostBySlug('any-slug')

      expect(post).toBeNull()
      expect(consoleWarn).toHaveBeenCalledWith(
        expect.stringContaining('non-JSON response')
      )

      consoleWarn.mockRestore()
    })
  })
})
