import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login', '/user/']

export function middleware(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('nab_session')?.value
  const isAuthenticated = session === '1'

  const isRootRoute = pathname === '/'

  // Root always redirects
  if (isRootRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Public paths — allow unauthenticated access
  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    // Only redirect authenticated users away from /login, not /user/
    if (isAuthenticated && pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  // Protected paths — redirect to login if not authenticated
  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
