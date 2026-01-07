/**
 * Shared test fixtures for content items
 * Used across content grid and card tests
 */

export interface ContentItem {
  href: string
  label: string
  title: string
  description: string
  labelColor: 'blue' | 'green' | 'purple' | 'orange'
}

export const mockContentItems: ContentItem[] = [
  {
    href: '/blog/test-post',
    label: 'latest.blog',
    title: 'Understanding Test-Driven Development',
    description: 'A deep dive into TDD principles and practices',
    labelColor: 'blue',
  },
  {
    href: '/projects/k3s-cluster',
    label: 'featured.project',
    title: 'K3s Home Cluster',
    description: 'Building a production-ready Kubernetes cluster at home',
    labelColor: 'green',
  },
  {
    href: '/blog/security-best-practices',
    label: 'recent.post',
    title: 'Security Best Practices',
    description: 'Essential security measures for modern applications',
    labelColor: 'purple',
  },
  {
    href: '/projects/portfolio-site',
    label: 'current.project',
    title: 'Portfolio Website',
    description: 'Next.js portfolio with GitLab and Grafana integration',
    labelColor: 'orange',
  },
]

export const createMockContentItem = (
  overrides?: Partial<ContentItem>
): ContentItem => ({
  href: '/test/path',
  label: 'test.label',
  title: 'Test Title',
  description: 'Test description',
  labelColor: 'blue',
  ...overrides,
})

export const mockEmptyContentGrid: ContentItem[] = []

export const mockSingleContentItem: ContentItem[] = [mockContentItems[0]]
