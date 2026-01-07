import { BlogPost, TechnicalDomain } from '@/lib/types/blog'

/**
 * Shared test fixtures for blog posts
 * Provides consistent test data across all blog-related tests
 */

export const createMockBlogPost = (
  overrides?: Partial<BlogPost>
): BlogPost => ({
  id: 'test-post-1',
  slug: 'test-post',
  title: 'Test Blog Post',
  excerpt: 'This is a test blog post excerpt',
  content: '# Test Content\n\nThis is test blog post content.',
  date: '2024-01-15',
  author: 'Test Author',
  tags: ['testing', 'jest'],
  domain: 'DevOps' as TechnicalDomain,
  readTime: 5,
  featured: false,
  ...overrides,
})

export const mockBlogPosts: BlogPost[] = [
  createMockBlogPost({
    id: 'devops-1',
    slug: 'kubernetes-migration',
    title: 'Kubernetes Migration Guide',
    excerpt: 'Learn how to migrate from Docker Compose to Kubernetes',
    domain: 'DevOps',
    tags: ['kubernetes', 'docker', 'migration'],
    readTime: 10,
    featured: true,
  }),
  createMockBlogPost({
    id: 'firmware-1',
    slug: 'embedded-systems-testing',
    title: 'Testing Embedded Systems',
    excerpt: 'Best practices for testing firmware and embedded systems',
    domain: 'Firmware',
    tags: ['embedded', 'testing', 'firmware'],
    readTime: 8,
  }),
  createMockBlogPost({
    id: 'security-1',
    slug: 'devsecops-pipeline',
    title: 'Building a DevSecOps Pipeline',
    excerpt: 'Integrate security into your CI/CD pipeline',
    domain: 'Security',
    tags: ['security', 'ci/cd', 'automation'],
    readTime: 12,
    featured: true,
  }),
  createMockBlogPost({
    id: 'fullstack-1',
    slug: 'react-performance',
    title: 'React Performance Optimization',
    excerpt: 'Techniques to optimize React application performance',
    domain: 'Full-Stack',
    tags: ['react', 'performance', 'javascript'],
    readTime: 7,
  }),
]

export const mockFeaturedPosts = mockBlogPosts.filter((post) => post.featured)

export const mockBlogPostsByDomain = {
  DevOps: mockBlogPosts.filter((p) => p.domain === 'DevOps'),
  Firmware: mockBlogPosts.filter((p) => p.domain === 'Firmware'),
  Security: mockBlogPosts.filter((p) => p.domain === 'Security'),
  'Full-Stack': mockBlogPosts.filter((p) => p.domain === 'Full-Stack'),
}

export const mockDraftPost = createMockBlogPost({
  id: 'draft-1',
  slug: 'draft-post',
  title: 'Draft Post',
})

export const mockLongFormPost = createMockBlogPost({
  id: 'long-1',
  slug: 'comprehensive-guide',
  title: 'Comprehensive Guide to Testing',
  content: `
# Comprehensive Guide to Testing

## Introduction
This is a comprehensive guide covering all aspects of testing...

## Chapter 1: Unit Testing
Unit testing forms the foundation...

## Chapter 2: Integration Testing
Integration testing validates...

## Chapter 3: E2E Testing
End-to-end testing ensures...

## Conclusion
Testing is essential for quality software...
  `.trim(),
  readTime: 25,
})
