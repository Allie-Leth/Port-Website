import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ArticleJsonLd, BreadcrumbJsonLd } from 'next-seo'
import { getAllPosts, getPostBySlug } from '@/lib/services/blog-service'
import { BlogPostView } from '@/components/blog/blog-post-view'
import { seoConfig } from '@/lib/seo/config'

interface BlogPostPageProps {
  params: Promise<{
    slug: string
  }>
}

/**
 * Generate dynamic metadata for blog posts
 * Fetches post data from Ghost CMS and returns SEO metadata
 */
export async function generateMetadata({
  params,
}: BlogPostPageProps): Promise<Metadata> {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    return {
      title: 'Post Not Found',
    }
  }

  const siteUrl = seoConfig.getSiteUrl()
  const postUrl = `${siteUrl}/blog/${post.slug}`

  return {
    title: post.title,
    description: post.excerpt,
    authors: [{ name: post.author }],
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: 'article',
      title: post.title,
      description: post.excerpt,
      url: postUrl,
      siteName: seoConfig.siteName,
      publishedTime: post.date,
      authors: [post.author],
      tags: post.tags,
      images: post.imageUrl ? [{ url: post.imageUrl }] : [],
    },
  }
}

export default async function BlogPostPage({ params }: BlogPostPageProps) {
  const { slug } = await params
  const post = await getPostBySlug(slug)

  if (!post) {
    notFound()
  }

  const siteUrl = seoConfig.getSiteUrl()
  const postUrl = `${siteUrl}/blog/${post.slug}`

  return (
    <>
      <BreadcrumbJsonLd
        items={[
          { name: 'Home', item: siteUrl },
          { name: 'Blog', item: `${siteUrl}/blog` },
          { name: post.title, item: postUrl },
        ]}
      />
      <ArticleJsonLd
        type="BlogPosting"
        url={postUrl}
        headline={post.title}
        image={post.imageUrl ? [post.imageUrl] : []}
        datePublished={post.date}
        author={[{ '@type': 'Person', name: post.author }]}
        description={post.excerpt}
      />
      <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
        <BlogPostView post={post} />
      </div>
    </>
  )
}

// Generate static params for all blog posts
// Returns empty array if Ghost is unavailable (build will use dynamic rendering)
export async function generateStaticParams() {
  try {
    const posts = await getAllPosts()
    return posts.map((post) => ({
      slug: post.slug,
    }))
  } catch {
    // Ghost unavailable at build time - use dynamic rendering
    console.warn('Ghost API unavailable during build, using dynamic rendering')
    return []
  }
}
