import type { Metadata } from 'next'
import { BlogLayout } from '@/components/blog/blog-layout'
import { getAllPosts } from '@/lib/services/blog-service'
import type { TechnicalDomain } from '@/lib/types/blog'

export const metadata: Metadata = {
  title: 'Blog',
  description:
    'Technical blog posts on embedded systems, DevOps, security, and full-stack development by Alison Alva.',
  alternates: {
    canonical: '/blog',
  },
}

const validDomains: TechnicalDomain[] = [
  'Firmware',
  'DevOps',
  'Security',
  'Full-Stack',
  'Projects',
]

interface BlogPageProps {
  searchParams: Promise<{ domain?: string }>
}

export default async function BlogPage({ searchParams }: BlogPageProps) {
  const posts = await getAllPosts()
  const params = await searchParams

  // Validate domain query param
  const domainParam = params.domain
  const initialDomain =
    domainParam && validDomains.includes(domainParam as TechnicalDomain)
      ? (domainParam as TechnicalDomain)
      : null

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <BlogLayout
        posts={posts}
        layout="sidebar"
        showFeatured={true}
        showDomainFilter={true}
        initialDomain={initialDomain}
        emptyMessage="No blog posts available yet. Check back soon!"
      />
    </div>
  )
}
