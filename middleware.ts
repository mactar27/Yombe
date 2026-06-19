import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authCookie = request.cookies.get('auth_user')

  let user = null
  if (authCookie) {
    try { user = JSON.parse(authCookie.value) } catch {}
  }

  // Protect /admin routes - admin only
  if (pathname.startsWith('/admin')) {
    if (!user || user.role !== 'admin') {
      return NextResponse.redirect(new URL('/connexion', request.url))
    }
  }

  // Protect /compte - any logged in user
  if (pathname.startsWith('/compte')) {
    if (!user) {
      return NextResponse.redirect(new URL('/connexion', request.url))
    }
  }

  // Redirect logged-in users away from /connexion
  if (pathname === '/connexion' && user) {
    return NextResponse.redirect(new URL('/compte', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/compte/:path*', '/connexion'],
}
