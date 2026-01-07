import type { Metadata } from 'next'
import Link from 'next/link'
import { StackDiagram } from '@/components/stack-diagram'
import { getAllPosts } from '@/lib/services/blog-service'

export const metadata: Metadata = {
  title: 'Hire Me',
  description:
    'Alison Alva - Embedded Systems Engineer. View my technical stack and capabilities across firmware, DevOps, and full-stack development.',
  alternates: {
    canonical: '/hire',
  },
}

export default async function HirePage() {
  const allPosts = await getAllPosts()

  return (
    <main className="w-full px-4 md:px-6 py-8 md:py-12">
      {/* Hero Section */}
      <section className="text-center mb-8 md:mb-12">
        <h1 className="text-3xl md:text-5xl font-light mb-3 md:mb-4">
          Alison Alva
        </h1>
        <p className="text-lg md:text-xl text-gray-400">
          Embedded Systems Engineer
        </p>
      </section>

      {/* Stack Diagram */}
      <StackDiagram allPosts={allPosts} />

      {/* CTA Section */}
      <section className="text-center mt-8 md:mt-12 space-y-4">
        <p className="text-sm md:text-base text-gray-400">
          Want to learn more?
        </p>
        <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center items-center">
          <Link
            href="/contact"
            className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors text-center"
          >
            Contact Me
          </Link>
          <Link
            href="/blog?domain=Projects"
            className="w-full sm:w-auto px-6 py-3 bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors text-center"
          >
            View Projects
          </Link>
        </div>
      </section>
    </main>
  )
}
