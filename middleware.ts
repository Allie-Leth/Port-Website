import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const hostname = request.headers.get('host') || ''
  const pathname = request.nextUrl.pathname

  // Handle hire subdomain
  if (hostname.startsWith('hire.')) {
    // Rewrite hire.domain.com/* to /hire/*
    const url = request.nextUrl.clone()

    // If already on /hire path, continue normally
    if (pathname.startsWith('/hire')) {
      return NextResponse.next()
    }

    // Rewrite root and other paths to /hire
    url.pathname = `/hire${pathname === '/' ? '' : pathname}`
    return NextResponse.rewrite(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization)
     * - favicon.ico
     * - public files
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.).*)',
  ],
}
