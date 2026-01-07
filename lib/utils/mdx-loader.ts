import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { BlogPost, TechnicalDomain } from '@/lib/types/blog'

const contentDirectory = path.join(process.cwd(), 'content', 'blog')

/**
 * Reads and parses all MDX blog posts from the content directory
 */
export function loadBlogPostsFromMDX(): BlogPost[] {
  // Check if content directory exists
  if (!fs.existsSync(contentDirectory)) {
    console.warn(
      `Blog content directory not found: ${contentDirectory}. Using empty array.`
    )
    return []
  }

  const fileNames = fs.readdirSync(contentDirectory)
  const mdxFiles = fileNames.filter((file) => file.endsWith('.mdx'))

  const posts: BlogPost[] = mdxFiles.map((fileName) => {
    const filePath = path.join(contentDirectory, fileName)
    const fileContents = fs.readFileSync(filePath, 'utf8')

    // Parse frontmatter and content
    const { data, content } = matter(fileContents)

    // Validate required fields
    if (!data.id || !data.slug || !data.title) {
      throw new Error(
        `Missing required frontmatter fields in ${fileName}. Required: id, slug, title`
      )
    }

    // Parse tags array if it's a string
    let tags: string[] = []
    if (Array.isArray(data.tags)) {
      tags = data.tags
    } else if (typeof data.tags === 'string') {
      tags = data.tags.split(',').map((tag: string) => tag.trim())
    }

    // Ensure date is always a string in ISO format
    let dateString: string
    if (data.date instanceof Date) {
      dateString = data.date.toISOString()
    } else if (typeof data.date === 'string') {
      dateString = data.date
    } else {
      dateString = new Date().toISOString()
    }

    const post: BlogPost = {
      id: data.id as string,
      slug: data.slug as string,
      title: data.title as string,
      excerpt: data.excerpt || '',
      content: content.trim(),
      date: dateString,
      author: data.author || 'Unknown',
      tags: tags,
      domain: (data.domain as TechnicalDomain) || 'Full-Stack',
      readTime: data.readTime || 5,
      featured: data.featured || false,
      imageUrl: data.imageUrl,
    }

    return post
  })

  return posts
}

/**
 * Gets a single blog post by slug from MDX files
 */
export function getBlogPostBySlug(slug: string): BlogPost | null {
  const posts = loadBlogPostsFromMDX()
  return posts.find((post) => post.slug === slug) || null
}
