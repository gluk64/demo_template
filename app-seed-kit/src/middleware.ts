import { NextResponse, type NextRequest } from 'next/server'

const PUBLIC_PATHS = ['/login']

export function middleware(request: NextRequest): NextResponse | undefined {
  const { pathname } = request.nextUrl
  const session = request.cookies.get('[app]_session')?.value
  const isAuthenticated = session === '1'

  const isRootRoute = pathname === '/'

  if (isRootRoute) {
    if (isAuthenticated) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.redirect(new URL('/login', request.url))
  }

  if (PUBLIC_PATHS.some((p) => pathname.startsWith(p))) {
    if (isAuthenticated && pathname.startsWith('/login')) {
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }
    return NextResponse.next()
  }

  if (!isAuthenticated) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
