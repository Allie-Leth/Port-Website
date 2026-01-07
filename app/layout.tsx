import type { Metadata } from 'next'
import { MinimalHeader } from '@/components/layout/minimal-header'
import { seoConfig } from '@/lib/seo/config'
import './globals.css'

export const metadata: Metadata = {
  metadataBase: new URL(seoConfig.getSiteUrl()),
  title: {
    template: `%s | ${seoConfig.siteName}`,
    default: seoConfig.defaultTitle,
  },
  description: seoConfig.defaultDescription,
  authors: [{ name: seoConfig.author.name }],
  openGraph: {
    type: seoConfig.openGraph.type,
    locale: seoConfig.openGraph.locale,
    siteName: seoConfig.siteName,
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="bg-slate-950 text-white">
        <MinimalHeader />
        <main>{children}</main>
      </body>
    </html>
  )
}
