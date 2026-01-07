import type { Metadata } from 'next'
import { ProfilePageJsonLd } from 'next-seo'
import { HeroSection } from '@/components/hero-section'
import { ButtonBar } from '@/components/button-bar'
import { ContentGrid } from '@/components/content-grid'
import { getAllPosts, getFeaturedPost } from '@/lib/services/blog-service'
import { seoConfig } from '@/lib/seo/config'

export const metadata: Metadata = {
  title: 'Secure DevOps & Embedded Systems Engineer',
  description:
    'Alison Alva - Secure DevOps and Embedded Systems Engineer. Firmware to infrastructure, schematics to field-deployed fleets.',
  alternates: {
    canonical: '/',
  },
}

export default async function Home() {
  const taglines = [
    'Firmware → infrastructure',
    'Schematics → field-deployed fleets',
    'Local flash → OTA rollouts',
    'Shell scripts → CI/CD',
    'Serial logs → Grafana dashboards',
    'Threat models → hardened defaults',
  ]

  // Get actual blog posts from Ghost CMS
  const allPosts = await getAllPosts()
  const latestPost = allPosts[0] // Already sorted by date
  const featuredPost = await getFeaturedPost()

  const contentItems = [
    // Latest blog post
    latestPost
      ? {
          href: `/blog/${latestPost.slug}?ref=latest`,
          label: 'latest.blog',
          title: latestPost.title,
          description: new Date(latestPost.date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
          }),
          labelColor: 'blue' as const,
        }
      : {
          href: '/blog?ref=latest',
          label: 'latest.blog',
          title: 'No posts yet',
          description: 'Check back soon',
          labelColor: 'blue' as const,
        },
    // Featured post or project
    featuredPost
      ? {
          href: `/blog/${featuredPost.slug}?ref=featured`,
          label: 'featured.blog',
          title: featuredPost.title,
          description: featuredPost.excerpt.substring(0, 60) + '...',
          labelColor: 'green' as const,
        }
      : {
          href: '/blog?ref=featured',
          label: 'featured.blog',
          title: 'No featured posts',
          description: 'Browse all posts',
          labelColor: 'green' as const,
        },
  ]

  return (
    <>
      <ProfilePageJsonLd
        mainEntity={{
          '@type': 'Person',
          name: seoConfig.author.name,
          url: seoConfig.getSiteUrl(),
          sameAs: [seoConfig.social.github, seoConfig.social.gitlab],
        }}
      />
      <div className="relative min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white overflow-hidden flex items-center justify-center">
        {/* Grid background pattern */}
        <div className="absolute inset-0 bg-grid-slate-700/25 [mask-image:linear-gradient(0deg,transparent,rgba(255,255,255,0.5))]"></div>

        {/* Content Container - aligned grid system */}
        <div className="relative z-10 px-4 md:px-6 w-full max-w-2xl">
          {/* Hero Section */}
          <HeroSection
            name="Alison Alva"
            title="Secure DevOps & Embedded Systems Engineer"
            taglines={taglines}
          />

          {/* Navigation bar - aligned with content grid */}
          <ButtonBar
            buttons={[
              { href: '/blog', label: 'Blog' },
              { href: '/about', label: 'About' },
            ]}
            variant="boxed"
            justify="between"
            className="mb-3"
          />

          {/* Content Grid */}
          <ContentGrid items={contentItems} />
        </div>
      </div>
    </>
  )
}
