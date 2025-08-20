import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl
  if (pathname === '/') {
    const url = req.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }
  if (pathname.startsWith('/admin')) {
    const hasSession = req.cookies.get('session')?.value
    if (!hasSession) {
      const url = req.nextUrl.clone()
      url.pathname = '/login'
      return NextResponse.redirect(url)
    }
  }
  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/admin/:path*']
}
