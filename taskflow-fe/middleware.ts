import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const user = request.cookies.get('user')
  const isAuthPage = request.nextUrl.pathname.startsWith('/login')
  
  // If user is not authenticated and trying to access protected routes
  if (!user && !isAuthPage) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // If user is authenticated and trying to access auth pages
  if (user && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/login',
  ],
} 