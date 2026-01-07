import type { Metadata } from 'next'
import { cn } from '@/lib/utils'
import { ReactNode } from 'react'

export const metadata: Metadata = {
  title: 'Contact',
  description:
    'Get in touch with Alison Alva for embedded systems, DevOps, and platform engineering opportunities.',
  alternates: {
    canonical: '/contact',
  },
}

interface ContactLink {
  label: string
  value: string
  href: string
  icon: ReactNode
}

const EmailIcon = () => (
  <svg
    className="w-5 h-5"
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={1.5}
      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
    />
  </svg>
)

const GitHubIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" role="img">
    <path d="M12 .297c-6.63 0-12 5.373-12 12 0 5.303 3.438 9.8 8.205 11.385.6.113.82-.258.82-.577 0-.285-.01-1.04-.015-2.04-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22 0 1.606-.015 2.896-.015 3.286 0 .315.21.69.825.57C20.565 22.092 24 17.592 24 12.297c0-6.627-5.373-12-12-12" />
  </svg>
)

const GitLabIcon = () => (
  <svg className="w-5 h-5" viewBox="0 0 380 380" role="img">
    <path
      fill="#e24329"
      d="M265.26416,174.37243l-.2134-.55822-21.19899-55.30908c-.4236-1.08359-1.18542-1.99642-2.17699-2.62689-.98837-.63373-2.14749-.93253-3.32305-.87014-1.1689.06239-2.29195.48925-3.20809,1.21821-.90957.73554-1.56629,1.73047-1.87493,2.85346l-14.31327,43.80662h-57.90965l-14.31327-43.80662c-.30864-1.12299-.96536-2.11791-1.87493-2.85346-.91614-.72895-2.03911-1.15582-3.20809-1.21821-1.17548-.06239-2.33468.23641-3.32297.87014-.99166.63047-1.75348,1.5433-2.17707,2.62689l-21.19891,55.31237-.21348.55493c-6.28158,16.38521-.92929,34.90803,13.05891,45.48782.02621.01641.04922.03611.07552.05582l.18719.14119,32.29094,24.17392,15.97151,12.09024,9.71951,7.34871c2.34117,1.77316,5.57877,1.77316,7.92002,0l9.71943-7.34871,15.96822-12.09024,32.48142-24.31511c.02958-.02299.05588-.04269.08538-.06568,13.97834-10.57977,19.32735-29.09604,13.04905-45.47796Z"
    />
    <path
      fill="#fc6d26"
      d="M265.26416,174.37243l-.2134-.55822c-10.5174,2.16062-20.20405,6.6099-28.49844,12.81593-.1346.0985-25.20497,19.05805-46.55171,35.19699,15.84998,11.98517,29.6477,22.40405,29.6477,22.40405l32.48142-24.31511c.02958-.02299.05588-.04269.08538-.06568,13.97834-10.57977,19.32735-29.09604,13.04905-45.47796Z"
    />
    <path
      fill="#fca326"
      d="M160.34962,244.23117l15.97151,12.09024,9.71951,7.34871c2.34117,1.77316,5.57877,1.77316,7.92002,0l9.71943-7.34871,15.96822-12.09024s-13.79772-10.41888-29.6477-22.40405c-15.85327,11.98517-29.65099,22.40405-29.65099,22.40405Z"
    />
    <path
      fill="#fc6d26"
      d="M143.44561,186.63014c-8.29111-6.20274-17.97446-10.65531-28.49507-12.81264l-.21348.55493c-6.28158,16.38521-.92929,34.90803,13.05891,45.48782.02621.01641.04922.03611.07552.05582l.18719.14119,32.29094,24.17392s13.79772-10.41888,29.65099-22.40405c-21.34673-16.13894-46.42031-35.09848-46.55499-35.19699Z"
    />
  </svg>
)

const contactLinks: ContactLink[] = [
  {
    label: 'Email',
    value: 'allie.leth@scopecreep.productions',
    href: 'mailto:allie.leth@scopecreep.productions',
    icon: <EmailIcon />,
  },
  {
    label: 'GitHub',
    value: 'github.com/Allie-Leth',
    href: 'https://github.com/Allie-Leth',
    icon: <GitHubIcon />,
  },
  {
    label: 'GitLab',
    value: 'gitlab.scopecreep.productions/leth',
    href: 'https://gitlab.scopecreep.productions/leth',
    icon: <GitLabIcon />,
  },
]

export default function ContactPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 to-slate-900 text-white">
      <main className="max-w-2xl mx-auto px-6 py-16">
        <h1 className="text-4xl font-light mb-4">Get In Touch</h1>
        <p className="text-lg text-gray-300 mb-4">
          I&apos;m open to work and collaboration opportunities.
        </p>
        <p className="text-gray-400 mb-12">
          Whether you have a project in mind, need embedded systems expertise,
          or just want to connect - reach out through any of the channels below.
        </p>

        <div className="space-y-6">
          {contactLinks.map((link) => {
            const isExternal = !link.href.startsWith('mailto:')

            return (
              <div key={link.label} className="flex items-center gap-4">
                <a
                  href={link.href}
                  target={isExternal ? '_blank' : undefined}
                  rel={isExternal ? 'noopener noreferrer' : undefined}
                  className={cn(
                    'p-3 rounded-lg',
                    'bg-slate-800/50 border border-slate-700/50',
                    'hover:bg-slate-700/60 hover:border-slate-600',
                    'text-gray-400 hover:text-blue-400',
                    'transition-all'
                  )}
                  aria-label={link.label}
                >
                  {link.icon}
                </a>
                <span className="text-white font-mono text-sm select-all">
                  {link.value}
                </span>
              </div>
            )
          })}
        </div>
      </main>
    </div>
  )
}
