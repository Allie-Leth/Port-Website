// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'

// Mock Next.js router
jest.mock('next/navigation', () => ({
  useRouter: () => ({
    push: jest.fn(),
    replace: jest.fn(),
    prefetch: jest.fn(),
    back: jest.fn(),
    forward: jest.fn(),
    refresh: jest.fn(),
  }),
  usePathname: () => '/',
  useSearchParams: () => new URLSearchParams(),
}))

// Mock Next.js Image component
jest.mock('next/image', () => ({
  __esModule: true,
  default: function Image(props: any) {
    // Return a simple function component
    return props
  },
}))

// Mock MDX loader for tests
jest.mock('@/lib/utils/mdx-loader', () => ({
  loadBlogPostsFromMDX: jest.fn(() => [
    {
      id: 'cloudflare-chunked-transfer-mystery',
      slug: 'cloudflare-chunked-transfer-mystery',
      title:
        "The 2MB Mystery: Debugging CloudFlare's Chunked Transfer Encoding Limitation",
      excerpt:
        "A deep dive into debugging container registry push failures. What started as 'digest mismatch' errors turned into discovering an undocumented CloudFlare limitation that affects Docker, Podman, and Skopeo users worldwide.",
      content: 'Test content for CloudFlare blog post',
      date: '2024-02-01T00:00:00Z',
      author: 'Alison Alva',
      tags: [
        'CloudFlare',
        'Docker',
        'DevOps',
        'Debugging',
        'Container Registry',
        'Infrastructure',
      ],
      domain: 'DevOps',
      readTime: 10,
      featured: true,
      imageUrl: '/images/blog/cloudflare-debug.jpg',
    },
  ]),
  getBlogPostBySlug: jest.fn((slug: string) => {
    if (slug === 'cloudflare-chunked-transfer-mystery') {
      return {
        id: 'cloudflare-chunked-transfer-mystery',
        slug: 'cloudflare-chunked-transfer-mystery',
        title:
          "The 2MB Mystery: Debugging CloudFlare's Chunked Transfer Encoding Limitation",
        excerpt:
          "A deep dive into debugging container registry push failures. What started as 'digest mismatch' errors turned into discovering an undocumented CloudFlare limitation that affects Docker, Podman, and Skopeo users worldwide.",
        content: 'Test content for CloudFlare blog post',
        date: '2024-02-01T00:00:00Z',
        author: 'Alison Alva',
        tags: [
          'CloudFlare',
          'Docker',
          'DevOps',
          'Debugging',
          'Container Registry',
          'Infrastructure',
        ],
        domain: 'DevOps',
        readTime: 10,
        featured: true,
        imageUrl: '/images/blog/cloudflare-debug.jpg',
      }
    }
    return null
  }),
}))

// Global test utilities
global.ResizeObserver = jest.fn().mockImplementation(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
}))

// Mock matchMedia for responsive testing
// Default to desktop viewport - tests can override with setViewportWidth()
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query: string) => ({
    matches: query.includes('min-width')
      ? window.innerWidth >= parseInt(query.match(/\d+/)?.[0] || '0', 10)
      : true,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
})

// Mock TouchEvent for jsdom
if (!global.TouchEvent) {
  global.TouchEvent = class TouchEvent extends Event {
    touches: Touch[]
    changedTouches: Touch[]
    targetTouches: Touch[]

    constructor(type: string, init?: any) {
      super(type, init)
      this.touches = init?.touches || []
      this.changedTouches = init?.changedTouches || []
      this.targetTouches = init?.targetTouches || []
    }
  } as any
}

// Suppress console errors in tests (optional)
const originalError = console.error
beforeAll(() => {
  console.error = (...args: any[]) => {
    if (
      typeof args[0] === 'string' &&
      args[0].includes('Warning: ReactDOM.render')
    ) {
      return
    }
    originalError.call(console, ...args)
  }
})

afterAll(() => {
  console.error = originalError
})
