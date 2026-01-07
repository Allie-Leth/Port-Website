import { BlogPost } from '@/lib/types/blog'

/**
 * Mock MDX loader for tests
 * Returns a single test blog post
 */
export function loadBlogPostsFromMDX(): BlogPost[] {
  return [
    {
      id: 'cloudflare-chunked-transfer-mystery',
      slug: 'cloudflare-chunked-transfer-mystery',
      title:
        "The 2MB Mystery: Debugging CloudFlare's Chunked Transfer Encoding Limitation",
      excerpt:
        "A deep dive into debugging container registry push failures. What started as 'digest mismatch' errors turned into discovering an undocumented CloudFlare limitation that affects Docker, Podman, and Skopeo users worldwide.",
      content: 'Test content',
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
  ]
}

/**
 * Mock function to get post by slug
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const posts = loadBlogPostsFromMDX()
  return posts.find((post) => post.slug === slug) || null
}
